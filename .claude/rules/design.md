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

- The `impeccable` skill owns design work; its `context` step loads `DESIGN.md`, `PRODUCT.md` and the page's brief.
- **Plain and Show move together**: a change to a piece both pages have (Skills and its detail, Experience, contact,
  the bar, shared copy) goes to both in the same session, each in its own world, and the report says what changed in
  each. Only Alan naming one page keeps it there.
- Shared pieces of Plain's world live in `src/partials/`: include them, never copy or rebuild them.
- A page's `body` (not only `html`) carries background, color and the 16 px base: the artifact viewer wraps pages in
  its own `body`.
- A new page counts as done only after Lighthouse mobile and desktop (skill `screenshots`), impeccable `audit` with the
  detector, `polish`, and the `impeccable-finish-reviewer` agent. Report scores and findings, also what was not fixed.

## Deciding visual options with Alan

- He decides by seeing options side by side (same markup, one variable changed), with one recommendation and its why.
  Finalists are standalone interactive pages with the real photo, not static sketches.
- Taste: colorful, bold, flat bright colors and recognizable formats land; dark technical, soft craft and "hacker"
  worlds miss. Check fit for a recruiter's fast read, not only visual appeal. Build 1–2 options deep, not 4 shallow.
- Before proposing a direction, look at real references as images (download and view them) and say what was taken
  from each. Style only: no characters, logos or brand names on the site.
- Never propose a design mainly because it reuses an existing piece: say why it fits best, or that reuse was the reason.
- Every comp goes out as images and live (skill `screenshots` → *Comparison images*); comps live in `_comps/<topic>/`.
- On throwaway prototypes, fix detector findings silently; report them only on final builds.
- The shared preview artifact is republished only when Alan asks (`DECISIONS.md` → *Avance publicado*).
