// Checks what the data checker cannot: nothing private is tracked, and (in a pull request) the title, body and branch
// follow CLAUDE.md → Conventions. Main only ever receives the squashed PR (title + body), so those are what is checked.
// Runs in .github/workflows/checks.yml; locally, `node tools/check-repo.js` checks the tracked paths.
// The pull request comes in through the environment: PR_TITLE, PR_BODY, PR_BRANCH.
const { execFileSync } = require("child_process");

const errors = [];
const err = m => errors.push(m);

// 1) private or third-party paths never enter this repo (the same list as .gitignore)
const PRIVATE = /^(_private\/|_comps\/|\.claude\/skills\/impeccable\/|\.claude\/agents\/impeccable-|\.claude\/settings\.local\.json$)/;
const tracked = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }).split("\0").filter(Boolean);
for (const f of tracked.filter(f => PRIVATE.test(f))) err(`tracked path must stay private: ${f}`);

// 2) the pull request
const TYPES = "feat|fix|refactor|docs|chore|perf|ci";
const SCOPES = "plain|show|case|cv|data|build|tokens|assets|harness|repo|deploy|readme";
const { PR_TITLE: title, PR_BODY: body, PR_BRANCH: branch } = process.env;

if (title != null) {
  if (!new RegExp(`^(${TYPES})\\((${SCOPES})\\): [A-Z]`).test(title)) err(`title "${title}" is not "type(scope): Imperative summary" (types: ${TYPES.replace(/\|/g, " ")}; scopes: ${SCOPES.replace(/\|/g, " ")})`);
  if (title.length > 72) err(`title is ${title.length} characters, the limit is 72`);
  if (/[.]$/.test(title)) err("title ends with a period");
}
if (body != null) {
  // three sections in this order, each with text; at most 6 lines of text under them (headings and bare links do not count)
  const SECTIONS = ["## What changed", "## Why", "## Verification"];
  const rows = body.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const heads = rows.filter(l => /^#{1,6} /.test(l));
  if (heads.join("|") !== SECTIONS.join("|")) err(`body headings are "${heads.join(", ")}"; they must be exactly: ${SECTIONS.join(", ")}`);
  else SECTIONS.forEach((h, i) => { if (rows[rows.indexOf(h) + 1] === SECTIONS[i + 1] || rows.indexOf(h) === rows.length - 1) err(`body section "${h}" is empty`); });
  const lines = rows.filter(l => !/^#{1,6} /.test(l) && !/^https?:\/\/\S+$/.test(l));
  if (lines.length > 6) err(`body has ${lines.length} lines of text, the limit is 6 (headings and links alone do not count)`);
}
if (branch != null && !new RegExp(`^(${TYPES})/[a-z0-9]+(-[a-z0-9]+)*$`).test(branch)) err(`branch "${branch}" is not {type}/{kebab-name}`);

for (const e of errors) console.log(`ERROR ${e}`);
console.log(`${errors.length} errors · ${tracked.length} tracked files${title != null ? " · pull request checked" : ""}`);
process.exit(errors.length ? 1 : 0);
