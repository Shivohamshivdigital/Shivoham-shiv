// AI-news scraper for the LinkedIn agent.
//
// Strategy: pull from public RSS/Atom feeds (the ToS-friendly way to read a
// blog) rather than HTML-scraping. We fetch several well-known AI sources,
// normalise every entry into { title, link, summary, source, published },
// then score them so the agent can pick the single most important story.
//
// Feeds are intentionally defensive: any feed that fails (network, 404,
// malformed XML) is skipped so one dead source never breaks the run. You can
// override the list with the AGENT_FEEDS env var (comma-separated URLs).

const DEFAULT_FEEDS = [
  // Lab / primary sources
  { url: "https://openai.com/news/rss.xml", source: "OpenAI", weight: 3 },
  { url: "https://www.anthropic.com/news/rss.xml", source: "Anthropic", weight: 3 },
  { url: "https://deepmind.google/blog/rss.xml", source: "Google DeepMind", weight: 3 },
  { url: "https://huggingface.co/blog/feed.xml", source: "Hugging Face", weight: 2 },
  // Tech press (reliably covers Claude / OpenAI / Gemini launches)
  { url: "https://techcrunch.com/category/artificial-intelligence/feed/", source: "TechCrunch", weight: 2 },
  { url: "https://venturebeat.com/category/ai/feed/", source: "VentureBeat", weight: 2 },
  { url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml", source: "The Verge", weight: 2 },
  { url: "https://www.technologyreview.com/topic/artificial-intelligence/feed", source: "MIT Tech Review", weight: 2 },
];

// Words that signal a high-impact story (model launches, funding, research).
const IMPORTANT_KEYWORDS = [
  "launch", "launches", "release", "releases", "released", "announce", "announces",
  "introducing", "unveil", "unveils", "gpt", "claude", "gemini", "llama", "model",
  "breakthrough", "raise", "raises", "funding", "billion", "agent", "reasoning",
  "open source", "open-source", "benchmark", "state-of-the-art", "multimodal",
  "available", "now available", "api", "update", "upgrade", "new",
];

function getFeeds() {
  const override = (process.env.AGENT_FEEDS || "").trim();
  if (!override) return DEFAULT_FEEDS;
  return override
    .split(",")
    .map((u) => u.trim())
    .filter(Boolean)
    .map((url) => ({ url, source: hostnameOf(url), weight: 2 }));
}

function hostnameOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "source";
  }
}

// --- Tiny, dependency-free RSS/Atom parser -------------------------------

function decodeEntities(str) {
  return String(str || "")
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ") // strip any nested HTML tags
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tag(block, name) {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i"));
  return m ? decodeEntities(m[1]) : "";
}

// Atom <link href="..."/> or RSS <link>...</link>
function linkOf(block) {
  const href = block.match(/<link[^>]*href=["']([^"']+)["']/i);
  if (href) return href[1].trim();
  return tag(block, "link");
}

function parseFeed(xml, source) {
  const items = [];
  const blocks = xml.match(/<(item|entry)[\s\S]*?<\/\1>/gi) || [];
  for (const block of blocks) {
    const title = tag(block, "title");
    const link = linkOf(block);
    if (!title || !link) continue;
    const summary =
      tag(block, "description") ||
      tag(block, "summary") ||
      tag(block, "content") ||
      tag(block, "content:encoded");
    const published =
      tag(block, "pubDate") || tag(block, "published") || tag(block, "updated") || "";
    items.push({
      title,
      link,
      summary: summary.slice(0, 600),
      source,
      published,
      publishedMs: Date.parse(published) || 0,
    });
  }
  return items;
}

async function fetchFeed(feed) {
  try {
    const resp = await fetch(feed.url, {
      headers: { "User-Agent": "ShivohamShiv-LinkedInAgent/1.0 (+https://shivohamshiv.com)" },
      signal: AbortSignal.timeout(12000),
    });
    if (!resp.ok) return [];
    const xml = await resp.text();
    return parseFeed(xml, feed.source).map((it) => ({ ...it, weight: feed.weight }));
  } catch (err) {
    console.warn(`Feed failed (${feed.source}):`, err.message);
    return [];
  }
}

function scoreArticle(a) {
  const text = `${a.title} ${a.summary}`.toLowerCase();
  let score = a.weight || 1;

  // Keyword importance.
  for (const kw of IMPORTANT_KEYWORDS) {
    if (text.includes(kw)) score += 1.5;
  }

  // Recency: strongly favour the last 48h, fade out after a week.
  const ageHours = a.publishedMs ? (Date.now() - a.publishedMs) / 3.6e6 : 9999;
  if (ageHours <= 24) score += 6;
  else if (ageHours <= 48) score += 4;
  else if (ageHours <= 96) score += 2;
  else if (ageHours <= 168) score += 1;
  else score -= 2;

  return score;
}

/**
 * Fetch every feed, dedupe, score, and return candidate articles sorted
 * best-first. `excludeLinks` is a Set of already-posted URLs to skip.
 */
export async function fetchTopArticles(excludeLinks = new Set()) {
  const feeds = getFeeds();
  const results = await Promise.all(feeds.map(fetchFeed));
  const all = results.flat();

  // Dedupe by link.
  const seen = new Set();
  const unique = [];
  for (const a of all) {
    const key = a.link.split("?")[0];
    if (seen.has(key) || excludeLinks.has(key)) continue;
    seen.add(key);
    unique.push(a);
  }

  return unique
    .map((a) => ({ ...a, score: scoreArticle(a) }))
    .sort((x, y) => y.score - x.score);
}
