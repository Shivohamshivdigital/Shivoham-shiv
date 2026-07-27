/**
 * Install the Python dependencies (Pydantic) the CRM mapping bridge needs,
 * alongside the Node build.
 *
 * Designed to be safe as an npm `postinstall` hook:
 *   - cross-platform (plain Node, no bash), so it can't break Windows/CI installs;
 *   - idempotent and NON-FATAL — it always exits 0. If python/pip are missing or
 *     the install fails, it logs a notice and moves on. The CRM bridge then falls
 *     back to its native-JS mapper, so nothing is dropped.
 *
 * Opt out entirely with SKIP_PYTHON_SETUP=1.
 *
 * NOTE: on Vercel *serverless*, a build-time install does NOT make python3
 * spawnable at request time — see tools/crm/DEPLOYMENT.md. This hook is for
 * standard servers, containers, and persistent Node hosts.
 */

import { spawnSync } from 'node:child_process';

const REQ = 'tools/crm/requirements.txt';

function ok(cmd, args) {
  try {
    return spawnSync(cmd, args, { stdio: 'ignore' }).status === 0;
  } catch {
    return false;
  }
}

if (process.env.SKIP_PYTHON_SETUP === '1') {
  console.log('[setup-python] SKIP_PYTHON_SETUP=1 → skipping.');
  process.exit(0);
}

const python = ['python3', 'python'].find((c) => ok(c, ['--version']));
if (!python) {
  console.log('[setup-python] no python interpreter found → skipping (CRM bridge will use its native-JS fallback).');
  process.exit(0);
}
if (!ok(python, ['-m', 'pip', '--version'])) {
  console.log(`[setup-python] pip unavailable for ${python} → skipping.`);
  process.exit(0);
}

console.log(`[setup-python] installing ${REQ} with ${python} -m pip …`);
const result = spawnSync(python, ['-m', 'pip', 'install', '-r', REQ], { stdio: 'inherit' });
if (result.status !== 0) {
  console.log('[setup-python] pip install did not succeed → continuing (native-JS fallback remains available).');
} else {
  console.log('[setup-python] Python dependencies installed.');
}
process.exit(0); // never fail the surrounding Node build
