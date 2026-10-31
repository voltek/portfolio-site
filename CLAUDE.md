# CLAUDE.md

Loaded every session: only what every session needs, plus pointers. Topic rules load on their own when their files are
touched (`.claude/rules/`); procedures live in skills (`close-session`, `screenshots`).

## What this is

Portfolio of Alan Hernández (Senior Android Developer) for technical recruiters (scan) and hiring managers (audit), at
`alanhernandez.dev`. Plain HTML/CSS/JS, no framework, no npm dependencies. `tools/build.js` (plain Node) fills `src/`
from `data/portfolio.js` into `_site/` (gitignored); dated numbers come from `lib/calc.js`, at build time and in the browser.

- **Plain** (`index.html` from `src/plain.html`): the quick read and main door. Old notes say "quick read".
- **Show** (`show.html` from `src/show.html`): the expressive version. Old notes say "Cortinilla".
- Case studies: `data/cases/<case>.js` → `<case>.html` through `src/case.html`. The CV has no design yet (phase 7).
- Each page links to the other; all read `data/portfolio.js`. The old bento site is an anti-reference, never extended.

## Commands

```sh
node tools/check-data.js   # data checks; run before the build
node tools/build.js        # src/ + data → _site/
node tools/serve.js        # http://localhost:8080/  (--port=N)
node tools/images.js       # WebP copies of new images · node tools/og.js: share image
```

Keep shell output short: pipe build, detector, Lighthouse and git output through `tail`/`grep` and report a summary.

## Map

| Path | What it is |
|---|---|
| `DATA.md` | Recipes for data changes (new job, skill, case study) |
| `DESIGN.md` · `PRODUCT.md` | Visual rules in force · product truth (who it is for, what is claimed) |
| `tokens.css` | Tokens by role: `data-world="read"` (Plain, cases, CV) and `"show"`; light and dark (`?theme=`) |
| `src/partials/` | Shared pieces of Plain's world, included with `{{>name}}`; never copied |
| `.impeccable/surfaces/` | Surface briefs: `index-html.md` (Plain), `show-html.md`, `case-html.md` |
| `tools/count-gamestack.sh` | GameStack numbers; not recounted while building (a GitHub Action will keep them) |
| `_comps/<topic>/` | Comps shown to Alan (gitignored); what is approved moves into `src/` |
| `_private/` | Private repo `voltek/portfolio-notes` (gitignored here), see below |

## `_private/` (private notes)

- `handoff/HANDOFF.md`: hot state, injected at session start by `.claude/hooks/session-start.sh`; rewritten once, at
  the close (`close-session`). Where it and this file disagree, the handoff is newer.
- `handoff/DECISIONS.md` · `FACTS.md`: standing decisions and verified facts. **Grep the heading, read that range;
  never read them whole.** `phases/phase-N.md`: plans read when that phase starts.
- `sources/`: copy deck (`copy-deck.md`), Alan's answers, case inventory. `archive/`: frozen, grep only.
- History: commit messages of both repos. Hashes older than 10-31 resolve with `git -C _private show <hash>`.

## Hard rules

- **Never fabricate proof**: no metrics, testimonials, benchmarks, inflated leadership or AI work not done. Every claim
  must be defensible in an interview. Source precedence: public repo > `_private/sources/sources.md`.
- No copy reaches the site without passing `_private/sources/copy-deck.md` with its source and Alan's approval.
- ModernNotes is "100% hand-written": Claude never writes code in that repo, only guides and audits.
- Nothing private enters this public repo: phone, salary, personal email, interview notes stay in `_private/`.
- Replies to Alan in Spanish; everything committed to either repo in English (the CV also ships in Spanish).

## Cost: the live site must cost as little as possible

The domain is the only planned cost. Static files on GitHub Pages; no backend, database, serverless, paid APIs or paid
services; automation only within free tiers (Actions on this public repo); small downloads (compressed images, few
fonts, no heavy libraries). If something would add a cost, say so and the cheaper alternative before building it.

## Working with Alan

- Recommend first, with your confidence. If you disagree with a request, or it goes against best practice, say why and
  wait; never apply your own alternative unasked. What you agree with, apply directly.
- Test his framing against evidence (references, `FACTS.md`) and say where it holds or not; he wants grounds, not assent.
- A scope he names (one theme, one surface) stays exactly there; ask before extending. Exception: Plain and Show move
  together (`.claude/rules/design.md`).
- After a second failed fix on the same piece, stop: write what was tried and the root cause, then propose options.
- He is an Android developer, not a web one: explain web/SEO terms in one plain line with how much they matter; when he
  asks for a concept, give the complete explanation in the final reply.
- The goal is a site that looks good and ships soon, without convention ceremony. Small single-block sessions; when
  one runs long, settle and record the open decisions and close before building.
- Anything reusable that a session discovers (a shared piece, a tool workaround) is written where it belongs (`DESIGN.md`,
  a rule, a skill) before closing, never left only in chat.

## Conventions

- Commit and PR title: `type(scope): Imperative summary`, ≤ 72 chars. Types: `feat fix refactor docs chore perf ci`.
  Scopes: `plain show case cv data build tokens assets harness repo deploy readme`. Body ≤ 6 lines, only the why.
- Branches `{type}/{kebab-name}`; `main` only through a PR with a merge commit. Claude pushes its branch without asking
  and **asks before opening, merging or deleting a PR**. Never `--force` on `main`, never `--no-verify`.
- Private repo: one commit per session, `Session <id>: <summary>`; that is the log.
- Retired files are deleted (`git rm`), not archived; the commit names the hash to recover them from.
