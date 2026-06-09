// Vercel Serverless Function — receives lead form submissions and forwards
// them to Brevo (https://www.brevo.com): adds the person as a contact AND
// sends a notification email to the Shivoham Shiv team.
//
// Required environment variable (set in Vercel → Project → Settings → Environment Variables):
//   BREVO_API_KEY        Your Brevo API v3 key (Settings → SMTP & API → API Keys)
//
// Optional environment variables:
//   LEAD_NOTIFY_EMAIL    Where lead notifications are sent (default: info@shivohamshiv.com)
//   BREVO_SENDER_EMAIL   Verified Brevo sender address (default: info@shivohamshiv.com)
//   BREVO_LIST_ID        Numeric Brevo contact list id to add leads to (optional)

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, whatsapp, message, source } = req.body || {};

  if (!name || !email || !whatsapp) {
    return res.status(400).json({ error: "Name, email and WhatsApp are required." });
  }

  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  if (!BREVO_API_KEY) {
    console.error("BREVO_API_KEY is not set");
    return res.status(500).json({ error: "Lead service is not configured." });
  }

  const NOTIFY_TO = process.env.LEAD_NOTIFY_EMAIL || "info@shivohamshiv.com";
  const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || "info@shivohamshiv.com";
  const LIST_ID = process.env.BREVO_LIST_ID ? Number(process.env.BREVO_LIST_ID) : null;

  const brevoHeaders = {
    "api-key": BREVO_API_KEY,
    "content-type": "application/json",
    accept: "application/json",
  };

  // 1) Add / update the lead as a Brevo contact (non-blocking — a failure here
  //    should not stop the notification email from going out).
  try {
    await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: brevoHeaders,
      body: JSON.stringify({
        email,
        attributes: { FIRSTNAME: name, SMS: whatsapp, WHATSAPP: whatsapp },
        updateEnabled: true,
        ...(LIST_ID ? { listIds: [LIST_ID] } : {}),
      }),
    });
  } catch (err) {
    console.error("Brevo contact upsert failed:", err);
  }

  // 2) Send the notification email to the Shivoham Shiv team.
  try {
    const htmlContent = `
      <h2>New website lead${source ? ` — ${escapeHtml(source)}` : ""}</h2>
      <table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px">
        <tr><td><strong>Name</strong></td><td>${escapeHtml(name)}</td></tr>
        <tr><td><strong>Email</strong></td><td>${escapeHtml(email)}</td></tr>
        <tr><td><strong>WhatsApp</strong></td><td>${escapeHtml(whatsapp)}</td></tr>
        <tr><td><strong>Message</strong></td><td>${escapeHtml(message || "—")}</td></tr>
      </table>
      <p style="color:#888;font-size:12px">Sent automatically from the Shivoham Shiv website.</p>
    `;

    const emailRes = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: brevoHeaders,
      body: JSON.stringify({
        sender: { name: "Shivoham Shiv Website", email: SENDER_EMAIL },
        to: [{ email: NOTIFY_TO }],
        replyTo: { email, name },
        subject: `New Lead: ${name}`,
        htmlContent,
      }),
    });

    if (!emailRes.ok) {
      const detail = await emailRes.text();
      console.error("Brevo email send failed:", emailRes.status, detail);
      return res.status(502).json({ error: "Could not send notification." });
    }
  } catch (err) {
    console.error("Brevo email send error:", err);
    return res.status(502).json({ error: "Could not send notification." });
  }

  return res.status(200).json({ success: true });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
