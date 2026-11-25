---
name: screenshots
description: Take screenshots of the portfolio pages (Plain, Show, case studies) at real phone and desktop widths, light and dark, check them for JavaScript errors and sideways overflow with Edge headless, run Lighthouse, or build the side-by-side comparison images for comps. Use whenever a page change or prototype needs to be seen or verified. Pass what changed and the mode (quick, yours, full) as the argument; quick by default.
---

# Screenshots

Task: $ARGUMENTS

`node tools/build.js` first; the pages are `_site/index.html` (Plain), `_site/show.html` and `_site/<case>.html`. The
CV is two PDFs, not a page: `node tools/cv.js --check` prints them and reads them back.

| Mode | When | What |
|---|---|---|
| **quick** | after each change, and before the PR when it is one card or only text | you, no subagent: only what changed, 390 and 1440, one theme (both if a color changed); Read those images |
| **yours** | Alan says he will look himself | you: `--check` on the pages touched, then give him the link or file; Read no image |
| **full** | once, before the PR, if `src/`, `tokens.css` or `assets/` changed | one `general-purpose` agent (Alan approved it), as below |

```
node .claude/skills/screenshots/shots.js <page.html>... [options]      # options: the file's header
# quick, one Show card (k counts from 0):
node .claude/skills/screenshots/shots.js _site/show.html --click=".frame[data-k='3']" --el=".card.on" --out=<scratchpad>
# full, the pages touched:
node .claude/skills/screenshots/shots.js <pages> --full --width=360,390,820,1440 --theme=light,dark --out=<scratchpad>
```

- Errors and overflow are printed as text for every page and width: no image is needed to know them.
- Queries for `--query`: `open` (opens the Skills detail on Plain and Show), `today=2027-09-15` (simulates a date).
- Images go to the scratchpad, or `_comps/<topic>/` for comps.

**Full:** give the agent the pages, what changed, the command above and the path of `reference.md` (here). It Reads every
360 and 1440 image in both themes, and 390 and 820 only where a layout changes or something looks off; compares with
the page's brief in `.impeccable/surfaces/` and `DESIGN.md` (read by range), and returns **text only**: findings per
page and width, and the paths of any image worth sending to Alan. Lighthouse joins only for a new page or a redesigned
section.

Lighthouse, Claude in Chrome, limits and comparison images for comps: `reference.md`, the section you need.
