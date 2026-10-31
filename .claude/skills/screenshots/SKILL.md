---
name: screenshots
description: Take screenshots of the portfolio pages (Plain, Show, CV) at desktop and phone widths, light and dark, and check them for JavaScript errors, with Edge headless. Use whenever a prototype or page change needs to be seen or verified.
---

# Capturas

The Chrome extension does not connect on this machine, so pages are checked with **Edge headless** through `capture.sh`
(next to this file). Save images to the session scratchpad, then look at them with Read.

```
bash .claude/skills/screenshots/capture.sh shot   <page.html> <out.png> [width] [height] [query]
bash .claude/skills/screenshots/capture.sh errors <page.html> [query]
```

## Standard pass after a change

The pages are the built ones: run `node tools/build.js` first, then capture `_site/index.html` (Plain) and
`_site/show.html` (Show). The CV has no page yet (phase 7a designs it).

1. `errors` on every page touched.
2. `shot` at **1440×900** and at **500×1000** (Edge clips at 390 px, so 500 stands in for phones).
3. Both pages: also `theme=dark` (and `theme=light` if the system is dark). Both pages: `open` shows the Skills detail.
4. Read the images and compare against the surface brief. Fix detector findings on drafts silently.

## URL switches in the pages

| Query | Page | Effect |
|---|---|---|
| `theme=dark` / `theme=light` | both | forces the theme |
| `open` | both | opens "See years and where I used each one" |
| `today=2027-09-15` | both | simulates another date (lengths, years, the Show axis) |

## Known limits

- A long page: raise the height (e.g. 1440×4000) rather than scrolling; `#anchor` URLs come out black, so capture the
  whole page and crop it in a small viewer page.
- Sticky bars and scroll states cannot be captured. For interactive states, make a temporary sibling copy with a script
  that clicks on `load` (top-level `let` and functions are globals), capture it, and delete the copy.
- Inside an `iframe`, `#anchor` does not work in headless. Widths of 360/390/820 px can be checked with a page that
  frames the target in iframes of those widths.
- Watch for class names reused across sections (`.star` broke cards once) and for `const top` (it clashes with `window.top`).

## Showing options to Alan

Every comp or visual option goes out **twice** (Alan, 2026-10-23): he may follow the session remotely.

1. **Images:** desktop and phone captures combined side by side in one PNG each (a small page of `<img>` captured
   at its full size), sent with `SendUserFile` (`display: "render"`).
2. **Live:** a private Artifact that frames the real pages side by side in scaled iframes, with desktop/phone and
   light/dark switches and an "open alone" link per option. Pages, `tokens.css`, the fonts they use and their images
   go in `files` at the same relative paths (absolute `file:///` paths do not reach the artifact). Give him the
   artifact link and the local `file:///C:/…` path of the same comparison page.

Comps live in `_comps/<topic>/` (gitignored, never published by Pages; the Artifact tool only publishes from inside the
project). Pages there use relative paths with copies of `tokens.css`, the fonts and the images, so the same folder works
locally and as the artifact. What survives a decision moves into `src/`.
