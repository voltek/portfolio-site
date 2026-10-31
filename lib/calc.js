// Everything on the pages that depends on dates is computed here, never written by hand: lengths ("≈ 4 months"),
// career years ("10+"), years per skill ("since 2015 · 10+ yrs"), episode numbers and date ranges.
// The same file runs in Node (the build fills the HTML with the values of the build day) and in the browser (a small
// script recomputes them against the day someone reads the page). Rules: _private/sources/copy-deck.md, section 9.
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.CALC = factory();
})(typeof self !== "undefined" ? self : this, function () {
  const MONTHS = {
    en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]
  };
  const PRESENT = { en: "Present", es: "Actualidad" };

  // "2015", "2015-08" or "2015-08-21" → a Date at noon UTC. A month alone means its first day, for a start and for an
  // end alike: "Aug 2020 – Feb 2026" counts from Aug 1 to Feb 1, so back-to-back jobs neither overlap nor leave a gap.
  // null (an end) means ongoing; today stands in for it.
  const parse = s => {
    const m = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/.exec(String(s));
    if (!m) throw new Error(`not a date: ${s}`);
    return new Date(Date.UTC(+m[1], m[2] ? m[2] - 1 : 0, m[3] ? +m[3] : 1, 12));
  };
  const end = (s, today) => s == null ? today : parse(s);
  const precision = s => String(s).split("-").length; // 1 year · 2 month · 3 day
  // months between two days, counted on the calendar (Aug 1 → Feb 1 is exactly 6), so whole months never pick up a
  // rounding error; leftover days count as a fraction of an average month
  const months = (a, b) => (b.getUTCFullYear() - a.getUTCFullYear()) * 12 + b.getUTCMonth() - a.getUTCMonth() + (b.getUTCDate() - a.getUTCDate()) / 30.436875;

  // the reading day: ?today=2027-09-15 in the address previews how the page ages (prototype aid, harmless live)
  const today = () => {
    const q = typeof location !== "undefined" && new URLSearchParams(location.search).get("today");
    return q ? parse(q) : new Date();
  };

  // A length on the pages: rounded up to the next half (1.1 → 1.5, 3.6 → 4), months below a year, years from 12
  // months up. An honest approximation; the exact dates live in the CV.
  const half = x => Math.max(.5, Math.ceil(x * 2) / 2);
  // its parts, for Show's sticker ("≈4.5" over "months"): { n: 4.5, unit: "months" }
  const lapseParts = (start, finish, now = today()) => {
    const m = months(parse(start), end(finish, now)), v = half(m);
    if (v < 12) return { n: v, unit: v <= 1 ? "month" : "months" };
    const y = half(m / 12);
    return { n: y, unit: y <= 1 ? "year" : "years" };
  };
  const lapse = (start, finish, now = today()) => { const p = lapseParts(start, finish, now); return `≈ ${p.n} ${p.unit}`; };

  // A day as a decimal year (Jul 15, 2026 → 2026.535), for Show's skills timeline, which places bars along the years.
  const decimal = d => { const y = d.getUTCFullYear(), m = d.getUTCMonth(), days = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
    return y + (m + (d.getUTCDate() - 1) / days) / 12; };
  // the calendar years a set of places covers: "2020", "2020–2026" (an open one reaches the reading year)
  const yearSpan = (places, now = today()) => {
    const a = Math.min(...places.map(p => parse(p.start).getUTCFullYear()));
    const b = Math.max(...places.map(p => end(p.end, now).getUTCFullYear()));
    return a === b ? `${a}` : `${a}–${b}`;
  };

  // "N+ years" of career: whole years from the first client job to the end of the last one (its employer's end when it
  // has one), or today while a client job is ongoing. A finished job stops adding.
  const careerYears = (data, now = today()) => {
    const jobs = data.work.filter(w => w.type === "job");
    const from = Math.min(...jobs.map(j => parse(j.start)));
    const to = Math.max(...jobs.map(j => {
      const emp = j.employer && data.employers[j.employer];
      return emp && emp.end !== undefined ? end(emp.end, now) : end(j.end, now);
    }));
    return Math.floor(months(new Date(from), new Date(to)) / 12);
  };

  // Episodes: jobs and projects together, oldest first; the number grows with every new one.
  const episodes = data => data.work.slice().sort((a, b) => parse(a.start) - parse(b.start));
  const episode = (data, id) => episodes(data).findIndex(w => w.id === id) + 1;

  // Dates as text. range() serves the Show tooltip and the CV: an open end says "Present", never the day of reading,
  // and a place inside a single month shows that month alone.
  const monthYear = (s, lang = "en") => { const d = parse(s); return `${MONTHS[lang][d.getUTCMonth()]} ${d.getUTCFullYear()}`; };
  const range = (start, finish, lang = "en") => {
    const a = monthYear(start, lang), b = finish == null ? PRESENT[lang] : monthYear(finish, lang);
    return a === b ? a : `${a} – ${b}`;
  };
  // a date that is a fact, not a length ("Updated …", "Counts from …"): it never moves with the reading day
  const factDate = s => { const d = parse(s); return `${MONTHS.en[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`; };

  // Years per skill, from the places it lists in "at" (an id, or { id, start, end } to narrow one place).
  // · used years: the places merged where they overlap, summed, rounded down ("7+ yrs"; below one year "under 1 yr")
  // · when: a gap of a year or more between uses lists the stretches ("2017, 2020–2026"); otherwise "since 2015" while
  //   one place is ongoing (just the year if it started this year), or "2015–2018"
  // · len:false names the places instead ("at OpenBank, Claro Drive"), newest first
  const uses = (skill, data, now) => skill.at.map(ref => {
    const r = typeof ref === "string" ? { id: ref } : ref, w = data.work.find(x => x.id === r.id);
    if (!w) throw new Error(`${skill.name}: unknown place "${r.id}"`);
    return { w, from: parse(r.start || w.start), to: end(r.end !== undefined ? r.end : w.end, now), open: (r.end !== undefined ? r.end : w.end) == null };
  });
  const skillSpan = (skill, data, now = today()) => {
    const us = uses(skill, data, now).sort((a, b) => a.from - b.from);
    if (skill.len === false) return `at ${us.slice().reverse().map(u => u.w.name).join(", ")}`;
    // 1) overlapping places count once  2) stretches closer than a year join into one run
    const segs = [];
    for (const u of us) {
      const s = segs[segs.length - 1];
      if (s && u.from <= s.to) { s.to = new Date(Math.max(s.to, u.to)); s.open = s.open || u.open; }
      else segs.push({ from: u.from, to: u.to, open: u.open });
    }
    const runs = [];
    for (const s of segs) {
      const r = runs[runs.length - 1];
      if (r && months(r.to, s.from) < 12) { r.to = s.to; r.open = r.open || s.open; }
      else runs.push({ ...s });
    }
    const y = segs.reduce((t, s) => t + months(s.from, s.to), 0) / 12;
    const len = y < 1 ? "under 1 yr" : `${Math.floor(y)}+ ${Math.floor(y) === 1 ? "yr" : "yrs"}`;
    const yr = d => d.getUTCFullYear(), stretch = r => yr(r.from) === yr(r.to) ? `${yr(r.from)}` : `${yr(r.from)}–${yr(r.to)}`;
    let when;
    if (runs.length > 1) when = runs.map(stretch).join(", ");
    else if (runs[0].open) when = yr(runs[0].from) === yr(now) ? `${yr(now)}` : `since ${yr(runs[0].from)}`;
    else when = stretch(runs[0]);
    return `${when} · ${len}`;
  };

  // Templates in the data: {careerYears} · {lapse} (of the entry that holds the text) · {updated} (a fact date) ·
  // {count:key} and {countsDate} (the public counts of a project). Anything else is left as is, for check-data to flag.
  const fill = (text, ctx = {}) => String(text).replace(/\{(careerYears|lapse|countsDate|updated|count:(\w+))\}/g, (m, k, key) =>
    k === "careerYears" ? ctx.careerYears
    : k === "lapse" ? ctx.lapse
    : k === "countsDate" ? ctx.counts && factDate(ctx.counts.date)
    : k === "updated" ? ctx.updated && factDate(ctx.updated)
    : ctx.counts && ctx.counts[key] != null ? ctx.counts[key] : m);

  return { parse, precision, months, today, lapse, lapseParts, decimal, yearSpan, careerYears, episodes, episode, monthYear, range, factDate, skillSpan, fill, MONTHS, PRESENT };
});
