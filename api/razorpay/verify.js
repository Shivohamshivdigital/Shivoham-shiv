// Vercel Serverless Function — verifies a Razorpay payment signature and
// notifies the team by email (via Brevo) with the buyer's details.
//
// Required environment variables:
//   RAZORPAY_KEY_ID       Razorpay API Key Id
//   RAZORPAY_KEY_SECRET   Razorpay API Key Secret
// Optional (for the email receipt notification):
//   BREVO_API_KEY         Brevo API key
//   LEAD_NOTIFY_EMAIL     Where to send the notification (default below)
//   BREVO_SENDER_EMAIL    Verified Brevo sender (default below)

import crypto from "crypto";
import { dbInsert } from "../_db.js";

const PLAN_LABEL = {
  register: "Registration (₹999)",
  course: "60-Day Program (₹7999)",
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    plan,
    name,
    email,
    contact,
  } = req.body || {};

  const KEY_ID = process.env.RAZORPAY_KEY_ID;
  const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
  if (!KEY_SECRET || !KEY_ID) {
    return res.status(500).json({ error: "Payment is not configured." });
  }
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: "Missing payment details." });
  }

  // Verify the signature: HMAC-SHA256(order_id|payment_id, key_secret).
  const expected = crypto
    .createHmac("sha256", KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  let valid = false;
  try {
    valid = crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(razorpay_signature));
  } catch {
    valid = expected === razorpay_signature;
  }

  if (!valid) {
    return res.status(400).json({ error: "Payment verification failed." });
  }

  // Best-effort: pull the payer's email/contact/amount from Razorpay.
  let payerEmail = email || "";
  let payerContact = contact || "";
  let amount = null;
  try {
    const auth = Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString("base64");
    const pr = await fetch(`https://api.razorpay.com/v1/payments/${razorpay_payment_id}`, {
      headers: { Authorization: `Basic ${auth}` },
    });
    if (pr.ok) {
      const p = await pr.json();
      payerEmail = payerEmail || p.email || "";
      payerContact = payerContact || p.contact || "";
      if (typeof p.amount === "number") amount = Math.round(p.amount / 100); // paise → ₹
    }
  } catch (err) {
    console.error("Could not fetch payment details:", err);
  }

  // Save the payment to our database (best-effort) so it shows in /admin.
  await dbInsert("payments", {
    plan,
    name: name || "",
    email: payerEmail,
    contact: payerContact,
    amount,
    razorpay_payment_id,
    razorpay_order_id,
    status: "paid",
  });

  await notifyTeam({ plan, name, email: payerEmail, contact: payerContact, razorpay_payment_id, razorpay_order_id });

  return res.status(200).json({ success: true });
}

async function notifyTeam(info) {
  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  if (!BREVO_API_KEY) return; // Email is optional; payment is already verified.

  const NOTIFY_TO = process.env.LEAD_NOTIFY_EMAIL || "shivohamshivdigital@gmail.com";
  const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || "shivohamshivdigital@gmail.com";
  const planLabel = PLAN_LABEL[info.plan] || info.plan || "Payment";

  const htmlContent = `
    <h2>✅ New paid ${escapeHtml(planLabel)}</h2>
    <table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px">
      <tr><td><strong>Plan</strong></td><td>${escapeHtml(planLabel)}</td></tr>
      <tr><td><strong>Name</strong></td><td>${escapeHtml(info.name || "—")}</td></tr>
      <tr><td><strong>Email</strong></td><td>${escapeHtml(info.email || "—")}</td></tr>
      <tr><td><strong>Contact</strong></td><td>${escapeHtml(info.contact || "—")}</td></tr>
      <tr><td><strong>Payment ID</strong></td><td>${escapeHtml(info.razorpay_payment_id)}</td></tr>
      <tr><td><strong>Order ID</strong></td><td>${escapeHtml(info.razorpay_order_id)}</td></tr>
    </table>
    <p style="color:#888;font-size:12px">Sent automatically from the Shivoham Shiv website.</p>
  `;

  try {
    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: { name: "Shivoham Shiv Payments", email: SENDER_EMAIL },
        to: [{ email: NOTIFY_TO }],
        subject: `New Payment: ${planLabel}${info.name ? " — " + info.name : ""}`,
        htmlContent,
      }),
    });
  } catch (err) {
    console.error("Payment notification email failed:", err);
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
