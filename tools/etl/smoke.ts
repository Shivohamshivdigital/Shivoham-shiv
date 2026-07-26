/**
 * End-to-end smoke test for the IPC helper against the real Python worker.
 * Runnable with no dependencies:  node tools/etl/smoke.ts
 * (Uses Node's native TypeScript type-stripping.)
 */

import { runPythonWorker } from './pythonWorker.ts';
import type { WorkerRun } from './pythonWorker.ts';

const PY = process.env.PYTHON ?? './.venv/bin/python3';
const env = { ...process.env, PYTHONPATH: '.' };

let failures = 0;
function check(name: string, cond: boolean, detail = '') {
  console.log(`  ${cond ? 'ok  ' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`);
  if (!cond) failures++;
}

async function main() {
  // 1) Success path: signature transform streams ordered results, isolates a bad line.
  const telem: string[] = [];
  const run = (await runPythonWorker(
    [
      { id: 'a1', body: 'Thanks,\nDana\nMobile: +1 (415) 555-0142 x22\ndana@x.com' },
      { id: 'a2', body: 'no signature, just invoice 4455667788 and date 2026-09-01' },
    ],
    {
      command: PY,
      args: ['-m', 'tools.crm.worker', '--transform', 'signature'],
      env,
      onTelemetry: (l) => telem.push(l),
    },
  )) as WorkerRun<{ id: string; phones: Array<{ digits: string }> }>;

  check('success run resolves ok', run.ok === true);
  if (run.ok) {
    check('two results returned', run.results.length === 2, `got ${run.results.length}`);
    const r0 = run.results[0];
    check(
      'record a1 extracted the signature phone',
      r0.ok === true && r0.data.phones[0]?.digits === '+14155550142',
    );
    const r1 = run.results[1];
    check('record a2 (no signature) yields no phones', r1.ok === true && r1.data.phones.length === 0);
    check('telemetry captured on stderr', run.telemetry.stderr.some((l) => l.includes('"event":"done"')));
    check('onTelemetry hook fired', telem.length > 0);
    check('exit code 0', run.telemetry.exitCode === 0);
  }

  // 2) Fault isolation: non-zero exit (map_contact needs pydantic, absent here -> exit 3).
  const bad = await runPythonWorker([{ source: 'google_people', payload: {} }], {
    command: PY,
    args: ['-m', 'tools.crm.worker', '--transform', 'map_contact'],
    env,
  });
  check('non-zero exit is caught, not thrown', bad.ok === false);
  if (!bad.ok) {
    check('classified as nonzero-exit', bad.kind === 'nonzero-exit', bad.kind);
    check(
      'failure telemetry preserved',
      bad.telemetry.stderr.some((l) => l.includes('missing_dependency')),
    );
  }

  // 3) Timeout: a worker that never exits is killed and isolated.
  const slow = await runPythonWorker([{ id: 'x' }], {
    command: PY,
    args: ['-c', 'import time; time.sleep(30)'],
    env,
    timeoutMs: 600,
  });
  check('timeout is caught', slow.ok === false && slow.kind === 'timeout', slow.ok ? 'resolved ok?!' : slow.kind);
  check('timedOut flag set', slow.telemetry.timedOut === true);

  // 4) Spawn failure: a missing executable does not crash the parent.
  const missing = await runPythonWorker([{ id: 'x' }], {
    command: 'definitely-not-a-real-binary-xyz',
    args: [],
    timeoutMs: 1000,
  });
  check('spawn failure is caught', missing.ok === false && missing.kind === 'spawn', missing.ok ? 'ok?!' : missing.kind);

  console.log(`\n${failures === 0 ? 'ALL PASSED' : failures + ' FAILED'}`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((err) => {
  // The helper should never reject; if we land here, that is itself a failure.
  console.error('UNEXPECTED THROW — isolation boundary leaked:', err);
  process.exit(1);
});
