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
    skill: el => C.skillSpan(D.skills[el.dataset.i], D, now),
    year: () => Math.max(Y1, D.year),
    years: el => C.yearSpan(el.dataset.ids.split(",").map(find), now),
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

  // Show's skills timeline (data-tl): bars sit in years along an axis, and a running one ends at --now. The reading
  // day moves --now; a new year widens the axis and adds its column to the axis labels and to every track.
  const tl = document.querySelector("[data-tl]");
  if (tl) {
    tl.style.setProperty("--now", C.decimal(now).toFixed(4));
    const x0 = parseFloat(tl.style.getPropertyValue("--x0")), x1 = parseFloat(tl.style.getPropertyValue("--x1"));
    if (Y1 + 1 > x1) {
      const y0 = Math.floor(x0);
      tl.style.setProperty("--x1", Y1 + 1);
      tl.style.setProperty("--cols", `${(y0 + 1 - x0).toFixed(3)}fr repeat(${Y1 - y0},1fr)`);
      for (let y = x1; y <= Y1; y++) {
        tl.querySelectorAll(".taxis ol").forEach(ol => ol.insertAdjacentHTML("beforeend", `<li>’${String(y % 100).padStart(2, "0")}</li>`));
        tl.querySelectorAll(".track").forEach(t => t.querySelector(":scope > i:last-of-type").insertAdjacentHTML("afterend", "<i></i>"));
      }
    }
  }

  // Year grids (data-years): one column per year up to the reading day. The build drew them up to its own year, so a
  // new year adds its column; a row with a skill index fills it where that skill was used.
  if (Y1 <= D.year) return;
  const ranges = s => s.at.map(r => {
    const ref = typeof r === "string" ? { id: r } : r, w = find(ref.id), end = ref.end !== undefined ? ref.end : w.end;
    return { w, from: C.parse(ref.start || w.start), to: end == null ? now : C.parse(end) };
  });
  document.querySelectorAll("[data-years]").forEach(row => {
    const s = row.dataset.years === "" ? null : D.skills[row.dataset.years];
    for (let y = D.year + 1; y <= Y1; y++) {
      if (!s) { row.insertAdjacentHTML("beforeend", `<span>’${String(y % 100).padStart(2, "0")}</span>`); continue; }
      const a = C.parse(`${y}`), b = C.parse(`${y + 1}`), hit = ranges(s).filter(r => r.from < b && r.to > a);
      const own = hit.some(r => r.w.type === "project"), client = hit.some(r => r.w.type === "job");
      const cell = document.createElement("i");
      cell.className = own && client ? "oc" : own ? "o" : client ? "c" : "";
      if (hit.length) cell.title = `${y}: ${hit.map(r => r.w.name).join(", ")}`;
      row.append(cell);
    }
    row.style.setProperty("--n", row.children.length);
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
