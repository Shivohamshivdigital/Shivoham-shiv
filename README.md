<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/6b58e176-f161-4fa9-adef-9415743e6f6f

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## LinkedIn AI-news agent

Automated agent that scrapes the latest AI-lab news, drafts a sub-200-word
LinkedIn post with Gemini, and publishes it to your company page after you
approve it in `/admin` → **LinkedIn** tab. Setup and token instructions:
[docs/LINKEDIN_AGENT.md](docs/LINKEDIN_AGENT.md).
