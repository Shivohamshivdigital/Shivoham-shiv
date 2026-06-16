// POST /api/auth/resend  { email }
// Generates a fresh OTP and emails it again.

import { dbUpdate, dbFindBy } from "../_db.js";
import { genOtp, sendOtpEmail } from "../_auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body || {};
  const normEmail = String(email || "").trim().toLowerCase();
  if (!normEmail) return res.status(400).json({ error: "Email is required." });

  try {
    const user = await dbFindBy("users", "email", normEmail);
    if (!user) return res.status(404).json({ error: "No signup found for this email." });

    const otp = genOtp();
    const { id, ...rest } = user;
    await dbUpdate("users", id, { ...rest, otp, otpExpiry: Date.now() + 10 * 60 * 1000 });
    const sent = await sendOtpEmail(normEmail, otp);
    if (!sent) return res.status(502).json({ error: "Could not send the email. Please try again." });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Resend error:", err);
    return res.status(500).json({ error: "Could not resend the code." });
  }
}
