// The pages arrive filled with the values of the build day (for search engines, share previews and readers without JS).
// This recomputes, against the day someone actually reads the page, every value the build marked with data-calc,
// with the same functions the build used (lib/calc.js, loaded before this file). ?today=2027-09-15 previews another day.
(() => {
  const src = document.getElementById("calc-data");
  if (!src || !window.CALC) return;
  const C = window.CALC, D = JSON.parse(src.textContent), now = C.today(), Y1 = now.getUTCFullYear();
  const find = id => D.work.find(w => w.id === id) || D.employers[id];

  const parts = el => { const w = find(el.dataset.id); return C.lapseParts(w.start, w.end, now); };
  const value = {
    career: () => C.careerYears(D, now),
    // data-about: Show's words for screen readers ("about 4 months" instead of "≈ 4 months")
    lapse: el => { const w = find(el.dataset.id), v = C.lapse(w.start, w.end, now); return el.dataset.about ? v.replace("≈", el.dataset.about) : v; },
    "skill-len": el => C.skillLength(D.skills[el.dataset.i], D, now),
    year: () => Math.max(Y1, D.year),
    years: el => C.yearSpan(el.dataset.ids.split(",").map(find), now),
    "years-short": el => C.yearSpanShort(el.dataset.ids.split(",").map(find), now),
    // Show's sticker: "≈4.5" (a half sets smaller) over "months"
    dur: el => { const n = parts(el).n; el.classList.toggle("half", n % 1 > 0); return `≈${n}`; },
    "dur-unit": el => parts(el).unit
  };
  document.querySelectorAll("[data-calc]").forEach(el => {
    const f = value[el.dataset.calc];
    if (!f) return;
    const v = String(f(el));
    if (el.textContent !== v) el.textContent = v;
  });
})();

// The hero pill: once it wraps, CSS keeps it as wide as the row while its lines are shorter, so it is fitted to its
// longest line. Layout offsets, not screen boxes: Show's pill is rotated.
const fitPills = () => document.querySelectorAll(".status .t, .onair .t").forEach(t => {
  t.style.width = "";
  const phrases = [...t.children].filter(s => !s.hidden);
  if (new Set(phrases.map(s => s.offsetTop)).size < 2) return; // one line already hugs its text
  // +1: offsets are rounded to whole pixels, and a line a fraction too narrow would push its last phrase down
  t.style.width = Math.max(...phrases.map(s => s.offsetLeft + s.offsetWidth)) - t.offsetLeft + 1 + "px";
});
let fitQueued = false;
addEventListener("resize", () => { if (!fitQueued) { fitQueued = true; requestAnimationFrame(() => { fitQueued = false; fitPills(); }); } });
// the web fonts change the widths: fit again once they arrive (fonts.ready alone can settle before they start loading)
addEventListener("load", fitPills);
if (document.fonts) { document.fonts.ready.then(fitPills); document.fonts.addEventListener("loadingdone", fitPills); }

// The hero's live clock: Alan's local time in the reader's own format (4:12 PM or 16:12), on each new minute. It shows
// only once filled, and it is not a live region, so a screen reader reads it when it gets there, not every minute.
document.querySelectorAll(".clock[data-tz]").forEach(el => {
  const time = el.querySelector("time");
  try {
    const f = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit", timeZone: el.dataset.tz });
    const tick = () => { time.textContent = f.format(new Date()); fitPills(); setTimeout(tick, 60000 - Date.now() % 60000); };
    el.hidden = false; tick();
  } catch (e) {} // an unknown time zone leaves the pill as built
});
fitPills();
