---
version: 1
slug: "case-html"
primary_target: "modernnotes.html"
related_targets: ["gamestack.html", "index.html"]
---

# Surface brief: case studies (`modernnotes.html`, then `gamestack.html`)

**Scope and mode:** one page per own build, for the reader who audits. Same world as Plain (`index-html.md`): it
inherits the landing's tokens (`data-world="read"`), its bar and its contact section, and adds nothing of its own beyond
the pieces a case needs (the screens strip, the data-flow diagram, the decisions table). Approved comp: the **Ficha**
(`_comps/caso-modernnotes/ficha.html`, Alan 2026-10-27).

**Audience and job:** a hiring manager or senior engineer checks that the landing's claims hold. Every claim on the page
links to the file that proves it, at a pinned commit. Action: open the code, or get in touch.

**Built page:** `src/case.html` + `tools/pages/case.js` → `_site/<case>.html`, from the project's entry in
`data/portfolio.js` (header, highlights, screens, repo) and `data/cases/<case>.js` (the body). A case joins the build by
having that file. Shared with Plain: `src/partials/bar-read.*`, `contact-read.html`, `copy-email.js`.

## Contract

FIRST SCREEN: cobalt field. Left: "All work", the name at display size, a meta line (status chip, dates and computed
length, "Own build"), the lede, the role, repo and README links. Right: the raised "At a glance" sheet (the card's three
highlights with purple checks, then the "Stack" tags). The phone screens straddle the field's edge.

ORDER: Overview → (Why, only if the case needs it) → Architecture → Key decisions → Tests → (How AI was used) → What went
wrong, what is missing → repo, README and the pinned commit, said once → "All work" left, "Next case" right → the
landing's contact. Each section is optional per case; the bar lists only the sections drawn.

RULES (DECISIONS.md → Pulido de la Ficha; Diagrama: Flujo de datos):
- Each idea once, in its place; a repeat only when it does another job.
- No boxes with a colored bar on one side. Purple only for own builds; status colors only for status.
- The diagram follows the data in one direction: a trunk of ≤ 6 pieces, layers as columns, a mark on the source of
  truth, side inputs below, one way back; HTML/CSS with no geometry; vertical below 1000 px. Meaning never by color
  alone. Diagram tokens hold ≥ 3:1 in both themes.
- Class names break only before their role (GetNotes·UseCase). Each section title links to itself.
- Screens: a strip with scroll-snap, never a carousel; arrows only where it overflows; a tap opens a viewer
  (keys, swipe, "2 / 3", focus back to the screen viewed). A video, if any, goes first and plays in its frame.
- Stack tags: Skills used at the project (same names) plus 2–3 verified libraries, ≤ ~15; check-data enforces it.

FINISH: Lighthouse mobile and desktop, impeccable `audit` with the detector, `polish`, `impeccable-finish-reviewer`.

## Unresolved

- "Next case" with more than two cases: a fixed order (today: the data's order, wrapping) or a list of all cases.
  The ending's look is decided with it; until then the comp's "NEXT CASE" label stays above the name, an exception to
  the kicker ban accepted by Alan on 2026-10-28 (reviewers: do not flag it again).
- Dark mode of the cases is reviewed with Plain's in phase 9 (diagram surfaces at 1.2–1.3:1).
- A share image per case (today the landing's `og.png`).
