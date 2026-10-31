// Plain (index.html): the parts of src/plain.html that come from the data. Each key fills a {{@key}} of the template.
const { C, esc, calc, text, calcData, head, srcset, status, ICON } = require("./common.js");

module.exports = ctx => {
  const { data, now } = ctx, cp = data.copy, p = data.profile;
  const byId = id => data.work.find(w => w.id === id);
  const live = data.work.find(w => w.status === "in-progress"); // "Now building"; none = the box and "Next" are not drawn
  const plainShot = live && (live.shots || []).find(s => s.on.includes("plain"));
  const path = live && live.learningPath, road = live && live.roadmap;

  const STATUS = {
    done: [cp.path.status.done, "var(--done)"], "in-progress": [cp.experience.kind["in-progress"], "var(--wip)"],
    completed: [cp.experience.kind.completed, "var(--done)"], now: [cp.path.status.now, "var(--wip)"],
    next: [cp.path.status.next, "var(--client)"], goal: [cp.path.status.goal, "var(--own)"]
  };
  const chip = s => `<span class="chip"><i style="background:${STATUS[s][1]}" aria-hidden="true"></i>${esc(STATUS[s][0])}</span>`;
  const links = l => `<div class="links">${l.caseStudy ? `<a class="tlink" href="${esc(l.caseStudy)}">${ICON.doc}${esc(cp.experience.links.caseStudy)}</a>` : ""}<a class="tlink" href="${esc(l.repo)}">${ICON.github}${esc(cp.experience.links.repo)}</a></div>`;

  // in Now building the case study is the main way on (a button); the repo stays a text link
  const nowLinks = l => `<div class="links">${l.caseStudy ? `<a class="btn go sm" href="${esc(l.caseStudy)}">${ICON.doc}${esc(cp.experience.links.caseStudy)}</a>` : ""}<a class="tlink" href="${esc(l.repo)}">${ICON.github}${esc(cp.experience.links.repo)}</a></div>`;

  // the sections in the bar, in page order; the two that hang on a build in progress leave with it
  const SECTIONS = ["now", "skills", "experience", "next", "contact"];
  const nav = SECTIONS.map((id, i) => [id, cp.nav.plain[i]]).filter(([id]) => live || (id !== "now" && id !== "next"))
    .map(([id, label]) => `<a href="#${id}">${esc(label)}</a>`).join("");

  // hero: the name around the portrait; the status breaks between its phrases, never inside one
  const [first, ...rest] = p.name.split(" ");
  const name = `<span><i>${esc(first)} <img class="portrait" ${srcset(p.photo.src, 68)} alt="${esc(p.photo.alt)}" onerror="this.replaceWith(Object.assign(document.createElement('b'),{className:'portrait',textContent:'${esc(first[0] + rest.join(" ")[0])}'}))"></i></span><span><i>${esc(rest.join(" "))}</i></span>`;

  // now building: the build in progress, its proof and its links
  const nowBox = !live ? "" : `<aside class="now" id="now" aria-labelledby="now-h"><div class="bar"><h2 id="now-h">${esc(cp.nav.plain[0])}</h2>${chip("in-progress")}</div><div class="body">
    <div class="top${plainShot ? "" : " solo"}">${plainShot ? `<div class="phone"><img ${srcset(plainShot.src, 84)} alt="${esc(plainShot.alt || "")}" onerror="this.replaceWith(Object.assign(document.createElement('span'),{textContent:'${esc(plainShot.label)}'}))"></div>` : ""}
    <div><h3>${esc(live.name)}</h3><p class="since num">${esc(cp.experience.kind.project)} · ${esc(cp.experience.since)} ${C.monthYear(live.start)}</p><p class="lede">${text(ctx, (live.lede || live.what).en)}</p></div></div>
    <ul class="proof">${(live.proof || []).filter(r => r.on.includes("plain")).map(r => `<li><b class="num">${r.check ? `${ICON.check}<span class="sr">${esc(cp.aria.yes)}</span>` : live.counts[r.count]}</b><span><strong>${esc(r.label)}</strong> <small>· ${text(ctx, r.note, { counts: live.counts })}</small></span></li>`).join("")}</ul>
    ${live.source ? `<p class="src">${text(ctx, live.source, { counts: live.counts })}</p>` : ""}${nowLinks(live.links)}</div></aside>`;

  // skills: by level (an empty level leaves no row), then the View-based apps row, one quiet look for all (its years
  // and places are in the detail). Within a level, AI skills first, then the data's order; pages: false stays off.
  const LV = ["core", "strong", "familiar"], L = cp.skills.levels;
  const indexed = data.skills.map((s, i) => ({ ...s, i }));
  const shown = indexed.filter(s => s.pages !== false);
  const byLevel = lv => shown.filter(s => !s.legacy && s.level === lv).sort((a, b) => !!b.ai - !!a.ai);
  const groups = [...LV.map(lv => [lv, byLevel(lv)]), ["legacy", shown.filter(s => s.legacy)]].filter(([, list]) => list.length);
  const tiers = groups.map(([id, list]) => `<div class="tier t-${id}"><div class="tlabel"><h3>${esc(L[id][0])}</h3><p>${esc(L[id][1])}</p></div>
    <ul class="chips">${list.map(s => `<li class="lv-${id === "legacy" ? "era" : s.level}">${esc(s.name)}</li>`).join("")}</ul></div>`).join("");

  // the detail: one small cell per year, filled where the skill was used (own builds, client work or both)
  const Y0 = Math.min(...data.work.map(w => C.parse(w.start).getUTCFullYear())), Y1 = now.getUTCFullYear();
  const YEARS = Array.from({ length: Y1 - Y0 + 1 }, (_, i) => Y0 + i);
  const ranges = s => s.at.map(r => { const ref = typeof r === "string" ? { id: r } : r, w = byId(ref.id);
    return { w, from: C.parse(ref.start || w.start), to: (e => e == null ? now : C.parse(e))(ref.end !== undefined ? ref.end : w.end) }; });
  const cell = (s, y) => { const a = C.parse(`${y}`), b = C.parse(`${y + 1}`), hit = ranges(s).filter(r => r.from < b && r.to > a);
    const own = hit.some(r => r.w.type === "project"), client = hit.some(r => r.w.type === "job");
    return `<i class="${own && client ? "oc" : own ? "o" : client ? "c" : ""}"${hit.length ? ` title="${y}: ${esc(hit.map(r => r.w.name).join(", "))}"` : ""}></i>`; };
  const where = s => [...new Set(s.at.map(r => typeof r === "string" ? r : r.id))].map(id => byId(id))
    .map(w => w.type === "project" ? `<b>${esc(w.name)}</b>` : esc(w.name)).join(" · ");
  // the detail's head (key and year axis) stays under the bar while the rows scroll; the rows carry no axis of their own
  const detailHead = `<ul class="key"><li><i style="background:var(--own)"></i>${esc(cp.skills.legend.own)}</li><li><i style="background:var(--client)"></i>${esc(cp.skills.legend.client)}</li></ul>
    <div class="years lbl num" data-years aria-hidden="true" style="--n:${YEARS.length}">${YEARS.map(y => `<span>’${String(y % 100).padStart(2, "0")}</span>`).join("")}</div>`;
  const detail = groups.map(([id, list]) => `<h3 class="group">${esc(L[id][0])}</h3>
    ${list.map(s => `<div class="srow"><div class="name"><b>${esc(s.name)}</b><span class="num">${calc.skill(ctx, s.i)}</span></div>
      <div class="years" data-years="${s.i}" style="--n:${YEARS.length}" aria-hidden="true">${YEARS.map(y => cell(s, y)).join("")}</div>
      <p class="where">${where(s)}${s.note ? `<small>${text(ctx, s.note, { counts: (data.work.find(w => w.counts) || {}).counts })}</small>` : ""}</p></div>`).join("")}`).join("");

  // experience, newest first; an employer behind several places gets one heading with its own total
  // a card with a case study carries its id: the case's "All work" lands on it (index.html#mn)
  const card = w => `<article class="job${w.type === "project" ? " own" : ""}"${w.links && w.links.caseStudy ? ` id="${esc(w.id)}"` : ""}><div class="when"><b class="num">${C.range(w.start, w.end)}</b><span>${calc.lapse(ctx, w.id)}</span></div>
      <div><h4>${esc(w.name)}</h4><p>${esc(w.type === "project" ? cp.experience.kind.project : w.studio.en)}</p>${w.type === "project" ? chip(w.status) : ""}</div>
      <div class="what-c"><p class="what">${text(ctx, w.what.en)}</p><ul>${w.highlights.map(h => `<li>${text(ctx, h.en)}</li>`).join("")}</ul>${w.links ? links(w.links) : ""}</div>
      <p class="tags">${esc(w.stack.join(" · "))}</p></article>`;
  const newest = data.work.slice().reverse(), seen = new Set();
  const jobs = [[cp.experience.groups.own, newest.filter(w => w.type === "project")], [cp.experience.groups.client, newest.filter(w => w.type === "job")]]
    .filter(([, list]) => list.length).map(([h, list]) => `<h3 class="group">${esc(h)}</h3>` + list.map(w => {
      let emp = "";
      if (w.employer && !seen.has(w.employer)) { seen.add(w.employer); const e = data.employers[w.employer];
        emp = `<div class="emp"><b class="num">${C.range(e.start, e.end)}</b><div><h4>${esc(e.name)}</h4><p>${text(ctx, e.note, { id: w.employer })}</p></div></div>`; }
      return emp + card(w);
    }).join("")).join("");

  const ed = p.education, langs = p.languages.map(l => `${esc(l.name.en)}, ${esc(l.level.en)}`).join(" · ");
  const education = `<div class="edu"><b>${esc(ed.start)}–${esc(ed.end)}</b><p>${esc(ed.degree.en)}, ${esc(ed.school)}</p></div>
    <div class="edu"><b>${esc(cp.education.languages)}</b><p>${langs}</p></div>`;

  // what comes next: the app's roadmap and the learning path behind its harness
  const next = !live || !(road || path) ? "" : `<section class="page" id="next" aria-labelledby="next-h">
  <div class="wrap">
    <div class="head"><h2 id="next-h">${esc(cp.next.heading.plain)}</h2><p>${text(ctx, cp.next.intro)}${path ? ` ${text(ctx, cp.path.updated, { updated: path.updated })}.` : ""}</p></div>
    <div class="next">${road ? `<div><h3 class="group">${esc(cp.next.groups.app)}</h3><ol class="steps">${[...road.steps, [road.goal, "goal"]].map(([t, s]) =>
      `<li class="s-${s}"><span class="mark">${s === "done" ? ICON.check : ""}</span><b>${esc(t)}</b><small>${esc(STATUS[s][0])}</small></li>`).join("")}</ol></div>` : ""}
    ${path ? `<div><h3 class="group">${esc(cp.next.groups.path)}</h3><ol class="blocks">${path.blocks.map(b =>
      `<li><span class="tag">${esc(b.tag)}</span><div><b>${esc(b.title)}</b><p>${esc(b.note)}</p></div><span class="st"><i style="background:${STATUS[b.status][1]}" aria-hidden="true"></i>${esc(STATUS[b.status][0])}</span></li>`).join("")}</ol>
      <p class="note">${text(ctx, path.intro)}</p></div>` : ""}</div>
  </div>
</section>`;

  return {
    head: head(ctx, { title: cp.page.title.plain, file: "index.html", themeColor: { light: "#1F3FBF", dark: "#1A35A3" } }),
    nav, name, status: status(p), now: nowBox, tiers, detailHead, detail, jobs, education, next,
    lede: text(ctx, p.lede.plain),
    stack: p.stack.map(s => `<li>${esc(s)}</li>`).join(" "),
    expIntro: text(ctx, cp.experience.intro.plain),
    githubIcon: ICON.github,
    calcData: calcData(data, Y1)
  };
};
