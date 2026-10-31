// Makes assets/og.png, the 1200×630 image link previews show (LinkedIn, Slack, WhatsApp…), with Edge headless.
// Design A (Alan, 10-21): Plain's hero on the cobalt field (name with the photo, role, the AI line) and a footer with the
// domain and the stack. Every text comes from data/portfolio.js and none carries a date, so the image only changes when
// the name, title, AI line, stack or photo change: then run node tools/og.js and commit the PNG.
// WhatsApp shows the large preview only for an image under 600 KB (safe target: 300 KB), 300 px wide or more.
const fs = require("fs"), os = require("os"), path = require("path"), { spawnSync } = require("child_process");
const root = path.join(__dirname, "..");
const data = require(path.join(root, "data", "portfolio.js"));
const { esc } = require("./pages/common.js");
const { copiesOf } = require("../lib/images.js");

const EDGE = ["C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "C:/Program Files/Microsoft/Edge/Application/msedge.exe"]
  .find(f => fs.existsSync(f));
if (!EDGE) { console.log("Edge not found: the image is made with Edge headless"); process.exit(1); }

const p = data.profile, url = f => "file:///" + path.join(root, f).replace(/\\/g, "/");
const [first, ...rest] = p.name.split(" ");
const html = `<!doctype html>
<html lang="en" data-world="read" data-theme="light">
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="${url("tokens.css")}">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{width:1200px;height:630px;overflow:hidden;position:relative;background:var(--field);color:var(--on-field);font-family:var(--text)}
  h1{position:absolute;left:72px;top:70px;font-family:var(--display);font-weight:800;font-size:132px;letter-spacing:-.035em;line-height:.9}
  h1 img{width:.7em;height:.82em;object-fit:cover;object-position:50% 18%;border-radius:.07em;border:.025em solid var(--on-field);vertical-align:-.05em;margin-left:.1em}
  .role{position:absolute;left:76px;top:340px;font-family:var(--display);font-weight:700;font-size:44px;letter-spacing:-.01em}
  .ai{position:absolute;left:76px;top:412px;font-size:34px;line-height:1.3}
  em{font-style:normal;background:var(--on-field);color:var(--field);padding:.02em .25em}
  .rule{position:absolute;left:72px;right:72px;bottom:110px;border-top:2px solid var(--field-rule)}
  .dom,.stack{position:absolute;bottom:52px;font-size:26px;font-weight:700;color:var(--on-field-2)}
  .dom{left:72px;letter-spacing:.01em}
  .dom::before{content:"";display:inline-block;width:12px;height:12px;border-radius:50%;background:var(--go);margin-right:12px;vertical-align:2px}
  .stack{right:72px;font-size:24px;font-weight:600}
</style>
</head>
<body>
  <h1>${esc(first)} <img src="${url(copiesOf(p.photo.src)[480])}" alt=""><br>${esc(rest.join(" "))}</h1>
  <p class="role">${esc(p.title.en)}</p>
  <p class="ai"><em>${esc(p.aiLine.en)}</em></p>
  <div class="rule"></div>
  <p class="dom">${esc(p.links.site.replace(/^https?:\/\//, "").replace(/\/$/, ""))}</p>
  <p class="stack">${p.stack.map(esc).join(" · ")}</p>
</body>
</html>`;

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-og-"));
const page = path.join(tmp, "og.html"), out = path.join(root, "assets", "og.png");
fs.writeFileSync(page, html);
spawnSync(EDGE, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files",
  "--window-size=1200,630", "--virtual-time-budget=3000", `--screenshot=${out}`, "file:///" + page.replace(/\\/g, "/")]);
fs.rmSync(tmp, { recursive: true, force: true });
if (!fs.existsSync(out)) { console.log("failed: Edge made no image"); process.exit(1); }
const kb = fs.statSync(out).size / 1024;
console.log(`assets/og.png  1200×630  ${kb.toFixed(1)} KB${kb > 300 ? "  · over 300 KB: WhatsApp may drop it" : ""}`);
