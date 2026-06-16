# 🤖 LinkedIn AI Agent — Setup Guide

An autonomous agent that, **once a day**:

1. **Scrapes** the most important AI news from the OpenAI, Anthropic (Claude),
   Google DeepMind, Hugging Face blogs + top tech press (via public RSS feeds).
2. **Writes** a polished LinkedIn post **under 200 words** using **Claude**
   (primary) with **Gemini** as fallback.
3. **Emails you** the draft with **Approve / Reject** buttons.
4. **Publishes** to your LinkedIn profile via the official API — only after you
   click **Approve**.

Nothing is ever posted without your approval.

---

## How it works

```
Vercel Cron (daily 09:00 UTC)
        │
        ▼
/api/agent/run ──► scrape RSS ──► rank ──► write post (Claude→Gemini)
        │
        ▼
  save draft (Firestore)  ──►  email you Approve/Reject link (Brevo)
        │
        ▼ (you click Approve)
/api/agent/approve ──► publish to LinkedIn (official API) ✅
```

| File | Role |
|------|------|
| `api/agent/run.js` | Daily entrypoint (cron). Scrape → write → email. |
| `api/agent/approve.js` | Approve link → publishes to LinkedIn. |
| `api/agent/reject.js` | Reject link → discards the draft. |
| `api/_agent/sources.js` | RSS/Atom scraper + ranking. |
| `api/_agent/writer.js` | Claude + Gemini post writer. |
| `api/_agent/linkedin.js` | Official LinkedIn publishing. |
| `api/_agent/notify.js` | Approval email + result pages. |

Drafts/posts are stored in the Firestore `linkedin_posts` collection (reuses
your existing Firebase config), which also prevents re-posting the same story.

---

## Step 1 — AI keys (write the posts)

You need **at least one**. Claude is used first; Gemini is the fallback.

- **Claude:** create a key at <https://console.anthropic.com> → *API Keys* →
  set `ANTHROPIC_API_KEY`.
- **Gemini:** you already have `GEMINI_API_KEY` in this project — nothing to do.

## Step 2 — Get LinkedIn API access (publish the posts)

LinkedIn requires an app with the **`w_member_social`** permission. This is the
only ToS-compliant way to auto-post.

1. Go to <https://www.linkedin.com/developers/apps> → **Create app**. Associate
   it with a LinkedIn Page you control (a personal Page is fine).
2. On the app's **Products** tab, request **“Share on LinkedIn”** and
   **“Sign In with LinkedIn using OpenID Connect”**. These grant the scopes
   `w_member_social`, `openid`, `profile`.
3. On the **Auth** tab, add a redirect URL (e.g.
   `https://www.linkedin.com/developers/tools/oauth/redirect`) and copy your
   **Client ID** and **Client Secret**.
4. **Get an access token.** Easiest path: use LinkedIn's built-in
   **OAuth 2.0 token generator** (Auth tab → *“OAuth 2.0 tools”* →
   *Create token*), tick the `w_member_social`, `openid`, `profile` scopes, and
   generate. Copy the token.
   - ⚠️ Member tokens last **~60 days**. Set a reminder to regenerate, or
     implement the refresh-token flow later.
5. Set `LINKEDIN_ACCESS_TOKEN` to that token.
6. *(Optional)* Set `LINKEDIN_AUTHOR_URN` to `urn:li:person:XXXX`. If you skip
   it, the agent resolves it automatically from the token. To find it manually,
   call `https://api.linkedin.com/v2/userinfo` with the token — the `sub` field
   is your member id.

## Step 3 — Secure the cron

Set `CRON_SECRET` to a long random string. Vercel Cron automatically sends it
as a `Bearer` token, so only Vercel (or you, with `?key=`) can trigger runs.

## Step 4 — Set the environment variables

Add everything from the **LinkedIn AI Agent** section of `.env.example` to your
**Vercel → Project → Settings → Environment Variables** (Production):

```
CRON_SECRET, ANTHROPIC_API_KEY, ANTHROPIC_MODEL (opt), GEMINI_MODEL (opt),
AGENT_BRAND_VOICE (opt), LINKEDIN_ACCESS_TOKEN, LINKEDIN_AUTHOR_URN (opt),
AGENT_NOTIFY_EMAIL (opt), AGENT_FEEDS (opt)
```

You also need the ones already used by the site: `GEMINI_API_KEY`,
`BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, and the `FIREBASE_*` keys.

## Step 5 — Deploy & test

```bash
git push                      # deploy to Vercel (the cron is in vercel.json)
```

Trigger a run manually (replace with your domain + secret):

```bash
curl "https://shivohamshiv.com/api/agent/run?key=YOUR_CRON_SECRET"
```

You should get a JSON response with the drafted post, and an **approval email**
in your inbox. Click **Approve** to publish, or **Reject** to discard.

The daily schedule is **09:00 UTC** — change it in `vercel.json` (`crons`).

> **Note on plans:** Vercel's Hobby plan allows **one cron run per day**, which
> matches this setup. For more frequent posting you'll need Vercel Pro.

---

## Customising

- **Sources:** edit the `DEFAULT_FEEDS` list in `api/_agent/sources.js`, or set
  `AGENT_FEEDS` to a comma-separated list of RSS URLs.
- **Voice/length:** tweak the prompt in `api/_agent/writer.js` (the 200-word cap
  is enforced in code via `enforceWordLimit`).
- **Schedule:** edit the `crons[0].schedule` cron expression in `vercel.json`.
- **Fully automatic (no approval):** in `api/agent/run.js`, after `writePost`,
  call `publishToLinkedIn(...)` directly instead of emailing. Not recommended
  for a professional profile.
