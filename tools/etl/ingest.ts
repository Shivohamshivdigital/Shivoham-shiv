/**
 * Ingestion orchestration: raw records -> Python worker -> idempotent upsert.
 *
 * This is the decoupled layer. It drives the IPC helper, then loads the
 * normalised output with per-record fault isolation and bounded concurrency.
 * A worker-level failure (spawn/timeout/non-zero exit) dead-letters the whole
 * batch without throwing; a per-record error dead-letters just that record.
 * The parent never has to try/catch this — it inspects the returned summary.
 *
 * The database is injected as a minimal `Queryable`, so this module is
 * driver-agnostic (works with `pg`, `postgres`, a pool, or a fake in tests) and
 * carries no third-party dependency itself.
 */

import { runPythonWorker } from './pythonWorker.ts';
import type { SpawnWorkerOptions } from './pythonWorker.ts';

/** Anything that can run a parameterised query — e.g. a `pg` Pool/Client. */
export interface Queryable {
  query(sql: string, params: unknown[]): Promise<{ rows: Array<Record<string, unknown>> }>;
}

/** One normalised entity ready to persist. */
export interface NormalizedEntity {
  entityHash: string; // unique global key
  sourceSystem: string; // independent source identity
  sourceId: string; // record id within that source
  payload: unknown; // full normalised payload for provenance
  canonical: Record<string, unknown>; // fields merged into the golden record
}

/**
 * Idempotent upsert mirroring tools/etl/upsert.sql:
 *  - writes the entity keyed by entityHash,
 *  - records the (source_system, source_id) assertion,
 *  - increments trust_score only when a NEW independent source corroborates.
 */
export const UPSERT_SQL = `
WITH incoming AS (
  SELECT $1::text AS entity_hash, $2::text AS source_system,
         $3::text AS source_id, $4::jsonb AS payload, $5::jsonb AS canonical
),
src AS (
  INSERT INTO entity_source AS es (entity_hash, source_system, source_id, payload, first_seen, last_seen)
  SELECT entity_hash, source_system, source_id, payload, now(), now() FROM incoming
  ON CONFLICT (entity_hash, source_system, source_id) DO UPDATE
    SET payload = EXCLUDED.payload, last_seen = now()
  RETURNING (xmax = 0) AS is_new_source
)
INSERT INTO entity AS e (entity_hash, canonical, trust_score, source_count, first_seen, last_seen)
SELECT entity_hash, canonical, 1, 1, now(), now() FROM incoming
ON CONFLICT (entity_hash) DO UPDATE
  SET canonical    = e.canonical || EXCLUDED.canonical,
      last_seen    = now(),
      trust_score  = e.trust_score  + CASE WHEN (SELECT is_new_source FROM src) THEN 1 ELSE 0 END,
      source_count = e.source_count + CASE WHEN (SELECT is_new_source FROM src) THEN 1 ELSE 0 END
RETURNING e.entity_hash, e.trust_score, e.source_count;
`;

export interface UpsertResult {
  entityHash: string;
  trustScore: number;
  sourceCount: number;
}

export async function upsertEntity(db: Queryable, e: NormalizedEntity): Promise<UpsertResult> {
  const { rows } = await db.query(UPSERT_SQL, [
    e.entityHash,
    e.sourceSystem,
    e.sourceId,
    JSON.stringify(e.payload),
    JSON.stringify(e.canonical),
  ]);
  const row = rows[0] ?? {};
  return {
    entityHash: String(row.entity_hash ?? e.entityHash),
    trustScore: Number(row.trust_score ?? 0),
    sourceCount: Number(row.source_count ?? 0),
  };
}

// ---- Batch ingestion ------------------------------------------------------

export interface DeadLetter {
  index: number;
  reason: string;
  detail?: unknown;
}

export interface IngestOptions<TOut> extends SpawnWorkerOptions {
  /** Map one worker output object to a persistable entity row. */
  toEntity: (data: TOut, index: number) => NormalizedEntity;
  /** Max concurrent upserts. Default: 8. */
  concurrency?: number;
  /** Called for every record that could not be loaded. */
  onDeadLetter?: (dl: DeadLetter) => void;
}

export interface IngestSummary {
  received: number;
  upserted: number;
  failed: number;
  deadLetters: DeadLetter[];
}

/**
 * Transform `records` through the worker and upsert the results.
 * Always resolves with a summary — never throws.
 */
export async function ingestBatch<TIn, TOut>(
  records: TIn[],
  db: Queryable,
  options: IngestOptions<TOut>,
): Promise<IngestSummary> {
  const summary: IngestSummary = {
    received: records.length,
    upserted: 0,
    failed: 0,
    deadLetters: [],
  };
  const deadLetter = (dl: DeadLetter) => {
    summary.failed++;
    summary.deadLetters.push({ index: dl.index, reason: dl.reason });
    options.onDeadLetter?.(dl);
  };

  const run = await runPythonWorker<TIn, TOut>(records, options);

  // Worker-level failure: isolate the entire batch, do not throw.
  if (!run.ok) {
    for (let i = 0; i < records.length; i++) {
      deadLetter({ index: i, reason: `worker:${run.kind}`, detail: run.message });
    }
    return summary;
  }

  // Collect the records that transformed cleanly; dead-letter the rest.
  const pending: Array<{ index: number; entity: NormalizedEntity }> = [];
  for (const result of run.results) {
    if (result.ok) {
      try {
        pending.push({ index: result.index, entity: options.toEntity(result.data, result.index) });
      } catch (err) {
        deadLetter({ index: result.index, reason: 'map:toEntity', detail: String(err) });
      }
    } else {
      deadLetter({ index: result.index, reason: `record:${result.error.kind}`, detail: result.error.message });
    }
  }

  // Bounded-concurrency upserts, each isolated.
  const concurrency = Math.max(1, options.concurrency ?? 8);
  let cursor = 0;
  async function worker() {
    while (cursor < pending.length) {
      const item = pending[cursor++];
      try {
        await upsertEntity(db, item.entity);
        summary.upserted++;
      } catch (err) {
        deadLetter({ index: item.index, reason: 'db:upsert', detail: String(err) });
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, pending.length) }, worker));

  return summary;
}
