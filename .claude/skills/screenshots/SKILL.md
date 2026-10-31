---
name: screenshots
description: Take screenshots of the portfolio pages (Plain, Show, case studies, CV) at desktop and phone widths, light and dark, check them for JavaScript errors with Edge headless, run Lighthouse, or build the side-by-side comparison images for comps. Use whenever a page change or prototype needs to be seen or verified. Pass what to capture and what to check as the argument.
context: fork
agent: general-purpose
background: false
---

# Screenshots (runs as a forked subagent)

The task is in the argument below. Capture, look at the images yourself with Read, and return **text only**: findings per page and width, JS errors, scores, and the absolute paths
of any image the main session should send to Alan. Never paste image contents or long tool output into the result.
Save images to the scratchpad of the session (or `_comps/<topic>/` for comps).

Task: $ARGUMENTS

## Tools (Windows)

The Chrome extension does not connect on this machine: pages are checked with **Edge headless** through `capture.sh`
(next to this file).

```
bash .claude/skills/screenshots/capture.sh shot   <page.html> <out.png> [width] [height] [query]
bash .claude/skills/screenshots/capture.sh errors <page.html> [query]
```

## Standard pass after a change

Pages are the built ones: `node tools/build.js` first, then `_site/index.html` (Plain), `_site/show.html` (Show) and
`_site/<case>.html`. The CV has no page yet.

1. `errors` on every page touched.
2. `shot` at **1440×900** and at **500×1000** (Edge headless never goes below a 504 px viewport, so 500 stands in for
   phones; for 360/390/820 px, capture a small page that frames the target in iframes of those widths).
3. Also `theme=dark` (and `theme=light` if the system is dark). `open` shows the Skills detail on Plain and Show.
4. Compare against the page's brief in `.impeccable/surfaces/` and `DESIGN.md` (read by range) and report what is off.

| Query | Page | Effect |
|---|---|---|
| `theme=dark` / `theme=light` | all | forces the theme |
| `open` | Plain, Show | opens "See years and where I used each one" |
| `today=2027-09-15` | all | simulates another date (lengths, years, the Show axis) |

## Lighthouse

Run it headless with Kaspersky's requests blocked (Alan does not need to turn Kaspersky off): start
`node tools/serve.js --port=8181` in the background, set `CHROME_PATH` to Edge's `msedge.exe`, then

```
npx -y lighthouse@13.4.1 http://localhost:8181/<page>.html [--preset=desktop] \
  --blocked-url-patterns="*kaspersky-labs.com*" --chrome-flags="--headless=new" --output=json --output-path=<scratch>.json
```

One run at a time, no `#` in the URL. Report the four scores, page weight, LCP, TBT and CLS from the JSON (extract them
with `node -e`, never print the JSON). Known: Best practices is 77 everywhere, from two audits: `errors-in-console`
(the missing favicon's 404, phase 9) and `is-on-https` (Kaspersky's injected http script; local only, not on the live site).

## Known limits

- A long page: raise the height (e.g. 1440×4000) rather than scrolling; `#anchor` URLs come out black, also inside
  iframes, so capture the whole page and crop it in a small viewer page.
- Sticky bars and scroll states cannot be captured. For interactive states, make a temporary sibling copy with a script
  that clicks on `load` (top-level `let` and functions are globals), capture it, and delete the copy.
- A class name reused across sections, or a top-level `const top` (clashes with `window.top`), breaks a page silently.

## Comparison images for comps

Every comp or visual option goes to Alan twice, images and live; this fork prepares both, the main session sends them.

1. **Images:** desktop and phone captures combined side by side in one PNG per option (a small page of `<img>`
   captured at its full size). Return their absolute paths; the main session sends them with `SendUserFile`.
2. **Live:** a comparison page in `_comps/<topic>/` that frames the real pages side by side in scaled iframes, with
   desktop/phone and light/dark switches and an "open alone" link per option. Pages there use relative paths with
   copies of `tokens.css`, the fonts and the images, so the same folder works locally and as a private artifact. Return
   the folder; the main session publishes it (files at the same relative paths) and gives Alan the artifact link and
   the local `file:///C:/…` path.
