// POST /api/auth  { action, ... }
// One serverless function handling all auth steps (keeps us under Vercel's
// Hobby function limit). Actions:
//   signup { email, password, attribution }  -> create unverified user, email OTP
//   verify { email, otp }                     -> mark verified, return token
//   login  { email, password }                -> token, or needsVerification + OTP
//   resend { email }                          -> new OTP email

import { dbInsert, dbUpdate, dbFindBy } from "./_db.js";
import { hashPassword, verifyPassword, genOtp, signToken, sendOtpEmail } from "./_auth.js";

const norm = (e) => String(e || "").trim().toLowerCase();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { action } = req.body || {};
  try {
    if (action === "signup") return await signup(req, res);
    if (action === "verify") return await verify(req, res);
    if (action === "login") return await login(req, res);
    if (action === "resend") return await resend(req, res);
    return res.status(400).json({ error: "Unknown action." });
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}

async function signup(req, res) {
  const { email, password, attribution } = req.body || {};
  const attr = attribution && typeof attribution === "object" ? attribution : {};
  const email2 = norm(email);
  if (!email2 || !password) return res.status(400).json({ error: "Email and password are required." });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email2)) return res.status(400).json({ error: "Please enter a valid email." });
  if (String(password).length < 6) return res.status(400).json({ error: "Password must be at least 6 characters." });

  const existing = await dbFindBy("users", "email", email2);
  if (existing && existing.verified) {
    return res.status(409).json({ error: "This email is already registered. Please log in." });
  }
  const otp = genOtp();
  const fields = {
    email: email2,
    passwordHash: hashPassword(password),
    verified: false,
    paid: existing?.paid || false,
    otp,
    otpExpiry: Date.now() + 10 * 60 * 1000,
    created_at: existing?.created_at || new Date().toISOString(),
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
  return res.status(200).json({ success: true, pending: true });
}

async function verify(req, res) {
  const { email, otp } = req.body || {};
  const email2 = norm(email);
  if (!email2 || !otp) return res.status(400).json({ error: "Email and code are required." });

  const user = await dbFindBy("users", "email", email2);
  if (!user) return res.status(404).json({ error: "No signup found for this email." });
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

async function login(req, res) {
  const { email, password } = req.body || {};
  const email2 = norm(email);
  if (!email2 || !password) return res.status(400).json({ error: "Email and password are required." });

  const user = await dbFindBy("users", "email", email2);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return res.status(401).json({ error: "Invalid email or password." });
  }
  if (!user.verified) {
    const otp = genOtp();
    const { id, ...rest } = user;
    await dbUpdate("users", id, { ...rest, otp, otpExpiry: Date.now() + 10 * 60 * 1000 });
    await sendOtpEmail(email2, otp);
    return res.status(200).json({ needsVerification: true });
  }
  return res.status(200).json({ success: true, token: signToken({ email: email2 }), email: email2 });
}

async function resend(req, res) {
  const { email } = req.body || {};
  const email2 = norm(email);
  if (!email2) return res.status(400).json({ error: "Email is required." });
  const user = await dbFindBy("users", "email", email2);
  if (!user) return res.status(404).json({ error: "No signup found for this email." });
  const otp = genOtp();
  const { id, ...rest } = user;
  await dbUpdate("users", id, { ...rest, otp, otpExpiry: Date.now() + 10 * 60 * 1000 });
  const sent = await sendOtpEmail(email2, otp);
  if (!sent) return res.status(502).json({ error: "Could not send the email. Please try again." });
  return res.status(200).json({ success: true });
}
