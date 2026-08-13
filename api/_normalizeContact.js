// Shared helper (NOT a route — the "_" prefix keeps Vercel from exposing it).
//
// Resilient contact normalisation for the serverless API. Turns a raw Google
// People / Microsoft Graph payload into the unified contact shape:
//
//   - If NORMALIZE_URL (or VERCEL_URL) is set, it calls the Python normaliser
//     function (api/normalize.py) over HTTP — the full Pydantic-validated path.
//   - On any failure, or when no URL is configured, it maps the payload with a
//     pure-JS native mapper. It never throws, so a record is never dropped.
//
// This mirrors tools/etl/contactBridge.ts but in plain JS for the api/ runtime.

const GRAPH_ALIASES = new Set(["microsoft", "microsoft_graph", "graph", "msgraph", "outlook"]);

function resolveFamily(provider) {
  return GRAPH_ALIASES.has(String(provider).trim().toLowerCase()) ? "microsoft_graph" : "google_people";
}

const isNonEmpty = (v) => typeof v === "string" && v.trim().length > 0;

function normLabel(raw) {
  const k = String(raw ?? "").trim().toLowerCase();
  if (k === "cell" || k === "mobile") return "mobile";
  if (k === "work" || k === "business" || k === "office") return "work";
  if (k === "home" || k === "personal") return "home";
  return "other";
}

function dedupePrimary(items, key) {
  const seen = new Map();
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

// Pure-JS fallback mapper. Never throws.
export function nativeMapContact(provider, raw) {
  const family = resolveFamily(provider);
  const rec = raw && typeof raw === "object" ? raw : {};
  const emails = [];
  const phones = [];
  let sourceId = "";
  let firstName = "";
  let lastName = "";

  if (family === "microsoft_graph") {
    sourceId = isNonEmpty(rec.id) ? rec.id : "";
    firstName = isNonEmpty(rec.givenName) ? rec.givenName.trim() : "";
    lastName = isNonEmpty(rec.surname) ? rec.surname.trim() : "";
    (rec.emailAddresses || []).forEach((e, i) => {
      if (isNonEmpty(e?.address)) emails.push({ address: e.address.trim().toLowerCase(), label: "other", is_primary: i === 0 });
    });
    if (isNonEmpty(rec.mobilePhone)) phones.push({ number: rec.mobilePhone.trim(), label: "mobile", is_primary: true });
    (rec.businessPhones || []).forEach((n) => { if (isNonEmpty(n)) phones.push({ number: n.trim(), label: "work", is_primary: false }); });
    (rec.homePhones || []).forEach((n) => { if (isNonEmpty(n)) phones.push({ number: n.trim(), label: "home", is_primary: false }); });
  } else {
    sourceId = isNonEmpty(rec.resourceName) ? rec.resourceName : "";
    const nm = (rec.names || [])[0] || {};
    firstName = isNonEmpty(nm.givenName) ? nm.givenName.trim() : "";
    lastName = isNonEmpty(nm.familyName) ? nm.familyName.trim() : "";
    if (!firstName && !lastName && isNonEmpty(nm.displayName)) {
      const parts = nm.displayName.trim().split(/\s+/);
      firstName = parts[0];
      lastName = parts.slice(1).join(" ");
    }
    (rec.emailAddresses || []).forEach((e) => {
      if (isNonEmpty(e?.value)) emails.push({ address: e.value.trim().toLowerCase(), label: normLabel(e.type), is_primary: Boolean(e?.metadata?.primary) });
    });
    (rec.phoneNumbers || []).forEach((p) => {
      const num = isNonEmpty(p?.canonicalForm) ? p.canonicalForm : p?.value;
      if (isNonEmpty(num)) phones.push({ number: num.trim(), label: normLabel(p?.type), is_primary: Boolean(p?.metadata?.primary) });
    });
  }

  return {
    source_system: family,
    source_id: sourceId,
    source_updated_at: new Date().toISOString(),
    first_name: firstName,
    last_name: lastName,
    emails: dedupePrimary(emails, (e) => e.address),
    phones: dedupePrimary(phones, (p) => p.number),
    addresses: [],
    organizations: [],
  };
}

async function httpNormalize(url, provider, payload, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const qs = new URLSearchParams({ provider }).toString();
    const res = await fetch(`${url}?${qs}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const text = await res.text();
    let parsed = null;
    try { parsed = text ? JSON.parse(text) : null; } catch { return null; }
    if (!res.ok || (parsed && parsed.status === "error")) return null;
    return parsed;
  } catch (err) {
    console.error("normalize HTTP call failed:", err);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Normalise a raw payload. Returns { contact, via: "python" | "native" }.
 * Never throws.
 */
export async function normalizeContact(provider, payload, { timeoutMs = 5000 } = {}) {
  const url =
    process.env.NORMALIZE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/api/normalize` : "");

  if (url) {
    const contact = await httpNormalize(url, provider, payload, timeoutMs);
    if (contact) return { contact, via: "python" };
  }
  return { contact: nativeMapContact(provider, payload), via: "native" };
}

/** Flatten a normalised contact into scalar Firestore-friendly fields. */
export function flattenForStore(contact, via) {
  const primaryEmail = (contact.emails.find((e) => e.is_primary) || contact.emails[0] || {}).address || "";
  const primaryPhone = (contact.phones.find((p) => p.is_primary) || contact.phones[0] || {}).number || "";
  return {
    source_system: contact.source_system,
    source_id: contact.source_id,
    first_name: contact.first_name,
    last_name: contact.last_name,
    primary_email: primaryEmail,
    primary_phone: primaryPhone,
    emails_json: JSON.stringify(contact.emails),
    phones_json: JSON.stringify(contact.phones),
    normalized_via: via,
  };
}
