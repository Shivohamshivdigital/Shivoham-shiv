// LinkedIn publishing via the official LinkedIn API (ToS-compliant).
//
// Uses the UGC Posts endpoint with the `w_member_social` permission. See
// SETUP-LINKEDIN-AGENT.md for how to create the app and obtain a token.
//
// Env:
//   LINKEDIN_ACCESS_TOKEN   OAuth access token with w_member_social scope (required)
//   LINKEDIN_AUTHOR_URN     optional, e.g. "urn:li:person:abc123". If omitted we
//                           resolve it from the token via /v2/userinfo (needs the
//                           openid+profile scopes).

async function resolveAuthorUrn(token) {
  if (process.env.LINKEDIN_AUTHOR_URN) return process.env.LINKEDIN_AUTHOR_URN;

  // OpenID Connect userinfo returns `sub` = the member id.
  const resp = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!resp.ok) {
    throw new Error(
      `Could not resolve LinkedIn author URN (${resp.status}). ` +
        `Set LINKEDIN_AUTHOR_URN explicitly, or grant the openid+profile scopes.`
    );
  }
  const data = await resp.json();
  if (!data.sub) throw new Error("LinkedIn userinfo returned no `sub`.");
  return `urn:li:person:${data.sub}`;
}

/**
 * Publish a text post (optionally linking to the source article) to LinkedIn.
 * Returns { id } of the created post.
 */
export async function publishToLinkedIn({ text, articleUrl, articleTitle, articleSummary }) {
  const token = process.env.LINKEDIN_ACCESS_TOKEN;
  if (!token) throw new Error("LINKEDIN_ACCESS_TOKEN is not set.");

  const author = await resolveAuthorUrn(token);

  const shareContent = {
    shareCommentary: { text },
    shareMediaCategory: articleUrl ? "ARTICLE" : "NONE",
  };

  if (articleUrl) {
    shareContent.media = [
      {
        status: "READY",
        originalUrl: articleUrl,
        title: { text: (articleTitle || "Read more").slice(0, 200) },
        description: { text: (articleSummary || "").slice(0, 256) },
      },
    ];
  }

  const body = {
    author,
    lifecycleState: "PUBLISHED",
    specificContent: { "com.linkedin.ugc.ShareContent": shareContent },
    visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
  };

  const resp = await fetch("https://api.linkedin.com/v2/ugcPosts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const detail = await resp.text();
    throw new Error(`LinkedIn publish failed (${resp.status}): ${detail}`);
  }

  // LinkedIn returns the post id in the X-RestLi-Id header or the body.
  const headerId = resp.headers.get("x-restli-id");
  let bodyId = null;
  try {
    bodyId = (await resp.json()).id;
  } catch {
    /* no JSON body — that's fine */
  }
  return { id: headerId || bodyId || "published" };
}
