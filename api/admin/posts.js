// Vercel Serverless Function — admin blog CRUD (password-protected).
//   POST { password, action: "list" }                 -> all posts (incl. drafts)
//   POST { password, action: "save", post }            -> create or update a post
//   POST { password, action: "delete", id }            -> delete a post
//
// Required environment variables:
//   ADMIN_PASSWORD
//   FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY (see api/_db.js)

import { dbSelect, dbInsert, dbUpdate, dbDelete } from "../_db.js";

function slugify(str) {
  return String(str || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  if (!ADMIN_PASSWORD) {
    return res.status(500).json({ error: "Admin panel is not configured yet." });
  }

  const { password, action, post, id } = req.body || {};
  if (!password || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Incorrect password." });
  }

  try {
    if (action === "list") {
      const posts = await dbSelect("posts");
      return res.status(200).json({ posts });
    }

    if (action === "save") {
      if (!post || !post.title) {
        return res.status(400).json({ error: "A title is required." });
      }
      const slug = (post.slug && slugify(post.slug)) || slugify(post.title);
      const clean = {
        slug,
        title: post.title || "",
        excerpt: post.excerpt || "",
        meta: post.meta || post.excerpt || "",
        keyword: post.keyword || "",
        category: post.category || "Wellness",
        author: post.author || "Shivoham Shiv",
        image: post.image || "",
        content: post.content || "",
        ctaText: post.ctaText || "Book a Free Consultation",
        ctaLink: post.ctaLink || "/weight-loss",
        date: post.date || new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
        published: post.published !== false,
      };

      if (post.id) {
        // Preserve original created_at on update.
        clean.created_at = post.created_at || new Date().toISOString();
        await dbUpdate("posts", post.id, clean);
        return res.status(200).json({ success: true, id: post.id, slug });
      }
      await dbInsert("posts", clean);
      return res.status(200).json({ success: true, slug });
    }

    if (action === "delete") {
      if (!id) return res.status(400).json({ error: "Post id is required." });
      await dbDelete("posts", id);
      return res.status(200).json({ success: true });
    }

    if (action === "import") {
      const incoming = Array.isArray(req.body.posts) ? req.body.posts : [];
      const existing = await dbSelect("posts");
      const existingSlugs = new Set(existing.map((p) => p.slug));
      let imported = 0;
      for (const p of incoming) {
        if (!p || !p.title) continue;
        const slug = (p.slug && slugify(p.slug)) || slugify(p.title);
        if (!slug || existingSlugs.has(slug)) continue; // skip duplicates
        await dbInsert("posts", {
          slug,
          title: p.title || "",
          excerpt: p.excerpt || "",
          meta: p.meta || p.excerpt || "",
          keyword: p.keyword || "",
          category: p.category || "Wellness",
          author: p.author || "Shivoham Shiv",
          image: p.image || "",
          content: p.content || "",
          ctaText: p.ctaText || "Book a Free Consultation",
          ctaLink: p.ctaLink || "/weight-loss",
          date: p.date || new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
          published: p.published !== false,
        });
        existingSlugs.add(slug);
        imported++;
      }
      return res.status(200).json({ success: true, imported });
    }

    return res.status(400).json({ error: "Unknown action." });
  } catch (err) {
    console.error("Admin posts error:", err);
    return res.status(500).json({ error: `Operation failed: ${String((err && err.message) || err)}` });
  }
}
