// Publishes to LinkedIn via the official UGC Posts API (needs the
// w_member_social scope). See README for how to get the token.
//
// Env:
//   LINKEDIN_ACCESS_TOKEN   OAuth token with w_member_social (required)
//   LINKEDIN_AUTHOR_URN     optional "urn:li:person:xxxx". If omitted we resolve
//                           it from the token via /v2/userinfo (openid+profile).

async function resolveAuthorUrn(token) {
  if (process.env.LINKEDIN_AUTHOR_URN) return process.env.LINKEDIN_AUTHOR_URN;
  const resp = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!resp.ok) {
    throw new Error(
      `Could not resolve LinkedIn author URN (${resp.status}). ` +
        `Set LINKEDIN_AUTHOR_URN, or grant the openid+profile scopes.`
    );
  }
  const data = await resp.json();
  if (!data.sub) throw new Error("LinkedIn userinfo returned no `sub`.");
  return `urn:li:person:${data.sub}`;
}

/** Publish a text post (optionally with a source link). Returns { id }. */
export async function publishToLinkedIn({ text, articleUrl, articleTitle, articleSummary }) {
  const token = process.env.LINKEDIN_ACCESS_TOKEN;
  if (!token) throw new Error("LINKEDIN_ACCESS_TOKEN is not set.");
  const author = await resolveAuthorUrn(token);

  const shareContent = {
    shareCommentary: { text },
    shareMediaCategory: articleUrl ? "ARTICLE" : "NONE",
  };
  if (articleUrl) {
    shareContent.media = [{
      status: "READY",
      originalUrl: articleUrl,
      title: { text: (articleTitle || "Read more").slice(0, 200) },
      description: { text: (articleSummary || "").slice(0, 256) },
    }];
  }

  const resp = await fetch("https://api.linkedin.com/v2/ugcPosts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify({
      author,
      lifecycleState: "PUBLISHED",
      specificContent: { "com.linkedin.ugc.ShareContent": shareContent },
      visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
    }),
  });

  if (!resp.ok) throw new Error(`LinkedIn publish failed (${resp.status}): ${await resp.text()}`);

  const headerId = resp.headers.get("x-restli-id");
  let bodyId = null;
  try { bodyId = (await resp.json()).id; } catch { /* no body */ }
  return { id: headerId || bodyId || "published" };
}
