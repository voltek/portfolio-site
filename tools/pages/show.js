// Show (show.html): the parts of src/show.html that come from the data. Each key fills a {{@key}} of the template.
// Everything the prototype drew in the browser is drawn here: every episode card (the remote only switches which one
// shows), the strip, the skills timeline, the title card's rays and color bars.
const { C, esc, calc, text, calcData, head, srcset, status, ICON } = require("./common.js");
const IMG = require("../../lib/images.js");

/* ---------- props: one painted object per episode, its title lettered on it (show.prop in the data) ---------- */
const ink = (w = 6) => `stroke="#111" stroke-width="${w}" stroke-linejoin="round"`;
const shadow = (cx = 200, rx = 150) => `<ellipse cx="${cx}" cy="322" rx="${rx}" ry="12" fill="#000" opacity=".22"/>`;
const pencil = (x, y, r) => `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="0" y="-11" width="112" height="22" fill="#F9C80E" ${ink(4)}/><rect x="0" y="-11" width="112" height="6" fill="#fff" opacity=".35"/><rect x="112" y="-11" width="14" height="22" fill="#C9C9C9" ${ink(4)}/><rect x="126" y="-11" width="20" height="22" rx="5" fill="#F49AC1" ${ink(4)}/><path d="M0 -11L-28 0L0 11Z" fill="#F2D3A0" ${ink(4)}/><path d="M-18 -4L-28 0L-18 4Z" fill="#111"/></g>`;
const T = (x, y, s, fam, fill, txt = "", extra = "") => `<text x="${x}" y="${y}" text-anchor="middle" font-family="${fam}" font-size="${s}" fill="${fill}" ${extra}>${esc(txt)}</text>`;

const qr = (() => { // a generic, unreadable QR-like pattern
  let seed = 7, out = ""; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647, m = 5.1;
  const finder = (cx, cy) => `<rect x="${cx * m}" y="${cy * m}" width="${7 * m}" height="${7 * m}" fill="#111"/><rect x="${(cx + 1) * m}" y="${(cy + 1) * m}" width="${5 * m}" height="${5 * m}" fill="#fff"/><rect x="${(cx + 2) * m}" y="${(cy + 2) * m}" width="${3 * m}" height="${3 * m}" fill="#111"/>`;
  for (let y = 0; y < 21; y++) for (let x = 0; x < 21; x++) {
    const inF = (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12);
    if (!inF && rnd() > .52) out += `<rect x="${(x * m).toFixed(1)}" y="${(y * m).toFixed(1)}" width="5.4" height="5.4" fill="#111"/>`;
  }
  return out + finder(0, 0) + finder(14, 0) + finder(0, 14);
})();

const bulbs = (() => { // lamps around the marquee frame
  const pts = [], x0 = 38, x1 = 362, y0 = 52, y1 = 218, step = 27;
  for (let x = x0; x <= x1; x += step) pts.push([x, y0], [x, y1]);
  for (let y = y0 + step; y < y1; y += step) pts.push([x0, y], [x1, y]);
  return pts.map(([x, y], i) => `<circle class="bulb b${i % 2}" cx="${x}" cy="${y}" r="6" fill="#FFF4B0" ${ink(2.5)}/>`).join("");
})();

// t: the title's lines, quotes included ("“PAPER", "CHASE”")
const PROPS = {
  ticket: t => `${shadow()}<g transform="rotate(-6 200 175)">
    <rect x="80" y="60" width="256" height="246" rx="10" fill="#DCCFAE" ${ink()}/>
    <rect x="68" y="48" width="256" height="246" rx="10" fill="#FFF8E6" ${ink()}/>
    <path d="M68 104V58a10 10 0 0 1 10-10h236a10 10 0 0 1 10 10v46Z" fill="#E5392B" ${ink()}/>
    ${T(196, 85, 23, "Bangers", "#fff", "CITATION · No. 0001", 'letter-spacing="2"')}
    ${Array.from({ length: 17 }, (_, i) => `<circle cx="${84 + i * 14}" cy="118" r="3" fill="#111" opacity=".45"/>`).join("")}
    ${T(196, 186, 68, "Bangers", "#B8261A", t[0], 'letter-spacing="1"')}${T(196, 252, 68, "Bangers", "#B8261A", t[1], 'letter-spacing="1"')}
    <path d="M92 284H300" stroke="#111" stroke-width="2.5" opacity=".4"/>
    <path class="sig" pathLength="1" d="M196 280c8-14 15-14 19 0s10 9 17-5 12-7 15 3 12 0 19-9" fill="none" stroke="#1F4E9E" stroke-width="3.5" stroke-linecap="round"/></g>
    <g class="scribble">${pencil(282, 270, -34)}</g>`,

  suitcase: t => `${shadow(200, 168)}
    <path d="M150 98V72a14 14 0 0 1 14-14h72a14 14 0 0 1 14 14v26" fill="none" stroke="#111" stroke-width="16" stroke-linecap="round"/>
    <path d="M150 98V72a14 14 0 0 1 14-14h72a14 14 0 0 1 14 14v26" fill="none" stroke="#8A4B1C" stroke-width="6" stroke-linecap="round"/>
    <rect x="36" y="96" width="328" height="212" rx="26" fill="#D9822B" ${ink()}/>
    <rect x="54" y="108" width="292" height="9" rx="4.5" fill="#fff" opacity=".3"/>
    <rect x="94" y="96" width="28" height="212" fill="#8A4B1C" ${ink(5)}/><rect x="278" y="96" width="28" height="212" fill="#8A4B1C" ${ink(5)}/>
    <rect x="88" y="122" width="40" height="26" rx="4" fill="#F9C80E" ${ink(4)}/><rect x="272" y="122" width="40" height="26" rx="4" fill="#F9C80E" ${ink(4)}/>
    <g transform="rotate(-12 74 262)"><circle cx="74" cy="262" r="30" fill="#7F52FF" ${ink(4)}/>${T(74, 274, 32, "Titan One", "#fff", "K")}</g>
    <g transform="rotate(10 326 258)"><ellipse cx="326" cy="258" rx="34" ry="26" fill="#4ADE80" ${ink(4)}/><path d="M326 272c-9-11-13-17-13-23a13 13 0 0 1 26 0c0 6-4 12-13 23z" fill="#E5392B" ${ink(3)}/><circle cx="326" cy="249" r="4" fill="#fff"/></g>
    <g transform="rotate(-4 200 200)"><g class="swing" style="transform-origin:120px 170px"><rect x="100" y="150" width="200" height="100" rx="14" fill="#FFF8E6" ${ink()}/><circle cx="120" cy="170" r="6" fill="#fff" ${ink(3)}/>
    ${T(204, 194, 36, "Pacifico", "#1F5FAD", t[0])}${T(204, 236, 36, "Pacifico", "#1F5FAD", t[1])}</g></g>`,

  scanner: t => `${shadow()}
    <g transform="rotate(14 300 120)"><rect x="236" y="34" width="130" height="168" rx="4" fill="#E3EEF7" ${ink(5)}/></g>
    <g transform="rotate(-16 90 130)"><rect x="30" y="60" width="120" height="156" rx="4" fill="#E3EEF7" ${ink(5)}/></g>
    <path d="M96 34H262L312 84V312H96Z" fill="#fff" ${ink()}/><path d="M262 34V84H312" fill="#D6E2EC" ${ink()}/>
    ${[234, 254, 274, 294].map((y, i) => `<rect x="122" y="${y}" width="${i === 3 ? 104 : 164}" height="8" rx="4" fill="#C9D3DC"/>`).join("")}
    ${T(204, 140, 72, "Bangers", "#111", t[0])}${T(204, 210, 72, "Bangers", "#C62828", t[1])}
    ${[[84, 22, 1, 1], [324, 22, -1, 1], [84, 324, 1, -1], [324, 324, -1, -1]].map(([x, y, a, b]) => `<path d="M${x} ${y + 26 * b}V${y}H${x + 26 * a}" fill="none" stroke="#111" stroke-width="13" stroke-linecap="round"/><path d="M${x} ${y + 26 * b}V${y}H${x + 26 * a}" fill="none" stroke="#FFD23F" stroke-width="6" stroke-linecap="round"/>`).join("")}
    <g class="beam"><rect x="62" y="146" width="284" height="38" fill="#5CF2D6" opacity=".55" filter="url(#soft)"/><rect x="62" y="160" width="284" height="10" rx="5" fill="#C4FFF3" ${ink(3)}/></g>`,

  qr: t => `${shadow(200, 175)}
    ${[0, 1, 2, 3, 4].map(i => `<ellipse cx="70" cy="${300 - i * 13}" rx="38" ry="12" fill="#F2B705" ${ink(4)}/>`).join("")}<ellipse cx="70" cy="248" rx="22" ry="6" fill="none" stroke="#B88A00" stroke-width="3"/>
    ${[0, 1, 2].map(i => `<ellipse cx="336" cy="${300 - i * 13}" rx="36" ry="11" fill="#F2B705" ${ink(4)}/>`).join("")}<g class="coin"><ellipse cx="336" cy="261" rx="36" ry="11" fill="#F2B705" ${ink(4)}/><ellipse cx="336" cy="259" rx="20" ry="5" fill="none" stroke="#B88A00" stroke-width="3"/></g>
    <rect x="122" y="18" width="156" height="296" rx="26" fill="#111"/><rect x="134" y="46" width="132" height="236" rx="8" fill="#fff"/><rect x="180" y="28" width="40" height="7" rx="3.5" fill="#555"/>
    <g transform="translate(147 64)">${qr}</g>
    <path d="M18 196H70L56 222L70 248H18Z" fill="#C99A06" ${ink(5)}/><path d="M382 196H330L344 222L330 248H382Z" fill="#C99A06" ${ink(5)}/>
    <path d="M46 184H354V260H46Z" fill="#FFD23F" ${ink()}/>${T(200, 233, 26, "Titan One", "#111", t.join(" "))}`,

  cert: t => `${shadow()}
    <rect x="34" y="40" width="332" height="250" rx="6" fill="#FFF6DA" ${ink()}/>
    <rect x="52" y="58" width="296" height="214" fill="none" stroke="#2F6F4E" stroke-width="5"/><rect x="62" y="68" width="276" height="194" fill="none" stroke="#2F6F4E" stroke-width="2"/>
    ${T(200, 98, 14, "Nunito", "#2F6F4E", "DEPOSIT CERTIFICATE", 'font-weight="800" letter-spacing="4"')}
    ${T(200, 156, 40, "Titan One", "#111", t[0])}${T(200, 204, 40, "Titan One", "#111", t[1])}
    <path d="M298 270l-14 48 16-8 10 14 8-46z" fill="#C62828" ${ink(4)}/><path d="M334 270l14 48-16-8-10 14-8-46z" fill="#C62828" ${ink(4)}/>
    <polygon points="${Array.from({ length: 24 }, (_, i) => { const r = i % 2 ? 27 : 34, a = i / 24 * Math.PI * 2; return `${(316 + r * Math.cos(a)).toFixed(1)},${(262 + r * Math.sin(a)).toFixed(1)}`; }).join(" ")}" fill="#E8B422" ${ink(4)}/><circle cx="316" cy="262" r="17" fill="none" stroke="#111" stroke-width="3"/>
    <g transform="rotate(-14 128 246)"><g class="stamp" filter="url(#rough)"><rect x="60" y="220" width="140" height="52" rx="8" fill="none" stroke="#D2232A" stroke-width="5"/>${T(130, 257, 34, "Bangers", "#D2232A", "REINVEST", 'letter-spacing="2"')}</g></g>`,

  notepad: t => `${shadow()}
    <rect x="66" y="44" width="268" height="272" rx="10" fill="#FFE98A" ${ink()}/>
    ${[110, 140, 170, 200, 230, 260, 290].map(y => `<path d="M70 ${y}H330" stroke="#7FB3D5" stroke-width="2.5"/>`).join("")}<path d="M112 48V312" stroke="#E57373" stroke-width="2.5"/>
    ${Array.from({ length: 9 }, (_, i) => { const x = 92 + i * 27; return `<rect x="${x - 6}" y="26" width="12" height="34" rx="6" fill="none" stroke="#111" stroke-width="5"/><rect x="${x - 6}" y="26" width="12" height="34" rx="6" fill="none" stroke="#B0B6BC" stroke-width="2"/>`; }).join("")}
    <g transform="rotate(-4 210 170)">${T(214, 158, 56, "Gochi Hand", "#1F4E9E", t[0])}${T(214, 220, 56, "Gochi Hand", "#1F4E9E", t[1])}</g>
    ${[252, 282].map((y, k) => `<rect x="126" y="${y - 14}" width="16" height="16" rx="2" fill="#fff" ${ink(3)}/><path class="tick t${k + 1}" pathLength="1" d="M129 ${y - 7}l4 5 8-11" fill="none" stroke="#1F4E9E" stroke-width="3.5" stroke-linecap="round"/><path d="M152 ${y - 6}q12-8 24 0t24 0t24 0" fill="none" stroke="#1F4E9E" stroke-width="3" stroke-linecap="round"/>`).join("")}
    ${pencil(296, 300, -48)}`,

  marquee: t => `${shadow(200, 170)}
    <path d="M46 236H354L376 302H24Z" fill="#E5392B" ${ink()}/>
    <path d="M120 270V246" stroke="#111" stroke-width="8"/><ellipse cx="120" cy="276" rx="26" ry="8" fill="#111"/><circle cx="120" cy="240" r="15" fill="#111"/><circle cx="115" cy="235" r="4" fill="#fff" opacity=".6"/>
    ${[[236, "#FFD23F"], [276, "#2EC4F1"], [316, "#fff"]].map(([x, c]) => `<ellipse cx="${x}" cy="272" rx="15" ry="11" fill="${c}" ${ink(4)}/>`).join("")}
    <rect x="26" y="40" width="348" height="190" rx="16" fill="#24124F" ${ink()}/>
    <rect x="50" y="64" width="300" height="142" rx="8" fill="url(#mq)" ${ink(4)}/>${bulbs}
    ${T(200, 128, 52, "Bangers", "#111", t[0], 'letter-spacing="1"')}${T(200, 186, 52, "Bangers", "#111", t[1], 'letter-spacing="1"')}`,

  // the generic prop, for an episode whose show.prop has no painting yet: a clapperboard with the title on its slate
  slate: t => `${shadow(200, 160)}<g transform="rotate(-4 200 200)">
    <rect x="52" y="112" width="296" height="196" rx="12" fill="#2B2B2B" ${ink()}/>
    <rect x="70" y="130" width="260" height="160" rx="6" fill="#FFF8E6" ${ink(4)}/>
    <g transform="rotate(-9 56 110)"><rect x="52" y="62" width="296" height="46" rx="8" fill="#fff" ${ink()}/>
    ${[0, 1, 2, 3, 4].map(i => `<path d="M${76 + i * 56} 65h30l-22 40h-30z" fill="#111"/>`).join("")}</g>
    <circle cx="66" cy="112" r="9" fill="#C9C9C9" ${ink(4)}/>
    ${t.length > 1 ? T(200, 200, 50, "Bangers", "#111", t[0], 'letter-spacing="1"') + T(200, 258, 50, "Bangers", "#C62828", t[1], 'letter-spacing="1"') : T(200, 230, 50, "Bangers", "#111", t[0], 'letter-spacing="1"')}</g>`
};
const propOf = w => PROPS[w.show && w.show.prop] ? w.show.prop : "slate";
// the title as lettered on the prop, inside curly quotes
const lines = w => { const t = (w.show && w.show.title) || [w.name]; return t.map((l, i) => `${i ? "" : "“"}${l}${i === t.length - 1 ? "”" : ""}`); };
const propSVG = w => `<svg class="prop" viewBox="0 0 400 340" aria-hidden="true">${PROPS[propOf(w)](lines(w))}</svg>`;

// the title card's sunburst and the color bars of the set warming up
const RAYS = Array.from({ length: 28 }, (_, i) => { const a = i / 28 * Math.PI * 2, b = (i + 1) / 28 * Math.PI * 2, R = 900, p = n => n.toFixed(1);
  return `<path class="${i % 2 ? "ray-sky" : "ray-sun"}" d="M0 0L${p(R * Math.cos(a))} ${p(R * Math.sin(a))}L${p(R * Math.cos(b))} ${p(R * Math.sin(b))}Z"/>`; }).join("");
const BARS = [["#C0C0C0", "#C0C000", "#00C0C0", "#00C000", "#C000C0", "#C00000", "#0000C0"], ["#0000C0", "#131313", "#C000C0", "#131313", "#00C0C0", "#131313", "#C0C0C0"], ["#00214C", "#FFFFFF", "#32006A", "#131313", "#131313"]]
  .map((row, i) => `<div class="r${i + 1}">${row.map(c => `<i style="background:${c}"></i>`).join("")}</div>`).join("");

const STAR = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.8l2.9 6.4 7 .7-5.2 4.7 1.5 6.9L12 17l-6.2 3.5 1.5-6.9L2.1 8.9l7-.7z" style="fill:var(--sun);stroke:var(--ink)" stroke-width="2" stroke-linejoin="round"/></svg>`;
const PIN = `<svg viewBox="0 0 30 40" aria-hidden="true"><path d="M15 38S3 23 3 14a12 12 0 0 1 24 0c0 9-12 24-12 24z" fill="#E5392B" stroke="#111" stroke-width="3" stroke-linejoin="round"/><circle cx="15" cy="14" r="5" fill="#fff" stroke="#111" stroke-width="2.5"/></svg>`;
const FLAG = `<svg viewBox="0 0 24 30" aria-hidden="true"><path d="M3 29V2" stroke="#111" stroke-width="3" stroke-linecap="round"/><path d="M4 3h17l-4 5 4 5H4z" fill="#FFFFFF" stroke="#111" stroke-width="2.5" stroke-linejoin="round"/><path d="M8 3v5h4V3h4v5h-4v5H8V8H4" fill="#111"/></svg>`;
const AI = `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7.5 4Q7.5 11 14.5 11Q7.5 11 7.5 18Q7.5 11 0.5 11Q7.5 11 7.5 4Z M15.5 1Q15.5 4.5 19 4.5Q15.5 4.5 15.5 8Q15.5 4.5 12 4.5Q15.5 4.5 15.5 1Z M16 13Q16 15.5 18.5 15.5Q16 15.5 16 18Q16 15.5 13.5 15.5Q16 15.5 16 13Z" fill="currentColor"/></svg>`;

module.exports = ctx => {
  const { data, now } = ctx, cp = data.copy, p = data.profile, ui = cp.experience.showUi;
  const byId = id => data.work.find(w => w.id === id);
  const live = data.work.find(w => w.status === "in-progress"); // "Now showing"; none = the section and its link leave
  const [first, ...rest] = p.name.split(" ");
  const initials = first[0] + rest.join(" ")[0];
  const STATUS = { "in-progress": [cp.experience.kind["in-progress"], "var(--wip)"], completed: [cp.experience.kind.completed, "var(--done)"] };
  const chip = s => `<span class="chip"><i style="background:${STATUS[s][1]}" aria-hidden="true"></i>${esc(STATUS[s][0])}</span>`;
  const cardlinks = l => l ? `<p class="cardlinks">${l.caseStudy ? `<a class="go" href="${esc(l.caseStudy)}">${esc(cp.experience.links.caseStudy)}</a>` : ""}<a href="${esc(l.repo)}">${ICON.github}${esc(cp.experience.links.repo)}</a></p>` : "";

  // the seasons: own builds (2) then client work (1), each newest first. This is the order of the strip and of the
  // remote, so "Older" always walks the strip left to right.
  const newest = data.work.slice().reverse();
  const SEASONS = [[2, cp.skills.legend.own, newest.filter(w => w.type === "project")], [1, cp.skills.legend.client, newest.filter(w => w.type === "job")]]
    .filter(([, , list]) => list.length);
  const order = SEASONS.flatMap(([, , list]) => list);
  const seasonOf = w => w.type === "project" ? 2 : 1;
  // the label on the card and the strip: "América Móvil · Claro Drive", "Globant · CitiBanamex"
  const co = w => [w.company || (w.employer && data.employers[w.employer].name), w.name].filter(Boolean).join(" · ");
  const plainTitle = w => ((w.show && w.show.title) || [w.name]).join(" ");
  // the calendar years of some places; marked for live.js while one of them is still running
  const years = list => { const v = C.yearSpan(list, now);
    return list.some(w => w.end == null) ? `<span data-calc="years" data-ids="${list.map(w => w.id).join(",")}">${v}</span>` : v; };

  /* ---------- an episode card (mode "feature" is the one in Now showing) ---------- */
  const card = (w, mode) => {
    const n = C.episode(data, w.id), emp = w.employer && data.employers[w.employer], lp = C.lapseParts(w.start, w.end, now);
    // its length, in words for screen readers and as a sticker beside the company label; marked while it still runs
    const mark = k => w.end == null ? ` data-calc="${k}" data-id="${w.id}"` : "";
    const about = `<span${mark("lapse")}${w.end == null ? ` data-about="${esc(ui.about)}"` : ""}>${C.lapse(w.start, w.end, now).replace("≈", ui.about)}</span>`;
    const sticker = `<span class="dur" aria-hidden="true"><b${lp.n % 1 ? ' class="half"' : ""}${mark("dur")}>≈${lp.n}</b><small${mark("dur-unit")}>${lp.unit}</small></span>`;
    const head = `<div class="head"><span class="ep">${esc(ui.episode)} ${n} · ${mode === "feature" ? esc(ui.inProduction) : `${esc(ui.season)} ${seasonOf(w)}`}</span>
      <p class="star"><b>${esc(first.toUpperCase())}</b><i>${esc(ui.starIn)}</i></p>${mode === "feature" ? "" : `<p class="co-row" aria-hidden="true"><span class="co">${esc(co(w))}</span>${sticker}</p>`}<h3 class="sr">${esc(first)} ${esc(ui.starIn)} ${esc(plainTitle(w))}: ${esc(w.name)}, ${C.range(w.start, w.end)}, ${about}</h3></div>`;
    if (mode === "feature") {
      const shots = (w.shots || []).filter(s => s.on.includes("show")).slice(0, 3);
      return `${head}<div class="bug">${propSVG(w)}</div>
      <div class="shots">${shots.map(s => `<button type="button" class="shot" data-full="${esc(IMG.copiesOf(s.src).full)}" data-cap="${esc(`${w.name} · ${s.label}`)}"><span class="sr">${esc(cp.aria.viewLarger)}</span><span class="frame-p"><img ${srcset(s.src, "(max-width: 900px) 30vw, 160px")} alt="${esc(s.alt || "")}" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'empty',textContent:'${esc(s.label)}'}))"></span><span class="lbl">${esc(s.label)}</span></button>`).join("")}</div>`;
    }
    const studio = w.type === "project" ? cp.experience.kind.project : w.studio.en;
    const dates = `${C.range(w.start, w.end)}${w.type === "project" ? ` ${chip(w.status)}` : ""}`;
    // a build with a roadmap trades the full credits and highlights for one credits line and its next episodes
    if (w.roadmap) return `${head}${propSVG(w)}
      <p class="what">${text(ctx, w.what.en)}</p>
      <p class="credline">${esc(studio)} · ${dates}</p>
      ${road(w)}
      ${cardlinks(w.links)}`;
    const cr = ui.credits;
    return `${head}${propSVG(w)}
      <p class="what">${text(ctx, w.what.en)}</p>
      <dl class="credits"><dt>${esc(cr.studio)}</dt><dd>${esc(studio)}</dd><dt>${esc(cr.dates)}</dt><dd>${dates}</dd>${emp ? `<dt>${esc(cr.total)}</dt><dd>${calc.lapse(ctx, w.employer)} ${esc(ui.at)} ${esc(emp.name)} (${C.range(emp.start, emp.end)})</dd>` : ""}<dt>${esc(cr.featuring)}</dt><dd>${esc(w.stack.join(" · "))}</dd></dl>
      <div class="hl"><p class="hl-h">${esc(ui.highlights)}</p><ul class="stars">${w.highlights.map(h => `<li>${STAR}${text(ctx, h.en)}</li>`).join("")}</ul></div>
      ${cardlinks(w.links)}`;
  };

  // next episodes, as Cuphead's progress line: every step is a point, the goal is the last one (a flag), and the pin
  // sits halfway between the last finished step and the first one that isn't
  const PS = cp.path.status;
  const lane = (label, steps, goal) => {
    const n = steps.length, k = steps.findIndex(s => s[1] !== "done"), x = i => +(i / n * 100).toFixed(3);
    const here = k < 0 ? 100 : k === 0 ? 0 : (x(k - 1) + x(k)) / 2;
    const say = (t, s, i) => i === k ? `${s === "now" ? ui.stopNow : ui.stopNext}: ${t}` : t;
    return `<div class="rl"><b>${esc(label)}</b><div class="rline" style="--n:${n};--f:${here}%" role="img" aria-label="${esc(`${label}: ${steps.map(([t, s]) => `${t} (${PS[s].toLowerCase()})`).join(", ")}. ${ui.goal}: ${goal}`)}">
      <span class="rfill"></span>${steps.map(([t, s], i) => `<span class="stop${s === "done" ? " ok" : i === k ? " at" : ""}" style="--x:${x(i)}%"><em>${esc(say(t, s, i))}</em></span>`).join("")}
      <span class="stop goal" style="--x:100%">${FLAG}<em><small>${esc(ui.goal)}</small>${esc(goal)}</em></span><span class="pin" style="--x:${here}%">${PIN}<b>${esc(ui.here)}</b></span></div></div>`;
  };
  const road = w => {
    const path = w.learningPath, lanes = [lane(w.roadmap.lane, w.roadmap.steps, w.roadmap.goal)];
    if (path) { const g = path.blocks.find(b => b.status === "goal"); lanes.push(lane(path.lane, path.blocks.flatMap(b => b.steps || []), g ? g.short || g.title : "")); }
    return `<div class="road"><p class="hl-h">${esc(ui.next)}</p><div class="lanes">${lanes.join("")}</div></div>`;
  };

  /* ---------- the episode guide: every card, the first one showing; the remote switches between them ---------- */
  const cards = order.map((w, k) => `<div class="card paint th-${propOf(w)}${w.roadmap ? " vr" : ""}${k ? "" : " on"}" data-k="${k}">${card(w)}</div>`).join("\n");
  const inter = (s, label, list) => `<div class="inter" aria-hidden="true"><span>${esc(ui.season)} ${s}</span><b>${esc(label)}</b><small>${years(list)}</small></div>`;
  const reel = SEASONS.map(([s, label, list]) => inter(s, label, list) + list.map(w => { const k = order.indexOf(w);
    return `<button type="button" class="frame" data-k="${k}" aria-current="${!k}"><span class="sr">${esc(ui.episode)} ${C.episode(data, w.id)}: </span><span class="mini paint th-${propOf(w)}" aria-hidden="true">${propSVG(w)}</span><span class="cap"><b>${esc(co(w))}</b><small>${years([w])}</small></span></button>`; }).join("")).join("");

  /* ---------- now showing: the build in progress, its real screens and its record ---------- */
  const nowShowing = !live ? "" : `<section class="now" id="now" aria-labelledby="now-h">
  <div class="wrap">
    <p class="kick">${esc(ui.nowKick)}</p>
    <h2 class="h2" id="now-h">${esc(cp.nav.show[0])}</h2>
    <div class="feature" id="feature">
      <div><div class="tv"><div class="screen"><div class="card feat paint th-${propOf(live)}">${card(live, "feature")}</div></div></div>
        ${(live.shots || []).some(s => s.on.includes("show")) ? `<p class="shots-note">${esc(cp.experience.shotsNote)}</p>` : ""}</div>
      <div><h3>${esc(live.name)}</h3>${chip("in-progress")}
        <p class="lede">${text(ctx, (live.lede || live.what).en)}</p>
        ${live.proof ? `<p class="rec-h">${esc((live.show && live.show.record) || "")}</p>
        <ul class="ledger">${live.proof.filter(r => r.on.includes("show")).map(r => `<li><span class="k">${esc(r.label)}<small>${text(ctx, r.note, { counts: live.counts })}</small></span><i aria-hidden="true"></i><b>${r.check
          ? `<svg viewBox="0 0 24 24" width="32" height="32" role="img" aria-label="${esc(cp.aria.yes)}"><path d="M4 13l5 5L20 6" fill="none" style="stroke:var(--sun)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`
          : live.counts[r.count]}</b></li>`).join("")}</ul>` : ""}
        ${live.source ? `<p class="source">${text(ctx, live.source, { counts: live.counts })} · <a href="${esc(live.links.repo)}">${esc(live.links.repo.replace(/^https?:\/\//, ""))}</a></p>` : ""}
        <div class="ctas">${live.links.caseStudy ? `<a class="btn go" href="${esc(live.links.caseStudy)}">${esc(cp.experience.links.caseStudy)}</a>` : ""}<a class="btn alt" href="${esc(live.links.repo)}">${ICON.github}${esc(cp.experience.links.repo)}</a></div></div>
    </div>
  </div>
</section>`;

  // the learning path behind the live build waits after the episode guide, as next season's teaser
  const path = live && live.learningPath, ST = { done: "var(--done)", now: "var(--wip)", next: "var(--next)", goal: "var(--sun)" };
  const dot = s => `<i style="background:${ST[s]}" aria-hidden="true"></i>`;
  const season = !path ? "" : `<section class="season" id="season" aria-labelledby="tm-h"><div class="wrap"><div class="montage">
    <p class="kick">${esc(cp.path.heading.show[0])}</p><h2 class="tm-h" id="tm-h">${esc(cp.path.heading.show[1])}</h2>
    <p class="tm-lede">${text(ctx, path.intro, { tag: "b" })}${path.arc ? ` ${text(ctx, path.arc, { tag: "b" })}` : ""}</p>
    <ol class="blocks">${path.blocks.map(b => `<li class="${b.status}"><span class="st">${dot(b.status)}${esc(PS[b.status])}</span><span class="no">${esc(b.tag)}</span><h3>${esc(b.title)}</h3>${b.note ? `<p>${esc(b.note)}</p>` : ""}${b.steps ? `<ul class="steps">${b.steps.map(([t, s]) => `<li class="${s}">${dot(s)}${esc(t)}<span class="sr"> (${esc(PS[s])})</span></li>`).join("")}</ul>` : ""}</li>`).join("")}</ol>
    <p class="source">${text(ctx, cp.path.updated, { updated: path.updated })}</p></div></div></section>`;

  /* ---------- skills: the levels, then the timeline behind the toggle ---------- */
  const LV = ["core", "strong", "familiar"], L = cp.skills.levels;
  const indexed = data.skills.map((s, i) => ({ ...s, i }));
  const shown = indexed.filter(s => s.pages !== false);
  const byLevel = lv => shown.filter(s => !s.legacy && s.level === lv).sort((a, b) => !!b.ai - !!a.ai);
  const groups = [...LV.map(lv => [lv, byLevel(lv)]), ["legacy", shown.filter(s => s.legacy)]].filter(([, list]) => list.length);
  const tiers = groups.map(([id, list]) => `<div class="tier t-${id}"><div class="tlabel"><h3>${esc(L[id][0])}</h3><p>${esc(L[id][1])}</p></div>
    <ul class="chips">${list.map(s => `<li class="lv-${id === "legacy" ? "era" : s.level}">${esc(s.name)}</li>`).join("")}</ul></div>`).join("");

  // The timeline places each bar in years (decimals): the container holds where the axis starts (--x0) and ends
  // (--x1) and the reading day (--now); a bar that is still running ends at var(--now). live.js moves --now and, in a
  // new year, adds its column, so the HTML of the build day stays right on any later day.
  const D = d => +C.decimal(d).toFixed(4);
  const AX0 = Math.min(...data.work.map(w => D(C.parse(w.start)))), Y0 = Math.floor(AX0), Y1 = now.getUTCFullYear(), AX1 = Y1 + 1;
  const cols = `${(Y0 + 1 - AX0).toFixed(3)}fr repeat(${AX1 - Y0 - 1},1fr)`;
  const segs = s => s.at.map(r => { const ref = typeof r === "string" ? { id: r } : r, w = byId(ref.id), to = ref.end !== undefined ? ref.end : w.end;
    return { w, start: ref.start || w.start, end: to, a: D(C.parse(ref.start || w.start)), b: to == null ? null : D(C.parse(to)), own: w.type === "project" }; })
    .sort((x, y) => x.a - y.a);
  // places of the same kind that follow each other (a month and a half apart at most) read as one bar with dividers
  const runs = list => list.reduce((rs, s) => { const r = rs[rs.length - 1];
    if (r && r.own === s.own && r.b != null && s.a - r.b <= 1.5 / 12) { r.parts.push(s); r.b = s.b; }
    else rs.push({ a: s.a, b: s.b, own: s.own, parts: [s] });
    return rs; }, []);
  const end = b => b == null ? "var(--now)" : b;
  const label = s => `<em>${esc(s.w.short || s.w.name)}</em>`, tip = s => esc(`${s.w.name} · ${C.range(s.start, s.end)}`);
  const color = own => own ? "var(--own)" : "var(--client)";
  const bar = r => r.parts.length === 1
    ? `<span class="seg${r.own ? " own" : ""}" title="${tip(r.parts[0])}" style="--a:${r.a};--b:${end(r.b)};background:${color(r.own)}">${label(r.parts[0])}</span>`
    : `<span class="seg run${r.own ? " own" : ""}" style="--a:${r.a};--b:${end(r.b)};background:${color(r.own)}">${r.parts.map((s, i) =>
      `<span class="part${i ? " div" : ""}" title="${tip(s)}" style="--pa:${s.a};--pb:${i < r.parts.length - 1 ? r.parts[i + 1].a : "var(--b)"}">${label(s)}</span>`).join("")}</span>`;
  const axis = `<div class="taxis" aria-hidden="true"><ol>${Array.from({ length: AX1 - Y0 }, (_, i) => `<li>’${String((Y0 + i) % 100).padStart(2, "0")}</li>`).join("")}</ol></div>`;
  const legend = both => `<ul class="legend" aria-label="${esc(cp.aria.legend)}">${(both ? ["own", "client"] : ["client"]).map(k => `<li><i style="background:var(--${k})"></i>${esc(cp.skills.legend[k])}</li>`).join("")}</ul>`;
  const where = s => [...new Set(s.at.map(r => typeof r === "string" ? r : r.id))].map(byId)
    .map(w => w.type === "project" ? `<b>${esc(w.name)}</b>` : esc(w.name)).join(" · ");
  const counts = (data.work.find(w => w.counts) || {}).counts;
  const row = s => `<div class="trow"><div class="tname"><b>${esc(s.name)}</b><span>${calc.skill(ctx, s.i)}</span></div>
      <div class="track" aria-hidden="true">${"<i></i>".repeat(AX1 - Y0)}${runs(segs(s)).map(bar).join("")}<span class="now-line"></span></div>
      <p class="twhere">${where(s)}${s.note ? `<span class="tdetail">${text(ctx, s.note, { counts })}</span>` : ""}</p></div>`;
  // the key and the axis sit in the detail's head, held under the bar while the rows scroll; legacy is one more group
  const tlHead = legend(true) + axis;
  const timeline = groups.map(([id, list]) => `<div class="tgroup"><div class="thead"><h3>${esc(L[id][0])}</h3></div>${list.map(row).join("")}</div>`).join("");

  // the sections in the bar, in page order; Now showing leaves with the build in progress
  const nav = [["now", 0], ["skills", 1], ["guide", 2], ["contact", 3]].filter(([id]) => live || id !== "now")
    .map(([id, i]) => `<a href="#${id}">${esc(cp.nav.show[i])}</a>`).join("");

  const photo = (size, alt, lazy) => `<img ${srcset(p.photo.src, size)} alt="${esc(alt)}"${lazy ? ' loading="lazy"' : ""} onerror="this.replaceWith(Object.assign(document.createElement('span'),{textContent:'${esc(initials)}'}))">`;
  const ed = p.education;

  return {
    head: head(ctx, { title: cp.page.title.show, file: "show.html", themeColor: { light: "#2EC4F1", dark: "#131942" } }),
    nav, initials: esc(initials), rays: RAYS, bars: BARS,
    markPhoto: `<img ${srcset(p.photo.src, 42)} alt="" onerror="this.replaceWith(Object.assign(document.createElement('i'),{textContent:'${esc(initials)}'}))">`,
    badgePhoto: photo("(max-width: 900px) 100px, 170px", p.photo.alt), finalePhoto: photo(230, "", true),
    logoFirst: esc(first.toUpperCase()), logoRest: esc(rest.join(" ").toUpperCase()),
    status: status(p), lede: text(ctx, p.lede.show),
    stack: p.stack.map(s => `<li>${esc(s)}</li>`).join("") + `<li class="ai">${AI}${esc(p.aiLine.en)}</li>`,
    now: nowShowing, tiers, tlHead, timeline,
    tlStyle: `--x0:${AX0};--x1:${AX1};--now:${D(now)};--cols:${cols}`,
    expIntro: text(ctx, cp.experience.intro.show),
    cards, reel, season,
    finale: text(ctx, p.contact.show, { tag: "i" }),
    education: `${esc(ed.degree.en)}, ${esc(ed.school)}, <span style="white-space:nowrap">${esc(ed.start)}–${esc(ed.end)}</span>`,
    languages: p.languages.map(l => `${esc(l.name.en)}, ${esc(l.level.en)}`).join(" · "),
    githubIcon: ICON.github,
    calcData: calcData(data, Y1)
  };
};
