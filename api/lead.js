// File: api/lead.js  (Vercel serverless function)
// This runs on YOUR server, so your secret key never shows in the browser.
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false });
  try {
    const r = await fetch(
      "https://crm.shivohamshivdigital.com/yt-data/leads/intake?clientId=client-msmx6hw&key=av123",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body || {}),
      }
    );
    const j = await r.json().catch(() => ({}));
    return res.status(200).json(j);
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e) });
  }
}
