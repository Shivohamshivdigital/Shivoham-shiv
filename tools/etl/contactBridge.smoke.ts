/**
 * End-to-end smoke test for the resilient contact bridge.
 * Run with no dependencies:  node tools/etl/contactBridge.smoke.ts
 *
 * Covers all four requirements:
 *  - happy path: spawn CLI, stream stdin, parse stdout, forward   (2 & 3)
 *  - CLI in-band {status:error} -> native fallback                (4)
 *  - real cli.py fails here (no pydantic) -> native fallback      (4)
 *  - missing python binary -> native fallback                     (4)
 * and never drops a record.
 */

import { ingestContact, runCliBridge, nativeMapContact } from './contactBridge.ts';
import type { NormalizedContact } from './contactBridge.ts';

const REAL_PY = process.env.PYTHON ?? './.venv/bin/python3';
const env = { ...process.env, PYTHONPATH: '.' };

let failures = 0;
const check = (n: string, c: boolean, d = '') => {
  console.log(`  ${c ? 'ok  ' : 'FAIL'} ${n}${d ? ' — ' + d : ''}`);
  if (!c) failures++;
};

const GOOGLE = {
  resourceName: 'people/c1',
  names: [{ givenName: 'Jane', familyName: 'Doe' }],
  emailAddresses: [{ value: 'Jane@Work.com', type: 'work', metadata: { primary: true } }],
  phoneNumbers: [{ value: '+1 415 555 0142', type: 'cell' }],
};
const GRAPH = {
  id: 'AAMk=',
  givenName: 'John',
  surname: 'Smith',
  emailAddresses: [{ address: 'john@contoso.com' }],
  mobilePhone: '+44 20 7946 0000',
  businessPhones: ['+44 20 7946 1111'],
};

async function main() {
  // 1) HAPPY PATH (req 2 & 3): CLI succeeds -> stdin streamed, stdout parsed,
  //    contact forwarded, via=python.
  const okStore: NormalizedContact[] = [];
  const ok = await ingestContact('google_people', GOOGLE, {
    python: 'python3',
    cliPath: 'tools/etl/testdata/fake_cli_ok.py',
    env,
    forward: (c) => { okStore.push(c); },
  });
  check('happy path used python', ok.via === 'python', ok.via);
  check('happy path parsed + forwarded', ok.forwarded && okStore.length === 1);
  check('parsed contact fields', ok.contact.first_name === 'Jane' && ok.contact.emails[0]?.address === 'jane@work.com');

  // 2) CLI in-band error object (req 4) -> fallback to native, still forwarded.
  const errStore: NormalizedContact[] = [];
  const err = await ingestContact('graph', GRAPH, {
    python: 'python3',
    cliPath: 'tools/etl/testdata/fake_cli_error.py',
    env,
    forward: (c) => { errStore.push(c); },
  });
  check('cli {status:error} -> native fallback', err.via === 'native', err.via);
  check('graph surname mapped natively', err.contact.last_name === 'Smith' && errStore.length === 1);
  check('graph mobilePhone primary natively', err.contact.phones[0]?.number === '+44 20 7946 0000' && err.contact.phones[0]?.label === 'mobile');

  // 3) REAL cli.py fails here (pydantic missing) (req 4) -> native fallback.
  const realStore: NormalizedContact[] = [];
  const real = await ingestContact('google_people', GOOGLE, {
    python: REAL_PY,
    cliPath: 'tools/crm/cli.py',
    env,
    timeoutMs: 8000,
    forward: (c) => { realStore.push(c); },
  });
  check('real cli failure -> native fallback', real.via === 'native', real.via);
  check('record never dropped', real.forwarded && realStore.length === 1);
  check('native normalised cell->mobile + lowercased email',
    real.contact.phones[0]?.label === 'mobile' && real.contact.emails[0]?.address === 'jane@work.com');

  // 4) Missing python binary -> spawn error -> native fallback.
  const missStore: NormalizedContact[] = [];
  const miss = await ingestContact('google', GOOGLE, {
    python: 'definitely-not-python-xyz',
    timeoutMs: 3000,
    forward: (c) => { missStore.push(c); },
  });
  check('missing binary -> native fallback, forwarded', miss.via === 'native' && miss.forwarded);

  // 5) Direct unit: runCliBridge classifies the error object as a failure.
  const raw = await runCliBridge('graph', GRAPH, {
    python: 'python3', cliPath: 'tools/etl/testdata/fake_cli_error.py', env,
  });
  check('runCliBridge flags cli-error', raw.ok === false && raw.kind === 'cli-error', raw.ok ? 'ok?!' : raw.kind);

  // 6) Direct unit: native mapper is faithful and never throws on junk.
  const junk = nativeMapContact('google', null);
  check('native mapper tolerates junk input', junk.source_system === 'google_people' && junk.emails.length === 0);

  console.log(`\n${failures === 0 ? 'ALL PASSED' : failures + ' FAILED'}`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error('UNEXPECTED THROW (bridge must never throw):', e);
  process.exit(1);
});
