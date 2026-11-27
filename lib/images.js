// The image copies' names and weight budgets, shared by tools/images.js (makes them), tools/check-data.js (checks them)
// and the page renderers (load them). Build-time only: the browser never loads this file.

// small copies' widths (srcset picks 240 on 1x screens, 480 on 2x) and the full copy's widest
const SIZES = [240, 480], FULL = 1080;
// a large image (the cut-out: up to 800 px wide in Quick's hero, so 1600 on a 2x screen) gets sharper copies instead:
// 480 and 960 for phones, and the full one at the original's own width, at most LARGE.full, all at LARGE.quality.
// A 1080 copy at 0.72 stretched to 1600 looked soft.
const LARGE = { sizes: [480, 960], full: 1600, quality: 0.82 };
// what each copy may weigh, in KB: over it, check-data warns (DATA.md → New app screenshots)
const BUDGET = { 240: 20, 480: 50, 960: 100, full: 120, largeFull: 180 };

// assets/x/name.png → { 240: "assets/x/name-240.webp", 480: …, full: "assets/x/name.webp" } (a large one: 480, 960, full)
const copiesOf = (src, large) => {
  const base = src.replace(/\.(png|jpe?g)$/i, "");
  return { ...Object.fromEntries((large ? LARGE.sizes : SIZES).map(w => [w, `${base}-${w}.webp`])), full: `${base}.webp` };
};
// a large image's original is a PNG (the cut-out keeps its alpha): its size, read from the PNG header
const sizeOf = src => {
  const b = require("fs").readFileSync(require("path").join(__dirname, "..", src));
  if (b.toString("latin1", 1, 4) !== "PNG") throw Error(`${src}: a large image's original must be a PNG`);
  return [b.readUInt32BE(16), b.readUInt32BE(20)];
};
// how wide and tall a large image's full copy is (srcset and the img's width and height need it): capped at LARGE.full
const fullSize = src => { const [w, h] = sizeOf(src), fw = Math.min(LARGE.full, w); return [fw, Math.round(h * fw / w)]; };

// every original the data lists, and whether it shows large: the photo, its cut-out and each project's shots
// (a missing cut-out is left for check-data to report, not crash on)
const sourcesOf = data => [{ src: data.profile.photo.src }, ...(data.profile.cutout ? [{ src: data.profile.cutout.src, large: true }] : []),
  ...data.work.flatMap(w => (w.shots || []).map(s => ({ src: s.src })))];

// which original each set of copies was made from: its SHA-1 in data/images.lock.json, written by tools/images.js.
// Content, not file dates: a fresh clone gives every file the same checkout time.
const LOCK = "data/images.lock.json";
const hashOf = file => require("crypto").createHash("sha1").update(require("fs").readFileSync(file)).digest("hex");

module.exports = { SIZES, FULL, LARGE, BUDGET, LOCK, copiesOf, fullSize, sourcesOf, hashOf };
