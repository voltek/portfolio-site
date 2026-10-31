// Helpers every page renderer shares: escaping, the **…** highlight, computed values marked for the browser to
// recompute (data-calc), the SEO head and the small data set the browser needs for that recomputation.
const C = require("../../lib/calc.js");
const IMG = require("../../lib/images.js");

const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
// **…** → the page's highlight (Plain: <em>)
const md = (s, tag = "em") => s.replace(/\*\*(.+?)\*\*/g, `<${tag}>$1</${tag}>`);

// The context of one build: the data, the build day and what is computed once from both.
const context = (data, now) => ({ data, now, careerYears: C.careerYears(data, now) });

// is this place (or employer) still running? Only then can its length change after the build.
const open = (data, id) => {
  const w = data.work.find(x => x.id === id) || data.employers[id];
  return w.end == null;
};
const lapseOf = (ctx, id) => {
  const w = ctx.data.work.find(x => x.id === id) || ctx.data.employers[id];
  return C.lapse(w.start, w.end, ctx.now);
};

// A computed value as HTML: the build-day value, marked so live.js recomputes it on the reading day.
// Values that can no longer change (a finished place) go out as plain text.
const calc = {
  career: ctx => `<span data-calc="career">${ctx.careerYears}</span>`,
  lapse: (ctx, id) => open(ctx.data, id) ? `<span data-calc="lapse" data-id="${id}">${lapseOf(ctx, id)}</span>` : lapseOf(ctx, id),
  skill: (ctx, i) => {
    const s = ctx.data.skills[i], span = C.skillSpan(s, ctx.data, ctx.now);
    const live = s.len !== false && s.at.some(r => typeof r === "object" ? r.end === undefined && open(ctx.data, r.id) : open(ctx.data, r));
    return live ? `<span data-calc="skill" data-i="${i}">${span}</span>` : span;
  }
};

// A text from the data as HTML: escaped, highlighted, its templates filled. `id` is the entry {lapse} refers to,
// `counts` and `updated` feed {count:key}, {countsDate} and {updated} (facts, never recomputed).
const text = (ctx, s, { id, counts, updated, tag } = {}) => md(esc(s), tag)
  .replace(/\{careerYears\}/g, () => calc.career(ctx))
  .replace(/\{lapse\}/g, () => calc.lapse(ctx, id))
  .replace(/\{(countsDate|updated|count:\w+)\}/g, m => C.fill(m, { counts, updated }));

// What live.js needs to recompute the marked values: places, employers and skills, without any copy.
// year: the build year (the last column of a year grid), so the browser knows how many years to add.
const calcData = (data, year) => JSON.stringify({
  year,
  work: data.work.map(({ id, type, name, start, end, employer }) => ({ id, type, name, start, end, employer })),
  employers: Object.fromEntries(Object.entries(data.employers).map(([k, { name, start, end }]) => [k, { name, start, end }])),
  skills: data.skills.map(({ name, at, len }) => ({ name, at, len }))
}).replace(/</g, "\\u003c");

// <title>, description, canonical, share previews (Open Graph) and the JSON-LD Person, for the page at `file`.
// A case study passes its own description (its lede), type "article" and no Person: the Person lives on the landing.
const head = (ctx, { title, file, themeColor, desc: own, type = "profile", person: withPerson = true }) => {
  const p = ctx.data.profile, site = p.links.site, url = site + (file === "index.html" ? "" : file);
  const desc = own || C.fill(ctx.data.copy.page.description, { careerYears: ctx.careerYears });
  const image = site + "assets/og.png";
  const person = {
    "@context": "https://schema.org", "@type": "Person",
    name: p.name, alternateName: p.alternateName, jobTitle: p.title.en, url: site,
    image: site + IMG.copiesOf(p.photo.src).full, email: `mailto:${p.email}`,
    sameAs: [p.links.linkedin, p.links.github], knowsAbout: p.stack
  };
  return [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(desc)}">`,
    `<link rel="canonical" href="${url}">`,
    ...Object.entries(themeColor).map(([scheme, c]) => `<meta name="theme-color" content="${c}" media="(prefers-color-scheme: ${scheme})">`),
    `<meta property="og:type" content="${type}">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(desc)}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${image}">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta property="og:image:alt" content="${esc(`${p.name} · ${p.title.en}`)}">`,
    `<meta property="og:locale" content="en_US">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    withPerson ? `<script type="application/ld+json">${JSON.stringify(person).replace(/</g, "\\u003c")}</script>` : ""
  ].filter(Boolean).join("\n");
};

// Fills a template: {{a.b.c}} is a value of the data, escaped; {{@name}} is HTML from the page renderer.
// Anything left unresolved stops the build.
// {{>name}} first: a piece shared by several pages, src/partials/name as is (DESIGN.md, the Bar Menu Rule)
const partials = tpl => tpl.replace(/\{\{>([\w.-]+)\}\}/g, (m, name) => require("fs").readFileSync(require("path").join(__dirname, "..", "..", "src", "partials", name), "utf8"));
const fillTemplate = (tpl, data, parts, file) => partials(tpl).replace(/\{\{(@?)([\w.]+)\}\}/g, (m, raw, key) => {
  if (raw) {
    if (!(key in parts)) throw new Error(`${file}: no renderer for {{@${key}}}`);
    return parts[key];
  }
  const v = key.split(".").reduce((o, k) => o == null ? o : o[k], data);
  if (typeof v !== "string") throw new Error(`${file}: {{${key}}} is not a text in the data`);
  return esc(v);
});

// An image from the data as its light WebP copies (tools/images.js): `size` is how wide it shows, in CSS px, or a
// sizes value when that changes with the screen ("(max-width: 900px) 30vw, 160px"), so the browser picks the 240 or
// 480 copy for the screen. The original is never loaded.
const srcset = (src, size) => {
  const c = IMG.copiesOf(src);
  return `src="${esc(c[240])}" srcset="${IMG.SIZES.map(w => `${esc(c[w])} ${w}w`).join(", ")}" sizes="${typeof size === "number" ? `${size}px` : size}"`;
};

// "Open to work · Mexico City (UTC−6) · …": it breaks between its phrases, never inside one. After the time zone goes
// an empty, hidden clock phrase that live.js fills with the local time (the build's time would be wrong by reading time).
const status = p => { const phrases = p.status.split(" · ");
  const clock = p.timeZone ? ` <span class="clock" data-tz="${esc(p.timeZone)}" hidden><time></time> ·</span>` : "";
  return phrases.map((s, i) => `<span>${esc(s).replace(/(\(UTC[^)]*\))/, '<span class="tz">$1</span>')}${i < phrases.length - 1 ? " ·" : ""}</span>${/\(UTC/.test(s) && i < phrases.length - 1 ? clock : ""}`).join(" "); };

// Icons more than one page draws
const ICON = {
  check: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 13l5 5L20 6" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  github: `<svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M8 0a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38v-1.33c-2.23.48-2.7-1.07-2.7-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.06-.49.06-.49.8.06 1.23.83 1.23.83.71 1.22 1.87.87 2.33.66.07-.52.28-.87.5-1.07-1.78-.2-3.65-.89-3.65-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 8 0z"/></svg>`,
  doc: `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 2h7l4 4v12H5z M12 2v4h4 M8 10h5M8 13.5h5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/></svg>`
};

module.exports = { C, esc, md, context, open, lapseOf, calc, text, calcData, head, fillTemplate, srcset, status, ICON };
