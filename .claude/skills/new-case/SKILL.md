---
name: new-case
description: Add a case study to the portfolio, for a new project or one already on the site - its entry on both landings, its own case page, and the landing "Now" sections when it is the build in progress. Use when Alan asks for a new case study or a new project with one. Pass the project id from data/portfolio.js (or the repo, for a new project) as the argument.
---

# New case study

This only orders the work; each step lives where it points. Point to headings, not step numbers.

1. **Read the rules before writing a word:** `_private/handoff/DECISIONS.md` → *Case studies* (grep the heading, read
   that range).
2. **Truth first:** the `sync-project` skill with the id, up to its copy stop, not through it: it reads the repo and
   writes the ledger, `FACTS.md` and the project's section in `case-inventory.md` (one row per case section).
3. **Pick the sections** from the catalog in `tools/pages/case.js` (`SECTIONS`, fixed order): one enters only if its
   inventory row has backing and it says something the page has not. A section outside the catalog is code and
   Alan's call: stop and ask.
4. **Copy stop, once:** the rows `sync-project` would propose plus every text the page needs, EN and ES, in `copy-deck.md` with its source; wait for Alan on each row.
   If the project is in progress, ask also for what "Now" draws (`proof` rows, `roadmap`, `learningPath`).
5. **Landings:** not yet in `work` → `DATA.md` → *I started a project* (one entry feeds Quick and Cartoon). "Now
   building" and "Now showing" follow the newest project in progress on their own; if another one is still in progress,
   tell Alan it leaves "Now" and ask whether it stays in progress.
6. **The page:** `DATA.md` → *New case study*; screens and video by *New app screenshots* and *New demo video*.
7. **Verify:** `node tools/build.js`; the `screenshots` skill on the case and on both landings (Quick and Cartoon move
   together). Then the PR as `CLAUDE.md` says.
