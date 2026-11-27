# Screenshots: reference

## Claude in Chrome

The extension (`mcp__claude-in-chrome__*`) is for looking at a page in the real Chrome: interaction, motion, sticky
headers at desktop width. `resize_window` does not give a phone viewport (390 asked, the page saw 1006 px). It only
connects while Chrome is open and logged in to claude.ai. If `tabs_context_mcp` says it is not connected: open Chrome,
then `/mcp` (reconnect) and `/chrome`.

## Lighthouse

Run it headless with Kaspersky's requests blocked. Its injected script stays local (the live site never has it), so
leave its failures out of the scores you judge by and say so; ask Alan to turn the injection off (several manual steps
for him) only when a result cannot be separated from it. Start
`node tools/serve.js --port=8181` in the background, set `CHROME_PATH` to Edge's `msedge.exe`, then

```
npx -y lighthouse@13.4.1 http://localhost:8181/<page>.html [--preset=desktop] \
  --blocked-url-patterns="*kaspersky-labs.com*" --chrome-flags="--headless=new" --output=json --output-path=<scratch>.json
```

One run at a time, no `#` in the URL. Report the four scores, page weight, LCP, TBT and CLS from the JSON (extract them
with `node -e`, never print the JSON). Known: Best practices is 77 everywhere, from two audits: `errors-in-console`
(the missing favicon's 404, phase 9) and `is-on-https` (Kaspersky's script, so not the site's).

## Known limits of `shots.js`

- Phone widths are Chromium's emulation, not iOS Safari or a real touch screen. Images are taken from the top of the
  page with reduced motion: sticky bars, scroll states and animations are looked at in Chrome.
- For `--full` and `--el` the whole page is scrolled once before the capture, so what appears on scroll is already
  there; a first-screen capture is taken without scrolling. A `--full` piece below the first screen enlarges the view
  while it is taken, so a part that watches the scroll may show its scrolled state there.
- The stretch check sees `<img>` only: a CSS background or mask image is not measured.
- A class name reused across sections, or a top-level `const top` (clashes with `window.top`), breaks a page silently.

## Comparison images for comps

Every comp or visual option goes to Alan twice, images and live.

1. **Images:** desktop and phone captures combined side by side in one PNG per option (a small page of `<img>`
   captured with `--full` at its width), sent with `SendUserFile`.
2. **Live:** a comparison page in `_comps/<topic>/` that frames the real pages side by side in scaled iframes, with
   desktop/phone and light/dark switches and an "open alone" link per option. Pages there use relative paths with
   copies of `tokens.css`, the fonts and the images, so the same folder works locally and as a private artifact
   (published with the files at the same relative paths). Give Alan the artifact link and the local `file:///C:/…` path.
