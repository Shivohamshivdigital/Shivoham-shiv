// Main entry: scrape AI news -> pick the top story -> write a <200-word post.
//
// Two modes:
//  * Local terminal (you run `npm run draft`): shows the draft and asks y/n.
//    Press y -> publishes to LinkedIn immediately.
//  * GitHub Actions (no screen): writes out/draft.md + out/title.txt so the
//    workflow can open a GitHub Issue you approve by commenting "approve".

import { mkdir, writeFile, readFile } from "node:fs/promises";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

// Tiny .env loader (no dependency) so local `npm run draft` just works.
try {
  const raw = await readFile(new URL("./.env", import.meta.url), "utf8");
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch { /* no .env file — fine (e.g. in GitHub Actions) */ }

const { fetchTopArticles } = await import("./lib/sources.mjs");
const { writePost } = await import("./lib/writer.mjs");
const { publishToLinkedIn } = await import("./lib/linkedin.mjs");

const OUT_DIR = new URL("./out/", import.meta.url);

function parseExcludes() {
  const raw = process.env.EXCLUDE_LINKS || "";
  return new Set(raw.split(/[\n,]/).map((s) => s.trim().split("?")[0]).filter(Boolean));
}

// Hidden machine-readable block embedded in the issue body for publish.mjs.
function buildIssueBody({ post, article, model }) {
  const words = post.trim().split(/\s+/).length;
  const data = JSON.stringify({
    post, link: article.link, title: article.title, summary: article.summary || "",
  });
  return [
    post,
    ``,
    `---`,
    `🔗 **Source:** [${article.source} — ${article.title}](${article.link})`,
    `✍️ **Written by:** ${model} • ${words} words`,
    ``,
    `### ✅ Approve karne ke liye / To approve`,
    `Is issue par comment karo: **\`approve\`** (ya \`yes\` / \`haan\` / \`y\`) → LinkedIn par post ho jayega.`,
    `Reject ke liye: **\`reject\`** (ya \`no\`), ya issue band kar do.`,
    ``,
    `<!-- linkedin-agent-data`,
    data,
    `-->`,
  ].join("\n");
}

async function runInteractive(post, article, model) {
  console.log("\n================ DRAFT LINKEDIN POST ================\n");
  console.log(post);
  console.log(`\n----------------------------------------------------`);
  console.log(`Source : ${article.source} — ${article.title}`);
  console.log(`Link   : ${article.link}`);
  console.log(`Model  : ${model} • ${post.trim().split(/\s+/).length} words`);
  console.log(`====================================================\n`);

  const rl = createInterface({ input: stdin, output: stdout });
  const answer = (await rl.question("LinkedIn par post karein? (y/n): ")).trim().toLowerCase();
  rl.close();

  if (["y", "yes", "haan", "ha"].includes(answer)) {
    console.log("Posting to LinkedIn…");
    const { id } = await publishToLinkedIn({
      text: post, articleUrl: article.link,
      articleTitle: article.title, articleSummary: article.summary,
    });
    console.log(`✅ Published! Post id: ${id}`);
  } else {
    console.log("❌ Cancelled. Kuch post nahi hua.");
  }
}

async function main() {
  const articles = await fetchTopArticles(parseExcludes());
  if (articles.length === 0) {
    console.log("No fresh articles found today.");
    return;
  }
  const article = articles[0];
  console.log(`Top story: [${article.score.toFixed(1)}] ${article.source} — ${article.title}`);

  const { text: post, model } = await writePost(article);

  // GitHub Actions / non-interactive: write files for the workflow.
  const isCI = process.env.CI === "true" || !stdout.isTTY;
  if (isCI) {
    await mkdir(OUT_DIR, { recursive: true });
    await writeFile(new URL("draft.md", OUT_DIR), buildIssueBody({ post, article, model }));
    await writeFile(new URL("title.txt", OUT_DIR), `LinkedIn draft: ${article.title}`.slice(0, 240));
    console.log("Draft written to linkedin-agent/out/ (draft.md, title.txt).");
    return;
  }

  // Local terminal: show and ask y/n.
  await runInteractive(post, article, model);
}

main().catch((err) => { console.error("Error:", err.message); process.exit(1); });
