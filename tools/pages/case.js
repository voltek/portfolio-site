// A case study (modernnotes.html, gamestack.html …): the parts of src/case.html that come from the data. One renderer
// for every case: the project's entry in data/portfolio.js gives the header, data/cases/<page>.js the body, copy.case
// the labels. A section the case file leaves out is not drawn and leaves the bar (DECISIONS.md → Case page rules).
const IMG = require("../../lib/images.js");
const { C, en, esc, text, calcData, head, srcset, ICON, cvMenu } = require("./common.js");

const I = {
  back: `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12 4l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  fwd: `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M8 4l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  code: `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7 6l-4 4 4 4M13 6l4 4-4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  play: `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7 4.5v11l9-5.5z" fill="currentColor"/></svg>`,
  x: `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>`
};

// the sections a case can have, in page order (overview is the header, always there)
const SECTIONS = ["overview", "why", "architecture", "decisions", "tests", "ai", "missing", "next"];

// a case text: escaped, `…` as code
const tx = s => esc(s).replace(/`([^`]+)`/g, "<code>$1</code>");
// a class name may break only before its role (GetNotes·UseCase, Games·Repository·Impl), never inside a word
const cw = s => esc(s).replace(/([a-z])(UseCase|ViewModel|Screen|Interceptor|Repository)(Impl)?\b/g, (m, a, role, impl) => `${a}<wbr>${role}${impl ? `<wbr>${impl}` : ""}`);
// a package breaks after its slashes
const pk = s => esc(s).replace(/\/(?=.)/g, "/<wbr>");

// "path:15–22" under roots.main, "test:path" under another root → the file at the pinned commit, and its label
const FILE = /^(?:(\w+):(?!\d+(?:–\d+)?$))?(.+?)(?::(\d+(?:–\d+)?))?$/;
// and what is not a file there: a pull request, an issue, a commit (read before FILE, which would take "209" for a line)
// a pull request or an issue is a number, a commit a hash: anything else is a typo check-data must catch
const ELSEWHERE = /^(?:(pr|issue):(\d+)|(commit):([0-9a-f]{7,40}))$/;
const GO = { pr: ["pull", "PR #"], issue: ["issues", "Issue #"], commit: ["commit", "Commit "] };
// a file whose name says little alone carries its folder; a decision record is its number; a folder is its path
const fileOf = (cs, repo, ref) => {
  const x = ref.match(ELSEWHERE);
  if (x) { const kind = x[1] || x[3], id = x[2] || x[4]; return { href: `${repo}/${GO[kind][0]}/${id}`, label: GO[kind][1] + id, out: true }; }
  const [, root = "main", p, lines] = ref.match(FILE), full = cs.roots[root] + p, dir = p.endsWith("/"), names = full.split("/");
  const href = `${repo}/${dir ? "tree" : "blob"}/${cs.pin.commit}/${full}${lines ? `#L${lines.replace("–", "-L")}` : ""}`;
  const adr = root === "adr" && p.match(/^(\d{4})-/);
  const label = dir ? p : adr ? `ADR ${adr[1]}` : names.slice(/^(README|SKILL|spec)\.md$/.test(names[names.length - 1]) ? -2 : -1).join("/");
  return { href, label: label + (lines ? ` · l.\u00a0${lines}` : "") };
};

module.exports = (cs, ctx) => {
  const { data } = ctx, cp = data.copy.case, p = data.profile;
  const w = data.work.find(x => x.id === cs.id), repo = w.links.repo, file = w.links.caseStudy;
  const f = ref => fileOf(cs, repo, ref);
  const links = (refs = []) => refs.length ? `<span class="files">${refs.map(f).map(l => `<a class="fl" href="${esc(l.href)}">${l.out ? ICON.github : I.code}<span>${esc(l.label)}</span></a>`).join("")}</span>` : "";
  const has = id => id === "overview" || cs[id] != null;
  // the line beside a section's title (decisions is a list, so its line is decisionsNote)
  const h = (id, line = id === "decisions" ? cs.decisionsNote : cs[id].intro) => `<div class="head"><h2 id="${id}-h">${esc(cp.h[id])}<a class="hash" href="#${id}" aria-label="${esc(cp.aria.hash + en(cp.h[id]))}">#</a></h2>${line ? `<p>${tx(line)}</p>` : "<span></span>"}</div>`;
  const repoLinks = `<div class="links"><a class="tlink" href="${esc(repo)}">${ICON.github}${esc(data.copy.experience.links.repo)}</a><a class="tlink" href="${esc(f(cs.readme).href)}">${ICON.doc}${esc(cp.readme)}</a></div>`;

  // the bar: the sections this case has, then Contact (outside the menu, in the template)
  const nav = SECTIONS.filter(has).map(id => `<a href="#${id}">${esc(cp.nav[id])}</a>`).join("");

  // the opening: the facts on the left, "At a glance" (the card's three highlights and the stack) on a raised sheet
  const STATUS = { completed: ["var(--done)", data.copy.experience.kind.completed], "in-progress": ["var(--wip)", data.copy.experience.kind["in-progress"]] };
  const lapse = w.end == null ? `<span data-calc="lapse" data-id="${w.id}">${C.lapse(w.start, w.end, ctx.now)}</span>` : C.lapse(w.start, w.end, ctx.now);
  const opening = `<div>
    <a class="back" id="allwork" href="index.html#${esc(w.id)}">${I.back}${esc(cp.back)}</a>
    <h1>${esc(w.name)}</h1>
    <div class="meta"><span class="chip"><i style="background:${STATUS[w.status][0]}" aria-hidden="true"></i>${esc(STATUS[w.status][1])}</span><span class="num">${C.range(w.start, w.end)} · ${lapse}</span><span>${esc(data.copy.experience.kind.project)}</span></div>
    <p class="lede">${tx(cs.lede)}</p>
    <p class="role">${tx(cs.role)}</p>
    ${repoLinks}
  </div>
  <aside class="sheet" aria-labelledby="glance-h">
    <div class="bar"><h2 id="glance-h">${esc(cp.glance)}</h2></div>
    <div class="body">
      <ul class="hl">${w.highlights.map(x => `<li>${ICON.check}<span>${text(ctx, x.en)}</span></li>`).join("")}</ul>
      <p class="stk" id="stack-h">${esc(cp.stack)}</p><ul class="facts" aria-labelledby="stack-h">${cs.stack.map(t => `<li>${esc(t)}</li>`).join("")}</ul>
    </div>
  </aside>`;

  // the strip: the screens, with the video (if any) in the middle; a tap opens the larger screen
  const shots = (w.shots || []).filter(s => s.on.includes("case"));
  const SIZES = "(max-width: 700px) min(62vw, 240px), 196px";
  const vid = cs.video ? `<figure class="it vid"><div class="phone"><video src="${esc(cs.video.src)}" poster="${esc(cs.video.poster)}" preload="none" controls muted playsinline aria-label="${esc(en(cs.video.alt))}"></video><button class="play" type="button" aria-label="${esc(en(cp.aria.play))}" hidden>${I.play}</button></div><figcaption>${esc(cp.demo)}</figcaption></figure>` : "";
  const mid = Math.floor(shots.length / 2);
  const strip = !shots.length && !cs.video ? "" : `<div class="strip" id="screens">
    <button class="sbtn prev" type="button" aria-label="${esc(cp.aria.prevScreens)}" hidden>${I.back}</button>
    <div class="track" tabindex="0" role="group" aria-label="${esc(cp.aria.screens)}">${shots.map((s, i) => `${i === mid ? vid : ""}<figure class="it"><button class="shot" type="button" data-i="${i}" aria-label="${esc(cp.aria.viewLarger + en(s.label))}"><span class="phone"><img ${srcset(s.src, SIZES)} alt="${esc(s.alt || "")}" width="240" height="539"></span></button><figcaption>${esc(s.label)}</figcaption></figure>`).join("")}${shots.length ? "" : vid}</div>
    <button class="sbtn next" type="button" aria-label="${esc(cp.aria.nextScreens)}" hidden>${I.fwd}</button>
  </div>
  ${cs.shotsFoot ? `<p class="shotnote">${tx(cs.shotsFoot)}</p>` : ""}
  ${shots.length ? `<dialog class="lb" aria-label="${esc(cp.aria.screen)}"><button class="theme lbx" type="button" aria-label="${esc(data.copy.aria.close)}">${I.x}</button><button class="lbn lbp" type="button" aria-label="${esc(cp.aria.prevScreen)}">${I.back}</button><button class="lbn lbf" type="button" aria-label="${esc(cp.aria.nextScreen)}">${I.fwd}</button><figure><img src="${esc(IMG.copiesOf(shots[0].src).full)}" alt="${esc(shots[0].alt || "")}" loading="lazy"><figcaption aria-live="polite">${esc(shots[0].label)}</figcaption></figure></dialog>` : ""}`;
  const shotsJson = JSON.stringify(shots.map(s => ({ src: IMG.copiesOf(s.src).full, label: en(s.label), alt: en(s.alt) || "" }))).replace(/</g, "\\u003c");

  // the architecture: the data's way to the screen (one trunk, layers as columns, side inputs below, one way back),
  // drawn in HTML/CSS from the data with no geometry; under 1000 px the same trunk goes down. Then the code walk.
  const flow = F => {
    const piece = id => F.pieces.find(x => x.id === id), layer = id => F.layers.find(l => l.id === piece(id).layer);
    const href = x => esc(f(x.file).href), sub = x => x.sub ? `<small>${esc(x.sub)}</small>` : "";
    const T = F.trunk, col = i => 2 * i + 1; // columns: node, edge, node, edge …
    const runs = []; T.forEach((id, i) => { const l = piece(id).layer, r = runs[runs.length - 1];
      if (r && r.l === l) r.to = i; else runs.push({ l, from: i, to: i }); });
    const bands = runs.map(r => { const L = F.layers.find(x => x.id === r.l), span = `grid-column:${col(r.from)} / ${col(r.to) + 1}`;
      return `<div class="fband" style="${span}"></div><div class="fhead" style="${span}"><b>${esc(L.name)}</b><code>${pk(L.pkg)}</code></div>`; }).join("");
    const mk = id => F.mark && F.mark[id] ? `<span class="mk">${esc(F.mark[id])}</span>` : "";
    const node = (id, i) => `<a class="fn${mk(id) ? " marked" : ""}" style="grid-column:${col(i)}" href="${href(piece(id))}">${mk(id)}<b>${cw(piece(id).name)}</b>${sub(piece(id))}</a>`;
    const ARROW = `<i class="ar" aria-hidden="true"></i>`;
    const edge = (say, i) => `<div class="fe" style="grid-column:${col(i) + 1}"><span>${cw(say)}</span>${ARROW}</div>`;
    const sides = (F.side || []).map(s => { const x = piece(s.piece);
      return `<div class="fs" style="grid-column:${col(T.indexOf(s.into))}"><span class="up" aria-hidden="true"></span><span class="say">${esc(s.say)}</span><a class="fn side" href="${href(x)}"><b>${cw(x.name)}</b>${sub(x)}</a></div>`; }).join("");
    const bk = F.back, a = T.indexOf(bk.to), b = T.indexOf(bk.from);
    const back = `<div class="fb" style="grid-column:${col(Math.min(a, b))} / ${col(Math.max(a, b)) + 1}"><i class="ar left" aria-hidden="true"></i><span>${esc(bk.say)}</span></div>`;
    const desk = `<div class="flow" style="grid-template-columns:${T.map(() => "minmax(0,1fr)").join(" var(--fe-w) ")}">${bands}
      ${T.map(node).join("")}${F.edges.map(edge).join("")}${sides}${back}</div>`;
    let last = null;
    const phone = `<ol class="vflow">${T.map((id, i) => { const x = piece(id), L = layer(id);
      const lh = L.id !== last ? `<li class="vl"><b>${esc(L.name)}</b> <code>${pk(L.pkg)}</code></li>` : ""; last = L.id;
      const side = (F.side || []).filter(s => s.into === id).map(s => { const q = piece(s.piece);
        return `<span class="ve vside"><span class="dn" aria-hidden="true"></span><span><a href="${href(q)}"><b>${esc(q.name)}</b>${q.sub ? ` <small>${esc(q.sub)}</small>` : ""}</a> · ${esc(s.say)}</span></span>`; }).join("");
      const isBack = [bk.to, bk.from].includes(id) && [bk.to, bk.from].includes(T[i + 1]);
      const e = i < T.length - 1 ? `<li class="ve"><span class="dn" aria-hidden="true"></span><span>${esc(F.edges[i])}${isBack ? ` <span class="vb">· ${esc(bk.down)}</span>` : ""}</span></li>` : "";
      return `${lh}<li><a class="fn${mk(id) ? " marked" : ""}" href="${href(x)}">${mk(id)}<b>${esc(x.name)}</b>${sub(x)}</a>${side}</li>${e}`; }).join("")}</ol>`;
    return desk + phone;
  };
  const A = cs.architecture;
  const walk = A && A.walk ? `<div class="walk"><h3>${esc(cp.walk)}</h3><ol>${A.walk.map(s => `<li><span><b>${tx(s.title)}</b> ${tx(s.text)}</span>${links(s.files)}</li>`).join("")}</ol></div>` : "";

  // how AI was used: the stages as columns, one lane per actor; one list, whose items fill the lanes on desktop and are
  // labeled by actor below 1000 px. A column is as wide as its longest text asks, within
  // limits, and never narrower than its name's longest word. Then the controls.
  const G = cs.ai, rows = G && G.stages ? G.actors.map(a => a.id) : [];
  const word = s => Math.max(...en(s).split(/\s+/).map(x => x.length));
  const weight = s => Math.max(.8, word(s.name) / 10.5, Math.min(1.5, Math.max(...rows.map(id => s[id] ? en(s[id]).length : 0)) / 60)).toFixed(2);
  const stages = () => `<h3 class="sub-h">${esc(cp.aiStages)}</h3>
    <div class="stages" style="--rows:${rows.length}">${G.actors.map((a, i) => `<div class="lane" style="grid-row:${i + 2}" aria-hidden="true"><b>${esc(a.name)}</b></div>`).join("")}
    <ol style="grid-template-columns:${G.stages.map(s => `minmax(0,${weight(s)}fr)`).join(" ")}">${G.stages.map(s => `<li><div class="st"><b>${esc(s.name)}</b>${s.note ? ` <small>${esc(s.note)}</small>` : ""}</div>${G.actors.map((a, i) => s[a.id] ? `<div class="act a-${a.id}" style="grid-row:${i + 2}"><b>${esc(a.name)}</b> <p>${tx(s[a.id])}</p></div>` : "").join("")}</li>`).join("")}</ol></div>`;
  // the harness: one column per group (what it controls), each piece filled by how it holds, as the strip's actors are
  const HK = cp.harness, KI = { blocks: "M6 9V6.5a4 4 0 0 1 8 0V9M4.5 9h11v8h-11z", waits: "M10 9.5a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zM4 17c0-3.2 2.7-5 6-5s6 1.8 6 5",
    guides: "M10 5.5C8 4 5.5 3.7 3 4v11.5c2.5-.3 5 0 7 1.5 2-1.5 4.5-1.8 7-1.5V4c-2.5-.3-5 0-7 1.5zm0 0V17" };
  const kicon = k => `<svg class="ki" viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><path d="${KI[k]}"/></svg>`;
  const harness = () => `<div class="hx"><h3 class="sub-h">${esc(HK.h)}</h3>${G.harnessNote ? `<p class="hi">${tx(G.harnessNote.text)} <a class="fl" href="${esc(G.harnessNote.source.href)}"><span>${esc(G.harnessNote.source.label)}</span></a></p>` : ""}
    <dl class="hk">${Object.entries(HK.kinds).map(([id, k]) => `<div><dt class="k-${id}">${kicon(id)}${esc(k.name)}</dt><dd>${esc(k.def)}</dd></div>`).join("")}</dl>
    <ol class="hc">${G.harness.map(g => `<li><h4 class="st">${esc(g.name)}</h4><ul>${g.pieces.map(x => `<li class="pc k-${x.kind}"><b>${kicon(x.kind)}<span>${esc(x.name)}<i class="sr"> (${esc(HK.kinds[x.kind].name)})</i></span></b><p>${tx(x.text)}</p>${links(x.files)}</li>`).join("")}</ul></li>`).join("")}</ol></div>`;

  // what comes next: the project's roadmap and learning path
  const DOT = { done: "var(--done)", now: "var(--wip)", next: "var(--client)", goal: "var(--own)" }, ps = data.copy.path.status, groups = data.copy.next.groups;
  const road = w.roadmap, path = w.learningPath;
  const next = () => `<div class="nx">${road ? `<div><h3 class="group">${esc(groups.app)}</h3><ol class="steps">${[...road.steps, [road.goal, "goal"]].map(([t, s]) =>
      `<li class="s-${s}"><span class="mark">${s === "done" ? ICON.check : ""}</span><b>${esc(t)}</b><small>${esc(ps[s])}</small></li>`).join("")}</ol>${cs.next.designed && road.steps.some(([, s]) => s === "designed") ? `<p class="nxnote">${tx(cs.next.designed)}</p>` : ""}</div>` : ""}
    ${path ? `<div><h3 class="group">${esc(groups.path)}</h3><ol class="blocks">${path.blocks.map(b =>
      `<li><span class="tag">${esc(b.tag)}</span><div><b>${esc(b.title)}</b><p>${esc(b.note)}</p></div><span class="bst"><i style="background:${DOT[b.status]}" aria-hidden="true"></i>${esc(ps[b.status])}</span></li>`).join("")}</ol></div>` : ""}</div>`;

  const body = {
    next,
    why: () => `<div class="pair"><span></span><div class="prose">${[].concat(cs.why.body || []).map(x => `<p>${tx(x)}</p>`).join("")}</div></div>`,
    architecture: () => `<div class="dg">${A.flow ? flow(A.flow) : ""}${walk}</div>${A.flow ? `<p class="pin">${esc(cp.pin)}</p>` : ""}`,
    decisions: () => `<div class="dtable" role="table" aria-label="${esc(cp.aria.decisions)}">
    <div class="dr dh" role="row">${cp.decisionCols.map(c => `<span role="columnheader">${esc(c)}</span>`).join("")}</div>
    ${cs.decisions.map(d => `<div class="dr" role="row"><b role="cell">${tx(d.what)}</b>${[d.instead, d.why, d.cost].map((x, i) => `<span role="cell" data-l="${esc(cp.decisionCols[i + 1])}">${tx(x)}</span>`).join("")}<span role="cell" data-l="${esc(cp.decisionCols[4])}">${links(d.files)}</span></div>`).join("")}
  </div>`,
    tests: () => `<ul class="items">${cs.tests.items.map(t => `<li><span>${tx(t.text)}</span>${links(t.files)}</li>`).join("")}</ul>`,
    ai: () => { const c = cs.ai.contrast, o = c && data.work.find(x => x.id === c.to);
      return `${cs.ai.stages ? stages() : ""}${G.harness ? harness() : ""}<div class="prose end">${(cs.ai.body || []).map(x => `<p>${tx(x)}</p>`).join("")}
      ${c ? `<p>${tx(c.text)}</p>${o && o.links.caseStudy ? `<a class="tlink gs" href="${esc(o.links.caseStudy)}">${esc(cp.title.replace("{name}", o.name))}${I.fwd}</a>` : ""}` : ""}</div>`; },
    missing: () => `<ul class="items one">${cs.missing.items.map(g => `<li><b>${tx(g.title)}</b><span>${tx(g.text)}</span>${g.list ? `<ul class="sub">${g.list.map(x => `<li>${tx(x)}</li>`).join("")}</ul>` : ""}${links(g.files)}</li>`).join("")}</ul>${cs.missing.outro ? `<p class="outro">${tx(cs.missing.outro)}</p>` : ""}`
  };
  const sections = SECTIONS.slice(1).filter(has).map(id => `<section id="${id}" aria-labelledby="${id}-h">${h(id)}
    ${body[id]()}
  </section>`).join("\n\n  ");

  // the end of the page: repo, README, the pinned commit (said once, here) and the case's own note
  const commit = tx(cp.commit).replace("{commit}", `<a href="${esc(`${repo}/tree/${cs.pin.commit}`)}"><code>${esc(cs.pin.commit)}</code></a>`).replace("{date}", C.factDate(cs.pin.date));
  const source = `<div class="source">${repoLinks}<p>${commit}</p>${cs.footNote ? `<p>${tx(cs.footNote)}</p>` : ""}</div>`;

  // back to the left, forward to the right: the cases run newest to oldest (the data is oldest first) and wrap around
  const cases = data.work.filter(x => x.links && x.links.caseStudy).reverse(), nx = cases.length > 1 && cases[(cases.indexOf(w) + 1) % cases.length];
  const after = `<nav class="after" aria-label="${esc(cp.aria.pager)}">
    <a class="back" href="index.html#${esc(w.id)}">${I.back}<span>${esc(cp.back)}</span></a>
    ${nx ? `<a class="nextc" href="${esc(nx.links.caseStudy)}"><small>${esc(cp.next)}</small><b>${esc(nx.name)}${I.fwd}</b><span>${text(ctx, nx.what.en)}</span></a>` : ""}
  </nav>`;

  return {
    head: head(ctx, { title: `${cp.title.replace("{name}", w.name)} · ${p.name}`, file, desc: en(cs.lede).replace(/`/g, ""), type: "article", person: false, themeColor: { light: "#1F3FBF", dark: "#1A35A3" } }),
    nav, opening, strip, sections, source, after, shotsJson,
    flat: strip ? "" : " flat", // no screens: the field closes without the room the strip straddles
    // a case still running has a length that grows: the browser recomputes it (live.js), as on the landing
    live: w.end == null ? `<script type="application/json" id="calc-data">${calcData(data, ctx.now.getUTCFullYear())}</script>\n<script src="lib/calc.js"></script>\n<script src="live.js"></script>` : "",
    githubIcon: ICON.github, cvMenu: cvMenu(ctx, "line", 2)
  };
};
Object.assign(module.exports, { FILE, ELSEWHERE, SECTIONS }); // check-data holds the case files to the same reading
