// Vercel Serverless Function — PUBLIC leads pull API for external tools
// (e.g. BrandPilot). Read-only; protected by a secret API key.
//
//   GET /api/leads                 -> { count, leads: [...] }
//   GET /api/leads?since=<ISO>     -> only leads created after that timestamp
//                                     (use this for periodic / incremental pulls)
//
// Auth: send the key as an `x-api-key: <key>` header OR a `?key=<key>` query
// param. Checked against ADMIN_API_KEY.
//
// Required environment variables:
//   ADMIN_API_KEY
//   FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY (see api/_db.js)

import { dbSelect } from "./_db.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "x-api-key, content-type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const API_KEY = process.env.ADMIN_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: "API is not configured. Set ADMIN_API_KEY in Vercel." });
  }

  const provided = req.headers["x-api-key"] || req.query.key || "";
  if (provided !== API_KEY) {
    return res.status(401).json({ error: "Invalid or missing API key." });
  }

  try {
    let leads = await dbSelect("leads");

    // Optional incremental pull: ?since=2026-06-16T00:00:00.000Z
    const since = req.query.since;
    if (since) {
      leads = leads.filter((l) => String(l.created_at || "") > String(since));
    }

    return res.status(200).json({ count: leads.length, leads });
  } catch (err) {
    console.error("Leads API error:", err);
    return res.status(500).json({ error: `Could not load leads: ${String((err && err.message) || err)}` });
  }
}
