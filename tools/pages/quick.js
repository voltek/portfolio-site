// Quick (index.html): the parts of src/quick.html that come from the data. Each key fills a {{@key}} of the template.
const { C, en, esc, skillName, skillRows, calc, matrix, text, calcData, stackHtml, head, srcset, status, ICON, cvMenu, pathCount } = require("./common.js");

module.exports = ctx => {
  const { data, now } = ctx, cp = data.copy, p = data.profile;
  const live = data.work.find(w => w.status === "in-progress"); // "Now building"; none = the box is not drawn
  const quickShot = live && (live.shots || []).find(s => s.on.includes("quick"));

  const STATUS = { "in-progress": [cp.experience.kind["in-progress"], "var(--wip)"], completed: [cp.experience.kind.completed, "var(--done)"] };
  const chip = s => `<span class="chip"><i style="background:${STATUS[s][1]}" aria-hidden="true"></i>${esc(STATUS[s][0])}</span>`;
  const links = l => `<div class="links">${l.caseStudy ? `<a class="tlink" href="${esc(l.caseStudy)}">${ICON.doc}${esc(cp.experience.links.caseStudy)}</a>` : ""}<a class="tlink" href="${esc(l.repo)}">${ICON.github}${esc(cp.experience.links.repo)}</a></div>`;

  // in Now building the case study is the main way on (a button); the repo stays a text link
  const nowLinks = l => `<div class="links">${l.caseStudy ? `<a class="btn go sm" href="${esc(l.caseStudy)}">${ICON.doc}${esc(cp.experience.links.caseStudy)}</a>` : ""}<a class="tlink" href="${esc(l.repo)}">${ICON.github}${esc(cp.experience.links.repo)}</a></div>`;

  // the sections in the bar, in page order; Now building leaves with the build in progress
  const SECTIONS = ["now", "skills", "experience", "contact"];
  const nav = SECTIONS.map((id, i) => [id, cp.nav.quick[i]]).filter(([id]) => live || id !== "now")
    .map(([id, label]) => `<a href="#${id}">${esc(label)}</a>`).join("");

  // hero: the name around the portrait; the status breaks between its phrases, never inside one
  const [first, ...rest] = p.name.split(" ");
  const name = `<span><i>${esc(first)} <img class="portrait" ${srcset(p.photo.src, 68)} alt="${esc(p.photo.alt)}" onerror="this.replaceWith(Object.assign(document.createElement('b'),{className:'portrait',textContent:'${esc(first[0] + rest.join(" ")[0])}'}))"></i></span><span><i>${esc(rest.join(" "))}</i></span>`;

  // now building: the build in progress, its proof and its links
  const nowBox = !live ? "" : `<aside class="now" id="now" aria-labelledby="now-h"><div class="bar"><h2 id="now-h">${esc(cp.nav.quick[0])}</h2>${chip("in-progress")}</div><div class="body">
    <div class="top${quickShot ? "" : " solo"}">${quickShot ? `<div class="phone"><img ${srcset(quickShot.src, 84)} alt="${esc(quickShot.alt || "")}" onerror="this.replaceWith(Object.assign(document.createElement('span'),{textContent:'${esc(quickShot.label)}'}))"></div>` : ""}
    <div><h3>${esc(live.name)}</h3><p class="since num">${esc(cp.experience.kind.project)} · ${esc(cp.experience.since)} ${C.monthYear(live.start)}</p><p class="lede">${text(ctx, (live.lede || live.what).en)}</p></div></div>
    <ul class="proof">${(live.proof || []).filter(r => r.on.includes("quick")).map(r => `<li><b class="num">${ICON.check}<span class="sr">${esc(cp.aria.yes)}</span></b><span><strong>${esc(r.label)}</strong> <small>· ${text(ctx, r.note)}</small></span></li>`).join("")}</ul>
    ${live.source ? `<p class="src">${text(ctx, live.source, { pin: live.pin })}</p>` : ""}${nowLinks(live.links)}</div></aside>`;

  // skills: the rows of skillRows (common.js); the XML Views row has one quiet look for all (its years and places
  // are in the detail). pages: false stays off.
  const L = cp.skills.levels, groups = skillRows(data.skills.map((s, i) => ({ ...s, i })).filter(s => s.pages !== false));
  // Core's chips carry their years ("Kotlin 7+ yrs"), the same length the detail shows under the name
  const tiers = groups.map(([id, list]) => `<div class="tier t-${id}"><div class="tlabel"><h3>${esc(L[id][0])}</h3><p>${esc(L[id][1])}</p></div>
    <ul class="chips">${list.map(s => `<li class="lv-${id === "legacy" ? "era" : s.level}">${skillName(s.name)}${(len => id === "core" && len ? ` <small class="num">${len}</small>` : "")(calc.len(ctx, s.i))}</li>`).join("")}</ul></div>`).join("");

  // the detail: the place matrix. One column per place, oldest to newest: the client jobs, a gap, then the own builds.
  // A filled dot where the skill was used, a hollow one where only some of the time; a length under the name only in
  // Core, the level that promises years, as on its chips (the column heads say when for the rest). On a phone the heads become two-letter codes, spelled out in the key line above.
  const M = matrix(data), lg = cp.skills.legend;
  const gap = list => list.map((x, i) => (i === M.jobs.length ? "<b></b>" : "") + x).join("");
  const code = w => w.id.toUpperCase();
  const DOT = { on: w => w.type === "project" ? "o" : "c", part: w => w.type === "project" ? "po" : "p" };
  // the head held under the bar is the toggle and the column heads, one row; the key scrolls away with the rows' top.
  // The key and the heads are for the eye: each row tells a screen reader its places in words (M.say)
  const detailHead = `<div class="cols" aria-hidden="true">${gap(M.places.map(w => `<span${w.type === "project" ? ' class="o"' : ""}><span class="full">${esc(w.short || w.name)}<small class="num">${calc.years(ctx, w)}</small></span><span class="abbr">${code(w)}</span></span>`))}</div>`;
  const key = `<div class="mkey" aria-hidden="true"><ul class="key"><li><i class="c"></i>${esc(lg.client)}</li><li><i class="o"></i>${esc(lg.own)}</li><li><i class="p"></i>${esc(lg.part)}</li></ul>
    <p class="places">${M.places.map(w => `<span><b>${code(w)}</b> ${esc(w.short || w.name)} <span class="num">${calc.years(ctx, w)}</span></span>`).join(" · ")}</p></div>`;
  const detail = key + groups.map(([id, list]) => `<h3 class="group">${esc(L[id][0])}</h3>
    ${list.map(s => { const len = id === "core" ? calc.len(ctx, s.i) : ""; return `<div class="mrow"><div class="name"><b>${skillName(s.name)}</b>${len ? `<span class="num">${len}</span>` : ""}<span class="sr">${esc(M.say(s, lg))}</span></div>
      <div class="dots" aria-hidden="true">${gap(M.state(s).map((x, i) => `<i${x ? ` class="${DOT[x](M.places[i])}"` : ""}></i>`))}</div>
      ${s.note ? `<p class="note">${text(ctx, s.note)}</p>` : ""}</div>`; }).join("")}`).join("");

  // experience, newest first; an employer behind several places is one block: its heading with its own total, and its
  // places on one line under it (h5), each saying what it is instead of repeating the employer
  // a card with a case study carries its id: the case's "All work" lands on it (index.html#mn)
  const sub = w => w.type === "project" ? cp.experience.kind.project : (w.employer ? w.note : w.studio).en;
  // a build with a learning path and a case study counts the path's blocks and links to the case's own section on it:
  // counts stay true whichever blocks are in progress
  const pathLine = w => { const L = w.learningPath;
    if (w.status !== "in-progress" || !L || !w.links || !w.links.caseStudy) return "";
    const line = pathCount(cp, L);
    return `<p class="pathline">${esc(line)} <a class="tlink" href="${esc(w.links.caseStudy)}#path">${esc(cp.case.h.path)}</a></p>`; };
  const card = (w, h = "h4") => `<article class="job${w.type === "project" ? " own" : ""}${w.employer ? " client" : ""}"${w.links && w.links.caseStudy ? ` id="${esc(w.id)}"` : ""}><div class="when"><b class="num">${C.range(w.start, w.end)}</b><span>${calc.lapse(ctx, w.id)}</span></div>
      <div><${h}>${esc(w.name)}</${h}><p>${text(ctx, sub(w))}</p>${w.type === "project" ? chip(w.status) : ""}</div>
      <div class="what-c"><p class="what">${text(ctx, w.what.en)}</p><ul>${w.highlights.map(h => `<li>${text(ctx, h.en)}</li>`).join("")}</ul>${pathLine(w)}${w.links ? links(w.links) : ""}</div>
      <p class="tags">${stackHtml(w.stack)}</p></article>`;
  const newest = data.work.slice().reverse();
  const jobs = [[cp.experience.groups.own, newest.filter(w => w.type === "project")], [cp.experience.groups.client, newest.filter(w => w.type === "job")]]
    .filter(([, list]) => list.length).map(([h, list]) => { const seen = new Set(); return `<h3 class="group">${esc(h)}</h3>` + list.map(w => {
      if (!w.employer) return card(w);
      if (seen.has(w.employer)) return "";
      seen.add(w.employer);
      const e = data.employers[w.employer];
      return `<div class="employer"><div class="emp"><div class="when"><b class="num">${C.range(e.start, e.end)}</b></div><div class="emp-c"><h4>${esc(e.name)}</h4><p>${text(ctx, e.note, { id: w.employer, tag: "b" })}</p></div></div>
      ${list.filter(x => x.employer === w.employer).map(x => card(x, "h5")).join("")}</div>`;
    }).join(""); }).join("");

  const ed = p.education, langs = p.languages.map(l => `${esc(l.name.en)}, ${esc(l.level.en)}`).join(" · ");
  const education = `<div class="edu"><b>${esc(ed.start)}–${esc(ed.end)}</b><p>${esc(ed.degree.en)}, ${esc(ed.school)}</p></div>
    <div class="edu"><b>${esc(cp.education.languages)}</b><p>${langs}</p></div>`;

  return {
    head: head(ctx, { title: cp.page.title.quick, file: "index.html", themeColor: { light: "#1F3FBF", dark: "#1A35A3" } }),
    nav, name, status: status(p), now: nowBox, tiers, detailHead, detail, jobs, education,
    lede: text(ctx, p.lede.quick),
    stack: p.stack.map(s => `<li>${esc(s)}</li>`).join(" "),
    expIntro: text(ctx, cp.experience.intro.quick),
    githubIcon: ICON.github, cvMenu: cvMenu(ctx, "line", 2),
    matrixCols: `--jobs:${M.jobs.length};--builds:${M.builds.length}`,
    calcData: calcData(data, now.getUTCFullYear())
  };
};
