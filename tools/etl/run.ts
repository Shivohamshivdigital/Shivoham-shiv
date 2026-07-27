/**
 * End-to-end ETL entrypoint: file/stdin -> Python worker -> upsert.
 *
 * This is the batch runner. It reads raw contact records, streams them through
 * the Python worker, and loads the normalised output via the idempotent upsert.
 *
 * Runnable with no dependencies via Node's TS type-stripping:
 *
 *   # dry run (no database) — prints what WOULD be upserted, and the trust scores
 *   node tools/etl/run.ts --transform signature \
 *        --input tools/etl/examples/signature-input.ndjson --dry-run
 *
 *   # real load into Postgres (requires DATABASE_URL and the `pg` package)
 *   DATABASE_URL=postgres://user:pass@host/db \
 *     node tools/etl/run.ts --transform map_contact --source google_people \
 *          --input contacts.json
 *
 * The `map_contact` transform needs Pydantic installed in the worker's env; the
 * `signature` transform is pure standard library.
 */

import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { ingestBatch, upsertEntity } from './ingest.ts';
import type { IngestSummary, NormalizedEntity, Queryable } from './ingest.ts';

// ---- CLI parsing ----------------------------------------------------------

interface Args {
  transform: 'signature' | 'map_contact';
  source?: string;
  input?: string;
  python: string;
  dryRun: boolean;
  concurrency: number;
  timeoutMs: number;
}

function parseArgs(argv: string[]): Args {
  const get = (flag: string): string | undefined => {
    const i = argv.indexOf(flag);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  const transform = get('--transform');
  if (transform !== 'signature' && transform !== 'map_contact') {
    throw new Error("--transform must be 'signature' or 'map_contact'");
  }
  return {
    transform,
    source: get('--source'),
    input: get('--input'),
    python: get('--python') ?? process.env.PYTHON ?? './.venv/bin/python3',
    dryRun: argv.includes('--dry-run') || !process.env.DATABASE_URL,
    concurrency: Number(get('--concurrency') ?? 8),
    timeoutMs: Number(get('--timeout') ?? 5000),
  };
}

// ---- Input loading (JSON array or NDJSON, from file or stdin) -------------

function loadRecords(input?: string): Array<Record<string, unknown>> {
  const raw = input ? readFileSync(input, 'utf8') : readFileSync(0, 'utf8');
  const text = raw.trim();
  if (!text) return [];
  if (text.startsWith('[')) return JSON.parse(text);
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => JSON.parse(l));
}

const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');

// ---- Routing: worker output -> a persistable entity -----------------------
//
// Each transform yields a different shape, so each has its own router. The
// router also sees the ORIGINAL input record (by index) for identity hints the
// transform output does not carry.

function makeRouter(
  args: Args,
  records: Array<Record<string, unknown>>,
): (data: any, index: number) => NormalizedEntity {
  if (args.transform === 'map_contact') {
    // EnterpriseContact dump carries its own identity.
    return (data: any) => {
      const email = data.emails?.find((e: any) => e.is_primary)?.address;
      const key = email ?? `${data.source_system}:${data.source_id}`;
      return {
        entityHash: sha256(key.toLowerCase()),
        sourceSystem: String(data.source_system),
        sourceId: String(data.source_id),
        payload: data,
        canonical: data,
      };
    };
  }
  // signature: enrichment keyed off the original record's routing fields.
  return (data: any, index: number) => {
    const rec = records[index] ?? {};
    const key = String(rec.key ?? rec.email ?? data.id ?? index);
    return {
      entityHash: sha256(key.toLowerCase()),
      sourceSystem: String(rec.source ?? 'email'),
      sourceId: String(rec.source_id ?? data.id ?? index),
      payload: data,
      canonical: { phones: data.phones },
    };
  };
}

// ---- Sinks: dry-run (in-memory) or real Postgres --------------------------

interface Sink {
  db: Queryable;
  report(): void;
}

/**
 * In-memory Queryable that faithfully emulates upsert.sql: idempotent per
 * (hash, source, source_id), trust_score += 1 only for a NEW independent source.
 * Used by --dry-run so the whole chain runs with no database.
 */
function dryRunSink(): Sink {
  const entities = new Map<string, { trust: number; sources: Set<string>; canonical: any }>();
  const db: Queryable = {
    async query(_sql, p) {
      const [hash, source, sourceId, , canonical] = p as string[];
      const skey = `${source}::${sourceId}`;
      let e = entities.get(hash);
      const isNew = !e || !e.sources.has(skey);
      if (!e) {
        e = { trust: 0, sources: new Set(), canonical: {} };
        entities.set(hash, e);
      }
      if (isNew) e.trust += 1;
      e.sources.add(skey);
      e.canonical = { ...e.canonical, ...JSON.parse(canonical) };
      return { rows: [{ entity_hash: hash, trust_score: e.trust, source_count: e.sources.size }] };
    },
  };
  return {
    db,
    report() {
      console.log('\n[dry-run] resolved entities (no database written):');
      for (const [hash, e] of entities) {
        console.log(
          `  ${hash.slice(0, 12)}…  trust=${e.trust}  sources=${e.sources.size}  ` +
            `canonical=${JSON.stringify(e.canonical)}`,
        );
      }
    },
  };
}

/** Real Postgres sink. Lazily imports `pg` so --dry-run needs no dependency. */
async function postgresSink(): Promise<Sink> {
  const pg = await import('pg'); // requires: npm i pg
  const pool = new pg.default.Pool({ connectionString: process.env.DATABASE_URL });
  const db: Queryable = {
    query: (sql, params) => pool.query(sql, params as unknown[]),
  };
  return {
    db,
    report() {
      console.log('\nLoaded into Postgres. Query `entity` / `entity_source` to inspect.');
      void pool.end();
    },
  };
}

// ---- Main -----------------------------------------------------------------

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const records = loadRecords(args.input);
  if (records.length === 0) {
    console.error('No input records. Provide --input <file> or pipe JSON/NDJSON on stdin.');
    process.exit(1);
  }

  const sink = args.dryRun ? dryRunSink() : await postgresSink();
  const workerArgs = ['-m', 'tools.crm.worker', '--transform', args.transform];
  if (args.source) workerArgs.push('--source', args.source);

  const dead: Array<{ index: number; reason: string }> = [];
  const summary: IngestSummary = await ingestBatch(records, sink.db, {
    command: args.python,
    args: workerArgs,
    env: { ...process.env, PYTHONPATH: '.' },
    timeoutMs: args.timeoutMs,
    concurrency: args.concurrency,
    toEntity: makeRouter(args, records),
    onDeadLetter: (dl) => dead.push({ index: dl.index, reason: dl.reason }),
  });

  console.log(
    `\nreceived=${summary.received}  upserted=${summary.upserted}  failed=${summary.failed}` +
      (args.dryRun ? '  (dry-run)' : ''),
  );
  if (dead.length) {
    console.log('dead-letters:');
    for (const d of dead.slice(0, 20)) console.log(`  #${d.index}  ${d.reason}`);
    if (dead.length > 20) console.log(`  … and ${dead.length - 20} more`);
  }
  sink.report();

  // Non-zero exit if nothing loaded, so cron/CI notices a fully failed batch.
  process.exit(summary.upserted === 0 && summary.received > 0 ? 2 : 0);
}

main().catch((err) => {
  console.error('run.ts fatal:', err);
  process.exit(1);
});

// keep the type import used even if tree-shaken by strippers
void upsertEntity;
