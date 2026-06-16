// Vercel Serverless Function — creates a Razorpay order.
//
// Required environment variables (Vercel → Settings → Environment Variables):
//   RAZORPAY_KEY_ID       Razorpay API Key Id (rzp_live_... or rzp_test_...)
//   RAZORPAY_KEY_SECRET   Razorpay API Key Secret (server-side only)

import { dbFindBy, dbUpdate } from "../_db.js";

const PLANS = {
  register: { amount: 99900, label: "Weight Loss Program — Registration" }, // ₹999
  course: { amount: 799900, label: "60-Day Natural Weight Loss Program" }, // ₹7999
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { plan, email } = req.body || {};
  const selected = PLANS[plan];
  if (!selected) {
    return res.status(400).json({ error: "Invalid plan selected." });
  }

  // Best-effort: record that this user reached checkout (an "attempt"), so the
  // admin can see unpaid attempts too.
  if (email) {
    try {
      const normEmail = String(email).trim().toLowerCase();
      const user = await dbFindBy("users", "email", normEmail);
      if (user) {
        const { id, ...rest } = user;
        await dbUpdate("users", id, {
          ...rest,
          lastPlan: plan,
          lastAttemptAt: new Date().toISOString(),
          attempts: (Number(user.attempts) || 0) + 1,
        });
      }
    } catch (err) {
      console.error("Attempt tracking failed:", err);
    }
  }

  const KEY_ID = process.env.RAZORPAY_KEY_ID;
  const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
  if (!KEY_ID || !KEY_SECRET) {
    console.error("Razorpay keys are not configured");
    return res.status(500).json({ error: "Payment is not configured yet." });
  }

  const auth = Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString("base64");

  try {
    const resp = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        amount: selected.amount,
        currency: "INR",
        receipt: `rcpt_${plan}_${Date.now()}`,
        notes: { plan, label: selected.label },
      }),
    });

    if (!resp.ok) {
      const detail = await resp.text();
      console.error("Razorpay order error:", resp.status, detail);
      return res.status(502).json({ error: "Could not create the payment order." });
    }

    const order = await resp.json();
    return res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: KEY_ID,
      label: selected.label,
    });
  } catch (err) {
    console.error("Razorpay order exception:", err);
    return res.status(500).json({ error: "Something went wrong creating the order." });
  }
}
