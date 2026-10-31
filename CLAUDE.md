# CLAUDE.md

## What this is

Portfolio of Alan Hernández (Senior Android Developer) for technical recruiters (scan) and hiring managers (audit), at
`alanhernandez.dev`. Plain HTML/CSS/JS, no framework, no npm dependencies. `tools/build.js` fills `src/` from
`data/portfolio.js` into `_site/`; dated numbers come from `lib/calc.js`, never hard-coded.

- **Plain** (`index.html` from `src/plain.html`): the quick read and main door. **Show** (`show.html`): the expressive one.
- Case studies: `data/cases/<case>.js` → `<case>.html` through `src/case.html`. The CV has no design yet (phase 7).

```sh
node tools/build.js        # runs tools/check-data.js first, then src/ + data → _site/
node tools/serve.js        # http://localhost:8080/  (--port=N)
```

Recipes for data changes: `DATA.md`. Visual rules: `DESIGN.md`. Product truth: `PRODUCT.md`.
Keep shell output short: pipe build, detector, Lighthouse and git output through `tail`/`grep` and report a summary.

## `_private/` (private repo `voltek/portfolio-notes`, gitignored here)

- `handoff/HANDOFF.md`: hot state, injected at session start; rewritten once, at the close (`close-session`). Where it
  and this file disagree, the handoff is newer.
- `handoff/DECISIONS.md` · `FACTS.md`: **grep the heading, read that range; never read them whole.**
  `phases/phase-N.md`: plans read when that phase starts. `sources/`: copy deck and Alan's answers. `archive/`: grep only.
- Hashes older than 10-31 resolve with `git -C _private show <hash>`.

## Hard rules

- **Never fabricate proof**: no metrics, testimonials, benchmarks, inflated leadership or AI work not done. Every claim
  must be defensible in an interview. Source precedence: public repo > `_private/sources/sources.md`.
- No copy reaches the site without passing `_private/sources/copy-deck.md` with its source and Alan's approval.
- ModernNotes is "100% hand-written": Claude never writes code in that repo, only guides and audits.
- Nothing private enters this public repo: phone, salary, personal email, interview notes stay in `_private/`.
- Everything committed to either repo is in English (the CV also ships in Spanish).

## Cost: the live site must cost as little as possible

The domain is the only planned cost: static files on GitHub Pages, automation only within free tiers, small downloads.
No backend, database, serverless, paid APIs or services. If something would add a cost, say so and the cheaper
alternative before building it.

## Working with Alan

- Recommend first, with your confidence. If you disagree with a request, or it goes against best practice, say why and
  wait; never apply your own alternative unasked.
- Test his framing against evidence (references, `FACTS.md`) and say where it holds or not; he wants grounds, not assent.
- A scope he names (one theme, one surface) stays exactly there; ask before extending. Exception: Plain and Show move
  together (`.claude/rules/design.md`).
- After a second failed fix on the same piece, stop: write what was tried and the root cause, then propose options.
- He is an Android developer, not a web one: explain web/SEO terms in one plain line with how much they matter; when he
  asks for a concept, give the complete explanation in the final reply.
- The goal is a site that looks good and ships soon, without convention ceremony. Small single-block sessions; when
  one runs long, settle and record the open decisions and close before building.

## Conventions

- Commit and PR title: `type(scope): Imperative summary`, ≤ 72 chars. Types: `feat fix refactor docs chore perf ci`.
  Scopes: `plain show case cv data build tokens assets harness repo deploy readme`. Commit body ≤ 6 lines, only the
  why. PR body: `## What changed`, `## Why`, `## Verification`, ≤ 6 lines of text under them (`checks` enforces it).
- Public repo: branches `{type}/{kebab-name}` (GitHub only lets PRs into `main`). Claude commits, pushes its branch and
  opens the PR without asking; **merging needs Alan's explicit yes** (`close-session`).
- Private repo: one commit per session on `main`, `Session <id>: <summary>`; that is the log.
- Retired files are deleted (`git rm`), not archived; the commit names the hash to recover them from.
