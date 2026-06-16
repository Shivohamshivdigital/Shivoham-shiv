// Vercel Serverless Function — reject a pending draft (don't publish).
//   GET /api/agent/reject?id=<draftId>&token=<token>

import { dbGet, dbUpdate } from "../_db.js";
import { resultPage } from "../_agent/notify.js";

const COLLECTION = "linkedin_posts";

export default async function handler(req, res) {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  const { id, token } = req.query || {};

  if (!id || !token) {
    return res.status(400).send(resultPage("Invalid link", "Missing draft id or token.", "#c0392b"));
  }

  const draft = await dbGet(COLLECTION, id);
  if (!draft || draft.token !== token) {
    return res.status(403).send(resultPage("Link not valid", "This link is invalid or has expired.", "#c0392b"));
  }
  if (draft.status === "posted") {
    return res.status(200).send(resultPage("Already published", "This post was already published, so it can't be rejected.", "#c0392b"));
  }

  await dbUpdate(COLLECTION, id, { ...draft, status: "rejected", token: "" });
  return res.status(200).send(resultPage("Draft rejected", "No worries — this post was discarded and won't be published. 🗑️", "#888"));
}
