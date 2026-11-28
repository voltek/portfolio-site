// The VK mark (Voltek: the V's right arm is a lightning bolt), printed riso style: the letters twice, in two inks a
// little out of register; where the inks cross they mix (multiply on light paper, screen on dark).
//   node tools/favicon.js    the site's icons into assets/ (the build copies favicon.ico to the root)
// Plain Node, no npm: the PNGs are drawn by Edge headless from the same paths as the SVGs. Run by hand when the mark
// changes; the build only copies what it wrote.
const fs = require("fs"), path = require("path"), os = require("os"), { execFileSync } = require("child_process");
const root = path.join(__dirname, "..");

// ---------- the letters, on a 100-unit box; every polygon clockwise, so one fill joins them ----------
const V = [[8, 14], [31, 14], [51.6, 62.1], [58.5, 50], [52, 50], [67, 14], [92, 14], [79.5, 44], [88, 44], [61, 84], [50, 95], [39, 84]];
const K = [[10, 14], [32, 14], [32, 44], [60, 14], [88, 14], [52, 52], [88, 95], [60, 95], [32, 62], [32, 95], [10, 95]];
const V_W = 84, K_W = 78, H = 81, GAP = 7;
const r2 = n => Math.round(n * 100) / 100;
const poly = (pts, minx, k, left, top) => "M" + pts.map(([x, y]) => `${r2(left + (x - minx) * k)} ${r2(top + (y - 14) * k)}`).join("L") + "Z";
// V and K side by side at the same height, so both letters read at 16 px
function letters({ w, h, cx = 50, cy = 50, dx = 0, dy = 0 }) {
  const W = V_W + GAP + K_W, k = Math.min(w / W, h / H), left = cx - W * k / 2 + dx, top = cy - H * k / 2 + dy;
  return poly(V, 8, k, left, top) + poly(K, 10, k, left + (V_W + GAP) * k, top);
}

// ---------- colour ----------
const hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16) / 255);
const toHex = v => "#" + v.map(x => Math.round(x * 255).toString(16).padStart(2, "0")).join("").toUpperCase();
const mix = (a, b, mode) => toHex(hex(a).map((x, i) => { const y = hex(b)[i]; return mode === "multiply" ? x * y : 1 - (1 - x) * (1 - y); }));
// Quick's cobalt and og.jpg's coral on light paper
const P = { bg: "#F7F8FC", a: "#1F3FBF", b: "#FF6F5E", mode: "multiply" };

// one drawing = a background and three layers: ink A, ink B, and where they cross, B clipped to A in the mixed colour
// (drawn, not blended, so every viewer shows the same colour)
const OFF = 3.125;   // each ink moves this far, so the two sit 6.25 units apart: whole pixels at 16 and 32 px
function drawing(round, fit) {
  const a = letters({ ...fit, dx: -OFF, dy: -OFF * .7 }), b = letters({ ...fit, dx: OFF, dy: OFF * .7 });
  return { bg: P.bg, rx: round ? 22 : 0, layers: [{ d: a, fill: P.a }, { d: b, fill: P.b }, { d: b, fill: mix(P.a, P.b, P.mode), clip: a }] };
}
const svg = g => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">` +
  `<defs><clipPath id="a"><path d="${g.layers[2].clip}"/></clipPath></defs>` +
  `<rect width="100" height="100"${g.rx ? ` rx="${g.rx}"` : ""} fill="${g.bg}"/>` +
  g.layers.map(l => `<path d="${l.d}" fill="${l.fill}"${l.clip ? ` clip-path="url(#a)"` : ""}/>`).join("") + `</svg>\n`;

// ---------- the PNGs, drawn by Edge headless: a page paints each drawing on a canvas and leaves the data URLs in its DOM ----------
const EDGE = [process.env.CHROME_PATH, "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe"].find(p => p && fs.existsSync(p));
function rasterize(jobs) {
  if (!EDGE) throw new Error("no Edge found (set CHROME_PATH)");
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "vk-")), page = path.join(dir, "draw.html");
  fs.writeFileSync(page, `<!doctype html><pre id="out"></pre><script>
const jobs = ${JSON.stringify(jobs)}, out = {};
for (const j of jobs) {
  const c = document.createElement("canvas"); c.width = c.height = j.size;
  const x = c.getContext("2d"), u = j.size / 100; x.scale(u, u);
  const tile = new Path2D(); j.g.rx ? tile.roundRect(0, 0, 100, 100, j.g.rx) : tile.rect(0, 0, 100, 100);
  x.fillStyle = j.g.bg; x.fill(tile);
  for (const l of j.g.layers) { x.save(); if (l.clip) x.clip(new Path2D(l.clip)); x.fillStyle = l.fill; x.fill(new Path2D(l.d)); x.restore(); }
  out[j.name] = c.toDataURL("image/png");
}
document.getElementById("out").textContent = JSON.stringify(out);
</script>`);
  const html = execFileSync(EDGE, ["--headless=new", "--disable-gpu", "--no-first-run", "--allow-file-access-from-files",
    `--user-data-dir=${path.join(dir, "profile")}`, "--dump-dom", "file:///" + page.replace(/\\/g, "/")], { encoding: "utf8", maxBuffer: 64 << 20 });
  fs.rmSync(dir, { recursive: true, force: true });
  const json = html.match(/<pre id="out">([\s\S]*?)<\/pre>/)[1].replace(/&quot;/g, '"').replace(/&amp;/g, "&");
  return Object.fromEntries(Object.entries(JSON.parse(json)).map(([k, v]) => [k, Buffer.from(v.split(",")[1], "base64")]));
}
// an .ico that holds PNGs (every current browser reads it): a 6-byte header, a 16-byte entry per image, then the images
function ico(pngs) {
  const head = Buffer.alloc(6 + 16 * pngs.length); head.writeUInt16LE(1, 2); head.writeUInt16LE(pngs.length, 4);
  let at = head.length;
  pngs.forEach(([size, png], i) => {
    const e = 6 + 16 * i; head[e] = size % 256; head[e + 1] = size % 256; head.writeUInt16LE(1, e + 4); head.writeUInt16LE(32, e + 6);
    head.writeUInt32LE(png.length, e + 8); head.writeUInt32LE(at, e + 12); at += png.length;
  });
  return Buffer.concat([head, ...pngs.map(p => p[1])]);
}

// ---------- the site: the SVG for browsers that take one, an .ico for the rest, the phone's home-screen icon ----------
// the home-screen icon keeps a margin: phones round its corners and some crop it to a circle
const tab = drawing(true, { w: 86, h: 50 }), touch = drawing(false, { w: 70, h: 41 });
const jobs = [16, 32, 48].map(size => ({ name: `ico${size}`, size, g: tab })).concat({ name: "touch", size: 180, g: touch });
const png = rasterize(jobs);
const write = (f, data) => { fs.writeFileSync(f, data); console.log(`  ${path.relative(root, f).padEnd(40)} ${(data.length / 1024).toFixed(1)} KB`); };
write(path.join(root, "assets/favicon.svg"), svg(tab));
write(path.join(root, "assets/favicon.ico"), ico([16, 32, 48].map(s => [s, png[`ico${s}`]])));
write(path.join(root, "assets/apple-touch-icon.png"), png.touch);
