// Vercel Serverless Function — returns all leads + payments for the admin panel.
// Protected by a single ADMIN_PASSWORD (checked server-side).
//
// Required environment variables:
//   ADMIN_PASSWORD               the password for the /admin page
//   FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY   (see api/_db.js)

import { dbSelect } from "../_db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  if (!ADMIN_PASSWORD) {
    return res.status(500).json({ error: "Admin panel is not configured yet." });
  }

  const { password } = req.body || {};
  if (!password || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Incorrect password." });
  }

  try {
    const [leads, payments, usersRaw] = await Promise.all([
      dbSelect("leads"),
      dbSelect("payments"),
      dbSelect("users").catch(() => []),
    ]);
    // Never expose password hashes / OTPs to the admin UI.
    const users = usersRaw.map(({ passwordHash, otp, otpExpiry, ...rest }) => rest);
    return res.status(200).json({ leads, payments, users });
  } catch (err) {
    console.error("Admin data fetch error:", err);
    // Surface the underlying reason so setup issues (e.g. a malformed
    // FIREBASE_PRIVATE_KEY) are visible on the password-protected admin page.
    return res.status(500).json({ error: `Could not load data: ${String((err && err.message) || err)}` });
  }
}
