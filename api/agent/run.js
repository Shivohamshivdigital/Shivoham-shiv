// Vercel Serverless Function — the LinkedIn agent's daily entrypoint.
//   GET /api/agent/run   (triggered by Vercel Cron; see vercel.json)
//
// Pipeline: scrape AI news -> pick the most important fresh story -> write a
// <200-word post (Claude, falling back to Gemini) -> save it as a pending
// draft -> email you an Approve/Reject link. Nothing is posted until you click.
//
// Security: if CRON_SECRET is set, the request must carry
// `Authorization: Bearer <CRON_SECRET>` (Vercel Cron adds this automatically)
// or `?key=<CRON_SECRET>` for manual runs.

import crypto from "crypto";
import { dbCreate, dbSelect, isDbConfigured } from "../_db.js";
import { fetchTopArticles } from "../_agent/sources.js";
import { writePost } from "../_agent/writer.js";
import { sendApprovalEmail } from "../_agent/notify.js";

const COLLECTION = "linkedin_posts";

function authorized(req) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true; // no secret configured -> open (set one in prod!)
  const header = req.headers.authorization || "";
  if (header === `Bearer ${secret}`) return true;
  if ((req.query?.key || "") === secret) return true;
  return false;
}

export default async function handler(req, res) {
  if (!authorized(req)) return res.status(401).json({ error: "Unauthorized" });

  if (!isDbConfigured()) {
    return res.status(500).json({
      error: "Firestore is not configured (FIREBASE_* env vars). Required for the approval flow.",
    });
  }

  try {
    // 1) Build a set of links we've already drafted/posted, to avoid repeats.
    const existing = await dbSelect(COLLECTION).catch(() => []);
    const seen = new Set(
      existing.map((d) => String(d.article_link || "").split("?")[0]).filter(Boolean)
    );

    // 2) Scrape + rank.
    const articles = await fetchTopArticles(seen);
    if (articles.length === 0) {
      return res.status(200).json({ ok: true, message: "No fresh articles found today." });
    }
    const article = articles[0];

    // 3) Write the post.
    const { text, model } = await writePost(article);

    // 4) Save as a pending draft with a one-time approval token.
    const token = crypto.randomBytes(24).toString("hex");
    const draftId = await dbCreate(COLLECTION, {
      status: "pending_approval",
      token,
      post: text,
      model,
      score: article.score,
      article_title: article.title,
      article_link: article.link.split("?")[0],
      article_source: article.source,
      article_summary: article.summary || "",
    });

    if (!draftId) {
      return res.status(500).json({ error: "Failed to save draft to Firestore." });
    }

    // 5) Email the approval request.
    const emailed = await sendApprovalEmail({
      draftId,
      token,
      post: text,
      article,
      model,
    });

    return res.status(200).json({
      ok: true,
      draftId,
      emailed,
      model,
      article: { title: article.title, source: article.source, link: article.link },
      post: text,
    });
  } catch (err) {
    console.error("[agent/run] error:", err);
    return res.status(500).json({ error: err.message || "Agent run failed." });
  }
}
