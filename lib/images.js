// The image copies' names and weight budgets, shared by tools/images.js (makes them), tools/check-data.js (checks them)
// and the page renderers (load them). Build-time only: the browser never loads this file.

// small copies' widths (srcset picks 240 on 1x screens, 480 on 2x) and the full copy's widest
const SIZES = [240, 480], FULL = 1080;
// what each copy may weigh, in KB: over it, check-data warns (DATA.md → New app screenshots)
const BUDGET = { 240: 20, 480: 50, full: 120 };

// assets/x/name.png → { 240: "assets/x/name-240.webp", 480: …, full: "assets/x/name.webp" }
const copiesOf = src => {
  const base = src.replace(/\.(png|jpe?g)$/i, "");
  return { ...Object.fromEntries(SIZES.map(w => [w, `${base}-${w}.webp`])), full: `${base}.webp` };
};

// every original the data lists: the photo and each project's shots
const sourcesOf = data => [data.profile.photo.src, ...data.work.flatMap(w => (w.shots || []).map(s => s.src))];

module.exports = { SIZES, FULL, BUDGET, copiesOf, sourcesOf };
