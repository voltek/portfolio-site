# DATA.md — how to change the portfolio

Every page and both CVs draw `data/portfolio.js`: a change is an edit there and nowhere else. Lengths, years, episode
numbers and "Now building" are computed (`lib/calc.js`); never type them. After any edit, `node tools/build.js` (it runs
`check-data.js` first); `node tools/check-data.js --calc` prints every computed value to review.

## Rules that hold in every recipe

- **Three highlights per card.** What does not fit goes to the CV.
- **Dates:** `"2026-07"` (counts from the month's first day) or `"2026-07-15"`; `end: null` while ongoing. `work` stays
  oldest first: that order is the episode order.
- **Texts the CV shows are `{ en, es }`.** `es: null` means the Spanish still needs approval.

## I finished a project

In its `work` entry: `status: "completed"` and `end: "YYYY-MM-DD"` (the last commit). Nothing else: "Now building",
its length and its skills' years follow.

## I started a project

1. Add a `work` entry at the end: `id` (two letters, unique), `type: "project"`, `status: "in-progress"`, `start`,
   `end: null`, `what`, three `highlights`, `stack`, `links.repo`, and `show.title` + `show.prop` for its episode (an
   unknown prop draws the generic one).
2. Screens are optional: `shots` with `label`, `alt` and `on` (`"plain"`, `"show"`, `"case"`).
3. Add its id to the `at` of every skill it uses.

## New job

1. Add a `work` entry in date order with `type: "job"`, `start`, `end: null`, `studio`, `role` (or `employer` if it is a
   client of an employer listed in `employers`), `what`, three `highlights`, `stack`, `show`.
2. Add its id to the `at` of the skills used there.
3. `profile.status` (open to work) does not change by itself: update it through the copy deck if Alan stops looking.

## New app screenshots (or a new photo)

Pages never load the original (a raw PNG is ~450 KB, Plain's whole first load budget is ~300 KB); the build publishes
only its WebP copies.

1. Save the original PNG in `assets/projects/<app>/` with a short lowercase name (`search_results.png`); it stays in
   the repo as the source. The photo is `assets/alan.jpg` (`profile.photo.src`).
2. List it in the project's `shots` with `label`, `alt` (what the screen shows) and `on`. Plain shows one, Show up to
   three, the case study all.
3. Run `node tools/images.js` (Edge headless): it makes `name-240.webp`, `name-480.webp` and `name.webp` for originals
   whose hash changed (`data/images.lock.json`; `--all` remakes every one). Commit the copies and the lock file.
4. `check-data` warns if a copy is missing, stale or over its budget (`lib/images.js`).

## New demo video (case studies)

One short MP4 in the repo, never Git LFS (Pages does not serve it); the page loads it only on play. It goes in the case
file's `video` (`data/cases/<page>.js`), and the screens strip opens with it.

1. **Record what screenshots cannot show:** one flow, 20–30 s, portrait, from the emulator, something that moves (a
   list reordering, a loading state, a transition). Demo data only, system demo mode on, no sound.
   `adb shell screenrecord /sdcard/demo.mp4` (stop with Ctrl+C), then `adb pull /sdcard/demo.mp4 demo-raw.mp4`; the raw
   file stays out of the repo.
2. **Compress** (ffmpeg comes from winget; open a new terminal if it is not found):

   ```
   ffmpeg -i demo-raw.mp4 -an -vf "scale=-2:960,fps=30" -c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p -movflags +faststart assets/projects/<app>/demo.mp4
   ffmpeg -ss 2 -i assets/projects/<app>/demo.mp4 -frames:v 1 -vf "scale=-2:960" -c:v libwebp -quality 80 assets/projects/<app>/demo-poster.webp
   ```

   Under 3 MB: if it weighs more, raise `-crf` to 30 or 32 and check it still looks sharp. `-ss` picks the poster frame.
3. **List it** in `video`: `src`, `poster` and `alt` (what the video shows). Only the case page uses it.

## The share image (assets/og.png)

1200×630, made from `profile` (name, `title`, `aiLine`, `stack`, `links.site`, the photo's copy), no date. When one of
those changes, run `node tools/og.js` (Edge headless) and commit the PNG; under 300 KB or WhatsApp may show no picture.

## New skill

1. Add it to `skills` with `name`, `level` (`core` · `strong` · `familiar`), `at` (where it was used) and, if useful, a
   one-line `note`. `ai: true` puts it first in its level; `legacy: true` sends it to "View-based apps";
   `pages: false` keeps it for the CV only.
2. Years come from `at`. To narrow one place, `{ id: "ir", end: "2017-12" }` instead of `"ir"`; `len: false` shows "at
   OpenBank" instead of a length (a skill used in only part of a job).

## New block in the learning path (or a block changes status)

1. In `learningPath.blocks` of the project it proves: change `status` (`done` · `now` · `next` · `goal`), add a block,
   or add `steps` to a block (they feed Show's harness lane).
2. Set `learningPath.updated` to today's date: it is shown as a fact and does not move by itself.

## New GameStack counts

Until the phase 10 Action does it: run `tools/count-gamestack.sh`, then write the numbers and `date` + `commit` in
`counts`; every place that shows them reads from there. Each proof row says where it shows with `on`: the landing keeps
the three that prove the differentiator, the case study shows them all. A new count is a new key in `counts` plus a
row. Only what is in the pinned commit gets a row; planned tooling waits in the roadmap.

## New case study

Every case is drawn by `src/case.html` and `tools/pages/case.js`; nothing is written in HTML.

1. Set `links.caseStudy` to the page's file name (`gamestack.html`); until step 2 exists the build lists the links as
   "not there yet".
2. Write `data/cases/<page>.js` (copy `data/cases/modernnotes.js`, which explains its conventions). The header comes
   from the project's entry; the case file holds what only the case says, approved in the copy deck first. With that
   file the page joins the build.
3. Sections are optional: leave one out (`why`, `ai` …) and it leaves the page and the bar. Keep each idea once.
4. `pin` is the commit every code link points to, and its date. A file is `"path"` under `roots.main`, `"path:15–22"`
   with its lines, `"test:path"` under another root.
5. `stack` takes the Skills used at the project (same names; of "MVI · MVVM", the part that applies) plus the libraries
   named in `libs`; `check-data` checks the tags and the diagram's limits.
6. "Next case" is the next project with a case study, in the data's order.
7. Check the page (`.claude/rules/design.md`): Lighthouse, impeccable `audit`, `polish` and the finish review.
