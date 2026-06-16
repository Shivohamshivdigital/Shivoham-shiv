// Vercel Serverless Function — approve & publish a pending draft.
//   GET /api/agent/approve?id=<draftId>&token=<token>
//
// Validates the one-time token, publishes the post to LinkedIn via the official
// API, and marks the draft as posted. Returns a small confirmation page.

import { dbGet, dbUpdate } from "../_db.js";
import { publishToLinkedIn } from "../_agent/linkedin.js";
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
    return res.status(403).send(resultPage("Link not valid", "This approval link is invalid or has expired.", "#c0392b"));
  }
  if (draft.status === "posted") {
    return res.status(200).send(resultPage("Already published", "This post has already been published to LinkedIn. ✅"));
  }
  if (draft.status !== "pending_approval") {
    return res.status(200).send(resultPage("Not available", `This draft is "${draft.status}" and can't be published.`, "#c0392b"));
  }

  try {
    const { id: postId } = await publishToLinkedIn({
      text: draft.post,
      articleUrl: draft.article_link,
      articleTitle: draft.article_title,
      articleSummary: draft.article_summary,
    });

    await dbUpdate(COLLECTION, id, {
      ...draft,
      status: "posted",
      token: "", // burn the one-time token
      linkedin_post_id: postId,
      posted_at: new Date().toISOString(),
    });

    return res
      .status(200)
      .send(resultPage("Published! 🎉", "Your post is now live on LinkedIn.", "#0a66c2"));
  } catch (err) {
    console.error("[agent/approve] publish error:", err);
    return res
      .status(500)
      .send(
        resultPage(
          "Publish failed",
          `LinkedIn rejected the post. Check your access token and scopes.<br/><br/><code style="font-size:12px;color:#666">${String(err.message).slice(0, 300)}</code>`,
          "#c0392b"
        )
      );
  }
}
