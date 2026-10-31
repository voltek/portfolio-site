---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: ["cv.html", "show.html"]
---

# Surface brief: landing (`index.html`, Plain)

**Scope and mode:** the portfolio landing's main door since 2026-10-17 (Alan): Plain. Inform fast and let the reader audit. The expressive version (Show, `show.html`, provisional name, its own brief in `show-html.md`) ships beside it from the same data file; each links to the other from its header. The CV (`cv.html`) inherits this direction.

**Audience and job:** technical recruiters decide in seconds whether to keep reading, so role, seniority, stack, availability and every job are visible without clicks; hiring managers audit through case studies and public repos. Action: get in touch or download the CV.

**Constraints:** every number dated and linked to a public repo; no invented proof; client work and own builds kept visibly apart.

**Built page:** `src/plain.html` + `tools/pages/plain.js` → `_site/index.html` (phase 4, 2026-10-21). The prototype (1d-9; palette chosen by Alan on 2026-10-16) is in the private history, `21f7e48` (`git -C _private show`).

## Direction (to be written as a full contract before the build)

OWN-WORLD: deliberately the opposite of Show: sober and corporate, easy to read and to find things in. Light: cobalt `#1F3FBF` field with paper panels; dark: "Noche azul" (Alan, 2026-10-17), a slightly deeper cobalt band `#1A35A3` over blue-black paper `#0A1029`, cards `#141E46`, visible rules `#323E76`, with the Now building box as the lighter surface. Client work in light blue `#9FB3F2` (dark `#4F6AD2`), never grey. One clickable color, Bricolage Grotesque for display (max 96 px) and Figtree for reading, no hard shadows, no illustration. It shares with Show only the data, the status colors and purple = own builds. The theme follows the system until the visitor picks one.

ORDER: hero + Now building box → Skills → Experience → Education and languages → What comes next → contact; sticky top bar with the current section marked.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict and DESIGN.md.

## Unresolved

- The header link to the expressive version gets inviting copy in the copy deck (today "See the full version"): it should say plainly that it leads to the animated, expressive version (Alan, 2026-10-20).
