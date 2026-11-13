#!/usr/bin/env node
// What changed in a project's repo since the commit the portfolio is pinned to, and which of the site's claims rest
// on a file that changed. Read-only. Usage: node tools/repo-changes.js <id> [--from=<sha>]
const { execFileSync } = require("child_process");
const fs = require("fs"), path = require("path");
const data = require("../data/portfolio.js");

const id = process.argv[2], from = (process.argv.find(a => a.startsWith("--from=")) || "").slice(7);
const w = data.work.find(x => x.id === id);
if (!w || !w.links || !w.links.repo) { console.error(`No project "${id}" with links.repo in data/portfolio.js`); process.exit(1); }
const repo = w.links.repo.replace("https://github.com/", "");
const pin = from || (w.pin && w.pin.commit);
const gh = (...a) => execFileSync("gh", a, { encoding: "utf8", maxBuffer: 1 << 26 }).trim();

const head = gh("api", `repos/${repo}/commits/HEAD`, "--jq", '.sha[0:7] + " " + .commit.committer.date[0:10]');
console.log(`${w.name} · ${repo} · pinned at ${pin || "nothing"} · HEAD ${head}`);
if (!pin) { console.log("No pin: a first sync. Every claim is a candidate; read the repo whole."); process.exit(0); }
if (head.startsWith(pin.slice(0, 7))) { console.log("Nothing changed since the pin."); process.exit(0); }

const files = gh("api", "--paginate", `repos/${repo}/compare/${pin}...HEAD?per_page=100`, "--jq",
  '.files[]? | [.status, .filename, (.previous_filename // "")] | @tsv')
  .split("\n").filter(Boolean).map(l => l.split("\t")).map(([s, f, p]) => [s, f, p || ""]);

const area = f => f.split("/").slice(0, /^(\.|docs\/)/.test(f) ? 2 : 1).join("/");
const by = {};
for (const [s, f] of files) { const a = by[area(f)] = by[area(f)] || {}; a[s] = (a[s] || 0) + 1; }
console.log(`\n${files.length} files changed, by area:`);
for (const [k, v] of Object.entries(by)) console.log(`  ${k}  ${Object.entries(v).map(([s, n]) => `${n} ${s}`).join(", ")}`);
console.log(`\nREADME.md: ${files.some(([, f]) => f === "README.md") ? "changed, read it whole" : "unchanged"}`);

const ledger = path.join(__dirname, "..", "_private", "sources", `claims-${id}.md`);
if (!fs.existsSync(ledger)) { console.log(`\nNo ledger at ${ledger}: write it during this sync.`); process.exit(0); }
const cited = new Set();
console.log("\nClaims whose sources changed (re-read each source before the claim is kept):");
for (const row of fs.readFileSync(ledger, "utf8").split("\n").filter(l => /^\|/.test(l) && !/^\|\s*(Key|-)/.test(l))) {
  const cells = row.split("|").map(c => c.trim());
  const paths = [...(cells[2] || "").matchAll(/`([^`]+)`/g)].map(m => m[1]).filter(p => !p.startsWith("gh "));
  const hits = files.filter(([, f, p]) => paths.some(q => q.endsWith("/") ? f.startsWith(q) || p.startsWith(q) : f === q || p === q));
  hits.forEach(h => cited.add(h[1]));
  if (hits.length) console.log(`  ${cells[1]}\n${hits.map(([s, f]) => `      ${s}  ${f}`).join("\n")}`);
}
const fresh = files.filter(([s, f]) => s === "added" && !cited.has(f)).map(([, f]) => area(f));
console.log(`\nNew files no claim cites, by area (where new material may be): ${[...new Set(fresh)].join(", ") || "none"}`);
console.log("Claims not listed above rest on files that did not change. Settings named by a `gh` read are always re-read.");
