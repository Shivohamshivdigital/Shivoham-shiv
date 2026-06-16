// Emails you a draft LinkedIn post with Approve / Reject buttons, reusing the
// project's existing Brevo integration (same env vars as api/contact.js).
//
// Env:
//   BREVO_API_KEY        required to send (without it the draft is logged only)
//   BREVO_SENDER_EMAIL   verified Brevo sender (default: shivohamshivdigital@gmail.com)
//   AGENT_NOTIFY_EMAIL   where approval emails go (default: LEAD_NOTIFY_EMAIL or owner)
//   APP_URL              base URL used to build the approve/reject links

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function appBaseUrl() {
  return (process.env.APP_URL || "https://shivohamshiv.com").replace(/\/+$/, "");
}

export async function sendApprovalEmail({ draftId, token, post, article, model }) {
  const base = appBaseUrl();
  const approveUrl = `${base}/api/agent/approve?id=${draftId}&token=${token}`;
  const rejectUrl = `${base}/api/agent/reject?id=${draftId}&token=${token}`;
  const wordCount = post.trim().split(/\s+/).length;

  const to =
    process.env.AGENT_NOTIFY_EMAIL ||
    process.env.LEAD_NOTIFY_EMAIL ||
    "shivohamshivdigital@gmail.com";
  const sender = process.env.BREVO_SENDER_EMAIL || "shivohamshivdigital@gmail.com";

  const htmlContent = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#1a1a1a">
      <h2 style="margin-bottom:4px">📝 Draft LinkedIn post ready for review</h2>
      <p style="color:#666;font-size:13px;margin-top:0">
        Source: <a href="${escapeHtml(article.link)}">${escapeHtml(article.source)} — ${escapeHtml(article.title)}</a><br/>
        Written by: ${escapeHtml(model)} • ${wordCount} words
      </p>
      <div style="white-space:pre-wrap;background:#f6f7f9;border:1px solid #e3e6ea;border-radius:10px;padding:18px;font-size:15px;line-height:1.5">${escapeHtml(post)}</div>
      <div style="margin:22px 0">
        <a href="${approveUrl}" style="background:#0a66c2;color:#fff;text-decoration:none;padding:12px 22px;border-radius:24px;font-weight:bold;display:inline-block;margin-right:10px">✅ Approve &amp; Publish</a>
        <a href="${rejectUrl}" style="background:#eee;color:#444;text-decoration:none;padding:12px 22px;border-radius:24px;font-weight:bold;display:inline-block">🗑️ Reject</a>
      </div>
      <p style="color:#999;font-size:12px">Approving posts this immediately to your LinkedIn profile via the official API. This link works once.</p>
    </div>`;

  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  if (!BREVO_API_KEY) {
    console.log("[agent] BREVO_API_KEY missing — draft NOT emailed. Approve link:", approveUrl);
    return false;
  }

  const resp = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: { name: "Shivoham Shiv LinkedIn Agent", email: sender },
      to: [{ email: to }],
      subject: `Approve LinkedIn post? — ${article.title.slice(0, 80)}`,
      htmlContent,
    }),
  });

  if (!resp.ok) {
    console.error("Approval email failed:", resp.status, await resp.text());
    return false;
  }
  return true;
}

// Minimal HTML page returned by the approve/reject endpoints.
export function resultPage(title, message, accent = "#0a66c2") {
  return `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${title}</title></head>
  <body style="font-family:Arial,sans-serif;background:#f4f6f8;margin:0;padding:0">
    <div style="max-width:520px;margin:80px auto;background:#fff;border-radius:14px;padding:40px;text-align:center;box-shadow:0 6px 24px rgba(0,0,0,.06)">
      <h1 style="color:${accent};margin-top:0">${title}</h1>
      <p style="color:#444;font-size:16px;line-height:1.5">${message}</p>
    </div>
  </body></html>`;
}
