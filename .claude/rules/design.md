---
paths:
  - "src/**"
  - "tokens.css"
  - "DESIGN.md"
  - "assets/**"
  - "_comps/**"
  - ".impeccable/**"
---

# Design work

- The `impeccable` skill (project-scoped) owns design work. Once per session, before it:
  `.claude/skills/impeccable/scripts/impeccable.cmd context --target index.html`.
- Rules in force: `DESIGN.md`. Each page's world: its brief in `.impeccable/surfaces/`. New pages and prototypes follow
  `DESIGN.md` and `PRODUCT.md` from the start and compute anything time-based from the dates (no hard-coded year).
  Old prototypes are not retrofitted unless Alan asks.
- **Plain and Show move together** (Alan, 10-28): a change to a piece both pages have (Skills and its detail,
  Experience, contact, the bar, shared copy) goes to both in the same session, each in its own world; the report says
  what changed in each. Grep the other page for the same piece before closing. Only Alan naming one page keeps it there.
- Shared pieces of Plain's world live in `src/partials/`: include them, never copy or rebuild them (`DESIGN.md` →
  *The Bar Menu Rule*, *The Contact Rule*).
- A page's `body` (not only `html`) carries background, color and the 16 px base: the artifact viewer wraps pages in
  its own `body`.
- A new page counts as done only after: Lighthouse mobile and desktop (skill `screenshots` → *Lighthouse*), impeccable
  `audit` with the detector, `polish`, and the `impeccable-finish-reviewer` agent. Report scores and findings,
  including what was not fixed.

## Deciding visual options with Alan

- He decides by seeing options side by side (same markup, one variable changed), with one recommendation and the why,
  not a bare rule. When he says "plantéamelo primero", propose and wait. Finalists are standalone interactive pages
  with the real photo, not static sketches.
- Taste: colorful, bold, flat bright colors and recognizable formats land; dark technical, soft craft and "hacker"
  worlds missed. Check fit for a recruiter's fast read, not only visual appeal ("is this a CV?"). Build 1–2 deep, not 4
  shallow, and say upfront what is a real limitation.
- Before prototyping or proposing a direction, look at real references as images (download and view them, not text
  results) and say what was taken from each. Style only: no characters, logos or brand names on the site.
- Every comp goes out twice: images (SendUserFile) and live (private artifact + local `file:///C:/…` path). Procedure:
  skill `screenshots` → *Showing options to Alan*. Comps live in `_comps/<topic>/`.
- Never propose a design mainly because it reuses an existing piece: say why it fits best, or say reuse was the reason.
- Within a named scope, a CSS custom property set on a container is inherited by everything inside: reset it on
  children that sit on their own paint, and confirm the touched surfaces with a before/after image.
- On throwaway prototypes, fix detector findings silently; report findings, fixes and ignores only on final builds.
- The shared preview artifact is republished only when Alan asks (`DECISIONS.md` → *Avance publicado*).
