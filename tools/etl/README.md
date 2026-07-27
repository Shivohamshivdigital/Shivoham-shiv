# JSON ETL pipeline (Node orchestration ⇄ Python workers)

A decoupled, high-throughput ingestion pipeline: a TypeScript orchestration
layer streams un-normalised JSON through local Python worker modules over IPC,
then loads the normalised output into PostgreSQL with idempotent,
entity-resolving upserts.

```
raw records ──► runPythonWorker ──► Python worker ──► normalised NDJSON
   (TS)          (stdin, NDJSON)     (tools/crm/*)      (stdout)
                        │                                    │
                   stderr telemetry                     ingestBatch ──► UPSERT (Postgres)
```

## Pieces

| File | Role |
| --- | --- |
| `run.ts` | Batch entrypoint: file/stdin → worker → upsert. `--dry-run` needs no DB. |
| `pythonWorker.ts` | Structured IPC helper over `child_process.spawn` — the fault-isolation boundary. |
| `ingest.ts` | Orchestration: worker → per-record upsert, with dead-lettering and bounded concurrency. |
| `upsert.sql` | Idempotent PostgreSQL upsert: unique-hash key, linked source table, trust-score counter. |
| `upsert.prisma.ts` | Prisma-client equivalent of the same upsert. |
| `smoke.ts` | Dependency-free end-to-end test against the real Python worker. |
| `../crm/worker.py` | The Python worker: streaming NDJSON transform (`signature` or `map_contact`). |

## 1. Structured IPC stream

`runPythonWorker(records, options)` spawns the worker once, pushes records as
NDJSON on `stdin`, and streams results back on `stdout`. It enforces a wall-clock
`timeoutMs` (default **5000ms**), a `maxBufferBytes` cap on stdout (default
**10 MiB**, kills the process on overflow), and routes the worker's `stderr`
NDJSON telemetry to an `onTelemetry` hook.

```ts
import { runPythonWorker } from './pythonWorker.ts';

const run = await runPythonWorker(rawRecords, {
  command: 'python3',
  args: ['-m', 'tools.crm.worker', '--transform', 'signature'],
  env: { ...process.env, PYTHONPATH: '.' },
  timeoutMs: 5000,
  onTelemetry: (line) => logger.debug(line),
});
```

## 2. Resilience & fault isolation

`runPythonWorker` is an **absolute isolation boundary**: it never throws and
never rejects. Every process-level failure is captured as a typed result so the
parent event loop is never interrupted:

| `kind` | Cause |
| --- | --- |
| `spawn` | executable missing / failed to start (`ENOENT`) |
| `timeout` | exceeded `timeoutMs`; process `SIGKILL`ed |
| `nonzero-exit` | worker exited non-zero (bad args, missing dependency, crash) |
| `buffer-overflow` | stdout exceeded `maxBufferBytes` |
| `protocol` | a stdout line was not the expected NDJSON envelope (per-record) |

```ts
if (run.ok) {
  for (const r of run.results) {
    if (r.ok) load(r.data);
    else deadLetter(r.index, r.error);   // per-record failure, stream continued
  }
} else {
  // whole-run failure — telemetry has stderr + timing; fall back gracefully
  logger.error(`worker ${run.kind}: ${run.message}`, run.telemetry);
}
```

`ingestBatch` builds on this: a worker-level failure dead-letters the whole
batch, a per-record error dead-letters just that record, and upserts run with
bounded concurrency — all without a single `throw` reaching the caller.

## 3. Idempotent entity-resolution upsert

`upsert.sql` writes an entity keyed by a **unique global hash**, records each
independent source in a linked `entity_source` table (idempotent per
`source_system + source_id`), and maintains a **`trust_score` counter that
increments only when a *new independent source* corroborates** the same key —
re-submitting the same source is a no-op for the score. Canonical metadata is
shallow-merged into the golden record; full payloads are retained per source for
provenance and un-merge.

The key trick: `RETURNING (xmax = 0) AS is_new_source` distinguishes an
`ON CONFLICT` insert from an update, so the counter reflects distinct sources
rather than raw submission volume. A denormalised jsonb-array variant is
included at the bottom of the file. See `upsert.prisma.ts` for the Prisma form.

## Batch runner (`run.ts`)

The end-to-end entrypoint. Reads a JSON array or NDJSON file (or stdin), streams
it through the worker, and upserts the results.

```bash
# Dry run — no database. Emulates upsert.sql in memory and prints resolved
# entities with their trust scores. Fully runnable with no dependencies.
node tools/etl/run.ts --transform signature \
     --input tools/etl/examples/signature-input.ndjson --dry-run

# Real load into Postgres (needs DATABASE_URL and `npm i pg`):
DATABASE_URL=postgres://user:pass@host/db \
  node tools/etl/run.ts --transform map_contact --source google_people \
       --input contacts.json
```

Exit codes: `0` on success, `2` when a non-empty batch loaded nothing (so cron/CI
flags a fully failed run). The dry-run above shows a contact arriving from two
independent sources collapsing to one entity with `trust=2` — the whole chain,
verified without a database.

## Running the smoke test

No `npm install` required — uses Node's native TypeScript type-stripping
(Node ≥ 22.6) and the repo's `.venv` for the worker:

```bash
python3 -m venv .venv           # if not already created
node tools/etl/smoke.ts
```

It verifies the success path, non-zero-exit isolation, timeout, and spawn
failure against the real `tools/crm/worker.py`. The `map_contact` transform
requires Pydantic in the worker's environment; the `signature` transform is pure
standard library and runs anywhere.
