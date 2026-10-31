# CLAUDE.md

Guidance for Claude Code in this repository. Loaded every session: keep it short and point to the files that hold the detail.

## Session protocol (temporary)

<!-- ALERT: remove this whole section in phase 11 of the handoff (project close), together with _private/handoff/ (archive
     it), the memory session-workflow and the skill close-session. -->

The redesign + CV build runs in small sessions. Read **only** `_private/handoff/HANDOFF.md` at start (status, next step);
`DECISIONS.md` and `FACTS.md` are read by range on demand, never whole. History lives in commit messages and in
`_private/archive/` (frozen; grep only). Close with the `close-session` skill, which updates the handoff **once, at the end**.
Where this file and the handoff disagree, the handoff is newer.

Large files (`src/show.html` ~78 KB, `_site/show.html` ~204 KB) are read by range or with Grep, never whole. Skill `screenshots` to see and
check pages. GameStack numbers are not recounted while building: they get automated (GitHub Action) and checked before deploy.

## Cost: the live site must cost as little as possible

Alan wants to pay the minimum once the site is live; today the only planned cost is the domain. Every proposal or new
piece must weigh what it would cost to host and run, and choose the cheapest option that works:

- Static files on GitHub Pages (free); no backend, database, serverless functions, paid APIs or paid services.
- Automation only within free tiers (GitHub Actions on a public repo); nothing that bills per request or per minute.
- Keep what visitors download small (compressed images, few fonts, no heavy libraries): Pages has bandwidth limits.
- If something would add a cost (a paid tier, a service, a subscription), say so and the cheaper alternative before building it.

## What this is

Portfolio of Alan Hernández (Senior Android Developer) for technical recruiters (scan) and hiring managers (audit).
Plain HTML/CSS/JS, no framework, no npm dependencies. **One build step (Alan, 10-21):** `tools/build.js` (plain Node)
fills the pages from `data/portfolio.js` into `_site/` (gitignored); a free GitHub Action runs `tools/check-data.js` and
the build on push and deploys `_site/` to Pages. Dated numbers are computed by `lib/calc.js` at build time and again in the
browser on load. Recipes for data changes: `DATA.md`. Local git repo (no remote until phase 10); custom domain.

- **Plain** (the quick read; Alan's names since 10-20), the main door: `index.html`, built from `src/plain.html`.
- **Show** (Cortinilla), the expressive version: `show.html`, built from `src/show.html`. Their prototypes left at the end of
  phase 4 (in the private history, `21f7e48` (`git -C _private show`)). Older notes still say "quick read" and "Cortinilla": they mean these two.
- Each links to the other; both (and both CVs) read `data/portfolio.js`. The CV has no design yet (phase 7a); the old
  draft `cv-vivo.html` was deleted on 10-22 (in the private history, `815e17b` (`git -C _private show`)).
- See the site locally: `node tools/build.js`, then `node tools/serve.js` (http://localhost:8080/).
- The old bento site is an anti-reference, never extended; it lives only in the private history (`df28821`).
- `_private/sources/` holds inputs and drafts. `_private/archive/` keeps only what may still serve before launch (today the original
  photo); anything that will not be reused is deleted, and git is the way to recover it. `_`-prefixed folders are not published by Pages.

## Hard rules

- **Never fabricate proof**: no metrics, testimonials, benchmarks, inflated leadership or AI work not done. Every claim must be
  defensible in an interview. Product truth lives in `PRODUCT.md`.
- Source precedence: public repo > `_private/sources/sources.md`.
- ModernNotes is "100% hand-written": Claude never writes code in that repo, only guides and audits.
- No copy reaches the site without passing `_private/sources/copy-deck.md` with its source and Alan's approval.
- Replies to Alan in Spanish; site and CV in English (the CV also in Spanish).

## Design

Visual rules in force live in `DESIGN.md` (guardrails until the documenter rewrites it from the build). Each page's world
lives in its surface brief: `.impeccable/surfaces/index-html.md` (quick read) and `show-html.md` (Cortinilla).
Every new page, once finished, is checked before it counts as done (Alan, 10-27): Lighthouse mobile and desktop, then
impeccable `audit` with the detector, `polish`, and the `impeccable-finish-reviewer` agent; report scores and findings.
**Plain and Show move together (Alan, 10-28):** a change to a piece both pages have (Skills and its detail, Experience,
contact, the bar's behavior, shared copy) is made in both in the same session, in each one's own visual world; the
report says what changed in each. Only Alan naming one page alone keeps it there.
The `impeccable` skill (project-scoped, v4.5.2) owns design work. Once per session before design work:
`.claude/skills/impeccable/scripts/impeccable.cmd context --target index.html`

## Tool notes (Windows)

- Screenshots with Edge headless (the Chrome extension does not connect). In Git Bash, file URLs are `file:///C:/…`, not `$PWD`.
- Phone widths: Edge headless never goes below a 504 px viewport; for 360 px, load the page in a 360 px `<iframe>`. JS errors: inject `window.onerror` that writes to `<title>`, read it with `--dump-dom`.
- A page's `body` (not only `html`) carries background, color and the 16 px base: the artifact viewer wraps pages in its own `body`.
- Lighthouse: Claude runs it headless with Kaspersky's requests blocked (command in `DECISIONS.md` → *Peso y velocidad*).
- Shared pieces of Plain's world live in `src/partials/` (the bar, "Let's talk"): include them, never copy or rebuild them
  (`DESIGN.md` → *The Bar Menu Rule*, *The Contact Rule*).
