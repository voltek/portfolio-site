// The CV's body, one language at a time, from data/portfolio.js (its own copy is data.cv; copy deck §11). tools/cv.js prints it.
const { C, esc, skillName, skillRows, md: mark, stackLine } = require("./common.js");

const bare = u => u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
const link = (href, label = bare(href)) => `<a href="${esc(href)}">${esc(label)}</a>`;
const DOT = '<span class="sep"> · </span>';

module.exports = ({ data, now, careerYears }, lang, { phone, fullName } = {}) => {
  // a Spanish text still pending (es: null; check-data lists it) goes out in English, never as "null"
  const p = data.profile, cv = data.cv, t = o => o[lang] == null ? o.en : o[lang];
  const fill = s => C.fill(s, { careerYears });
  const md = s => mark(esc(fill(s)), "strong");
  const term = s => lang === "es" && cv.terms[s] || s;
  const month = s => s == null ? null : s.slice(0, 7);
  const when = o => `<span class="when">${C.range(month(o.start), month(o.end), lang)}</span>`;
  const bullets = list => `<ul>${list.map(b => `<li>${md(b)}</li>`).join("")}</ul>`;

  const contact = [link(`mailto:${p.email}`, p.email), phone && link(`tel:${phone.replace(/[^+\d]/g, "")}`, phone), link(p.links.linkedin), link(p.links.github), cv.siteLink && link(p.links.site)].filter(Boolean).join(DOT);
  const top = `<header class="top">
  <div>
    <h1>${esc(lang === "es" && fullName || p.name)}</h1>
    <p class="title">${esc(t(p.title))}</p>
    <p class="meta">${md(t(cv.status))}</p>
    <p class="meta">${contact}</p>
  </div>${cv.photo.includes(lang) ? `\n  <img src="${esc(p.photo.src)}" alt="">` : ""}
</header>
<p class="summary">${md(t(cv.summary))}</p>
<p class="overlap">${md(t(cv.overlap))}</p>`;

  // the pages' rows, with the CV-only skills; years only for Core, as on the pages
  const skills = skillRows(data.skills).map(([k, list]) => {
    const items = list.map(s => { const y = k === "core" && C.skillLength(s, data, now, lang);
      return `${skillName(term(s.cv || s.name))}${y ? ` <span class="yr">${y}</span>` : ""}`; });
    return `<div class="lv lv-${k}"><h3>${esc(t(cv.levels[k]))}${k === "core" ? ` <span class="lvsub">(${esc(t(cv.levels.coreNote))})</span>` : ""}</h3> <p>${items.join(", ")}</p></div>`;
  }).join("\n");

  const entry = (w, kind, sub, extra = []) => `<article class="entry ${kind}">
  <header><h3>${esc(w.name)}</h3> <span class="sub">${sub}</span> ${when(w)}</header>
  <p class="what">${md(t(w.lede || w.what))}</p>
  ${bullets([...w.highlights.map(t), ...extra])}
  <p class="stack">${esc(stackLine(w.stack.map(term)))}</p>
</article>`;
  const newest = data.work.slice().reverse();

  const projects = newest.filter(w => w.type === "project").map(w => entry(w, "own",
    `${esc(t(cv.kind.project))} · ${esc(t(cv.kind[w.status]))}${w.links && w.links.repo ? DOT + link(w.links.repo) : ""}`,
    (w.proof || []).filter(r => r.es).map(r => lang === "es" ? r.es : r).map(r => C.fill(`**${r.label}**: ${r.note}`, { careerYears, pin: w.pin, updated: w.learningPath && w.learningPath.updated }))));

  // newest first; an employer's clients go together under its line
  const job = w => entry(w, "client", esc(w.employer ? t(w.note) : `${t(w.studio)} · ${t(w.role)}`), (w.cv && w.cv.more || []).map(t));
  const jobs = newest.filter(w => w.type === "job"), done = new Set();
  const experience = jobs.map(w => {
    if (!w.employer) return job(w);
    if (done.has(w.employer)) return "";
    done.add(w.employer);
    const e = data.employers[w.employer];
    return `<section class="employer">
<header class="emp"><h3>${esc(e.name)}</h3> <span class="sub">${esc(t(e.role))} · ${esc(t(e.place))}</span> ${when(e)}</header>
${jobs.filter(x => x.employer === w.employer).map(job).join("\n")}
</section>`;
  });

  const ed = p.education, h = k => `<h2>${esc(t(cv.h[k]))}</h2>`;
  const body = [
    top,
    `<section>${h("skills")}<div class="skills">${skills}</div></section>`,
    `<section>${h("projects")}${projects.join("\n")}</section>`,
    `<section>${h("experience")}${experience.filter(Boolean).join("\n")}</section>`,
    `<section class="how">${h("how")}${bullets(cv.how.map(t))}</section>`,
    `<div class="last"><section>${h("education")}<p>${esc(t(ed.degree))} · ${esc(ed.school)} · ${ed.start}–${ed.end}</p></section>`,
    `<section>${h("languages")}<p>${p.languages.map(l => `${esc(t(l.name))}, ${esc(t(l.level))}`).join(" · ")}</p></section></div>`
  ].join("\n");
  return { body, lang };
};
