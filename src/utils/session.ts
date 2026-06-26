// Client-side login session for real customer accounts.
// We store a short signed token (issued by /api/auth verify) + the email in
// localStorage. The token is sent to /api/auth { action: "me" } to load the
// live user record (paid status, plan, phone). Logout just clears it.

export interface SessionUser {
  email?: string;
  phone?: string;
  contact?: string;
  verified?: boolean;
  paid?: boolean;
  paidPlan?: string;
  lastPlan?: string;
  attempts?: number;
  created_at?: string;
  paidAt?: string;
  lastAttemptAt?: string;
  [k: string]: any;
}

const KEY = "shivoham_session";
const EVENT = "shivoham-auth";

export interface Session {
  token: string;
  email: string;
}

export function getSession(): Session | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    return s && s.token && s.email ? s : null;
  } catch {
    return null;
  }
}

export function setSession(token: string, email: string) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ token, email }));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    /* ignore */
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(KEY);
    window.dispatchEvent(new Event(EVENT));
  } catch {
    /* ignore */
  }
}

// Subscribe to login/logout changes (same tab via custom event, other tabs via
// the native storage event). Returns an unsubscribe function.
export function onAuthChange(cb: () => void): () => void {
  const handler = () => cb();
  window.addEventListener(EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

// Friendly display name derived from the email (we don't collect a name).
export function displayName(email?: string): string {
  if (!email) return "Learner";
  const local = email.split("@")[0].replace(/[._-]+/g, " ").trim();
  if (!local) return "Learner";
  return local.replace(/\b\w/g, (c) => c.toUpperCase());
}

// Load the live user record for the saved session. Clears the session and
// returns null if the token is missing / invalid / expired.
export async function fetchMe(): Promise<SessionUser | null> {
  const s = getSession();
  if (!s) return null;
  try {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "me", token: s.token }),
    });
    if (res.status === 401 || res.status === 404) {
      clearSession();
      return null;
    }
    const data = await res.json().catch(() => ({}));
    return data.user || null;
  } catch {
    return null;
  }
}
