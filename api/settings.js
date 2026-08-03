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
    // Transformation before/after images (managed from the admin).
    if (req.query.type === "transformations") {
      try {
        const doc = await dbGetDoc("settings", "transformations");
        const items = doc && doc.data ? JSON.parse(doc.data) : [];
        res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=600");
        return res.status(200).json({ items: Array.isArray(items) ? items : [] });
      } catch {
        return res.status(200).json({ items: [] });
      }
    }

    // Founder / guide photo + name + title (managed from the admin).
    if (req.query.type === "founder") {
      try {
        const doc = await dbGetDoc("settings", "founder");
        const founder = doc && doc.data ? JSON.parse(doc.data) : null;
        // Admin-controlled content — keep it fresh so edits appear right away.
        res.setHeader("Cache-Control", "no-store");
        return res.status(200).json({ founder: founder || null });
      } catch {
        return res.status(200).json({ founder: null });
      }
    }

    try {
      const s = await dbGetDoc("settings", "pricing");
      const { id, ...rest } = s || {};
      return res.status(200).json({ ...DEFAULTS, ...rest });
    } catch {
      return res.status(200).json(DEFAULTS);
    }
  }

  if (req.method === "POST") {
    const { password, settings, transformations, founder, integrations } = req.body || {};
    if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Incorrect password." });
    }

    // Save CRM / Leads-API integration settings (admin only).
    if (integrations && typeof integrations === "object") {
      const clean = {
        leadsApiKey: String(integrations.leadsApiKey || "").trim().slice(0, 200),
        crmIntakeUrl: String(integrations.crmIntakeUrl || "").trim().slice(0, 500),
      };
      try {
        await dbUpdate("settings", "integrations", clean);
        return res.status(200).json({ success: true });
      } catch (err) {
        console.error("Integrations save error:", err);
        return res.status(500).json({ error: `Could not save: ${String((err && err.message) || err)}` });
      }
    }

    // Save founder / guide photo + name + title (admin upload).
    if (founder && typeof founder === "object") {
      const src = String(founder.src || "");
      const clean = {
        src: src.startsWith("data:image") || src.startsWith("http") ? src : "",
        name: String(founder.name || "").slice(0, 60),
        title: String(founder.title || "").slice(0, 100),
      };
      const json = JSON.stringify(clean);
      // Firestore caps a document at ~1 MB — guard so we never fail the write.
      if (json.length > 900000) {
        return res.status(413).json({ error: "Image too large. Please use a smaller photo." });
      }
      try {
        await dbUpdate("settings", "founder", { data: json });
        // Read back so we report what ACTUALLY persisted (large fields can be
        // rejected/dropped by Firestore's indexing) instead of a false success.
        let storedImage = !!clean.src;
        try {
          const check = await dbGetDoc("settings", "founder");
          const stored = check && check.data ? JSON.parse(check.data) : {};
          storedImage = !!(stored.src && String(stored.src).startsWith("data:image"));
        } catch {
          /* best-effort verification */
        }
        return res.status(200).json({ success: true, hasImage: storedImage });
      } catch (err) {
        console.error("Founder save error:", err);
        return res.status(500).json({ error: `Could not save: ${String((err && err.message) || err)}` });
      }
    }

    // Save transformation before/after images (admin upload).
    if (Array.isArray(transformations)) {
      const items = transformations
        .slice(0, 8)
        .map((t) => ({
          src: String((t && t.src) || ""),
          caption: String((t && t.caption) || "").slice(0, 80),
        }))
        .filter((t) => t.src.startsWith("data:image") || t.src.startsWith("http"));
      const json = JSON.stringify(items);
      // Firestore caps a document at ~1 MB — guard so we never fail the write.
      if (json.length > 900000) {
        return res.status(413).json({ error: "Images too large. Please use fewer / smaller images." });
      }
      try {
        await dbUpdate("settings", "transformations", { data: json });
        return res.status(200).json({ success: true, count: items.length });
      } catch (err) {
        console.error("Transformations save error:", err);
        return res.status(500).json({ error: `Could not save: ${String((err && err.message) || err)}` });
      }
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
