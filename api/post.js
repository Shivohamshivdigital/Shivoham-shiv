// Server-side render for blog posts so crawlers + AI engines (SEO/AEO/GEO)
// get real content, meta and structured data in the raw HTML — while the
// React app still boots for normal users. Any miss/error falls back to the
// plain SPA shell, so the blog never breaks.

import { dbSelect } from "./_db.js";

const SITE = "https://shivohamshiv.com";

function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Plain-text body (## headings, - bullets) -> semantic HTML.
function contentToHtml(content) {
  if (!content) return "";
  const blocks = String(content).replace(/\r\n/g, "\n").split(/\n\s*\n/);
  let out = "";
  for (const raw of blocks) {
    const b = raw.trim();
    if (!b) continue;
    const lines = b.split("\n").map((l) => l.trim()).filter(Boolean);
    if (b.startsWith("## ")) {
      out += `<h2>${esc(b.replace(/^##\s+/, ""))}</h2>`;
    } else if (lines.length && lines.every((l) => l.startsWith("- "))) {
      out += "<ul>" + lines.map((l) => `<li>${esc(l.replace(/^-\s+/, ""))}</li>`).join("") + "</ul>";
    } else {
      out += `<p>${esc(lines.join(" "))}</p>`;
    }
  }
  return out;
}

async function getShell(req) {
  const host = req.headers["x-forwarded-host"] || req.headers.host || "shivohamshiv.com";
  const r = await fetch(`https://${host}/index.html`, { headers: { "user-agent": "ssr-shell" } });
  if (!r.ok) throw new Error("shell " + r.status);
  return await r.text();
}

export default async function handler(req, res) {
  const slug = String(req.query.slug || "");

  let shell = "";
  try {
    shell = await getShell(req);
  } catch {
    shell = "";
  }

  let post = null;
  try {
    const posts = await dbSelect("posts");
    post = posts.find((p) => p.slug === slug && p.published !== false) || null;
  } catch {
    post = null;
  }

  res.setHeader("Content-Type", "text/html; charset=utf-8");

  // Not a DB post (e.g. a bundled/static post) -> let the SPA render it.
  if (!post) {
    res.setHeader("Cache-Control", "public, s-maxage=60");
    return res.status(200).send(shell || `<!doctype html><meta http-equiv="refresh" content="0;url=/blog">`);
  }

  const url = `${SITE}/blog/${esc(post.slug)}`;
  const title = `${post.title} — Shivoham Shiv`;
  const desc = post.meta || post.excerpt || "";
  const img = post.image || `${SITE}/shivoham-shiv-logo.jpg`;
  const body = String(post.content || "").replace(/##\s+/g, "").replace(/\s+/g, " ").trim().slice(0, 5000);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: desc,
    image: img,
    author: { "@type": "Organization", name: post.author || "Shivoham Shiv", url: SITE },
    publisher: {
      "@type": "Organization",
      name: "Shivoham Shiv",
      logo: { "@type": "ImageObject", url: `${SITE}/shivoham-shiv-logo.jpg` },
    },
    datePublished: post.created_at || undefined,
    dateModified: post.created_at || undefined,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    articleBody: body,
  };

  const headExtra =
    `<meta name="description" content="${esc(desc)}" />` +
    `<link rel="canonical" href="${url}" />` +
    `<meta property="og:type" content="article" />` +
    `<meta property="og:title" content="${esc(title)}" />` +
    `<meta property="og:description" content="${esc(desc)}" />` +
    `<meta property="og:image" content="${esc(img)}" />` +
    `<meta property="og:url" content="${url}" />` +
    `<meta name="twitter:card" content="summary_large_image" />` +
    `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`;

  const article =
    `<main><article>` +
    `<h1>${esc(post.title)}</h1>` +
    (desc ? `<p>${esc(desc)}</p>` : "") +
    (post.image ? `<img src="${esc(img)}" alt="${esc(post.title)}" width="1200" height="630" />` : "") +
    contentToHtml(post.content) +
    `</article></main>`;

  if (shell) {
    let html = shell
      .replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(title)}</title>`)
      .replace("</head>", headExtra + "</head>")
      .replace('<div id="root"></div>', `<div id="root">${article}</div>`);
    res.setHeader("Cache-Control", "public, s-maxage=600, stale-while-revalidate=86400");
    return res.status(200).send(html);
  }

  // Shell unavailable (rare): still serve a contentful page for crawlers.
  const standalone =
    `<!doctype html><html lang="en"><head><meta charset="UTF-8"/>` +
    `<meta name="viewport" content="width=device-width, initial-scale=1.0"/>` +
    `<title>${esc(title)}</title>${headExtra}</head><body>${article}` +
    `<p><a href="/blog">← Back to blog</a></p></body></html>`;
  res.setHeader("Cache-Control", "public, s-maxage=600");
  return res.status(200).send(standalone);
}
