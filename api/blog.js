// Vercel Serverless Function — PUBLIC blog read API.
//   GET /api/blog            -> list of published posts (no full content)
//   GET /api/blog?slug=xyz   -> a single published post (with full content)
//
// Posts are stored in the Firestore `posts` collection (see api/_db.js).
// Best-effort: if the DB isn't configured, returns an empty list / 404 so the
// site still works on the bundled static posts.

import { dbSelect } from "./_db.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  let posts = [];
  try {
    posts = await dbSelect("posts");
  } catch (err) {
    console.error("Blog list error:", err);
    posts = [];
  }

  // Only show published posts publicly.
  const published = posts.filter((p) => p.published !== false);

  const { slug } = req.query;
  if (slug) {
    const post = published.find((p) => p.slug === slug);
    if (!post) return res.status(404).json({ error: "Post not found" });
    return res.status(200).json({ post });
  }

  // List view: drop the heavy `content` field.
  const list = published.map(({ content, ...rest }) => rest);
  return res.status(200).json({ posts: list });
}
