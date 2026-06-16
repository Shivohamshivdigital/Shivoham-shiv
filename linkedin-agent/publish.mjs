// Publishes an already-approved draft to LinkedIn.
//
// Reads the GitHub Issue body from the ISSUE_BODY env var (set by the publish
// workflow), extracts the hidden linkedin-agent-data JSON, and posts it.

import { publishToLinkedIn } from "./lib/linkedin.mjs";

function extractData(issueBody) {
  const m = (issueBody || "").match(/<!--\s*linkedin-agent-data\s*([\s\S]*?)-->/);
  if (!m) throw new Error("No linkedin-agent-data block found in the issue body.");
  return JSON.parse(m[1].trim());
}

async function main() {
  const body = process.env.ISSUE_BODY;
  if (!body) throw new Error("ISSUE_BODY env var is empty.");

  const { post, link, title, summary } = extractData(body);
  if (!post) throw new Error("Draft had no post text.");

  const { id } = await publishToLinkedIn({
    text: post, articleUrl: link, articleTitle: title, articleSummary: summary,
  });
  console.log(`✅ Published to LinkedIn. Post id: ${id}`);
}

main().catch((err) => { console.error("Publish error:", err.message); process.exit(1); });
