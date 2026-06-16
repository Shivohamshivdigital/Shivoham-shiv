# LinkedIn AI-News Agent

An automated agent that scrapes the latest AI-lab news (Claude/Anthropic,
OpenAI, Google), writes a LinkedIn post **under 200 words** with Gemini, saves
it as a **draft**, and posts it to your **company page** once you approve it.

```
  RSS feeds (Claude / OpenAI / Google)
            │  scrape newest unused story
            ▼
  Gemini  →  <200-word LinkedIn post
            │  save
            ▼
  Firestore  "linkedin_drafts"  (status: draft)
            │  you review + edit in /admin → LinkedIn tab
            ▼
  LinkedIn Posts API  →  published to your company page
```

Nothing is ever posted automatically — generation creates a **draft**, and you
press **Publish** after reviewing. A daily cron keeps fresh drafts ready.

## Files

| File | Role |
| --- | --- |
| `api/linkedin/generate.js` | Scrapes feeds + writes the draft. Cron-callable. |
| `api/linkedin/drafts.js`   | Admin: list / edit / delete / **publish** drafts. |
| `src/views/AdminView.tsx`  | The **LinkedIn** tab in `/admin`. |
| `vercel.json`              | Daily cron (`0 4 * * *` UTC → 09:30 IST). |

## Environment variables

Set these in **Vercel → Settings → Environment Variables** (see `.env.example`):

| Variable | Needed for | Notes |
| --- | --- | --- |
| `GEMINI_API_KEY` | writing posts | already configured for the site |
| `FIREBASE_*` | storing drafts | already configured (`api/_db.js`) |
| `ADMIN_PASSWORD` | admin panel | already configured |
| `ADMIN_API_KEY` | external/manual trigger | already configured |
| `CRON_SECRET` | the daily cron | Vercel sends it as `Authorization: Bearer …` |
| `LINKEDIN_ACCESS_TOKEN` | **publishing** | OAuth token, scope `w_organization_social` |
| `LINKEDIN_ORG_URN` | **publishing** | `urn:li:organization:<id>` or bare `<id>` |
| `LINKEDIN_API_VERSION` | publishing | optional, default `202506` |
| `GEMINI_MODEL` | writing posts | optional, default `gemini-2.0-flash` |
| `LINKEDIN_FEEDS` | scraping | optional, comma-separated RSS URLs to override defaults |
| `LINKEDIN_BRAND` | writing posts | optional, the voice to write in |

## One-time LinkedIn setup (to enable publishing)

Publishing to a company page needs a LinkedIn developer app and an access
token. This is a manual click-through on LinkedIn's side — it can't be
automated — but it's only done once.

1. **Create an app** at <https://www.linkedin.com/developers/apps> and link it
   to your company page.
2. Request the **Community Management API** (or "Share on LinkedIn" +
   "Advertising API") product so the app gets the `w_organization_social`
   scope. Verify you are a page admin.
3. Generate an **access token** with `w_organization_social` (and
   `r_organization_social` if you also want read access). The OAuth 2-legged /
   3-legged flow is described in LinkedIn's docs; the token is what goes into
   `LINKEDIN_ACCESS_TOKEN`.
4. **Find your page id** — open your company page while signed in as admin; the
   id is in the URL (`…/company/<id>/admin/`), or call
   `GET https://api.linkedin.com/rest/organizationAcls?q=roleAssignee`. Put it
   in `LINKEDIN_ORG_URN`.
5. Redeploy. The **Publish** button in the admin panel now works.

> Tokens expire (often ~60 days). When publishing starts returning a 401,
> regenerate the token and update `LINKEDIN_ACCESS_TOKEN`.

## Using it

- **Admin panel** → `/admin` → **LinkedIn** tab → **Generate Draft**. Review,
  edit the text inline (a word counter warns past 200), then **Publish to
  LinkedIn**.
- **Daily cron** runs `/api/linkedin/generate` automatically and leaves a fresh
  draft waiting for you.
- **Manual API trigger:**
  ```
  curl -X POST "https://<your-domain>/api/linkedin/generate" \
       -H "x-api-key: $ADMIN_API_KEY"
  ```

## Notes & limits

- The agent skips any story whose URL/title already exists as a draft, so it
  won't repeat itself.
- Default feeds: OpenAI, Google AI, Google DeepMind, and a Google-News query
  for Anthropic/Claude (Anthropic has no stable public RSS feed). Override with
  `LINKEDIN_FEEDS`.
- If the feeds return nothing new, `generate` responds with `{ skipped: true }`
  and creates no draft.
