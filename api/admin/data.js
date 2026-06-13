// Vercel Serverless Function — returns all leads + payments for the admin panel.
// Protected by a single ADMIN_PASSWORD (checked server-side).
//
// Required environment variables:
//   ADMIN_PASSWORD               the password for the /admin page
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY   (see api/_db.js)

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
    const [leads, payments] = await Promise.all([
      dbSelect("leads"),
      dbSelect("payments"),
    ]);
    return res.status(200).json({ leads, payments });
  } catch (err) {
    console.error("Admin data fetch error:", err);
    return res.status(500).json({ error: "Could not load data." });
  }
}
