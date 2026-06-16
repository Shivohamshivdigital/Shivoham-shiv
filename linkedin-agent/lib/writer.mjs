// Turns a scraped article into a <200-word LinkedIn post.
// Primary: Claude (ANTHROPIC_API_KEY). Fallback: Gemini (GEMINI_API_KEY).

const WORD_LIMIT = 200;

function buildPrompt(article) {
  const brand = (process.env.AGENT_BRAND_VOICE || "").trim();
  return [
    `You are a social media writer creating a LinkedIn post about a piece of AI news.`,
    ``,
    `ARTICLE`,
    `Title: ${article.title}`,
    `Source: ${article.source}`,
    `Summary: ${article.summary || "(no summary available)"}`,
    `URL: ${article.link}`,
    ``,
    `WRITE A LINKEDIN POST THAT:`,
    `- Is STRICTLY under ${WORD_LIMIT} words (hard limit).`,
    `- Opens with a strong, scroll-stopping hook (no "Exciting news!" clichés).`,
    `- Explains why this matters in plain, confident language.`,
    `- Adds one short insight/takeaway for professionals.`,
    `- Ends with a light question or call-to-engagement.`,
    `- Uses 2-4 short paragraphs with line breaks; tasteful emojis OK (sparingly).`,
    `- Ends with 3-5 relevant hashtags on the final line.`,
    `- Does NOT fabricate facts, quotes, or numbers beyond the article.`,
    `- Does NOT include the URL inside the text (it is attached separately).`,
    brand ? `\nBRAND VOICE: ${brand}` : ``,
    ``,
    `Return ONLY the post text, nothing else.`,
  ].join("\n");
}

function enforceWordLimit(text) {
  const clean = String(text || "").trim();
  const words = clean.split(/\s+/);
  if (words.length <= WORD_LIMIT) return clean;
  return words.slice(0, WORD_LIMIT).join(" ").replace(/[\s,;:-]+$/, "") + "…";
}

async function writeWithClaude(article) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";
  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model, max_tokens: 600, messages: [{ role: "user", content: buildPrompt(article) }] }),
    signal: AbortSignal.timeout(45000),
  });
  if (!resp.ok) { console.warn("Claude failed:", resp.status, await resp.text()); return null; }
  const data = await resp.json();
  const text = (data.content || []).map((b) => b.text || "").join("").trim();
  return text ? { text: enforceWordLimit(text), model } : null;
}

async function writeWithGemini(article) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(article) }] }],
        generationConfig: { temperature: 0.8, maxOutputTokens: 600 },
      }),
      signal: AbortSignal.timeout(45000),
    }
  );
  if (!resp.ok) { console.warn("Gemini failed:", resp.status, await resp.text()); return null; }
  const data = await resp.json();
  const text = (data.candidates?.[0]?.content?.parts || []).map((p) => p.text || "").join("").trim();
  return text ? { text: enforceWordLimit(text), model } : null;
}

/** Write a post; tries Claude, then Gemini. Throws if neither is available. */
export async function writePost(article) {
  return (
    (await writeWithClaude(article)) ||
    (await writeWithGemini(article)) ||
    (() => { throw new Error("No AI model produced a post. Set ANTHROPIC_API_KEY and/or GEMINI_API_KEY."); })()
  );
}

export { WORD_LIMIT };
