// Checks data/portfolio.js before anything is built or deployed: broken ids, invalid dates, missing texts, public counts
// without a date, screens that do not exist. Errors stop the build (exit 1); warnings list what is pending.
// Runs locally and in the phase 10 Action.
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
// a CV text: { en, es }; es null = Spanish pending
const bi = (t, where) => {
  if (t == null || typeof t !== "object") return err(`${where}: expected { en, es }`);
  if (!t.en) err(`${where}: missing en`);
  if (t.es === undefined) err(`${where}: missing es (use null while pending)`);
  else if (t.es === null) warn(`${where}: Spanish pending`);
};
const TOKEN = /\{(careerYears|lapse|countsDate|updated|count:\w+)\}/g;
const tokens = (t, where) => {
  for (const s of [].concat(t && typeof t === "object" ? [t.en, t.es] : t).filter(Boolean)) {
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
  span(e, `employers.${id}`, true); bi(e.role, `employers.${id}.role`); bi(e.intro, `employers.${id}.intro`); tokens(e.note, `employers.${id}.note`);
}

// work: jobs and projects
const ids = new Set(), STATUS = ["in-progress", "completed"], ON = ["plain", "show", "case"];
data.work.forEach((w, i) => {
  const at = `work.${w.id || i}`;
  if (!w.id) err(`work[${i}]: missing id`); else if (ids.has(w.id)) err(`${at}: duplicate id`); else ids.add(w.id);
  if (!w.name) err(`${at}: missing name`);
  if (!["job", "project"].includes(w.type)) err(`${at}: type must be "job" or "project"`);
  span(w, at, w.type === "project" || true);
  if (w.employer && !data.employers[w.employer]) err(`${at}: unknown employer "${w.employer}"`);
  if (w.type === "job") { if (!w.employer) bi(w.role, `${at}.role`); bi(w.studio, `${at}.studio`); }
  if (w.type === "project") {
    if (!STATUS.includes(w.status)) err(`${at}: status must be ${STATUS.join(" or ")}`);
    if (w.status === "completed" && w.end == null) err(`${at}: completed but has no end date`);
    if (w.status === "in-progress" && w.end != null) err(`${at}: in progress but has an end date`);
    if (!w.links || !w.links.repo) warn(`${at}: no repo link`);
  }
  bi(w.what, `${at}.what`);
  if (!Array.isArray(w.highlights) || w.highlights.length !== 3) err(`${at}: exactly three highlights per card`);
  else w.highlights.forEach((h, j) => { bi(h, `${at}.highlights[${j}]`); tokens(h, `${at}.highlights[${j}]`); });
  if (!Array.isArray(w.stack) || !w.stack.length) err(`${at}: missing stack`);
  if (!w.show || !w.show.title) warn(`${at}: no Show title card`);
  (w.shots || []).forEach((s, j) => {
    const where = `${at}.shots[${j}]`;
    if (!fs.existsSync(path.join(root, s.src))) warn(`${where}: file not found, the empty state will show (${s.src})`);
    if (!s.label) err(`${where}: missing label`);
    if (!s.alt) warn(`${where}: alt text pending`);
    if (!Array.isArray(s.on) || !s.on.every(o => ON.includes(o))) err(`${where}: "on" must list ${ON.join(", ")}`);
  });
  if (w.counts) {
    const keys = Object.keys(w.counts).filter(k => !["date", "commit"].includes(k));
    if (!w.counts.date) err(`${at}.counts: public numbers need the day they were counted`);
    else date(w.counts.date, `${at}.counts.date`);
    if (!w.counts.commit) warn(`${at}.counts: no commit to trace the numbers back to`);
    for (const k of keys) if (!Number.isInteger(w.counts[k])) err(`${at}.counts.${k}: not a whole number`);
    const used = JSON.stringify([w.proof, w.source, data.skills]).match(/\{count:(\w+)\}|"count":"(\w+)"/g) || [];
    for (const u of used) { const k = u.replace(/\{count:|\}|"count":|"/g, ""); if (!keys.includes(k)) err(`${at}: count "${k}" is used but not counted`); }
  }
  (w.proof || []).forEach((r, j) => { if (!r.check && !r.count) err(`${at}.proof[${j}]: needs count or check`);
    if (!Array.isArray(r.on) || !r.on.every(o => ON.includes(o))) err(`${at}.proof[${j}]: "on" must list ${ON.join(", ")}`); tokens(r.note, `${at}.proof[${j}]`); });
  if (w.learningPath) {
    const lp = w.learningPath;
    date(lp.updated, `${at}.learningPath.updated`);
    const ST = ["done", "now", "next", "goal"];
    lp.blocks.forEach((b, j) => {
      if (!ST.includes(b.status)) err(`${at}.learningPath.blocks[${j}]: status must be ${ST.join(", ")}`);
      (b.steps || []).forEach(s => { if (!ST.includes(s[1])) err(`${at}.learningPath.blocks[${j}]: step "${s[0]}" has status "${s[1]}"`); });
    });
    if (lp.blocks.filter(b => b.status === "goal").length > 1) err(`${at}.learningPath: more than one goal`);
  }
});
const running = data.work.filter(w => w.status === "in-progress");
if (!running.length) warn(`no project in progress: "Now building" shows its designed empty state`);
const sorted = data.work.every((w, i, a) => !i || C.parse(a[i - 1].start) <= C.parse(w.start));
if (!sorted) err("work: keep it oldest first (it is the episode order)");

// skills
const LEVELS = Object.keys(data.copy.skills.levels).filter(l => l !== "legacy"), names = new Set();
data.skills.forEach((s, i) => {
  const at = `skills.${s.name || i}`;
  if (!s.name) err(`skills[${i}]: missing name`); else if (names.has(s.name)) err(`${at}: duplicate`); else names.add(s.name);
  if (!LEVELS.includes(s.level)) err(`${at}: level must be ${LEVELS.join(", ")}`);
  if (!Array.isArray(s.at) || !s.at.length) return err(`${at}: "at" lists no place`);
  for (const r of s.at) {
    const id = typeof r === "string" ? r : r.id;
    if (!ids.has(id)) err(`${at}: unknown place "${id}"`);
    if (typeof r === "object") { if (r.start) date(r.start, `${at}.at.${id}.start`); if (r.end) date(r.end, `${at}.at.${id}.end`); }
  }
  if (s.note) tokens(s.note, at);
});

// case studies: data/cases/<page>.js for each project's links.caseStudy (DECISIONS.md → Case page rules and
// Data-flow diagram). Wrong ids and shapes are errors; the size limits of the diagram and the stack are warnings.
const { FILE, SECTIONS } = require(path.join(root, "tools", "pages", "case.js"));
for (const w of data.work.filter(x => x.links && x.links.caseStudy)) {
  const f = path.join(root, "data", "cases", w.links.caseStudy.replace(/\.html$/, ".js"));
  if (!fs.existsSync(f)) { warn(`work.${w.id}: ${w.links.caseStudy} has no data/cases/${path.basename(f)} yet; its links wait`); continue; }
  const cs = require(f), at = `cases/${path.basename(f)}`;
  if (cs.id !== w.id) err(`${at}: id "${cs.id}" is not its project "${w.id}"`);
  if (!cs.pin || !/^[0-9a-f]{7,40}$/.test(cs.pin.commit || "")) err(`${at}: pin.commit missing: every code link goes to that commit`);
  else date(cs.pin.date, `${at}.pin.date`);
  for (const k of ["lede", "role", "readme"]) if (!cs[k]) err(`${at}: missing ${k}`);
  for (const k of Object.keys(cs)) if (/^[a-z]+$/.test(k) && !SECTIONS.includes(k) && !["id", "pin", "roots", "readme", "lede", "role", "stack", "libs", "video", "shots"].includes(k)) warn(`${at}: "${k}" is not a section the page draws`);
  // every file names a root the case has
  const A = cs.architecture || {}, F = A.flow;
  const refs = [cs.readme, ...(A.walk || []).flatMap(s => s.files || []), ...(cs.decisions || []).flatMap(d => d.files || []),
    ...((cs.tests || {}).items || []).flatMap(t => t.files || []), ...((cs.missing || {}).items || []).flatMap(g => g.files || []),
    ...(F ? F.pieces.map(p => p.file) : [])].filter(Boolean);
  for (const r of refs) { const m = String(r).match(FILE); if (!m || !((m[1] || "main") in (cs.roots || {}))) err(`${at}: file "${r}" names no root of roots`); }
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
  if (cs.ai && cs.ai.contrast && !ids.has(cs.ai.contrast.to)) err(`${at}.ai.contrast: unknown project "${cs.ai.contrast.to}"`);
  if (cs.video) for (const k of ["src", "poster", "alt"]) { if (!cs.video[k]) err(`${at}.video: missing ${k}`); else if (k !== "alt" && !fs.existsSync(path.join(root, cs.video[k]))) err(`${at}.video: ${cs.video[k]} not found`); }
}

// image copies (made by node tools/images.js): the pages load these, never the original
const IMG = require(path.join(root, "lib", "images.js"));
for (const src of IMG.sourcesOf(data)) {
  const orig = path.join(root, src);
  if (!fs.existsSync(orig)) continue;
  for (const [k, c] of Object.entries(IMG.copiesOf(src))) {
    const f = path.join(root, c);
    if (!fs.existsSync(f)) { warn(`${src}: copy missing (${c}); run node tools/images.js`); continue; }
    if (fs.statSync(f).mtimeMs < fs.statSync(orig).mtimeMs) warn(`${c}: older than its original; run node tools/images.js`);
    const kb = fs.statSync(f).size / 1024;
    if (kb > IMG.BUDGET[k]) warn(`${c}: ${kb.toFixed(1)} KB, over its ${IMG.BUDGET[k]} KB budget`);
  }
}

// page copy
const walk = (o, k) => typeof o === "string" ? tokens(o, k) : o && typeof o === "object" && Object.entries(o).forEach(([kk, v]) => walk(v, `${k}.${kk}`));
const { case: caseCopy, ...pageCopy } = data.copy;
walk(pageCopy, "copy");
// the case labels fill their own blanks in tools/pages/case.js: {name} (a project), {commit} and {date} (the pin)
JSON.stringify(caseCopy).replace(/\{(\w+)\}/g, (m, k) => { if (!["name", "commit", "date"].includes(k)) err(`copy.case: unknown template ${m}`); return m; });

// computed values, for review against copy-deck section 9
if (process.argv.includes("--calc")) {
  const day = now.toISOString().slice(0, 10), years = C.careerYears(data, now);
  console.log(`Computed against ${day}\n\ncareer: ${years}+ years`);
  console.log("\nepisodes and lengths");
  for (const w of C.episodes(data)) console.log(`  Episode ${C.episode(data, w.id)} · ${w.name.padEnd(22)} ${C.lapse(w.start, w.end, now).padEnd(16)} ${C.range(w.start, w.end)}  ·  ${C.range(w.start, w.end, "es")}`);
  for (const [id, e] of Object.entries(data.employers)) console.log(`  ${e.name} · ${C.fill(e.note, { lapse: C.lapse(e.start, e.end, now) })}  (${C.range(e.start, e.end)})`);
  console.log("\nskills");
  for (const s of data.skills) console.log(`  ${s.name.padEnd(36)} ${C.skillSpan(s, data, now)}`);
  const gs = data.work.find(w => w.counts);
  if (gs) console.log(`\n${C.fill(gs.source, { counts: gs.counts })}\n${C.fill(data.copy.path.updated, { updated: gs.learningPath.updated })}`);
  console.log(`\n${C.fill(data.copy.page.description, { careerYears: years })}`);
}

for (const w of warnings) console.log(`warn  ${w}`);
for (const e of errors) console.log(`ERROR ${e}`);
console.log(`\n${errors.length} errors · ${warnings.length} warnings`);
process.exit(errors.length ? 1 : 0);
