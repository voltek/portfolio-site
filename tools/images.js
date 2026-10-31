// Makes the light WebP copies the pages load, with Edge headless (canvas → WebP: nothing to install, $0).
// For every image the data lists (the photo and each project's shots), next to the original:
//   name-240.webp · name-480.webp   small copies; the pages pick one with srcset (240 for 1x, 480 for 2x screens)
//   name.webp                       the full-size copy, at most 1080 px wide (the viewer and the case studies)
// The original (PNG or JPG) stays in assets/ as the source and is not published. The copies are committed; run this
// after adding or replacing an image (DATA.md → New app screenshots), then node tools/check-data.js.
// Usage: node tools/images.js            make the copies that are missing or older than their original
//        node tools/images.js --all      remake every copy
const fs = require("fs"), os = require("os"), path = require("path"), { spawnSync } = require("child_process");
const root = path.join(__dirname, "..");
const data = require(path.join(root, "data", "portfolio.js"));
const { SIZES, FULL, copiesOf, sourcesOf } = require("../lib/images.js");

const EDGE = ["C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "C:/Program Files/Microsoft/Edge/Application/msedge.exe"]
  .find(f => fs.existsSync(f));
if (!EDGE) { console.log("Edge not found: the copies are made with Edge headless"); process.exit(1); }

// WebP quality: 0.8 keeps small screenshots' text sharp; the full copy, seen large, holds up at 0.72 for less weight
const QUALITY = { small: 0.8, full: 0.72 };
const all = process.argv.includes("--all");
const mtime = f => fs.existsSync(f) ? fs.statSync(f).mtimeMs : 0;

// the page Edge runs: the original goes in as a data URL (a file:// image would taint the canvas), each copy comes
// back as a data URL inside <pre id="out">, read with --dump-dom. The work runs synchronously on "load", which
// --dump-dom waits for (async work would be cut off). Halving in steps keeps the small copies sharp.
const page = (src, widths) => `<!doctype html><meta charset="utf-8"><img id="src" src="${src}"><pre id="out"></pre><script>
addEventListener("load", () => {
  const img = document.getElementById("src"), out = {};
  const canvas = (w, h) => Object.assign(document.createElement("canvas"), { width: w, height: h });
  try {
    for (const w of ${JSON.stringify(widths)}) {
      const width = Math.min(w, img.naturalWidth), height = Math.round(img.naturalHeight * width / img.naturalWidth);
      let from = img, fw = img.naturalWidth, fh = img.naturalHeight;
      while (fw / 2 >= width) {
        const c = canvas(Math.round(fw / 2), Math.round(fh / 2)), g = c.getContext("2d");
        g.imageSmoothingQuality = "high"; g.drawImage(from, 0, 0, c.width, c.height);
        from = c; fw = c.width; fh = c.height;
      }
      const c = canvas(width, height), g = c.getContext("2d");
      g.imageSmoothingQuality = "high"; g.drawImage(from, 0, 0, width, height);
      out[w] = c.toDataURL("image/webp", w === ${FULL} ? ${QUALITY.full} : ${QUALITY.small});
    }
  } catch (e) { out.error = String(e); }
  document.getElementById("out").textContent = JSON.stringify(out);
});
</script>`;

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-images-"));
let made = 0, failed = 0;
for (const src of sourcesOf(data)) {
  const file = path.join(root, src);
  if (!fs.existsSync(file)) { console.log(`  missing original: ${src}`); failed++; continue; }
  const copies = copiesOf(src);
  const todo = [...SIZES.map(w => [w, copies[w]]), [FULL, copies.full]]
    .filter(([, c]) => all || mtime(path.join(root, c)) < mtime(file));
  if (!todo.length) continue;

  const type = /\.png$/i.test(src) ? "image/png" : "image/jpeg";
  const html = path.join(tmp, "encode.html");
  fs.writeFileSync(html, page(`data:${type};base64,${fs.readFileSync(file).toString("base64")}`, todo.map(([w]) => w)));
  const r = spawnSync(EDGE, ["--headless=new", "--disable-gpu", "--virtual-time-budget=20000", "--dump-dom",
    "file:///" + html.replace(/\\/g, "/")], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  const json = (r.stdout.match(/<pre id="out">([^<]*)<\/pre>/) || [])[1];
  const res = json ? JSON.parse(json.replace(/&quot;/g, '"').replace(/&amp;/g, "&")) : { error: "no output from Edge" };
  if (res.error) { console.log(`  failed: ${src} (${res.error})`); failed++; continue; }

  for (const [w, copy] of todo) {
    fs.writeFileSync(path.join(root, copy), Buffer.from(res[w].split(",")[1], "base64"));
    console.log(`  ${copy.padEnd(56)} ${(fs.statSync(path.join(root, copy)).size / 1024).toFixed(1)} KB`);
    made++;
  }
}
fs.rmSync(tmp, { recursive: true, force: true });
console.log(made ? `${made} copies made` : "every copy is up to date", failed ? `· ${failed} failed` : "");
process.exit(failed ? 1 : 0);
