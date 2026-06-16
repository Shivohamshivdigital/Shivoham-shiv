// POST /api/auth/login  { email, password }
// Verifies credentials. If the account isn't verified yet, re-sends an OTP and
// asks the client to verify; otherwise returns a session token.

import { dbUpdate, dbFindBy } from "../_db.js";
import { verifyPassword, signToken, genOtp, sendOtpEmail } from "../_auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body || {};
  const normEmail = String(email || "").trim().toLowerCase();
  if (!normEmail || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const user = await dbFindBy("users", "email", normEmail);
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    if (!user.verified) {
      const otp = genOtp();
      const { id, ...rest } = user;
      await dbUpdate("users", id, { ...rest, otp, otpExpiry: Date.now() + 10 * 60 * 1000 });
      await sendOtpEmail(normEmail, otp);
      return res.status(200).json({ needsVerification: true });
    }

    const token = signToken({ email: normEmail });
    return res.status(200).json({ success: true, token, email: normEmail });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Could not log in. Please try again." });
  }
}
