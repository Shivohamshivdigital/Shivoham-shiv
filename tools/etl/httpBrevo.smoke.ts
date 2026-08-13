/**
 * Smoke test for the HTTP transport (Vercel Python function) and the Brevo sink.
 * Run: node tools/etl/httpBrevo.smoke.ts   (no dependencies)
 */

import { createServer } from 'node:http';
import { runHttpBridge, ingestContact } from './contactBridge.ts';
import type { NormalizedContact } from './contactBridge.ts';
import { forwardToBrevo, createBrevoSink } from './sinks/brevoSink.ts';

let failures = 0;
const check = (n: string, c: boolean, d = '') => {
  console.log(`  ${c ? 'ok  ' : 'FAIL'} ${n}${d ? ' — ' + d : ''}`);
  if (!c) failures++;
};

const CONTACT: NormalizedContact = {
  source_system: 'google_people', source_id: 'people/c1', source_updated_at: '2026-01-01T00:00:00Z',
  first_name: 'Jane', last_name: 'Doe',
  emails: [{ address: 'jane@work.com', label: 'work', is_primary: true }],
  phones: [{ number: '+1 415 555 0142', label: 'mobile', is_primary: true }],
  addresses: [], organizations: [],
};

// A stand-in for the deployed Python function.
function startServer(mode: 'ok' | 'error' | 'boom') {
  const server = createServer((req, res) => {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => {
      if (mode === 'boom') { res.writeHead(500); res.end('kaboom'); return; }
      if (mode === 'error') {
        res.writeHead(422, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ status: 'error', message: 'bad record' }));
        return;
      }
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify(CONTACT));
    });
  });
  return new Promise<{ url: string; close: () => void }>((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address() as any;
      resolve({ url: `http://127.0.0.1:${addr.port}/api/normalize`, close: () => server.close() });
    });
  });
}

async function main() {
  // --- HTTP transport ---
  const okSrv = await startServer('ok');
  const okRes = await runHttpBridge('google_people', { resourceName: 'people/c1' }, { url: okSrv.url });
  check('http transport parses contact', okRes.ok === true && (okRes as any).contact.first_name === 'Jane');
  okSrv.close();

  const errSrv = await startServer('error');
  const errRes = await runHttpBridge('graph', {}, { url: errSrv.url });
  check('http {status:error} -> cli-error', errRes.ok === false && (errRes as any).kind === 'cli-error');
  errSrv.close();

  // ingestContact over HTTP: happy path forwards; server error falls back to native.
  const boomSrv = await startServer('boom');
  const stored: NormalizedContact[] = [];
  const out = await ingestContact('google_people',
    { resourceName: 'people/c1', names: [{ givenName: 'Jane', familyName: 'Doe' }] },
    { normalizeUrl: boomSrv.url, forward: (c) => { stored.push(c); } });
  check('http 500 -> native fallback, still forwarded', out.via === 'native' && out.forwarded && stored.length === 1);
  boomSrv.close();

  const okSrv2 = await startServer('ok');
  const store2: NormalizedContact[] = [];
  const out2 = await ingestContact('google_people', { resourceName: 'people/c1' },
    { normalizeUrl: okSrv2.url, forward: (c) => { store2.push(c); } });
  check('http happy path -> via=python, forwarded', out2.via === 'python' && store2.length === 1);
  okSrv2.close();

  // --- Brevo sink ---
  let captured: any = null;
  const fakeFetch = (async (url: string, init: any) => {
    captured = { url, body: JSON.parse(init.body), headers: init.headers };
    return { ok: true, status: 201, text: async () => '' } as any;
  }) as unknown as typeof fetch;

  await forwardToBrevo(CONTACT, { apiKey: 'test-key', listId: 7, fetchImpl: fakeFetch });
  check('brevo posts to contacts endpoint', captured.url === 'https://api.brevo.com/v3/contacts');
  check('brevo maps email + names + phone', captured.body.email === 'jane@work.com'
    && captured.body.attributes.FIRSTNAME === 'Jane'
    && captured.body.attributes.SMS === '+1 415 555 0142');
  check('brevo upsert (updateEnabled) + listId', captured.body.updateEnabled === true && captured.body.listIds[0] === 7);
  check('brevo sends api-key header', captured.headers['api-key'] === 'test-key');

  // missing email must throw (so ingestContact logs and does not silently lose it)
  let threw = false;
  try {
    await forwardToBrevo({ ...CONTACT, emails: [] }, { apiKey: 'k', fetchImpl: fakeFetch });
  } catch { threw = true; }
  check('brevo throws when no email', threw);

  // non-ok HTTP throws
  let threw2 = false;
  const badFetch = (async () => ({ ok: false, status: 400, text: async () => 'bad' })) as unknown as typeof fetch;
  try { await forwardToBrevo(CONTACT, { apiKey: 'k', fetchImpl: badFetch }); } catch { threw2 = true; }
  check('brevo throws on non-ok status', threw2);

  // createBrevoSink returns a usable forward fn
  const sink = createBrevoSink({ apiKey: 'k', fetchImpl: fakeFetch });
  await sink(CONTACT);
  check('createBrevoSink forwards', captured.body.email === 'jane@work.com');

  console.log(`\n${failures === 0 ? 'ALL PASSED' : failures + ' FAILED'}`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => { console.error('UNEXPECTED THROW:', e); process.exit(1); });
