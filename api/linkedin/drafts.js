// Vercel Serverless Function — LinkedIn drafts admin (password-protected).
//
//   POST { password, action: "list" }                  -> all drafts (newest first)
//   POST { password, action: "save", id, text }         -> edit a draft's text
//   POST { password, action: "delete", id }             -> delete a draft
//   POST { password, action: "publish", id }            -> post the draft to the
//                                                          LinkedIn company page,
//                                                          then mark it published
//
// Drafts live in the Firestore `linkedin_drafts` collection (see api/_db.js).
//
// Required environment variables:
//   ADMIN_PASSWORD
//   FIREBASE_PROJECT_ID / _CLIENT_EMAIL / _PRIVATE_KEY
// For publishing (LinkedIn Posts API):
//   LINKEDIN_ACCESS_TOKEN   OAuth token with the w_organization_social scope.
//   LINKEDIN_ORG_URN        Your company page, e.g. "urn:li:organization:12345678"
//                           (a bare numeric id is also accepted).
// Optional:
//   LINKEDIN_API_VERSION    LinkedIn-Version header, "YYYYMM". Default "202506".

import { dbSelect, dbUpdate, dbDelete } from "../_db.js";

function wordCount(text) {
  return (String(text || "").trim().match(/\S+/g) || []).length;
}

function orgUrn() {
  const raw = (process.env.LINKEDIN_ORG_URN || "").trim();
  if (!raw) return "";
  if (raw.startsWith("urn:li:organization:")) return raw;
  return `urn:li:organization:${raw.replace(/\D/g, "")}`;
}

// Publish a text post (optionally with an article link card) to the company
// page using the LinkedIn Posts API (https://api.linkedin.com/rest/posts).
async function publishToLinkedIn(draft) {
  const token = process.env.LINKEDIN_ACCESS_TOKEN;
  const author = orgUrn();
  if (!token) throw new Error("LINKEDIN_ACCESS_TOKEN is not set.");
  if (!author) throw new Error("LINKEDIN_ORG_URN is not set.");

  const version = process.env.LINKEDIN_API_VERSION || "202506";
  const body = {
    author,
    commentary: draft.text,
    visibility: "PUBLIC",
    distribution: {
      feedDistribution: "MAIN_FEED",
      targetEntities: [],
      thirdPartyDistributionChannels: [],
    },
    lifecycleState: "PUBLISHED",
    isReshareDisabledByAuthor: false,
  };

  // Attach the source article as a link card when we have a real URL.
  if (draft.source_url && /^https?:\/\//i.test(draft.source_url)) {
    body.content = {
      article: {
        source: draft.source_url,
        title: (draft.source_title || "").slice(0, 400) || "Read more",
      },
    };
  }

  const resp = await fetch("https://api.linkedin.com/rest/posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
      "LinkedIn-Version": version,
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const detail = await resp.text();
    throw new Error(`LinkedIn API ${resp.status}: ${detail}`);
  }

  // The new post's URN comes back in a response header.
  const postUrn = resp.headers.get("x-restli-id") || resp.headers.get("x-linkedin-id") || "";
  const postUrl = postUrn ? `https://www.linkedin.com/feed/update/${postUrn}` : "";
  return { postUrn, postUrl };
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

  const { password, action, id, text } = req.body || {};
  if (!password || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Incorrect password." });
  }

  try {
    if (action === "list") {
      const drafts = await dbSelect("linkedin_drafts");
      return res.status(200).json({ drafts });
    }

    if (action === "save") {
      if (!id) return res.status(400).json({ error: "Draft id is required." });
      if (!text || !text.trim()) return res.status(400).json({ error: "Post text is required." });
      const drafts = await dbSelect("linkedin_drafts");
      const current = drafts.find((d) => d.id === id);
      if (!current) return res.status(404).json({ error: "Draft not found." });
      const updated = { ...current, text: text.trim(), words: wordCount(text) };
      delete updated.id;
      await dbUpdate("linkedin_drafts", id, updated);
      return res.status(200).json({ success: true });
    }

    if (action === "delete") {
      if (!id) return res.status(400).json({ error: "Draft id is required." });
      await dbDelete("linkedin_drafts", id);
      return res.status(200).json({ success: true });
    }

    if (action === "publish") {
      if (!id) return res.status(400).json({ error: "Draft id is required." });
      const drafts = await dbSelect("linkedin_drafts");
      const draft = drafts.find((d) => d.id === id);
      if (!draft) return res.status(404).json({ error: "Draft not found." });
      if (draft.status === "published") {
        return res.status(400).json({ error: "This draft is already published." });
      }
      // Allow publishing freshly-edited text passed from the editor.
      if (text && text.trim()) draft.text = text.trim();

      const { postUrn, postUrl } = await publishToLinkedIn(draft);

      const updated = {
        ...draft,
        text: draft.text,
        words: wordCount(draft.text),
        status: "published",
        published_at: new Date().toISOString(),
        linkedin_urn: postUrn,
        linkedin_url: postUrl,
      };
      delete updated.id;
      await dbUpdate("linkedin_drafts", id, updated);
      return res.status(200).json({ success: true, linkedin_url: postUrl });
    }

    return res.status(400).json({ error: "Unknown action." });
  } catch (err) {
    console.error("LinkedIn drafts error:", err);
    return res.status(500).json({ error: String((err && err.message) || err) });
  }
}
