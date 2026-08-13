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

import { dbInsert, dbFindBy } from "./_db.js";
import { verifyToken } from "./_auth.js";
import { normalizeContact, flattenForStore } from "./_normalizeContact.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Health-assessment submissions are saved to a separate collection. We route
  // them here (instead of a new serverless function) to stay under Vercel's
  // Hobby plan function limit.
  if (req.body && req.body.type === "assessment") {
    return handleAssessment(req, res);
  }

  // "Partner With Us" submissions — saved as a lead tagged "Partner With Us".
  if (req.body && req.body.type === "partner") {
    return handlePartner(req, res);
  }

  // Contact-sync from Google People / Microsoft Graph. Routed through this
  // handler (not a new function) to stay under the Vercel Hobby function limit.
  if (req.body && req.body.type === "contact_sync") {
    return handleContactSync(req, res);
  }

  const { name, email, whatsapp, message, source, attribution } = req.body || {};

  if (!name || !email || !whatsapp) {
    return res.status(400).json({ error: "Name, email and WhatsApp are required." });
  }

  const attr = attribution && typeof attribution === "object" ? attribution : {};

  // 1) Save the lead to our database FIRST (best-effort) so it always appears
  //    in /admin — regardless of whether the Brevo email integration is set up.
  const saved = await dbInsert("leads", {
    name,
    email,
    whatsapp,
    message: message || "",
    source: source || "Website",
    // Ad attribution — which ad / campaign / search term this lead came from.
    utm_source: attr.utm_source || "",
    utm_medium: attr.utm_medium || "",
    utm_campaign: attr.utm_campaign || "",
    utm_term: attr.utm_term || "",
    utm_content: attr.utm_content || "",
    gclid: attr.gclid || "",
    fbclid: attr.fbclid || "",
    referrer: attr.referrer || "",
    landing_page: attr.landing_page || "",
  });

  // 2) Notify the team by email via Brevo — entirely optional. If the key is
  //    missing or the send fails, the lead is still captured above, so we never
  //    block the visitor or lose the lead.
  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  if (BREVO_API_KEY) {
    const NOTIFY_TO = process.env.LEAD_NOTIFY_EMAIL || "shivohamshivdigital@gmail.com";
    const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || "shivohamshivdigital@gmail.com";
    const LIST_ID = process.env.BREVO_LIST_ID ? Number(process.env.BREVO_LIST_ID) : null;
    const brevoHeaders = {
      "api-key": BREVO_API_KEY,
      "content-type": "application/json",
      accept: "application/json",
    };

    // Add / update the lead as a Brevo contact (best-effort).
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

    // Send the notification email to the team (best-effort).
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
        console.error("Brevo email send failed:", emailRes.status, await emailRes.text());
      }
    } catch (err) {
      console.error("Brevo email send error:", err);
    }
  }

  // As long as the lead reached the database (or Brevo was attempted), succeed.
  if (!saved && !BREVO_API_KEY) {
    return res.status(500).json({ error: "Lead service is not configured." });
  }
  return res.status(200).json({ success: true });
}

// Save an interactive health-assessment submission to the `assessments`
// collection and (best-effort) notify the team by email.
async function handleAssessment(req, res) {
  const b = req.body || {};
  const fullName = (b.fullName || "").trim();
  const formEmail = (b.email || "").trim().toLowerCase(); // secondary / contact email
  const mobile = (b.mobile || "").trim();

  // The assessment is OWNED by the "primary" email: the logged-in account when
  // a valid session token is sent, otherwise the email entered (which the free
  // flow then verifies via OTP). The form email is kept only as a contact.
  let emailNorm = formEmail;
  const tokenEmail = b.token ? verifyToken(b.token)?.email : "";
  if (tokenEmail) emailNorm = String(tokenEmail).trim().toLowerCase();

  if (!fullName || !emailNorm || !mobile) {
    return res.status(400).json({ error: "Name, email and mobile are required." });
  }

  // One assessment per email — if they've already submitted, don't save again.
  // The frontend uses `already` to show the customer their existing details.
  try {
    const existing = await dbFindBy("assessments", "email", emailNorm);
    if (existing) {
      return res.status(200).json({ success: true, already: true });
    }
  } catch (err) {
    console.error("Assessment dedup check failed:", err);
  }

  const attr = b.attribution && typeof b.attribution === "object" ? b.attribution : {};

  const saved = await dbInsert("assessments", {
    full_name: fullName,
    age: b.age || "",
    gender: b.gender || "",
    mobile,
    email: emailNorm,
    contact_email: formEmail,
    city_state: b.cityState || "",
    current_weight: b.currentWeight || "",
    height: b.height || "",
    target_weight: b.targetWeight || "",
    conditions: b.conditions || "",
    conditions_other: b.conditionsOther || "",
    medications: b.medications || "",
    surgery: b.surgery || "",
    pregnant: b.pregnant || "",
    why_lose_weight: b.whyLoseWeight || "",
    kg_to_lose: b.kgToLose || "",
    biggest_challenge: b.biggestChallenge || "",
    paid: b.paid === true || b.paid === "1" || b.paid === 1,
    utm_source: attr.utm_source || "",
    utm_medium: attr.utm_medium || "",
    utm_campaign: attr.utm_campaign || "",
    utm_term: attr.utm_term || "",
    utm_content: attr.utm_content || "",
    gclid: attr.gclid || "",
    fbclid: attr.fbclid || "",
    referrer: attr.referrer || "",
    landing_page: attr.landing_page || "",
  });

  // Best-effort email notification to the team.
  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  if (BREVO_API_KEY) {
    const NOTIFY_TO = process.env.LEAD_NOTIFY_EMAIL || "shivohamshivdigital@gmail.com";
    const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || "shivohamshivdigital@gmail.com";
    try {
      const rows = [
        ["Name", fullName],
        ["Age", b.age],
        ["Gender", b.gender],
        ["Mobile", mobile],
        ["Email", email],
        ["City & State", b.cityState],
        ["Current Weight", b.currentWeight],
        ["Height", b.height],
        ["Target Weight", b.targetWeight],
        ["Conditions", b.conditions],
        ["Other condition", b.conditionsOther],
        ["Medications", b.medications],
        ["Recent surgery", b.surgery],
        ["Pregnant/breastfeeding", b.pregnant],
        ["Why lose weight", b.whyLoseWeight],
        ["Kg to lose", b.kgToLose],
        ["Biggest challenge", b.biggestChallenge],
        ["Paid customer", b.paid ? "Yes" : "No"],
      ];
      const htmlContent =
        `<h2>New health assessment — ${escapeHtml(fullName)}</h2>` +
        `<table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px">` +
        rows
          .map(([k, v]) => `<tr><td><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(v || "—")}</td></tr>`)
          .join("") +
        `</table>`;
      const emailRes = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: { "api-key": BREVO_API_KEY, "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({
          sender: { name: "Shivoham Shiv Website", email: SENDER_EMAIL },
          to: [{ email: NOTIFY_TO }],
          replyTo: { email, name: fullName },
          subject: `New Health Assessment: ${fullName}`,
          htmlContent,
        }),
      });
      if (!emailRes.ok) {
        console.error("Brevo assessment email failed:", emailRes.status, await emailRes.text());
      }
    } catch (err) {
      console.error("Brevo assessment email error:", err);
    }
  }

  // The assessment MUST be saved — never show a false success (which would
  // make the data silently disappear from the admin + customer dashboard).
  if (!saved) {
    return res.status(500).json({ error: "Could not save your assessment. Please try again in a moment." });
  }
  return res.status(200).json({ success: true });
}

// Save a "Partner With Us" submission as a lead (source = "Partner With Us")
// and notify the team by email. Kept in this endpoint to stay under Vercel's
// Hobby-plan function limit.
async function handlePartner(req, res) {
  const b = req.body || {};
  const name = (b.name || "").trim();
  const email = (b.email || "").trim();
  const whatsapp = (b.whatsapp || "").trim();
  const organization = (b.organization || "").trim();
  const partnerType = (b.partnerType || "").trim();
  const city = (b.city || "").trim();
  const website = (b.website || "").trim();
  const note = (b.message || "").trim();

  if (!name || !email || !whatsapp) {
    return res.status(400).json({ error: "Name, email and WhatsApp are required." });
  }

  const attr = b.attribution && typeof b.attribution === "object" ? b.attribution : {};

  const summary = [
    organization && `Organization: ${organization}`,
    partnerType && `Partnership type: ${partnerType}`,
    city && `City: ${city}`,
    website && `Website: ${website}`,
    note && `Message: ${note}`,
  ]
    .filter(Boolean)
    .join(" | ");

  const saved = await dbInsert("leads", {
    name,
    email,
    whatsapp,
    message: summary || note || "",
    source: "Partner With Us",
    organization,
    partner_type: partnerType,
    city,
    website,
    utm_source: attr.utm_source || "",
    utm_medium: attr.utm_medium || "",
    utm_campaign: attr.utm_campaign || "",
    utm_term: attr.utm_term || "",
    utm_content: attr.utm_content || "",
    gclid: attr.gclid || "",
    fbclid: attr.fbclid || "",
    referrer: attr.referrer || "",
    landing_page: attr.landing_page || "",
  });

  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  if (BREVO_API_KEY) {
    const NOTIFY_TO = process.env.LEAD_NOTIFY_EMAIL || "shivohamshivdigital@gmail.com";
    const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || "shivohamshivdigital@gmail.com";
    try {
      const rows = [
        ["Name", name],
        ["Organization", organization],
        ["Partnership type", partnerType],
        ["Email", email],
        ["WhatsApp", whatsapp],
        ["City", city],
        ["Website", website],
        ["Message", note],
      ];
      const htmlContent =
        `<h2>New “Partner With Us” enquiry — ${escapeHtml(name)}</h2>` +
        `<table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px">` +
        rows
          .map(([k, v]) => `<tr><td><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(v || "—")}</td></tr>`)
          .join("") +
        `</table>` +
        `<p style="color:#888;font-size:12px">Sent automatically from the Shivoham Shiv website.</p>`;
      const emailRes = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: { "api-key": BREVO_API_KEY, "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({
          sender: { name: "Shivoham Shiv Website", email: SENDER_EMAIL },
          to: [{ email: NOTIFY_TO }],
          replyTo: { email, name },
          subject: `New Partner Enquiry: ${name}${organization ? ` (${organization})` : ""}`,
          htmlContent,
        }),
      });
      if (!emailRes.ok) {
        console.error("Brevo partner email failed:", emailRes.status, await emailRes.text());
      }
    } catch (err) {
      console.error("Brevo partner email error:", err);
    }
  }

  if (!saved && !BREVO_API_KEY) {
    return res.status(500).json({ error: "Partner service is not configured." });
  }
  return res.status(200).json({ success: true });
}

// Normalise an external contact (Google People / Microsoft Graph) and store it.
//
// Body: { type: "contact_sync", provider: "google_people"|"graph"|...,
//         payload: <raw provider contact> }
// Auth: when ADMIN_API_KEY is set, require it via `x-api-key` (this is an
//       internal sync endpoint, not a public form).
//
// The normaliser prefers the Python /api/normalize function (full Pydantic
// validation) and falls back to a native-JS mapper, so a record is never lost.
async function handleContactSync(req, res) {
  const API_KEY = process.env.ADMIN_API_KEY;
  if (API_KEY) {
    const provided = req.headers["x-api-key"] || req.query.key || "";
    if (provided !== API_KEY) {
      return res.status(401).json({ error: "Invalid or missing API key." });
    }
  }

  const provider = String(req.body?.provider || req.query.provider || "").trim();
  const payload = req.body?.payload ?? req.body ?? {};
  if (!provider) {
    return res.status(400).json({ error: "provider is required." });
  }
  if (!payload || typeof payload !== "object") {
    return res.status(400).json({ error: "payload must be an object." });
  }

  const { contact, via } = await normalizeContact(provider, payload);

  // 1) Persist to Firestore (best-effort), flattened to scalar fields.
  const saved = await dbInsert("contacts", flattenForStore(contact, via));

  // 2) Upsert into Brevo (best-effort) — only if we have an email.
  const email = contact.emails.find((e) => e.is_primary)?.address || contact.emails[0]?.address;
  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  if (BREVO_API_KEY && email) {
    const phone = contact.phones.find((p) => p.is_primary)?.number || contact.phones[0]?.number;
    const LIST_ID = process.env.BREVO_LIST_ID ? Number(process.env.BREVO_LIST_ID) : null;
    try {
      await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: { "api-key": BREVO_API_KEY, "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({
          email,
          attributes: {
            FIRSTNAME: contact.first_name,
            LASTNAME: contact.last_name,
            ...(phone ? { SMS: phone, WHATSAPP: phone } : {}),
            SOURCE_SYSTEM: contact.source_system,
            SOURCE_ID: contact.source_id,
          },
          updateEnabled: true,
          ...(LIST_ID ? { listIds: [LIST_ID] } : {}),
        }),
      });
    } catch (err) {
      console.error("Brevo contact upsert failed:", err);
    }
  }

  return res.status(200).json({
    success: true,
    via, // "python" | "native"
    saved: Boolean(saved),
    source_system: contact.source_system,
    source_id: contact.source_id,
    primary_email: email || null,
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
