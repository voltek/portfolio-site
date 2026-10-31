// A case study (modernnotes.html, gamestack.html …): the parts of src/case.html that come from the data. One renderer
// for every case: the project's entry in data/portfolio.js gives the header, data/cases/<page>.js the body, copy.case
// the labels. A section the case file leaves out is not drawn and leaves the bar (DECISIONS.md → Case page rules).
const IMG = require("../../lib/images.js");
const { C, esc, text, calcData, head, srcset, ICON } = require("./common.js");

const I = {
  back: `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12 4l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  fwd: `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M8 4l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  code: `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7 6l-4 4 4 4M13 6l4 4-4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  x: `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>`
};

// the sections a case can have, in page order (overview is the header, always there)
const SECTIONS = ["overview", "why", "architecture", "decisions", "tests", "ai", "missing"];

// a case text: escaped, `…` as code
const tx = s => esc(s).replace(/`([^`]+)`/g, "<code>$1</code>");
// a class name may break only before its role (GetNotes·UseCase), never inside a word
const cw = s => esc(s).replace(/([a-z])(UseCase|ViewModel|Screen|Repository)\b/g, "$1<wbr>$2");

// "path:15–22" under roots.main, "test:path" under another root → the file at the pinned commit, and its label
const FILE = /^(?:(\w+):(?!\d))?(.+?)(?::(\d+(?:–\d+)?))?$/;
const fileOf = (cs, repo, ref) => {
  const [, root = "main", p, lines] = ref.match(FILE);
  const href = `${repo}/blob/${cs.pin.commit}/${cs.roots[root]}${p}${lines ? `#L${lines.replace("–", "-L")}` : ""}`;
  return { href, label: p.split("/").pop() + (lines ? ` · l. ${lines}` : "") };
};

module.exports = (cs, ctx) => {
  const { data } = ctx, cp = data.copy.case, p = data.profile;
  const w = data.work.find(x => x.id === cs.id), repo = w.links.repo, file = w.links.caseStudy;
  const f = ref => fileOf(cs, repo, ref);
  const links = (refs = []) => refs.length ? `<span class="files">${refs.map(f).map(l => `<a class="fl" href="${esc(l.href)}">${I.code}<span>${esc(l.label)}</span></a>`).join("")}</span>` : "";
  const has = id => id === "overview" || cs[id] != null;
  const h = id => `<div class="head"><h2 id="${id}-h">${esc(cp.h[id])}<a class="hash" href="#${id}" aria-label="${esc(cp.aria.hash + cp.h[id])}">#</a></h2>${cs[id].intro ? `<p>${tx(cs[id].intro)}</p>` : "<span></span>"}</div>`;
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

  // the strip: the video first (if any), then the screens; a tap opens the larger screen
  const shots = (w.shots || []).filter(s => s.on.includes("case"));
  const SIZES = "(max-width: 700px) min(62vw, 240px), 196px";
  const vid = cs.video ? `<figure class="it vid"><div class="phone"><video src="${esc(cs.video.src)}" poster="${esc(cs.video.poster)}" preload="none" controls muted playsinline aria-label="${esc(cs.video.alt)}"></video></div><figcaption>${esc(cp.demo)}</figcaption></figure>` : "";
  const strip = !shots.length && !cs.video ? "" : `<div class="strip" id="screens">
    <button class="sbtn prev" type="button" aria-label="${esc(cp.aria.prevScreens)}" hidden>${I.back}</button>
    <div class="track" tabindex="0" role="group" aria-label="${esc(cp.aria.screens)}">${vid}${shots.map((s, i) => `<figure class="it"><button class="shot" type="button" data-i="${i}" aria-label="${esc(cp.aria.viewLarger + s.label)}"><span class="phone"><img ${srcset(s.src, SIZES)} alt="${esc(s.alt || "")}" width="240" height="539"></span></button><figcaption>${esc(s.label)}</figcaption></figure>`).join("")}</div>
    <button class="sbtn next" type="button" aria-label="${esc(cp.aria.nextScreens)}" hidden>${I.fwd}</button>
  </div>
  ${cs.shotsFoot ? `<p class="shotnote">${tx(cs.shotsFoot)}</p>` : ""}
  ${shots.length ? `<dialog class="lb" aria-label="${esc(cp.aria.screen)}"><button class="theme lbx" type="button" aria-label="${esc(data.copy.aria.close)}">${I.x}</button><button class="lbn lbp" type="button" aria-label="${esc(cp.aria.prevScreen)}">${I.back}</button><button class="lbn lbf" type="button" aria-label="${esc(cp.aria.nextScreen)}">${I.fwd}</button><figure><img src="${esc(IMG.copiesOf(shots[0].src).full)}" alt="${esc(shots[0].alt || "")}" loading="lazy"><figcaption aria-live="polite">${esc(shots[0].label)}</figcaption></figure></dialog>` : ""}`;
  const shotsJson = JSON.stringify(shots.map(s => ({ src: IMG.copiesOf(s.src).full, label: s.label, alt: s.alt || "" }))).replace(/</g, "\\u003c");

  // the architecture: the data's way to the screen (one trunk, layers as columns, side inputs below, one way back),
  // drawn in HTML/CSS from the data with no geometry; under 1000 px the same trunk goes down. Then the code walk.
  const flow = F => {
    const piece = id => F.pieces.find(x => x.id === id), layer = id => F.layers.find(l => l.id === piece(id).layer);
    const href = x => esc(f(x.file).href), sub = x => x.sub ? `<small>${esc(x.sub)}</small>` : "";
    const T = F.trunk, col = i => 2 * i + 1; // columns: node, edge, node, edge …
    const runs = []; T.forEach((id, i) => { const l = piece(id).layer, r = runs[runs.length - 1];
      if (r && r.l === l) r.to = i; else runs.push({ l, from: i, to: i }); });
    const bands = runs.map(r => { const L = F.layers.find(x => x.id === r.l), span = `grid-column:${col(r.from)} / ${col(r.to) + 1}`;
      return `<div class="fband" style="${span}"></div><div class="fhead" style="${span}"><b>${esc(L.name)}</b><code>${esc(L.pkg)}</code></div>`; }).join("");
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
      const lh = L.id !== last ? `<li class="vl"><b>${esc(L.name)}</b> <code>${esc(L.pkg)}</code></li>` : ""; last = L.id;
      const side = (F.side || []).filter(s => s.into === id).map(s => { const q = piece(s.piece);
        return `<span class="vside"><a href="${href(q)}"><b>${esc(q.name)}</b>${q.sub ? ` <small>${esc(q.sub)}</small>` : ""}</a> → ${esc(s.say)}</span>`; }).join("");
      const isBack = [bk.to, bk.from].includes(id) && [bk.to, bk.from].includes(T[i + 1]);
      const e = i < T.length - 1 ? `<li class="ve"><span class="dn" aria-hidden="true"></span>${esc(F.edges[i])}${isBack ? ` <span class="vb">· ${esc(bk.down)}</span>` : ""}</li>` : "";
      return `${lh}<li><a class="fn${mk(id) ? " marked" : ""}" href="${href(x)}">${mk(id)}<b>${esc(x.name)}</b>${sub(x)}</a>${side}</li>${e}`; }).join("")}</ol>`;
    return desk + phone;
  };
  const A = cs.architecture;
  const walk = A && A.walk ? `<div class="walk"><h3>${esc(cp.walk)}</h3><ol>${A.walk.map(s => `<li><span><b>${tx(s.title)}</b> ${tx(s.text)}</span>${links(s.files)}</li>`).join("")}</ol></div>` : "";

  const body = {
    why: () => `<div class="pair"><span></span><div class="prose">${[].concat(cs.why.body || []).map(x => `<p>${tx(x)}</p>`).join("")}</div></div>`,
    architecture: () => `<div class="dg">${A.flow ? flow(A.flow) : ""}${walk}</div>${A.flow ? `<p class="pin">${esc(cp.pin)}</p>` : ""}`,
    decisions: () => `<div class="dtable" role="table" aria-label="${esc(cp.aria.decisions)}">
    <div class="dr dh" role="row">${cp.decisionCols.map(c => `<span role="columnheader">${esc(c)}</span>`).join("")}</div>
    ${cs.decisions.map(d => `<div class="dr" role="row"><b role="cell">${tx(d.what)}</b>${[d.instead, d.why, d.cost].map((x, i) => `<span role="cell" data-l="${esc(cp.decisionCols[i + 1])}">${tx(x)}</span>`).join("")}<span role="cell" data-l="${esc(cp.decisionCols[4])}">${links(d.files)}</span></div>`).join("")}
  </div>`,
    tests: () => `<ul class="items">${cs.tests.items.map(t => `<li><span>${tx(t.text)}</span>${links(t.files)}</li>`).join("")}</ul>`,
    ai: () => { const c = cs.ai.contrast, o = c && data.work.find(x => x.id === c.to);
      return `<div class="pair"><span></span><div class="prose">${(cs.ai.body || []).map(x => `<p>${tx(x)}</p>`).join("")}
      ${c ? `<p>${tx(c.text)}</p>${o && o.links.caseStudy ? `<a class="tlink gs" href="${esc(o.links.caseStudy)}">${esc(cp.title.replace("{name}", o.name))}${I.fwd}</a>` : ""}` : ""}</div></div>`; },
    missing: () => `<ul class="items one">${cs.missing.items.map(g => `<li><b>${tx(g.title)}</b><span>${tx(g.text)}</span>${g.list ? `<ul class="sub">${g.list.map(x => `<li>${tx(x)}</li>`).join("")}</ul>` : ""}${links(g.files)}</li>`).join("")}</ul>`
  };
  const sections = SECTIONS.slice(1).filter(has).map(id => `<section id="${id}" aria-labelledby="${id}-h">${id === "decisions" ? h(id).replace(/<p>.*<\/p>/, "<span></span>") : h(id)}
    ${body[id]()}
  </section>`).join("\n\n  ");

  // the end of the page: repo, README, the pinned commit (said once, here) and the case's own note
  const commit = tx(cp.commit).replace("{commit}", `<a href="${esc(`${repo}/tree/${cs.pin.commit}`)}"><code>${esc(cs.pin.commit)}</code></a>`).replace("{date}", C.factDate(cs.pin.date));
  const source = `<div class="source">${repoLinks}<p>${commit}</p>${cs.footNote ? `<p>${tx(cs.footNote)}</p>` : ""}</div>`;

  // back to the left, forward to the right: the next case is the next project with a case study, in the data's order
  const cases = data.work.filter(x => x.links && x.links.caseStudy), nx = cases.length > 1 && cases[(cases.indexOf(w) + 1) % cases.length];
  // (its look waits for the "Next case" decision with more than two cases: DECISIONS.md → Case page rules)
  const after = `<nav class="after" aria-label="${esc(cp.aria.pager)}">
    <a class="back" href="index.html#${esc(w.id)}">${I.back}<span>${esc(cp.back)}</span></a>
    ${nx ? `<a class="nextc" href="${esc(nx.links.caseStudy)}"><small>${esc(cp.next)}</small><b>${esc(nx.name)}${I.fwd}</b><span>${text(ctx, nx.what.en)}</span></a>` : ""}
  </nav>`;

  return {
    head: head(ctx, { title: `${cp.title.replace("{name}", w.name)} · ${p.name}`, file, desc: cs.lede.replace(/`/g, ""), type: "article", person: false, themeColor: { light: "#1F3FBF", dark: "#1A35A3" } }),
    nav, opening, strip, sections, source, after, shotsJson,
    flat: strip ? "" : " flat", // no screens: the field closes without the room the strip straddles
    // a case still running has a length that grows: the browser recomputes it (live.js), as on the landing
    live: w.end == null ? `<script type="application/json" id="calc-data">${calcData(data, ctx.now.getUTCFullYear())}</script>\n<script src="lib/calc.js"></script>\n<script src="live.js"></script>` : "",
    githubIcon: ICON.github
  };
};
Object.assign(module.exports, { FILE, SECTIONS }); // check-data holds the case files to the same reading
