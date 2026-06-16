// Pricing settings — editable from the admin "Settings" tab.
//   GET  /api/settings              -> current pricing (public; for display)
//   POST /api/settings { password, settings }  -> save (admin only)
//
// Stored as a single Firestore document: settings/pricing.

import { dbGetDoc, dbUpdate } from "./_db.js";

const DEFAULTS = {
  registerAmount: 999,
  courseAmount: 7999,
  courseOriginal: 11999,
  discountLabel: "30% OFF",
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  if (req.method === "OPTIONS") return res.status(204).end();

  if (req.method === "GET") {
    try {
      const s = await dbGetDoc("settings", "pricing");
      const { id, ...rest } = s || {};
      return res.status(200).json({ ...DEFAULTS, ...rest });
    } catch {
      return res.status(200).json(DEFAULTS);
    }
  }

  if (req.method === "POST") {
    const { password, settings } = req.body || {};
    if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Incorrect password." });
    }
    const s = settings || {};
    const clean = {
      registerAmount: Math.max(1, Math.round(Number(s.registerAmount) || DEFAULTS.registerAmount)),
      courseAmount: Math.max(1, Math.round(Number(s.courseAmount) || DEFAULTS.courseAmount)),
      courseOriginal: Math.max(0, Math.round(Number(s.courseOriginal) || DEFAULTS.courseOriginal)),
      discountLabel: String(s.discountLabel || DEFAULTS.discountLabel).slice(0, 24),
    };
    try {
      await dbUpdate("settings", "pricing", clean);
      return res.status(200).json({ success: true, settings: clean });
    } catch (err) {
      console.error("Settings save error:", err);
      return res.status(500).json({ error: `Could not save settings: ${String((err && err.message) || err)}` });
    }
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Method not allowed" });
}
