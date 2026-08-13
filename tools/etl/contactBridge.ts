/**
 * Resilient ingestion bridge: raw provider webhook -> normalised contact.
 *
 * On a contact-sync request the bridge spawns the Python CLI
 * (`python3 tools/crm/cli.py --provider <p>`), streams the raw webhook payload
 * into its stdin, and parses the validated EnterpriseContact JSON from stdout.
 *
 * If Python fails for ANY reason — not installed, missing deps (pydantic), bad
 * exit, timeout, or the CLI's own {"status":"error"} object — the failure is
 * caught, logged, and the record is mapped by a pure-JS native mapper instead.
 * The record is never dropped.
 *
 * This belongs in a persistent Node runtime (the ETL service / a worker), NOT a
 * Vercel serverless function — serverless cannot spawn python3, so there the
 * native path is always used. The bridge degrades to exactly that, safely.
 *
 * Runtime: plain Node (>=18), no third-party deps. Type-strippable, so
 * `node tools/etl/contactBridge.ts`-style execution works as-is.
 */

import { spawn } from 'node:child_process';

// ---- Normalised shape (mirrors EnterpriseContact.model_dump) --------------

export interface NormalizedEmail {
  address: string;
  label: string;
  is_primary: boolean;
}
export interface NormalizedPhone {
  number: string;
  label: string;
  is_primary: boolean;
}
export interface NormalizedContact {
  source_system: string;
  source_id: string;
  source_updated_at: string;
  first_name: string;
  last_name: string;
  emails: NormalizedEmail[];
  phones: NormalizedPhone[];
  addresses: unknown[];
  organizations: unknown[];
}

// ---- CLI bridge (spawn + stdin stream + stdout capture) -------------------

export interface BridgeOptions {
  python?: string; // default 'python3'
  cliPath?: string; // default 'tools/crm/cli.py'
  extractSignature?: boolean;
  timeoutMs?: number; // default 5000
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  logger?: Pick<Console, 'warn' | 'error' | 'debug'>;
}

export type BridgeResult =
  | { ok: true; contact: NormalizedContact; stderr: string[] }
  | { ok: false; kind: 'spawn' | 'timeout' | 'nonzero-exit' | 'protocol' | 'cli-error'; message: string; stderr: string[] };

/**
 * Run one payload through the Python CLI. Always resolves — never throws.
 */
export function runCliBridge(
  provider: string,
  rawPayload: unknown,
  options: BridgeOptions = {},
): Promise<BridgeResult> {
  const python = options.python ?? 'python3';
  const cliPath = options.cliPath ?? 'tools/crm/cli.py';
  const timeoutMs = options.timeoutMs ?? 5000;
  const logger = options.logger ?? console;

  const args = [cliPath, '--provider', provider];
  if (options.extractSignature) args.push('--extract-signature');

  return new Promise<BridgeResult>((resolve) => {
    const stderrLines: string[] = [];
    let stdout = '';
    let stderrRest = '';
    let settled = false;
    let timedOut = false;

    const settle = (r: BridgeResult) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(r);
    };
    const fail = (kind: Extract<BridgeResult, { ok: false }>['kind'], message: string) =>
      settle({ ok: false, kind, message, stderr: stderrLines });

    let child;
    try {
      child = spawn(python, args, {
        cwd: options.cwd,
        env: options.env ?? process.env,
        stdio: ['pipe', 'pipe', 'pipe'],
      });
    } catch (err) {
      return fail('spawn', `spawn threw: ${String(err)}`);
    }

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGKILL');
    }, timeoutMs);
    if (typeof timer.unref === 'function') timer.unref();

    // Stream the raw payload into stdin (guard EPIPE if the child dies early).
    child.stdin.on('error', (err) => logger.debug?.(`[bridge] stdin error ignored: ${String(err)}`));
    try {
      child.stdin.write(typeof rawPayload === 'string' ? rawPayload : JSON.stringify(rawPayload));
      child.stdin.end();
    } catch (err) {
      logger.debug?.(`[bridge] stdin write failed: ${String(err)}`);
    }

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (chunk: string) => {
      stdout += chunk;
    });

    child.stderr.setEncoding('utf8');
    child.stderr.on('data', (chunk: string) => {
      stderrRest += chunk;
      const lines = stderrRest.split('\n');
      stderrRest = lines.pop() ?? '';
      for (const l of lines) if (l.trim()) stderrLines.push(l.trim());
    });

    child.on('error', (err) => fail('spawn', `child error: ${String(err)}`));

    child.on('close', (code) => {
      if (stderrRest.trim()) stderrLines.push(stderrRest.trim());
      if (timedOut) return fail('timeout', `cli exceeded ${timeoutMs}ms`);
      if (code !== 0) return fail('nonzero-exit', `cli exited with code ${code}`);

      const text = stdout.trim();
      if (!text) return fail('protocol', 'cli produced no output');
      let parsed: any;
      try {
        parsed = JSON.parse(text);
      } catch {
        return fail('protocol', `cli output was not JSON: ${text.slice(0, 160)}`);
      }
      // The CLI signals data errors in-band with {"status":"error", ...}.
      if (parsed && parsed.status === 'error') {
        return fail('cli-error', String(parsed.message ?? 'unknown cli error'));
      }
      settle({ ok: true, contact: parsed as NormalizedContact, stderr: stderrLines });
    });
  });
}

// ---- HTTP transport (call the Vercel Python function over fetch) ----------

export interface HttpBridgeOptions {
  /** URL of the deployed Python normaliser, e.g. https://site/api/normalize */
  url: string;
  extractSignature?: boolean;
  timeoutMs?: number; // default 5000
  headers?: Record<string, string>;
}

/**
 * Same contract as {@link runCliBridge}, but calls the Python normaliser over
 * HTTP — for serverless targets that can't spawn python3. Never throws.
 */
export async function runHttpBridge(
  provider: string,
  rawPayload: unknown,
  options: HttpBridgeOptions,
): Promise<BridgeResult> {
  const timeoutMs = options.timeoutMs ?? 5000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  if (typeof (timer as any).unref === 'function') (timer as any).unref();

  const qs = new URLSearchParams({ provider });
  if (options.extractSignature) qs.set('extract_signature', '1');
  const url = `${options.url}?${qs.toString()}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...(options.headers ?? {}) },
      body: typeof rawPayload === 'string' ? rawPayload : JSON.stringify(rawPayload),
      signal: controller.signal,
    });
    const text = await res.text();
    let parsed: any;
    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {
      return { ok: false, kind: 'protocol', message: `non-JSON response: ${text.slice(0, 160)}`, stderr: [] };
    }
    if (!res.ok || (parsed && parsed.status === 'error')) {
      const message = (parsed && parsed.message) || `HTTP ${res.status}`;
      return { ok: false, kind: 'cli-error', message: String(message), stderr: [] };
    }
    return { ok: true, contact: parsed as NormalizedContact, stderr: [] };
  } catch (err) {
    const aborted = (err as any)?.name === 'AbortError';
    return {
      ok: false,
      kind: aborted ? 'timeout' : 'spawn',
      message: aborted ? `request exceeded ${timeoutMs}ms` : `fetch failed: ${String(err)}`,
      stderr: [],
    };
  } finally {
    clearTimeout(timer);
  }
}

// ---- Native JS fallback mapper (never throws) -----------------------------

const _GRAPH_ALIASES = new Set(['microsoft', 'microsoft_graph', 'graph', 'msgraph', 'outlook']);

function resolveFamily(provider: string): 'microsoft_graph' | 'google_people' {
  return _GRAPH_ALIASES.has(String(provider).trim().toLowerCase()) ? 'microsoft_graph' : 'google_people';
}

function dedupeResolvePrimary<T extends { is_primary: boolean }>(items: T[], key: (t: T) => string): T[] {
  const seen = new Map<string, T>();
  for (const it of items) {
    const k = key(it);
    if (!k) continue;
    const existing = seen.get(k);
    if (existing) {
      if (it.is_primary) existing.is_primary = true;
    } else {
      seen.set(k, { ...it });
    }
  }
  const out = [...seen.values()];
  if (out.length) {
    let primarySeen = false;
    for (const it of out) {
      if (it.is_primary && !primarySeen) primarySeen = true;
      else if (it.is_primary) it.is_primary = false;
    }
    if (!primarySeen) out[0].is_primary = true;
  }
  return out;
}

const isNonEmpty = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;

/**
 * Map a raw Google/Graph payload to the normalised shape using plain JS.
 * Deliberately forgiving — it returns a best-effort record rather than throwing,
 * so a customer record is never lost when Python is unavailable.
 */
export function nativeMapContact(provider: string, raw: any): NormalizedContact {
  const family = resolveFamily(provider);
  const nowIso = new Date().toISOString();
  const record = (raw && typeof raw === 'object') ? raw : {};

  let sourceId = '';
  let firstName = '';
  let lastName = '';
  const emails: NormalizedEmail[] = [];
  const phones: NormalizedPhone[] = [];

  if (family === 'microsoft_graph') {
    sourceId = isNonEmpty(record.id) ? record.id : '';
    firstName = isNonEmpty(record.givenName) ? record.givenName.trim() : '';
    lastName = isNonEmpty(record.surname) ? record.surname.trim() : '';
    (record.emailAddresses ?? []).forEach((e: any, i: number) => {
      if (isNonEmpty(e?.address)) emails.push({ address: e.address.trim().toLowerCase(), label: 'other', is_primary: i === 0 });
    });
    if (isNonEmpty(record.mobilePhone)) phones.push({ number: record.mobilePhone.trim(), label: 'mobile', is_primary: true });
    (record.businessPhones ?? []).forEach((n: any) => { if (isNonEmpty(n)) phones.push({ number: n.trim(), label: 'work', is_primary: false }); });
    (record.homePhones ?? []).forEach((n: any) => { if (isNonEmpty(n)) phones.push({ number: n.trim(), label: 'home', is_primary: false }); });
  } else {
    sourceId = isNonEmpty(record.resourceName) ? record.resourceName : '';
    const name = (record.names ?? [])[0] ?? {};
    firstName = isNonEmpty(name.givenName) ? name.givenName.trim() : '';
    lastName = isNonEmpty(name.familyName) ? name.familyName.trim() : '';
    if (!firstName && !lastName && isNonEmpty(name.displayName)) {
      const parts = name.displayName.trim().split(/\s+/);
      firstName = parts[0];
      lastName = parts.slice(1).join(' ');
    }
    (record.emailAddresses ?? []).forEach((e: any) => {
      if (isNonEmpty(e?.value)) {
        emails.push({
          address: e.value.trim().toLowerCase(),
          label: normLabel(e.type),
          is_primary: Boolean(e?.metadata?.primary),
        });
      }
    });
    (record.phoneNumbers ?? []).forEach((p: any) => {
      const num = isNonEmpty(p?.canonicalForm) ? p.canonicalForm : p?.value;
      if (isNonEmpty(num)) phones.push({ number: num.trim(), label: normLabel(p?.type), is_primary: Boolean(p?.metadata?.primary) });
    });
  }

  return {
    source_system: family,
    source_id: sourceId,
    source_updated_at: nowIso,
    first_name: firstName,
    last_name: lastName,
    emails: dedupeResolvePrimary(emails, (e) => e.address),
    phones: dedupeResolvePrimary(phones, (p) => p.number),
    addresses: [],
    organizations: [],
  };
}

function normLabel(raw: unknown): string {
  const k = String(raw ?? '').trim().toLowerCase();
  if (k === 'cell' || k === 'mobile') return 'mobile';
  if (k === 'work' || k === 'business' || k === 'office') return 'work';
  if (k === 'home' || k === 'personal') return 'home';
  return 'other';
}

// ---- Orchestration: bridge with fallback, then forward --------------------

export interface IngestDeps extends BridgeOptions {
  /** Where the sanitised contact goes: DB upsert, Brevo sync, Firebase, etc. */
  forward: (contact: NormalizedContact) => Promise<void> | void;
  /**
   * If set, call the Python normaliser over HTTP (the Vercel function) instead
   * of spawning the CLI. Use this on serverless targets that can't spawn python3.
   */
  normalizeUrl?: string;
}

export interface IngestOutcome {
  via: 'python' | 'native';
  contact: NormalizedContact;
  forwarded: boolean;
}

/**
 * Ingest one raw webhook payload: try the Python CLI, fall back to native
 * mapping on any failure, then forward the result. Never throws; always yields
 * a contact so the caller never drops a record.
 */
export async function ingestContact(
  provider: string,
  rawPayload: unknown,
  deps: IngestDeps,
): Promise<IngestOutcome> {
  const logger = deps.logger ?? console;
  let contact: NormalizedContact;
  let via: 'python' | 'native';

  const result = deps.normalizeUrl
    ? await runHttpBridge(provider, rawPayload, {
        url: deps.normalizeUrl,
        extractSignature: deps.extractSignature,
        timeoutMs: deps.timeoutMs,
      })
    : await runCliBridge(provider, rawPayload, deps);
  if (result.ok) {
    contact = result.contact;
    via = 'python';
  } else {
    logger.error(
      `[contactBridge] python CLI failed (${result.kind}): ${result.message} — falling back to native mapping`,
    );
    // Native mapper is designed not to throw, but guard anyway: a record must
    // never be dropped.
    try {
      contact = nativeMapContact(provider, rawPayload);
    } catch (err) {
      logger.error(`[contactBridge] native mapping also failed: ${String(err)} — using minimal record`);
      contact = minimalContact(provider, rawPayload);
    }
    via = 'native';
  }

  let forwarded = false;
  try {
    await deps.forward(contact);
    forwarded = true;
  } catch (err) {
    logger.error(`[contactBridge] forward/upsert failed (record retained upstream): ${String(err)}`);
  }
  return { via, contact, forwarded };
}

// ---- Request handler factory (Express / Next.js route) --------------------

interface MinimalReq {
  body?: any;
  query?: Record<string, unknown>;
}
interface MinimalRes {
  status(code: number): MinimalRes;
  json(body: unknown): unknown;
}

/**
 * Build a server-side handler that ingests one webhook payload.
 *
 * Wire it into a Next.js route handler or an Express route. The request may send
 * `{ provider, payload }` or a bare provider payload with `?provider=`. Because
 * ingestContact never throws and always falls back to native mapping, the
 * handler responds 200 even when Python is unavailable — the record is never
 * dropped.
 *
 *   app.post('/api/contact-sync', createContactSyncHandler({
 *     forward: (c) => upsertEntity(db, toEntity(c)),   // or Brevo/Firebase
 *   }));
 */
export function createContactSyncHandler(deps: IngestDeps) {
  return async (req: MinimalReq, res: MinimalRes) => {
    const provider = String(req.query?.provider ?? req.body?.provider ?? '');
    const payload = req.body?.payload ?? req.body ?? {};
    if (!provider) {
      return res.status(400).json({ status: 'error', message: 'missing provider' });
    }
    const outcome = await ingestContact(provider, payload, deps);
    return res.status(200).json({
      status: 'ok',
      via: outcome.via, // 'python' | 'native'
      forwarded: outcome.forwarded,
      source_id: outcome.contact.source_id,
    });
  };
}

function minimalContact(provider: string, raw: any): NormalizedContact {
  const family = resolveFamily(provider);
  const record = (raw && typeof raw === 'object') ? raw : {};
  return {
    source_system: family,
    source_id: String(record.id ?? record.resourceName ?? ''),
    source_updated_at: new Date().toISOString(),
    first_name: '',
    last_name: '',
    emails: [],
    phones: [],
    addresses: [],
    organizations: [],
  };
}
