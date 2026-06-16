// POST /api/auth/verify  { email, otp }
// Confirms the OTP, marks the user verified, and returns a session token.

import { dbUpdate, dbFindBy } from "../_db.js";
import { signToken } from "../_auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, otp } = req.body || {};
  const normEmail = String(email || "").trim().toLowerCase();
  if (!normEmail || !otp) {
    return res.status(400).json({ error: "Email and code are required." });
  }

  try {
    const user = await dbFindBy("users", "email", normEmail);
    if (!user) return res.status(404).json({ error: "No signup found for this email." });
    if (!user.otp || String(user.otp) !== String(otp).trim()) {
      return res.status(400).json({ error: "Incorrect code. Please check and try again." });
    }
    if (user.otpExpiry && Number(user.otpExpiry) < Date.now()) {
      return res.status(400).json({ error: "Code expired. Please resend a new one." });
    }

    const { id, ...rest } = user;
    await dbUpdate("users", id, { ...rest, verified: true, otp: "", otpExpiry: 0 });

    const token = signToken({ email: normEmail });
    return res.status(200).json({ success: true, token, email: normEmail });
  } catch (err) {
    console.error("Verify error:", err);
    return res.status(500).json({ error: "Could not verify. Please try again." });
  }
}
