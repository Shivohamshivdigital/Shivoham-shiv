// Vercel Serverless Function — LinkedIn AI-news agent (draft generator).
//
// What it does, end to end:
//   1. Scrapes the latest posts from AI-lab blogs (Anthropic/Claude, OpenAI,
//      Google AI) via their RSS feeds.
//   2. Picks the freshest story that hasn't been drafted yet.
//   3. Asks Gemini to write a punchy LinkedIn post UNDER 200 words.
//   4. Saves it to the Firestore `linkedin_drafts` collection as a DRAFT
//      (status: "draft") — nothing is posted to LinkedIn here. Review &
//      publish happens from the admin panel (see api/linkedin/drafts.js).
//
// How it can be triggered:
//   • Vercel Cron (daily)  -> GET, authorised by the Vercel `Authorization:
//                             Bearer ${CRON_SECRET}` header (set CRON_SECRET in
//                             Vercel), or by ?key=<ADMIN_API_KEY>.
//   • Admin panel (manual) -> POST { password: <ADMIN_PASSWORD> }.
//   • External tools       -> POST/GET with x-api-key: <ADMIN_API_KEY>.
//
// Required environment variables:
//   GEMINI_API_KEY                          (post writing)
//   FIREBASE_PROJECT_ID / _CLIENT_EMAIL / _PRIVATE_KEY   (drafts storage)
//   ADMIN_PASSWORD and/or ADMIN_API_KEY     (auth)
// Optional:
//   CRON_SECRET        — Vercel injects this as a Bearer token on cron runs.
//   GEMINI_MODEL       — defaults to "gemini-2.0-flash".
//   LINKEDIN_FEEDS     — comma-separated RSS feed URLs (overrides the defaults).
//   LINKEDIN_BRAND     — short description of the voice/brand the post writes as.

import { dbSelect, dbInsert, isDbConfigured } from "../_db.js";

// Direct RSS feeds from the AI labs, plus a Google-News fallback for Anthropic
// (which doesn't expose a stable public RSS feed). Override with LINKEDIN_FEEDS.
const DEFAULT_FEEDS = [
  { name: "OpenAI", url: "https://openai.com/news/rss.xml" },
  { name: "Google AI", url: "https://blog.google/technology/ai/rss/" },
  { name: "Google DeepMind", url: "https://deepmind.google/blog/rss.xml" },
  {
    name: "Anthropic / Claude",
    url: "https://news.google.com/rss/search?q=(Anthropic+OR+Claude)+AI+when:14d&hl=en-US&gl=US&ceid=US:en",
  },
];

const DEFAULT_BRAND =
  "a sharp, forward-looking technology commentator sharing AI industry news " +
  "with a professional LinkedIn audience";

function getFeeds() {
  const raw = (process.env.LINKEDIN_FEEDS || "").trim();
  if (!raw) return DEFAULT_FEEDS;
  return raw
    .split(",")
    .map((u) => u.trim())
    .filter(Boolean)
    .map((url) => ({ name: hostOf(url), url }));
}

function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "source";
  }
}

// --- tiny dependency-free RSS / Atom parser -------------------------------

function decodeEntities(str) {
  return String(str || "")
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/<[^>]+>/g, " ") // strip any leftover tags
    .replace(/\s+/g, " ")
    .trim();
}

function tag(block, name) {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i"));
  return m ? m[1].trim() : "";
}

function parseFeed(xml, sourceName) {
  const items = [];
  // RSS <item> ... </item>
  const rssBlocks = xml.match(/<item[\s\S]*?<\/item>/gi) || [];
  for (const block of rssBlocks) {
    const link = decodeEntities(tag(block, "link"));
    items.push({
      title: decodeEntities(tag(block, "title")),
      link,
      summary: decodeEntities(tag(block, "description") || tag(block, "content:encoded")),
      date: tag(block, "pubDate") || tag(block, "dc:date"),
      source: sourceName,
    });
  }
  // Atom <entry> ... </entry>
  const atomBlocks = xml.match(/<entry[\s\S]*?<\/entry>/gi) || [];
  for (const block of atomBlocks) {
    const linkMatch = block.match(/<link[^>]*href="([^"]+)"[^>]*\/?>/i);
    items.push({
      title: decodeEntities(tag(block, "title")),
      link: linkMatch ? linkMatch[1] : "",
      summary: decodeEntities(tag(block, "summary") || tag(block, "content")),
      date: tag(block, "updated") || tag(block, "published"),
      source: sourceName,
    });
  }
  return items.filter((it) => it.title && it.link);
}

async function fetchFeed(feed) {
  try {
    const resp = await fetch(feed.url, {
      headers: { "User-Agent": "ShivohamLinkedInAgent/1.0 (+https://shivohamshiv.com)" },
    });
    if (!resp.ok) return [];
    const xml = await resp.text();
    return parseFeed(xml, feed.name);
  } catch (err) {
    console.error("Feed fetch failed:", feed.url, String(err));
    return [];
  }
}

function timeOf(item) {
  const t = Date.parse(item.date || "");
  return Number.isNaN(t) ? 0 : t;
}

// --- post writing via Gemini ----------------------------------------------

async function writePost(article) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set.");
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const brand = process.env.LINKEDIN_BRAND || DEFAULT_BRAND;

  const prompt = `You are ${brand}.

Write a single LinkedIn post about the news article below.

STRICT RULES:
- Under 200 words. Aim for 110-170.
- Hook in the first line. No "I'm excited to share".
- Plain text only — NO markdown, NO asterisks, NO headings.
- Use 1-3 short line breaks for readability.
- End with one sharp takeaway or question.
- Add 3-5 relevant hashtags on the final line.
- Do NOT invent facts beyond the title and summary.
- Do NOT include the raw URL in the body (a link card is attached separately).

ARTICLE TITLE: ${article.title}
SOURCE: ${article.source}
SUMMARY: ${article.summary || "(no summary available)"}

Return ONLY the post text.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const resp = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.8, maxOutputTokens: 600 },
    }),
  });
  if (!resp.ok) {
    throw new Error(`Gemini request failed: ${resp.status} ${await resp.text()}`);
  }
  const data = await resp.json();
  const text = (data?.candidates?.[0]?.content?.parts || [])
    .map((p) => p.text || "")
    .join("")
    .trim();
  if (!text) throw new Error("Gemini returned an empty post.");
  return text;
}

function wordCount(text) {
  return (text.trim().match(/\S+/g) || []).length;
}

// --- auth ------------------------------------------------------------------

function isAuthorised(req) {
  const apiKey = process.env.ADMIN_API_KEY;
  const adminPw = process.env.ADMIN_PASSWORD;
  const cronSecret = process.env.CRON_SECRET;

  // Vercel Cron sends: Authorization: Bearer <CRON_SECRET>
  const auth = req.headers["authorization"] || "";
  if (cronSecret && auth === `Bearer ${cronSecret}`) return true;

  // Secret key via header or query (cron-without-secret / external tools).
  const provided = req.headers["x-api-key"] || req.query.key || "";
  if (apiKey && provided === apiKey) return true;

  // Admin password in the POST body (admin panel "Generate" button).
  const pw = (req.body || {}).password;
  if (adminPw && pw && pw === adminPw) return true;

  return false;
}

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!isAuthorised(req)) {
    return res.status(401).json({ error: "Unauthorised." });
  }
  if (!isDbConfigured()) {
    return res.status(500).json({ error: "Firestore is not configured (see api/_db.js)." });
  }

  try {
    // 1. Scrape feeds (in parallel).
    const feeds = getFeeds();
    const lists = await Promise.all(feeds.map(fetchFeed));
    const articles = lists.flat().sort((a, b) => timeOf(b) - timeOf(a));
    if (articles.length === 0) {
      return res.status(502).json({ error: "Could not fetch any news from the configured feeds." });
    }

    // 2. Skip anything we've already turned into a draft.
    const existing = await dbSelect("linkedin_drafts");
    const usedLinks = new Set(existing.map((d) => d.source_url));
    const usedTitles = new Set(existing.map((d) => String(d.source_title || "").toLowerCase()));
    const article = articles.find(
      (a) => !usedLinks.has(a.link) && !usedTitles.has(a.title.toLowerCase())
    );
    if (!article) {
      return res.status(200).json({ skipped: true, reason: "No fresh articles — all recent stories already drafted." });
    }

    // 3. Write the post.
    const text = await writePost(article);

    // 4. Save as a draft (NOT published).
    const draft = {
      text,
      words: wordCount(text),
      status: "draft",
      source_title: article.title,
      source_url: article.link,
      source_name: article.source,
    };
    await dbInsert("linkedin_drafts", draft);

    return res.status(200).json({ success: true, draft });
  } catch (err) {
    console.error("LinkedIn generate error:", err);
    return res.status(500).json({ error: `Generation failed: ${String((err && err.message) || err)}` });
  }
}
