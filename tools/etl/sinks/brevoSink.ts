/**
 * Brevo sink: upsert a normalised contact as a Brevo contact.
 *
 * Use as the `forward` dependency of `ingestContact`, mirroring the Brevo
 * integration already in api/contact.js but for the EnterpriseContact shape:
 *
 *   import { createBrevoSink } from './sinks/brevoSink.ts';
 *   const outcome = await ingestContact(provider, payload, {
 *     forward: createBrevoSink(),        // reads BREVO_API_KEY / BREVO_LIST_ID
 *   });
 *
 * No third-party deps — uses global fetch (Node >= 18).
 */

import type { NormalizedContact } from '../contactBridge.ts';

export interface BrevoOptions {
  apiKey?: string; // default: process.env.BREVO_API_KEY
  listId?: number; // default: process.env.BREVO_LIST_ID
  endpoint?: string; // default: https://api.brevo.com/v3/contacts
  fetchImpl?: typeof fetch; // injectable for tests
}

function primaryOr<T extends { is_primary: boolean }>(items: T[]): T | undefined {
  return items.find((i) => i.is_primary) ?? items[0];
}

/** Map + POST one contact to Brevo. Throws on missing key / no email / HTTP error. */
export async function forwardToBrevo(contact: NormalizedContact, options: BrevoOptions = {}): Promise<void> {
  const apiKey = options.apiKey ?? process.env.BREVO_API_KEY;
  if (!apiKey) throw new Error('BREVO_API_KEY is not set');

  const email = primaryOr(contact.emails)?.address;
  if (!email) throw new Error(`contact ${contact.source_id || '(no id)'} has no email; cannot upsert to Brevo`);

  const phone = primaryOr(contact.phones)?.number;
  const listId = options.listId ?? (process.env.BREVO_LIST_ID ? Number(process.env.BREVO_LIST_ID) : undefined);
  const doFetch = options.fetchImpl ?? fetch;

  const body = {
    email,
    attributes: {
      FIRSTNAME: contact.first_name,
      LASTNAME: contact.last_name,
      ...(phone ? { SMS: phone, WHATSAPP: phone } : {}),
      SOURCE_SYSTEM: contact.source_system,
      SOURCE_ID: contact.source_id,
    },
    updateEnabled: true, // upsert: create or update by email
    ...(listId ? { listIds: [listId] } : {}),
  };

  const res = await doFetch(options.endpoint ?? 'https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: { 'api-key': apiKey, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify(body),
  });

  // Brevo returns 201 (created) or 204 (updated).
  if (!res.ok && res.status !== 204) {
    const text = await res.text().catch(() => '');
    throw new Error(`Brevo upsert failed: ${res.status} ${text}`);
  }
}

/** Build a `forward` sink bound to Brevo options. */
export function createBrevoSink(options: BrevoOptions = {}) {
  return (contact: NormalizedContact) => forwardToBrevo(contact, options);
}
