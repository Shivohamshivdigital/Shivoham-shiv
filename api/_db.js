// Shared Supabase REST helpers (server-side only).
// Files prefixed with "_" are NOT exposed as routes by Vercel.
//
// Required environment variables:
//   SUPABASE_URL                 e.g. https://xxxx.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY    service_role key (server-side only, never in the browser)

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function isDbConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_KEY);
}

/** Insert a row. Best-effort: returns false on failure instead of throwing. */
export async function dbInsert(table, row) {
  if (!isDbConfigured()) return false;
  try {
    const resp = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "content-type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(row),
    });
    if (!resp.ok) {
      console.error("Supabase insert failed:", table, resp.status, await resp.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("Supabase insert error:", err);
    return false;
  }
}

/** Select rows (default: newest first). Throws on failure. */
export async function dbSelect(table, query = "select=*&order=created_at.desc") {
  if (!isDbConfigured()) return [];
  const resp = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });
  if (!resp.ok) {
    throw new Error(`Supabase select failed: ${resp.status} ${await resp.text()}`);
  }
  return resp.json();
}
