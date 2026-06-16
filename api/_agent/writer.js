// LinkedIn post writer.
//
// Turns a scraped news article into a polished, <200-word LinkedIn post.
// Primary model: Claude (Anthropic). Fallback: Gemini (already configured in
// this project). If neither key is present the run fails loudly so you know to
// add one.
//
// Env:
//   ANTHROPIC_API_KEY   enables Claude (primary)
//   ANTHROPIC_MODEL     default "claude-sonnet-4-6"
//   GEMINI_API_KEY      enables Gemini (fallback)
//   GEMINI_MODEL        default "gemini-2.5-flash"
//   AGENT_BRAND_VOICE   optional extra style guidance appended to the prompt

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
    `- Is STRICTLY under ${WORD_LIMIT} words (this is a hard limit).`,
    `- Opens with a strong, scroll-stopping hook (no "Exciting news!" clichés).`,
    `- Explains why this matters in plain, confident language.`,
    `- Adds one short insight or takeaway for professionals.`,
    `- Ends with a light question or call-to-engagement.`,
    `- Uses 2-4 short paragraphs with line breaks; tasteful emojis are OK (sparingly).`,
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
  // Trim to the limit at a sentence/line boundary where possible.
  return words.slice(0, WORD_LIMIT).join(" ").replace(/[\s,;:-]+$/, "") + "…";
}

async function writeWithClaude(article) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: 600,
      messages: [{ role: "user", content: buildPrompt(article) }],
    }),
    signal: AbortSignal.timeout(45000),
  });

  if (!resp.ok) {
    console.warn("Claude write failed:", resp.status, await resp.text());
    return null;
  }
  const data = await resp.json();
  const text = (data.content || []).map((b) => b.text || "").join("").trim();
  if (!text) return null;
  return { text: enforceWordLimit(text), model };
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

  if (!resp.ok) {
    console.warn("Gemini write failed:", resp.status, await resp.text());
    return null;
  }
  const data = await resp.json();
  const text = (data.candidates?.[0]?.content?.parts || [])
    .map((p) => p.text || "")
    .join("")
    .trim();
  if (!text) return null;
  return { text: enforceWordLimit(text), model };
}

/** Write a post; tries Claude, then Gemini. Throws if both are unavailable. */
export async function writePost(article) {
  const viaClaude = await writeWithClaude(article);
  if (viaClaude) return viaClaude;

  const viaGemini = await writeWithGemini(article);
  if (viaGemini) return viaGemini;

  throw new Error(
    "No AI model produced a post. Set ANTHROPIC_API_KEY (Claude) and/or GEMINI_API_KEY (Gemini)."
  );
}

export { WORD_LIMIT };
