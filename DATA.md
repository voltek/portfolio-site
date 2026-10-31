# DATA.md — how to change the portfolio

Everything the pages say comes from `data/portfolio.js`. Plain, Show, the case-study headers and both CVs only draw it,
so a change is an edit there and nowhere else. Lengths, years, episode numbers and "Now building" are computed
(`lib/calc.js`); never type them.

After any edit:

```
node tools/check-data.js          # errors stop the build; warnings list what is pending
node tools/check-data.js --calc   # also prints every computed value, to read before publishing
node tools/build.js               # writes the pages into _site/ to preview them locally (open _site/index.html)
```

Publishing is a push: the GitHub Action runs the check, builds `_site/` and deploys it to Pages (phase 10). The
generated pages are not in git.

## Rules that hold in every recipe

- **Approved copy only.** A new text goes through `_private/sources/copy-deck.md` (with its source) before it lands here.
- **Defensible only.** No metric, testimonial or claim that cannot be defended in an interview (`PRODUCT.md`).
- **Three highlights per card**, always. What does not fit goes to the CV.
- **Dates:** `"2026-07"` (a month counts from its first day) or `"2026-07-15"` when the day matters; `end: null` while
  ongoing. `work` stays oldest first: that order is the episode order.
- **Texts the CV shows are `{ en, es }`.** `es: null` means the Spanish still needs approval; the check lists it.

## I finished a project

1. In its `work` entry: `status: "completed"` and `end: "YYYY-MM-DD"` (the last commit).
2. Nothing else. It leaves "Now building", its length stops growing, and its skills stop adding years. If another
   project is in progress, that one becomes "Now building"; if none is, the designed empty state shows.
3. If its learning path or roadmap should stay visible, they already travel with the project (and its case study).

## I started a project

1. Add a `work` entry at the end: `id` (two letters, unique), `type: "project"`, `status: "in-progress"`, `start`,
   `end: null`, `what`, three `highlights`, `stack`, `links.repo`, and `show.title` + `show.prop` for its episode (an
   unknown prop draws the generic one).
2. Screens are optional: list them in `shots` with `label`, `alt` and `on` (`"plain"`, `"show"`, `"case"`). Without
   them the designed empty state shows.
3. Add its id to the `at` of every skill it uses. The episode number, its season (own build) and "Now building" follow.

## New job

1. Add a `work` entry in date order with `type: "job"`, `start`, `end: null`, `studio`, `role` (or `employer` if it is a
   client of an employer listed in `employers`), `what`, three `highlights`, `stack`, `show`.
2. Add its id to the `at` of the skills used there.
3. The career "N+ years" starts growing again with the calendar, and the open-to-work line stays as written in
   `profile.status`: update it in the copy deck first if you are no longer looking.

## New app screenshots (or a new photo)

A raw phone screenshot is ~450 KB as PNG, more than the whole budget for Plain's first load (~300 KB). The pages
never load the original; they load light WebP copies made from it, and the build publishes only the copies.

1. Save the original PNG in `assets/projects/<app>/` with a short lowercase name (`search_results.png`). It stays in the
   repo as the source of the copies; it is not published. (The photo is `assets/alan.jpg`, `profile.photo.src`.)
2. List it in the project's `shots` with `label`, `alt` (what the screen shows, in plain words; the check warns while
   it is missing) and `on` (`"plain"`, `"show"`, `"case"`). Plain shows one, Show up to three, the case study all.
3. Run `node tools/images.js` (Edge headless, nothing to install). Next to the original it makes `name-240.webp` and
   `name-480.webp` (the pages pick one for the screen) and `name.webp`, the full-size copy for the viewer and the case
   study. It only remakes copies older than their original; `--all` remakes every one. Commit the copies.
4. Run `node tools/check-data.js`: it warns if a copy is missing, older than its original or over its budget
   (240: 20 KB · 480: 50 KB · full: 120 KB, in `lib/images.js`). Then `node tools/build.js`.

## New demo video (case studies)

A case study may open its screens with one short video. It is a plain MP4 in the repo: GitHub Pages serves it like any
file, at no cost. Never Git LFS (Pages does not serve LFS files). The page loads it only when the visitor presses play.
The `video` field lives in the case file (`data/cases/<page>.js`); with it set, the screens strip opens with the video.

1. **Record what screenshots cannot show.** One flow, 20–30 s, portrait, from the emulator: something that moves or
   changes (the list reordering, a loading state, a transition), not a tour of every screen. Demo data only (no
   personal accounts), the system demo mode on (clean status bar, no notifications), no sound. On the emulator:
   `adb shell screenrecord /sdcard/demo.mp4`, stop with Ctrl+C, then `adb pull /sdcard/demo.mp4 demo-raw.mp4`.
   The raw recording stays out of the repo.
2. **Compress it with ffmpeg** (installed with winget, 10-26; open a new terminal if `ffmpeg` is not found):

   ```
   ffmpeg -i demo-raw.mp4 -an -vf "scale=-2:960,fps=30" -c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p -movflags +faststart assets/projects/<app>/demo.mp4
   ffmpeg -ss 2 -i assets/projects/<app>/demo.mp4 -frames:v 1 -vf "scale=-2:960" -c:v libwebp -quality 80 assets/projects/<app>/demo-poster.webp
   ```

   The first makes a 960 px tall H.264 MP4 without audio that starts playing before it has fully downloaded
   (`+faststart`); the second takes the frame at second 2 as the still shown before play (change `-ss` to pick another).
   Aim for under 3 MB: if it weighs more, raise `-crf` to 30 or 32 and check that it still looks sharp.
3. **List it** in the case file's `video`: `src`, `poster` and `alt` (what the video shows, in plain words).
   The case page puts it first among the screens; Plain and Show do not use it. `check-data` checks both files exist.

## The share image (assets/og.png)

The 1200×630 picture link previews show. It is made from `profile` (name, `title`, `aiLine`, `stack`, `links.site` and the
photo's copy) and carries no date, so it only changes when one of those does: then run `node tools/og.js` (Edge headless)
and commit the PNG. Keep it under 300 KB, or WhatsApp may show no picture; the script warns.

## New skill

1. Add it to `skills` with `name`, `level` (`core` · `strong` · `familiar`), `at` (where it was used) and, if useful, a
   one-line `note`. `ai: true` puts it first in its level; `legacy: true` sends it to "View-based apps";
   `pages: false` keeps it off Plain and Show (it stays in the data for the CV).
2. Its years are computed from `at`. To narrow one place, write `{ id: "ir", end: "2017-12" }` instead of `"ir"`.
   `len: false` shows "at OpenBank" instead of a length (for a skill used in only part of a job).
3. A level with no skills is not drawn.

## New block in the learning path (or a block changes status)

1. In `learningPath.blocks` of the project it proves: change `status` (`done` · `now` · `next` · `goal`), or add a
   block, or add `steps` to a block (they feed Show's harness lane).
2. Set `learningPath.updated` to today's date: it is a fact ("Updated Oct 20, 2026"), it does not move by itself.

## New GameStack counts

Until the phase 10 Action does it: run `tools/count-gamestack.sh`, then write the numbers and `date` + `commit`
in `counts`. Every place that shows them (the proof rows, the ADRs skill note, the source line) reads from there.
Each proof row says where it shows with `on` (`"plain"`, `"show"`, `"case"`), like the screens: the landing keeps the
three that prove the differentiator, the case study shows them all. A new count is a new key in `counts` plus a row.
Only what is in the pinned commit gets a row; planned tooling waits in the roadmap.

## New case study

One template (`src/case.html`) and one renderer (`tools/pages/case.js`) draw every case; nothing is written in HTML.

1. Set `links.caseStudy` to the page's file name (`gamestack.html`). The "Case study" links on every page point to it;
   until step 2 exists the build only lists them as "not there yet".
2. Write `data/cases/<page>.js` (copy `data/cases/modernnotes.js`, which explains its conventions). The header (name,
   status, dates and length, the three highlights, the screens with `on: ["case"]`, the repo) comes from the project's
   entry; the case file holds what only the case says, all of it approved in the copy deck first. With that file the
   page joins the build by itself.
3. Sections are optional: leave one out (`why`, `ai` …) and it leaves the page and the bar. Keep each idea once.
4. `pin` is the commit every code link points to, and its date; the page says it once, at the end. A file is
   `"path"` under `roots.main`, `"path:15–22"` with its lines, `"test:path"` under another root.
5. `stack` takes the Skills used at the project (same names; of "MVI · MVVM", the part that applies) plus the
   libraries named in `libs`; `node tools/check-data.js` checks the tags and the diagram's limits (a trunk of ≤ 6
   pieces, one way back, side inputs into the trunk).
6. "Next case" is the next project with a case study, in the data's order; the landing card gets `id` by itself, so
   "All work" lands on it.
7. Check the page (CLAUDE.md → Design): Lighthouse, impeccable `audit`, `polish` and the finish review.
