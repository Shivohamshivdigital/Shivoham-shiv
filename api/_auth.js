// Shared auth helpers (server-side only). Not exposed as a route ("_" prefix).
// Passwords are hashed with scrypt; OTP emails go out via Brevo; sessions use
// a short signed token (HMAC) keyed off ADMIN_PASSWORD.

import crypto from "crypto";

const SECRET = process.env.ADMIN_PASSWORD || "shivoham-fallback-secret";

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(String(password), salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password, stored) {
  if (!stored || !String(stored).includes(":")) return false;
  const [salt, hash] = String(stored).split(":");
  const check = crypto.scryptSync(String(password), salt, 64).toString("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(check, "hex"));
  } catch {
    return false;
  }
}

export function genOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function b64url(input) {
  return Buffer.from(input).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

export function signToken(payload, ttlSeconds = 60 * 60 * 24 * 30) {
  const body = { ...payload, exp: Math.floor(Date.now() / 1000) + ttlSeconds };
  const data = b64url(JSON.stringify(body));
  const sig = b64url(crypto.createHmac("sha256", SECRET).update(data).digest());
  return `${data}.${sig}`;
}

export function verifyToken(token) {
  try {
    const [data, sig] = String(token).split(".");
    const expected = b64url(crypto.createHmac("sha256", SECRET).update(data).digest());
    if (sig !== expected) return null;
    const body = JSON.parse(Buffer.from(data.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString());
    if (body.exp && body.exp < Math.floor(Date.now() / 1000)) return null;
    return body;
  } catch {
    return null;
  }
}

export async function sendOtpEmail(email, otp) {
  const KEY = process.env.BREVO_API_KEY;
  if (!KEY) {
    console.error("BREVO_API_KEY not set; cannot send OTP email");
    return false;
  }
  const SENDER = process.env.BREVO_SENDER_EMAIL || "shivohamshivdigital@gmail.com";
  try {
    const r = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": KEY, "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        sender: { name: "Shivoham Shiv", email: SENDER },
        to: [{ email }],
        subject: `Your Shivoham Shiv verification code: ${otp}`,
        htmlContent: `
          <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto">
            <h2 style="color:#2F5233">Verify your email</h2>
            <p>Use this one-time code to continue your Shivoham Shiv signup:</p>
            <p style="font-size:30px;font-weight:bold;letter-spacing:6px;color:#2F5233;margin:16px 0">${otp}</p>
            <p style="color:#888;font-size:13px">This code expires in 10 minutes. If you didn't request it, you can ignore this email.</p>
          </div>`,
      }),
    });
    if (!r.ok) {
      console.error("OTP email failed", r.status, await r.text());
      return false;
    }
    return true;
  } catch (e) {
    console.error("OTP email error", e);
    return false;
  }
}
