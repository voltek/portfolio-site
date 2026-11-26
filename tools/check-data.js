// Checks data/portfolio.js before anything is built or deployed: broken ids, invalid dates, missing texts, repo pins
// without a date, screens that do not exist. Errors stop the build (exit 1); warnings list what is pending.
// Runs locally and in .github/workflows/checks.yml.
// Usage: node tools/check-data.js            check only
//        node tools/check-data.js --calc     also print every computed value (lengths, years, episodes) for review
//        add --today=2027-09-15 to compute them against another day
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const data = require(path.join(root, "data", "portfolio.js"));
const C = require(path.join(root, "lib", "calc.js"));

const arg = k => (process.argv.find(a => a.startsWith(`--${k}`)) || "").split("=")[1];
const now = arg("today") ? C.parse(arg("today")) : new Date();
const errors = [], warnings = [];
const err = m => errors.push(m), warn = m => warnings.push(m);

const date = (s, where, nullable) => {
  if (s == null) { if (!nullable) err(`${where}: missing date`); return null; }
  try { return C.parse(s); } catch { err(`${where}: invalid date "${s}"`); return null; }
};
const span = (o, where, openEnd) => {
  const a = date(o.start, `${where}.start`), b = date(o.end, `${where}.end`, openEnd);
  if (a && b && b < a) err(`${where}: ends before it starts`);
  if (a && a > now) warn(`${where}: starts after today`);
};
// a text the CV shows: always { en, es }
const bi = (t, where) => {
  if (t == null || typeof t !== "object") return err(`${where}: expected { en, es }`);
  if (!t.en) err(`${where}: missing en`);
};
// an { en } anywhere, the CV's or the site's, says its Spanish too; es null = pending
const both = (o, where) => {
  if (!o || typeof o !== "object") return;
  if (typeof o.en === "string") {
    if (o.es === null) warn(`${where}: Spanish pending`);
    else if (!o.es) err(`${where}: missing es (use null while pending)`);
  }
  for (const [k, v] of Object.entries(o)) both(v, where ? `${where}.${k}` : k);
};
both(data, "");
const TOKEN = /\{(careerYears|lapse|pinDate|updated)\}/g;
// {lapse} is filled only in an employer's note (the entry that holds it); anywhere else it would crash the build
const tokens = (t, where, lapse = false) => {
  for (const s of [].concat(t && typeof t === "object" ? [t.en, t.es] : t).filter(Boolean)) {
    if (!lapse && s.includes("{lapse}")) err(`${where}: {lapse} only works in an employer's note`);
    const left = s.replace(TOKEN, "").match(/\{[^}]*\}/g);
    if (left) err(`${where}: unknown template ${left.join(" ")}`);
    if (/\b\d+(\.\d)?\+? (years?|months?|yrs?)\b/.test(s.replace(TOKEN, ""))) warn(`${where}: looks like a length written by hand: "${s}"`);
  }
};

// profile and employers
const p = data.profile;
for (const k of ["name", "alternateName", "status", "email"]) if (!p[k]) err(`profile.${k}: missing`);
bi(p.title, "profile.title"); bi(p.aiLine, "profile.aiLine"); bi(p.education.degree, "profile.education.degree");
span(p.education, "profile.education");
p.languages.forEach((l, i) => { bi(l.name, `profile.languages[${i}].name`); bi(l.level, `profile.languages[${i}].level`); });
for (const [k, s] of Object.entries(p.lede)) tokens(s, `profile.lede.${k}`);
for (const [id, e] of Object.entries(data.employers)) {
  span(e, `employers.${id}`, true); bi(e.role, `employers.${id}.role`); bi(e.place, `employers.${id}.place`); if ("kind" in e) bi(e.kind, `employers.${id}.kind`); if (!e.note) err(`employers.${id}: missing note`); tokens(e.note, `employers.${id}.note`, true);
}

// the CV's own copy
const cv = data.cv;
for (const k of ["status", "overlap", "summary"]) { bi(cv[k], `cv.${k}`); tokens(cv[k], `cv.${k}`); }
for (const g of ["h", "levels", "kind"]) for (const [k, t] of Object.entries(cv[g])) bi(t, `cv.${g}.${k}`);
cv.how.forEach((t, i) => { bi(t, `cv.how[${i}]`); tokens(t, `cv.how[${i}]`); });
const named = new Set([...data.skills.map(s => s.cv || s.name), ...data.work.flatMap(w => [w.name, ...w.stack])]);
for (const k of Object.keys(cv.terms)) if (!named.has(k)) err(`cv.terms: "${k}" is no skill, stack or place name`);

// work: jobs and projects
const ids = new Set(), STATUS = ["in-progress", "completed"], ON = ["plain", "show", "case"];
data.work.forEach((w, i) => {
  const at = `work.${w.id || i}`;
  if (!w.id) err(`work[${i}]: missing id`); else if (ids.has(w.id)) err(`${at}: duplicate id`); else ids.add(w.id);
  // the Skills matrix shows each place as its id in capitals on phones ("OB"), spelled out in the key line
  if (w.id && !/^[a-z]{2}$/.test(w.id)) err(`${at}: id must be two lowercase letters (the matrix's phone code)`);
  if (!w.name) err(`${at}: missing name`);
  if (!["job", "project"].includes(w.type)) err(`${at}: type must be "job" or "project"`);
  span(w, at, true); // an ongoing job has no end either
  if (w.employer && !data.employers[w.employer]) err(`${at}: unknown employer "${w.employer}"`);
  if (w.type === "job") { if (!w.employer) bi(w.role, `${at}.role`); bi(w.studio, `${at}.studio`); }
  if (w.type === "project") {
    if (!STATUS.includes(w.status)) err(`${at}: status must be ${STATUS.join(" or ")}`);
    if (w.status === "completed" && w.end == null) err(`${at}: completed but has no end date`);
    if (w.status === "in-progress" && w.end != null) err(`${at}: in progress but has an end date`);
    if (!w.links || !w.links.repo) warn(`${at}: no repo link`);
  }
  bi(w.what, `${at}.what`);
  if (w.lede) bi(w.lede, `${at}.lede`);
  if (!Array.isArray(w.highlights) || w.highlights.length !== 3) err(`${at}: exactly three highlights per card`);
  else w.highlights.forEach((h, j) => { bi(h, `${at}.highlights[${j}]`); tokens(h, `${at}.highlights[${j}]`); });
  if (!Array.isArray(w.stack) || !w.stack.length) err(`${at}: missing stack`);
  else if (w.stack.length > (w.type === "job" ? 9 : 12)) warn(`${at}.stack: ${w.stack.length} tags, more than 9 for a job or 12 for a project no longer scans`);
  if (!w.show || !w.show.title) warn(`${at}: no Show title card`);
  (w.shots || []).forEach((s, j) => {
    const where = `${at}.shots[${j}]`;
    if (!fs.existsSync(path.join(root, s.src))) warn(`${where}: file not found, the empty state will show (${s.src})`);
    if (!s.label) err(`${where}: missing label`);
    if (!s.alt) warn(`${where}: alt text pending`);
    if (!Array.isArray(s.on) || !s.on.every(o => ON.includes(o))) err(`${where}: "on" must list ${ON.join(", ")}`);
  });
  if (w.note) { bi(w.note, `${at}.note`); tokens(w.note, `${at}.note`); }
  if (w.cv) { (w.cv.more || []).forEach((t, j) => bi(t, `${at}.cv.more[${j}]`)); }
  if (w.type === "job" && w.employer && !w.note) err(`${at}.note: Plain and the CV say what the place is with it`);
  if (w.pin) {
    if (!w.pin.date) err(`${at}.pin: needs the day the claims were checked`);
    else date(w.pin.date, `${at}.pin.date`);
    if (!w.pin.commit) err(`${at}.pin: needs the commit the claims were checked at`);
  }
  if ((w.proof || w.source) && !w.pin) err(`${at}: proof rows need a pin to trace them back to`);
  (w.proof || []).forEach((r, j) => { if (typeof r.label !== "string" || typeof r.note !== "string") err(`${at}.proof[${j}]: label and note are plain strings; their Spanish goes in es: { label, note }`); if (r.es && !(r.es.label && r.es.note)) err(`${at}.proof[${j}].es: needs label and note`); if (r.check !== true) err(`${at}.proof[${j}]: needs check: true`);
    if (!Array.isArray(r.on) || !r.on.every(o => ON.includes(o))) err(`${at}.proof[${j}]: "on" must list ${ON.join(", ")}`); tokens(r.note, `${at}.proof[${j}]`); });
  if (w.learningPath) {
    const lp = w.learningPath;
    date(lp.updated, `${at}.learningPath.updated`);
    const ST = ["done", "now", "next", "goal"], bi = (s, k) => s && typeof s === "object" && s.en && s.es || err(k);
    lp.blocks.forEach((b, j) => { const bat = `${at}.learningPath.blocks[${j}]`;
      if (!ST.includes(b.status)) err(`${bat}: status must be ${ST.join(", ")}`);
      if (b.n !== j + 1) err(`${bat}: n must be ${j + 1}, the blocks numbered in order`);
      bi(b.title, `${bat}.title: needs { en, es }`); bi(b.note, `${bat}.note: needs { en, es }`); if (b.short) bi(b.short, `${bat}.short: needs { en, es }`);
      (b.steps || []).forEach(s => { const name = s[0] && s[0].en || s[0];
        // a step is proof of work done: what is still to come is the block's own status
        if (s[1] !== "done") err(`${bat}: step "${name}" has status "${s[1]}"; a step is only ever done`);
        if (!(s[0] && typeof s[0] === "object" && s[0].en && s[0].es) && !/\.\w+$/.test(s[0])) err(`${bat}: step "${name}" needs { en, es } (a file name may stay a string)`);
        if (!(s[2] || []).length) err(`${bat}: step "${name}" needs its files`); });
      // the path is updated only when a block closes: a block in progress shows only what is done
      if (b.status === "now") {
        if ([b.note && b.note.en, b.note && b.note.es].some(t => /\b(next|sigue|luego)\s*:/i.test(t || ""))) err(`${bat}: a block in progress says only what is done; its note announces what comes next`);
      }
      if (b.status === "done" && !(b.files || []).length && !(b.steps || []).length) err(`${bat}: a finished block needs files or steps to prove it`);
    });
    if (lp.blocks.filter(b => b.status === "goal").length > 1) err(`${at}.learningPath: more than one goal`);
  }
  if (w.roadmap) (w.roadmap.steps || []).forEach(s => { if (!["done", "now", "designed", "next"].includes(s[1])) err(`${at}.roadmap: step "${s[0].en || s[0]}" has status "${s[1]}"`); });
});
const running = data.work.filter(w => w.status === "in-progress");
if (!running.length) warn(`no project in progress: "Now building" shows its designed empty state`);
const sorted = data.work.every((w, i, a) => !i || C.parse(a[i - 1].start) <= C.parse(w.start));
if (!sorted) err("work: keep it oldest first (it is the episode order)");

// skills
const LEVELS = Object.keys(data.copy.skills.levels).filter(l => l !== "legacy" && l !== "ai"), names = new Set();
// every row with skills has its label, on the pages and on the CV
for (const k of new Set(data.skills.map(s => s.legacy ? "legacy" : s.ai ? "ai" : s.level)))
  if (!data.copy.skills.levels[k] || !cv.levels[k]) err(`skills: the "${k}" row has no label in copy.skills.levels or cv.levels`);
data.skills.forEach((s, i) => {
  const at = `skills.${s.name || i}`;
  if (!s.name) err(`skills[${i}]: missing name`); else if (names.has(s.name)) err(`${at}: duplicate`); else names.add(s.name);
  if (!LEVELS.includes(s.level)) err(`${at}: level must be ${LEVELS.join(", ")}`);
  // the AI row says its level once, in its line
  if (s.ai && s.pages !== false && s.level !== "strong") err(`${at}: an AI skill on the pages is strong, as its row says`);
  // a CV-only skill may name no place (it draws no matrix row)
  if (Array.isArray(s.at) && !s.at.length && s.pages === false) return;
  if (!Array.isArray(s.at) || !s.at.length) return err(`${at}: "at" lists no place`);
  for (const r of s.at) {
    const id = typeof r === "string" ? r : r.id;
    if (!ids.has(id)) err(`${at}: unknown place "${id}"`);
    if (typeof r === "object") { if (r.start) date(r.start, `${at}.at.${id}.start`); if (r.end) date(r.end, `${at}.at.${id}.end`);
      if ("part" in r && r.part !== true) err(`${at}.at.${id}: part is true or left out`);
      if (r.part && (r.start || r.end)) err(`${at}.at.${id}: a part-time place adds no years, so it takes no dates`); }
  }
  // one entry per place: the matrix draws one dot per column
  const placeIds = s.at.map(r => typeof r === "string" ? r : r.id);
  if (new Set(placeIds).size !== placeIds.length) err(`${at}: a place is listed twice in "at"`);
  if (s.at.every(r => r.part)) err(`${at}: every place is part-time; one at least must be a full one`);
  if (s.note) tokens(s.note, at);
});

// case studies: data/cases/<page>.js for each project's links.caseStudy (DECISIONS.md → Case page rules and
// Data-flow diagram). Wrong ids and shapes are errors; the size limits of the diagram and the stack are warnings.
const { FILE, ELSEWHERE, SECTIONS } = require(path.join(root, "tools", "pages", "case.js"));
for (const w of data.work.filter(x => x.links && x.links.caseStudy)) {
  const f = path.join(root, "data", "cases", w.links.caseStudy.replace(/\.html$/, ".js"));
  if (!fs.existsSync(f)) { warn(`work.${w.id}: ${w.links.caseStudy} has no data/cases/${path.basename(f)} yet; its links wait while it is in PENDING (tools/build.js)`); continue; }
  const cs = require(f), at = `cases/${path.basename(f)}`;
  both(cs, at);
  if (cs.id !== w.id) err(`${at}: id "${cs.id}" is not its project "${w.id}"`);
  if (!cs.pin || !/^[0-9a-f]{7,40}$/.test(cs.pin.commit || "")) err(`${at}: pin.commit missing: every code link goes to that commit`);
  else date(cs.pin.date, `${at}.pin.date`);
  for (const k of ["lede", "role", "readme"]) if (!cs[k]) err(`${at}: missing ${k}`);
  // Plain's path line and Show's "The whole path" link to the case's #path
  if (w.learningPath && !cs.path) err(`${at}: missing path: ${w.id} has a learning path, and the landing links to its #path`);
  for (const k of Object.keys(cs)) if (/^[a-z]+$/.test(k) && !SECTIONS.includes(k) && !["id", "pin", "roots", "readme", "lede", "role", "stack", "libs", "video", "shots"].includes(k)) warn(`${at}: "${k}" is not a section the page draws`);
  // every file names a root the case has
  const A = cs.architecture || {}, F = A.flow;
  const refs = [cs.readme, ...(A.walk || []).flatMap(s => s.files || []), ...(cs.decisions || []).flatMap(d => d.files || []),
    ...((cs.tests || {}).items || []).flatMap(t => t.files || []), ...((cs.missing || {}).items || []).flatMap(g => g.files || []),
    ...(F ? F.pieces.map(p => p.file) : []), ...(w.proof || []).flatMap(r => r.files || []),
    ...((cs.ai || {}).harness || []).flatMap(g => g.pieces.flatMap(x => x.files || [])),
    ...((w.learningPath || {}).blocks || []).flatMap(b => [...(b.files || []), ...(b.steps || []).flatMap(s => s[2] || [])])].filter(Boolean);
  for (const r of refs) { if (ELSEWHERE.test(r)) continue; const m = String(r).match(FILE); if (!m || m[2].includes(":") || !((m[1] || "main") in (cs.roots || {}))) err(`${at}: file "${r}" names no root of roots`); }
  // the stack tags: Skills used at this project (same name, or the part of a compound name that applies), plus libs
  const parts = data.skills.filter(s => s.at.some(r => (typeof r === "string" ? r : r.id) === w.id)).flatMap(s => [s.name, ...s.name.split(" · ")]);
  const libs = cs.libs || [];
  for (const t of cs.stack || []) {
    if (parts.includes(t)) { if (libs.includes(t)) warn(`${at}: "${t}" is a Skill; take it out of libs`); }
    else if (!libs.includes(t)) err(`${at}.stack: "${t}" is neither a Skill used at ${w.id} nor in libs`);
  }
  for (const l of libs) if (!(cs.stack || []).includes(l)) warn(`${at}.libs: "${l}" is not in the stack`);
  if ((cs.stack || []).length > 15) warn(`${at}.stack: ${cs.stack.length} tags, more than ~15`);
  // the data flow: one trunk (≤ 6), an edge between each pair, side inputs into the trunk (one per piece), one way back
  if (F) {
    const ids = new Set(F.pieces.map(p => p.id)), known = (id, where) => { if (!ids.has(id)) err(`${at}.flow.${where}: unknown piece "${id}"`); };
    F.pieces.forEach(p => { if (!F.layers.some(l => l.id === p.layer)) err(`${at}.flow: piece "${p.id}" in unknown layer "${p.layer}"`); if (!p.file) err(`${at}.flow: piece "${p.id}" has no file`); });
    F.trunk.forEach(id => known(id, "trunk"));
    if (F.trunk.length > 6) warn(`${at}.flow: the trunk has ${F.trunk.length} pieces, more than 6: group some ("4 feature modules")`);
    if (F.layers.length > 4) warn(`${at}.flow: ${F.layers.length} layers, more than 4`);
    if (F.edges.length !== F.trunk.length - 1) err(`${at}.flow: ${F.edges.length} edges for ${F.trunk.length} trunk pieces (one between each pair)`);
    Object.keys(F.mark || {}).forEach(id => known(id, "mark"));
    const sidePieces = (F.side || []).map(s => s.piece);
    (F.side || []).forEach(s => { known(s.piece, "side"); if (!F.trunk.includes(s.into)) err(`${at}.flow.side: "${s.into}" is not on the trunk`); });
    if (new Set(sidePieces).size !== sidePieces.length) warn(`${at}.flow.side: a piece enters more than once`);
    if (!F.back || Array.isArray(F.back)) err(`${at}.flow.back: exactly one way back`);
    else { [F.back.from, F.back.to].forEach(id => { if (!F.trunk.includes(id)) err(`${at}.flow.back: "${id}" is not on the trunk`); });
      if (!F.back.say || !F.back.down) err(`${at}.flow.back: needs say (across) and down (the phone's line)`); }
  }
  // the AI section's strip: at most 8 stages and 3 actors, each stage with someone in it
  if (cs.ai && cs.ai.stages) {
    const who = (cs.ai.actors || []).map(a => a.id);
    if (!who.length) err(`${at}.ai: stages need actors`);
    if (cs.ai.stages.length > 8) warn(`${at}.ai: ${cs.ai.stages.length} stages, more than 8`);
    if (who.length > 3) warn(`${at}.ai: ${who.length} actors, more than 3`);
    cs.ai.stages.forEach((s, i) => { if (!who.some(id => s[id])) err(`${at}.ai.stages[${i}]: no actor does anything`);
      for (const k of Object.keys(s)) if (!["name", "note", ...who].includes(k)) err(`${at}.ai.stages[${i}]: "${k}" is not an actor`); });
  }
  if (cs.ai && cs.ai.harness) cs.ai.harness.forEach((g, i) => (g.pieces || []).forEach((x, j) => { const at2 = `${at}.ai.harness[${i}].pieces[${j}]`;
    if (!(x.kind in data.copy.case.harness.kinds)) err(`${at2}: kind "${x.kind}" is not blocks, waits or guides`);
    if (!(x.files || []).length) err(`${at2}: a piece needs its evidence (files)`); }));
  if (cs.next && !w.roadmap) err(`${at}.next: the project has no roadmap to draw`);
  if (cs.path && !w.learningPath) err(`${at}.path: the project has no learning path to draw`);
  if (cs.ai && cs.ai.contrast && !ids.has(cs.ai.contrast.to)) err(`${at}.ai.contrast: unknown project "${cs.ai.contrast.to}"`);
  if (cs.video) for (const k of ["src", "poster", "alt"]) { if (!cs.video[k] || k === "alt" && !(cs.video.alt.en && cs.video.alt.es)) err(`${at}.video: missing ${k}${k === "alt" ? " { en, es }" : ""}`); else if (k !== "alt" && !fs.existsSync(path.join(root, cs.video[k]))) err(`${at}.video: ${cs.video[k]} not found`); }
}

// image copies (made by node tools/images.js): the pages load these, never the original
const IMG = require(path.join(root, "lib", "images.js"));
const lockFile = path.join(root, IMG.LOCK), lock = fs.existsSync(lockFile) ? JSON.parse(fs.readFileSync(lockFile, "utf8")) : {};
for (const src of IMG.sourcesOf(data)) {
  const orig = path.join(root, src);
  if (!fs.existsSync(orig)) continue;
  const stale = lock[src] !== IMG.hashOf(orig);
  for (const [k, c] of Object.entries(IMG.copiesOf(src))) {
    const f = path.join(root, c);
    if (!fs.existsSync(f)) { warn(`${src}: copy missing (${c}); run node tools/images.js`); continue; }
    if (stale) warn(`${c}: made from another version of its original; run node tools/images.js`);
    const kb = fs.statSync(f).size / 1024;
    if (kb > IMG.BUDGET[k]) warn(`${c}: ${kb.toFixed(1)} KB, over its ${IMG.BUDGET[k]} KB budget`);
  }
}

// page copy
const walk = (o, k) => typeof o === "string" ? tokens(o, k) : o && typeof o === "object" && Object.entries(o).forEach(([kk, v]) => walk(v, `${k}.${kk}`));
const { case: caseCopy, ...pageCopy } = data.copy;
// Plain's path line and the case's block tag fill their own blanks (tools/pages/plain.js, case.js): {done}, {now} and
// {total} count the learning path's blocks, {n} numbers one
const { line: pathLine, lineNone, block: blockTag, ...pathCopy } = pageCopy.path || {};
walk({ ...pageCopy, path: pathCopy }, "copy");
for (const [name, t, need] of [["line", pathLine, ["done", "now", "total"]], ["lineNone", lineNone, ["done", "total"]], ["block", blockTag, ["n"]]]) {
  if (!(t && t.en && t.es)) { err(`copy.path.${name}: needs { en, es }`); continue; }
  for (const [k, v] of Object.entries(t)) {
    for (const x of need) if (!v.includes(`{${x}}`)) err(`copy.path.${name}.${k}: needs {${x}}`);
    tokens(v.replace(/\{(done|now|total|n)\}/g, ""), `copy.path.${name}.${k}`);
  }
}
// the case labels fill their own blanks in tools/pages/case.js: {name} (a project), {commit} and {date} (the pin)
JSON.stringify(caseCopy).replace(/\{(\w+)\}/g, (m, k) => { if (!["name", "commit", "date"].includes(k)) err(`copy.case: unknown template ${m}`); return m; });

// computed values, for review against copy-deck section 9
if (process.argv.includes("--calc")) {
  const day = now.toISOString().slice(0, 10), years = C.careerYears(data, now);
  console.log(`Computed against ${day}\n\ncareer: ${years}+ years`);
  console.log("\nepisodes and lengths");
  for (const w of C.episodes(data)) console.log(`  Episode ${C.episode(data, w.id)} · ${w.name.padEnd(22)} ${C.lapse(w.start, w.end, now).padEnd(16)} ${C.range(w.start, w.end)}  ·  ${C.range(w.start, w.end, "es")}`);
  for (const [id, e] of Object.entries(data.employers)) console.log(`  ${e.name} · ${C.fill((e.note.en || e.note).split("**").join(""), { lapse: C.lapse(e.start, e.end, now) })}  (${C.range(e.start, e.end)})`);
  console.log("\nskills");
  for (const s of data.skills.filter(s => s.at.length)) console.log(`  ${s.name.padEnd(36)} ${C.skillSpan(s, data, now).padEnd(30)} pages: ${s.level === "core" && !s.legacy && s.pages !== false && C.skillLength(s, data, now) || "—"}`);
  const gs = data.work.find(w => w.learningPath);
  if (gs) console.log(`\n${C.fill(gs.source, { pin: gs.pin })}\n${C.fill(data.copy.path.updated.en || data.copy.path.updated, { updated: gs.learningPath.updated })}`);
  console.log(`\n${C.fill(data.copy.page.description, { careerYears: years })}`);
}

for (const w of warnings) console.log(`warn  ${w}`);
for (const e of errors) console.log(`ERROR ${e}`);
console.log(`\n${errors.length} errors · ${warnings.length} warnings`);
process.exit(errors.length ? 1 : 0);
