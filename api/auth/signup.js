// POST /api/auth/signup  { email, password }
// Creates (or refreshes) an unverified user and emails a 6-digit OTP.

import { dbInsert, dbUpdate, dbFindBy } from "../_db.js";
import { hashPassword, genOtp, sendOtpEmail } from "../_auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password, attribution } = req.body || {};
  const attr = attribution && typeof attribution === "object" ? attribution : {};
  const normEmail = String(email || "").trim().toLowerCase();
  if (!normEmail || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normEmail)) {
    return res.status(400).json({ error: "Please enter a valid email." });
  }
  if (String(password).length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  }

  try {
    const existing = await dbFindBy("users", "email", normEmail);
    if (existing && existing.verified) {
      return res.status(409).json({ error: "This email is already registered. Please log in." });
    }

    const otp = genOtp();
    const otpExpiry = Date.now() + 10 * 60 * 1000;
    const fields = {
      email: normEmail,
      passwordHash: hashPassword(password),
      verified: false,
      paid: existing?.paid || false,
      otp,
      otpExpiry,
      created_at: existing?.created_at || new Date().toISOString(),
      // Ad attribution (keep the first-touch if the user already exists).
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

    const sent = await sendOtpEmail(normEmail, otp);
    if (!sent) {
      return res.status(502).json({ error: "Could not send the verification email. Please try again." });
    }
    return res.status(200).json({ success: true, pending: true });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: "Could not sign up. Please try again." });
  }
}
