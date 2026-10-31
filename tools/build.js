// Builds the site into _site/ (gitignored): checks the data, fills each page template in src/ from data/portfolio.js
// with its renderer in tools/pages/, and copies what the pages load. Plain Node, no npm dependencies.
// Runs locally to preview and in the phase 10 Action, which deploys _site/ to GitHub Pages.
// Usage: node tools/build.js                    build against today
//        node tools/build.js --today=2027-09-15  build as if it were another day
const fs = require("fs"), path = require("path"), { spawnSync } = require("child_process");
const root = path.join(__dirname, ".."), out = path.join(root, "_site");
const data = require(path.join(root, "data", "portfolio.js"));
const { C, context, fillTemplate } = require("./pages/common.js");

const arg = k => (process.argv.find(a => a.startsWith(`--${k}=`)) || "").split("=")[1];
const now = arg("today") ? C.parse(arg("today")) : new Date();

// 1) the data check: errors stop the build, warnings are only counted here (node tools/check-data.js lists them)
const check = spawnSync(process.execPath, [path.join(__dirname, "check-data.js")], { encoding: "utf8" });
if (check.status !== 0) { process.stdout.write(check.stdout); console.log("build stopped: fix the data errors above"); process.exit(1); }
const summary = check.stdout.trim().split("\n").pop();

// 2) the pages: template + renderer. The CV joins this list when it is built. A case study joins by itself: a project
// whose links.caseStudy is "x.html" and that has data/cases/x.js (until then its links are only listed as not there yet).
const renderCase = require("./pages/case.js");
const PAGES = [
  { file: "index.html", template: "src/plain.html", render: require("./pages/plain.js") },
  { file: "show.html", template: "src/show.html", render: require("./pages/show.js") },
  ...data.work.filter(w => w.links && w.links.caseStudy).map(w => [w.links.caseStudy, path.join(root, "data", "cases", w.links.caseStudy.replace(/\.html$/, ".js"))])
    .filter(([, f]) => fs.existsSync(f)).map(([file, f]) => ({ file, template: "src/case.html", render: ctx => renderCase(require(f), ctx) }))
];
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
const ctx = context(data, now);
for (const p of PAGES) {
  const html = fillTemplate(fs.readFileSync(path.join(root, p.template), "utf8"), data, p.render(ctx), p.file);
  fs.writeFileSync(path.join(out, p.file), html);
}

// 3) what the pages load: the shared tokens, the date functions and their browser runner, and the assets. An original
// with WebP copies (tools/images.js) stays out: the pages load the copies only.
const original = f => /\.(png|jpe?g)$/i.test(f) && fs.existsSync(f.replace(/\.(png|jpe?g)$/i, ".webp"));
const copy = (from, to = from) => fs.cpSync(path.join(root, from), path.join(out, to), { recursive: true, filter: f => !f.endsWith("README.md") && !original(f) });
copy("tokens.css"); copy("lib/calc.js"); copy("src/live.js", "live.js"); copy("assets");

// 4) for search engines: the sitemap lists the pages, robots.txt points to it
const site = data.profile.links.site, pad = n => String(n).padStart(2, "0");
const day = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
fs.writeFileSync(path.join(out, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.map(p => `  <url><loc>${site}${p.file === "index.html" ? "" : p.file}</loc><lastmod>${day}</lastmod></url>`).join("\n")}
</urlset>
`);
fs.writeFileSync(path.join(out, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${site}sitemap.xml\n`);

// 5) every local link and image must exist in _site; a page still to be built (the CV, a case study) is only listed
const missing = new Set();
for (const p of PAGES) {
  const html = fs.readFileSync(path.join(out, p.file), "utf8");
  for (const [, ref] of html.matchAll(/(?:href|src)="([^"#?]+)/g))
    if (!/^([a-z]+:|\/\/)/i.test(ref) && !fs.existsSync(path.join(out, decodeURI(ref)))) missing.add(`${p.file} → ${ref}`);
  // a link to a place on another built page (a case's "All work" → index.html#mn) needs that id there
  for (const [, ref, id] of html.matchAll(/href="([\w.-]+\.html)#([\w-]+)"/g)) {
    const to = path.join(out, ref);
    if (fs.existsSync(to) && !fs.readFileSync(to, "utf8").includes(`id="${id}"`)) missing.add(`${p.file} → ${ref}#${id} (no such id)`);
  }
}
if (!fs.existsSync(path.join(out, "assets/og.png"))) missing.add("share image → assets/og.png");

const kb = f => (fs.statSync(path.join(out, f)).size / 1024).toFixed(1) + " KB";
console.log(`built _site/ against ${day} · data: ${summary}`);
for (const p of PAGES) console.log(`  ${p.file.padEnd(16)} ${kb(p.file)}`);
if (missing.size) console.log(`not there yet (a page or file still to make):\n${[...missing].map(m => `  ${m}`).join("\n")}`);
