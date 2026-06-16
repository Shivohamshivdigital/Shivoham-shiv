// Shared Firebase Firestore helpers (server-side only).
// Files prefixed with "_" are NOT exposed as routes by Vercel.
//
// Uses the Firestore REST API with a Google service account — no extra npm
// packages required (keeps the Vercel build light).
//
// Required environment variables (from your Firebase service account JSON:
//   Firebase Console → Project Settings → Service accounts → Generate new private key):
//   FIREBASE_PROJECT_ID     e.g. shivoham-shiv
//   FIREBASE_CLIENT_EMAIL   e.g. firebase-adminsdk-xxxx@shivoham-shiv.iam.gserviceaccount.com
//   FIREBASE_PRIVATE_KEY    the long "-----BEGIN PRIVATE KEY-----..." string
//                           (paste it exactly; literal \n inside it are handled automatically)

import crypto from "crypto";

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
const CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL;
const PRIVATE_KEY = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);

// Vercel (and copy-paste) often wrap the key in quotes or keep literal "\n"
// sequences instead of real newlines. Normalise both so the PEM parses.
function normalizePrivateKey(raw) {
  let key = (raw || "").trim();
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }
  return key.replace(/\\n/g, "\n");
}

const FIRESTORE_BASE = PROJECT_ID
  ? `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`
  : null;

export function isDbConfigured() {
  return Boolean(PROJECT_ID && CLIENT_EMAIL && PRIVATE_KEY);
}

// --- Google OAuth access token (cached while the container stays warm) ---

let cachedToken = null; // { token, expiresAt }

function base64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedToken.expiresAt - 60 > now) {
    return cachedToken.token;
  }

  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64url(
    JSON.stringify({
      iss: CLIENT_EMAIL,
      scope: "https://www.googleapis.com/auth/datastore",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    })
  );
  const signingInput = `${header}.${claim}`;
  const signature = base64url(
    crypto.createSign("RSA-SHA256").update(signingInput).sign(PRIVATE_KEY)
  );
  const assertion = `${signingInput}.${signature}`;

  const resp = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  if (!resp.ok) {
    throw new Error(`Firebase token request failed: ${resp.status} ${await resp.text()}`);
  }
  const data = await resp.json();
  cachedToken = { token: data.access_token, expiresAt: now + (data.expires_in || 3600) };
  return cachedToken.token;
}

// --- Firestore typed-value conversion ---

function toFirestoreValue(v) {
  if (v === null || v === undefined) return { nullValue: null };
  if (typeof v === "boolean") return { booleanValue: v };
  if (typeof v === "number") {
    return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  }
  return { stringValue: String(v) };
}

function toFirestoreFields(obj) {
  const fields = {};
  for (const [k, v] of Object.entries(obj)) fields[k] = toFirestoreValue(v);
  return fields;
}

function fromFirestoreValue(val) {
  if (!val || typeof val !== "object") return null;
  if ("stringValue" in val) return val.stringValue;
  if ("integerValue" in val) return Number(val.integerValue);
  if ("doubleValue" in val) return val.doubleValue;
  if ("booleanValue" in val) return val.booleanValue;
  if ("timestampValue" in val) return val.timestampValue;
  if ("nullValue" in val) return null;
  return null;
}

function fromFirestoreDoc(doc) {
  const out = {};
  // The document id is the last path segment of doc.name.
  if (doc.name) out.id = String(doc.name).split("/").pop();
  const fields = doc.fields || {};
  for (const [k, v] of Object.entries(fields)) out[k] = fromFirestoreValue(v);
  return out;
}

// --- Public API (same shape as before, so callers don't change) ---

/** Insert a document. Best-effort: returns false on failure instead of throwing. */
export async function dbInsert(collection, row) {
  if (!isDbConfigured()) return false;
  try {
    const token = await getAccessToken();
    const payload = { ...row, created_at: new Date().toISOString() };
    const resp = await fetch(`${FIRESTORE_BASE}/${collection}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ fields: toFirestoreFields(payload) }),
    });
    if (!resp.ok) {
      console.error("Firestore insert failed:", collection, resp.status, await resp.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("Firestore insert error:", err);
    return false;
  }
}

/** Select all documents in a collection (newest first). Throws on failure. */
export async function dbSelect(collection) {
  if (!isDbConfigured()) return [];
  const token = await getAccessToken();
  const rows = [];
  let pageToken = "";
  // Firestore lists up to 300 docs/page; page through to get them all.
  do {
    const url = new URL(`${FIRESTORE_BASE}/${collection}`);
    url.searchParams.set("pageSize", "300");
    if (pageToken) url.searchParams.set("pageToken", pageToken);
    const resp = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!resp.ok) {
      throw new Error(`Firestore select failed: ${resp.status} ${await resp.text()}`);
    }
    const data = await resp.json();
    for (const doc of data.documents || []) rows.push(fromFirestoreDoc(doc));
    pageToken = data.nextPageToken || "";
  } while (pageToken);

  // Newest first.
  rows.sort((a, b) => String(b.created_at || "").localeCompare(String(a.created_at || "")));
  return rows;
}

/** Overwrite a document by id with the given fields. Throws on failure. */
export async function dbUpdate(collection, id, row) {
  if (!isDbConfigured()) return false;
  const token = await getAccessToken();
  const resp = await fetch(`${FIRESTORE_BASE}/${collection}/${id}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({ fields: toFirestoreFields(row) }),
  });
  if (!resp.ok) {
    throw new Error(`Firestore update failed: ${resp.status} ${await resp.text()}`);
  }
  return true;
}

/** Delete a document by id. Throws on failure. */
export async function dbDelete(collection, id) {
  if (!isDbConfigured()) return false;
  const token = await getAccessToken();
  const resp = await fetch(`${FIRESTORE_BASE}/${collection}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!resp.ok) {
    throw new Error(`Firestore delete failed: ${resp.status} ${await resp.text()}`);
  }
  return true;
}
