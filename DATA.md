# DATA.md — how to change the portfolio

Every page and both CVs draw `data/portfolio.js`: a change is an edit there and nowhere else. Lengths, years, episode
numbers and "Now building" are computed (`lib/calc.js`); never type them. After any edit, `node tools/build.js` (it runs
`check-data.js` first); `node tools/check-data.js --calc` prints every computed value to review.

## Rules that hold in every recipe

- **Three highlights per card.** What does not fit goes to the CV.
- **Dates:** `"2026-07"` (counts from the month's first day) or `"2026-07-15"`; `end: null` while ongoing. `work` stays
  oldest first: that order is the episode order.
- **An English text written or changed brings its Spanish** in the same change: `{ en, es }`, also where only the site
  shows it. A plain string is a site text still without Spanish; `es: null` means the Spanish still needs approval
  (until then the Spanish CV shows the English).

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
   place under an employer listed in `employers`), `what`, three `highlights`, `stack`, `show`. A place under an employer also needs `note`
   (what it is, with its name on Plain and the CV), and a new employer its dates, `role`, `place` and
   `note` (and `kind`, what it is, if its name does not say).
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
file's `video` (`data/cases/<page>.js`), in the middle of the screens strip.

1. **Record what screenshots cannot show:** one flow, as long as it needs and at most 30 s, portrait, from the
   emulator, something that moves (a list reordering, a loading state, a transition). Demo data only, system demo mode
   on, no sound.
   `adb shell screenrecord /sdcard/demo.mp4` (stop with Ctrl+C), then `adb pull /sdcard/demo.mp4 demo-raw.mp4`; the raw
   file stays out of the repo. Recorded this way, touches sent with `adb shell input` do not show, and the keyboard can
   show what was copied on the computer: empty the clipboard first.
2. **Compress** (ffmpeg comes from winget; open a new terminal if it is not found):

   ```
   ffmpeg -i demo-raw.mp4 -an -vf "scale=-2:960,fps=30" -c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p -movflags +faststart assets/projects/<app>/demo.mp4
   ffmpeg -ss 2 -i assets/projects/<app>/demo.mp4 -frames:v 1 -vf "scale=-2:960" -c:v libwebp -quality 80 assets/projects/<app>/demo-poster.webp
   ```

   Under 3 MB: if it weighs more, raise `-crf` to 30 or 32 and check it still looks sharp. `-ss` picks the poster
   frame: one that repeats no screenshot of the strip.
3. **List it** in `video`: `src`, `poster` and `alt` (`{ en, es }`, what the video shows). Only the case page uses it.

## The share image (assets/og.png)

1200×630, made from `profile` (name, `title`, `aiLine`, `stack`, `links.site`, the photo's copy), no date. When one of
those changes, run `node tools/og.js` (Edge headless) and commit the PNG; under 300 KB or WhatsApp may show no picture.

## New skill

1. Add it to `skills`, in its row by how often Android openings ask for it, with `name`, `level` (`core` · `strong` ·
   `familiar`), `at` (where it was used) and, if useful, a one-line `note`. `ai: true` sends it to the "AI-assisted
   development" row (strong, if the pages show it; its line, `copy.skills.levels.ai`, names the project behind it);
   `legacy: true` sends it to "Apps with XML Views"; `pages: false` keeps it for the CV only (with `at: []` if no
   place stands behind it); `cv` is its name there when it says more. A name that changes in Spanish goes in
   `cv.terms`.
2. Years come from `at`. To narrow one place, `{ id: "ag", end: "2017-12" }` instead of `"ag"`; `{ id: "ob", part: true }`
   is a place where it was used only some of the time (the matrix's hollow dot, no years); `len: false` keeps the
   length off the pages (a skill used in only part of a job). The pages show a length
   only for Core (chips and matrix rows), and there only when client work alone gives a year or more (`node tools/check-data.js --calc` lists them).

## New block in the learning path (or a block changes status)

The path changes only when a block closes, so it never announces what comes next inside a block.

1. In `learningPath.blocks` of the project it proves: change `status` (`done` · `now` · `next` · `goal`), add a block
   (`n` in order; `title` and `note` as `{ en, es }`), or add `steps` as `[name, status, files]`.
2. A `now` block shows only what is done: no "next: …" in its note and no `next` step (`check-data` stops the build).
   Future blocks stay `next`. Every done step, and every done block without steps, carries its `files` (the case's
   link syntax: `repo:`, `adr:`, `pr:`).
3. Set `learningPath.updated` to today's date: it is shown as a fact and does not move by itself.
4. Plain's line counts the blocks and Show draws one stop per block, so neither needs a change.

## Re-pin GameStack

When Alan says a project's repo moved, run the `sync-project` skill with its id. Proof rows are `check: true` (no
counts), say where they show with `on` (the CV takes Plain's) and name their evidence in `files`; `pin` holds the commit and day the claims were checked.

## New case study

Every case is drawn by `src/case.html` and `tools/pages/case.js`; nothing is written in HTML.

1. Set `links.caseStudy` to the page's file name (`gamestack.html`); until step 2 exists the build fails on the
   links unless the page is in `PENDING` (`tools/build.js`), which lists them as "not there yet".
2. Write `data/cases/<page>.js` (copy `data/cases/modernnotes.js`, which explains its conventions). The header comes
   from the project's entry; the case file holds what only the case says, approved in the copy deck first. With that
   file the page joins the build.
3. Sections are optional: leave one out (`why`, `ai` …) and it leaves the page and the bar. Keep each idea once.
4. `pin` is the commit every code link points to, and its date. A file is `"path"` under `roots.main`, `"path:15–22"`
   with its lines, `"test:path"` under another root. `"pr:209"`, `"issue:159"` and `"commit:a00cf8c"` open that on GitHub;
   a path that ends in `/` opens the folder; a decision record under the `adr` root shows its number.
5. `stack` takes the Skills used at the project (same names; of "MVI · MVVM", the part that applies) plus the libraries
   named in `libs`; `check-data` checks the tags and the diagram's limits.
6. `ai.stages` is the strip by actor (at most 8 stages, 3 `actors`), `ai.harness` lists its pieces by group, each with a
   `kind` (`blocks`, `waits`, `guides`: copy.case.harness) and its files,
   and `next` draws its `roadmap` (status `designed` = an approved mockup) and `learningPath`.
7. "Next case" goes from the newest project with a case study to the oldest, then back to the newest.
8. Check the page (`.claude/rules/design.md`): Lighthouse, impeccable `audit`, `polish` and the finish review.
