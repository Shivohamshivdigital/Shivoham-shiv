// POST /api/auth  { action, ... }   — passwordless email-OTP flow.
//   request { email, attribution }  -> create/refresh user, email a 6-digit OTP
//   verify  { email, otp }          -> mark verified, return token
//   phone   { email, phone }         -> save the user's phone number
//   resend  { email }                -> email a fresh OTP

import { dbInsert, dbUpdate, dbFindBy } from "./_db.js";
import { genOtp, signToken, verifyToken, sendOtpEmail } from "./_auth.js";

const norm = (e) => String(e || "").trim().toLowerCase();
const TEN_MIN = 10 * 60 * 1000;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { action } = req.body || {};
  try {
    if (action === "request" || action === "resend") return await requestOtp(req, res);
    if (action === "verify") return await verify(req, res);
    if (action === "phone") return await savePhone(req, res);
    if (action === "me") return await me(req, res);
    return res.status(400).json({ error: "Unknown action." });
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}

async function requestOtp(req, res) {
  const { email, attribution } = req.body || {};
  const attr = attribution && typeof attribution === "object" ? attribution : {};
  const email2 = norm(email);
  if (!email2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email2)) {
    return res.status(400).json({ error: "Please enter a valid email." });
  }

  const existing = await dbFindBy("users", "email", email2);
  const otp = genOtp();
  let base = {};
  if (existing) {
    const { id, ...rest } = existing;
    base = rest;
  }
  const fields = {
    ...base,
    email: email2,
    otp,
    otpExpiry: Date.now() + TEN_MIN,
    verified: existing?.verified || false,
    paid: existing?.paid || false,
    created_at: existing?.created_at || new Date().toISOString(),
    // First-touch ad attribution.
    utm_source: existing?.utm_source || attr.utm_source || "",
    utm_medium: existing?.utm_medium || attr.utm_medium || "",
    utm_campaign: existing?.utm_campaign || attr.utm_campaign || "",
    utm_term: existing?.utm_term || attr.utm_term || "",
    gclid: existing?.gclid || attr.gclid || "",
    fbclid: existing?.fbclid || attr.fbclid || "",
    referrer: existing?.referrer || attr.referrer || "",
    landing_page: existing?.landing_page || attr.landing_page || "",
  };
  if (existing) await dbUpdate("users", existing.id, fields);
  else await dbInsert("users", fields);

  const sent = await sendOtpEmail(email2, otp);
  if (!sent) return res.status(502).json({ error: "Could not send the verification email. Please try again." });
  return res.status(200).json({ success: true });
}

async function verify(req, res) {
  const { email, otp } = req.body || {};
  const email2 = norm(email);
  if (!email2 || !otp) return res.status(400).json({ error: "Email and code are required." });

  const user = await dbFindBy("users", "email", email2);
  if (!user) return res.status(404).json({ error: "Please request a code first." });
  if (!user.otp || String(user.otp) !== String(otp).trim()) {
    return res.status(400).json({ error: "Incorrect code. Please check and try again." });
  }
  if (user.otpExpiry && Number(user.otpExpiry) < Date.now()) {
    return res.status(400).json({ error: "Code expired. Please resend a new one." });
  }
  const { id, ...rest } = user;
  await dbUpdate("users", id, { ...rest, verified: true, otp: "", otpExpiry: 0 });
  return res.status(200).json({ success: true, token: signToken({ email: email2 }), email: email2 });
}

// Return the logged-in user for a saved session token (used by the dashboard
// and navbar). Re-reads from the DB so paid status / plan is always current.
async function me(req, res) {
  const { token } = req.body || {};
  const payload = token ? verifyToken(token) : null;
  if (!payload || !payload.email) return res.status(401).json({ error: "Not logged in." });
  const user = await dbFindBy("users", "email", norm(payload.email));
  if (!user) return res.status(404).json({ error: "Account not found." });
  // Never expose the OTP or any password hash.
  const { otp, otpExpiry, passwordHash, ...safe } = user;
  return res.status(200).json({ user: safe });
}

async function savePhone(req, res) {
  const { email, phone } = req.body || {};
  const email2 = norm(email);
  const phone2 = String(phone || "").replace(/[^\d+]/g, "");
  if (!email2) return res.status(400).json({ error: "Email is required." });
  if (phone2.replace(/\D/g, "").length < 10) {
    return res.status(400).json({ error: "Please enter a valid phone number." });
  }
  const user = await dbFindBy("users", "email", email2);
  if (!user) return res.status(404).json({ error: "User not found." });
  const { id, ...rest } = user;
  await dbUpdate("users", id, { ...rest, phone: phone2, contact: phone2 });
  return res.status(200).json({ success: true });
}
