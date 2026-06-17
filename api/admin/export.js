// Vercel Serverless Function — programmatic export of leads + payments.
// Meant for external tools (Google Sheets, Zapier, scripts), so it uses a
// secret API key instead of the interactive admin password.
//
// Auth: send the key either as a header `x-api-key: <key>` or as `?key=<key>`.
//
// Required environment variables:
//   ADMIN_API_KEY                              a long random secret you choose
//   FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY  (see api/_db.js)
//
// Examples:
//   GET /api/admin/export?key=XXX                       -> { leads, payments, users }
//   GET /api/admin/export?type=leads&key=XXX            -> { leads: [...] }
//   GET /api/admin/export?type=users&key=XXX            -> { users: [...] }  (signups: paid/unpaid, attempts, ad source, phone)
//   GET /api/admin/export?type=payments&format=csv&key=XXX  -> CSV download

import { dbSelect } from "../_db.js";

// Fields we never expose externally.
function safeUser({ passwordHash, otp, otpExpiry, ...rest }) {
  return rest;
}

export default async function handler(req, res) {
  // Allow cross-origin GETs so the data can be pulled from anywhere (still
  // protected by the API key).
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

  const type = String(req.query.type || "all").toLowerCase();
  const format = String(req.query.format || "json").toLowerCase();

  try {
    const result = {};
    if (type === "leads" || type === "all") result.leads = await dbSelect("leads");
    if (type === "payments" || type === "all") result.payments = await dbSelect("payments");
    if (type === "users" || type === "all") {
      result.users = (await dbSelect("users").catch(() => [])).map(safeUser);
    }

    if (format === "csv") {
      const rows = type === "payments" ? result.payments || [] : type === "users" ? result.users || [] : result.leads || [];
      const csv = toCsv(rows);
      const name = type === "payments" ? "payments" : type === "users" ? "users" : "leads";
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="${name}.csv"`);
      return res.status(200).send(csv);
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error("Export error:", err);
    return res.status(500).json({ error: `Could not load data: ${String((err && err.message) || err)}` });
  }
}

function toCsv(rows) {
  if (!rows || rows.length === 0) return "";
  const headers = Array.from(
    rows.reduce((set, r) => {
      Object.keys(r).forEach((k) => set.add(k));
      return set;
    }, new Set())
  );
  const esc = (v) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [headers.join(",")];
  for (const r of rows) lines.push(headers.map((h) => esc(r[h])).join(","));
  return lines.join("\n");
}
