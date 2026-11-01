---
name: close-session
description: Close a portfolio work session - review, PR and merge the public branch on Alan's yes first, then rewrite the hot state in HANDOFF.md with what that left, update standing decisions/facts by range only, and commit and push the private repo. Use when Alan says the session ends or the block of work is done.
---

# Close session

The public PR goes first and the notes last, so the handoff records what the review, the checks and the merge left.
Write each file once. The handoff is already in context (the SessionStart hook injected it): never re-read it, and
never read a whole `DECISIONS.md`, `FACTS.md` or anything in `_private/archive/`. Stage the session's files by name,
never scratch or temp copies; end every commit message with the attribution lines from the system reminder.

1. **Filter.** Keep only what the site, the CV or the way of working depends on. Side topics (personal tooling,
   security setup, accounts) were answered in chat and go nowhere. Anything reusable found this session (a shared
   piece, a tool workaround) goes to its home (`DESIGN.md`, `.claude/rules/`, a skill) if it is not there yet.
2. **Public PR** (skip to step 3 if nothing changed; `main` only takes PRs):
   - Review, once per PR and before it is opened (before merging, if it was opened earlier): if the branch touches
     JS or the build (`tools/`, `lib/`, `src/*.js`, `data/`), run `/code-review low` on
     it and fix what it confirms. The reviewer is always Sonnet, never Opus: in an Opus session, delegate the review
     to a subagent with `model: "sonnet"`. UI changes were already checked with `screenshots`; text and docs rely on
     the `checks` workflow. If it touches `src/`, `tokens.css` or `assets/` with finished visual work, confirm the
     `impeccable-finish-reviewer` agent ran on it (`.claude/rules/design.md`); if it did not, the report says why.
   - If still on `main`, create the branch first. Commit (`type(scope): Imperative summary`, body ≤ 6 lines), push the
     branch, and open the PR if the branch has none: `gh pr create --base main --title "<commit-style title>"
     --body-file <scratch file>`. The PR is squash-merged: its title and body become the one commit on `main` (GitHub
     appends the co-authors of the branch commits). Its body is `## What changed`, `## Why` and `## Verification`, with
     at most 6 lines of text under them; the `checks` workflow rejects any other shape.
   - Wait for the checks (`gh pr checks <n> --watch`); fix and push until they pass. Tell Alan in two lines what the PR
     changes and what the review found, then run `gh pr merge <n> --squash --delete-branch`: the `ask` rule in
     `.claude/settings.json` stops it for his explicit yes. After it, `git switch main && git pull --ff-only && git
     fetch --prune`, and delete any local branch whose remote is gone (`git branch -vv`, `: gone]`; `-D`, since squash
     leaves it unmerged to git). If he declines, the PR stays open and the handoff says so.
3. **`_private/handoff/HANDOFF.md`**: rewrite it in English, **≤ 4 KB and ≤ 60 lines** (the hook alerts above that):
   date and session id; one line per phase; *Alan owes* (items marked "do not remind" stay but are not mentioned);
   *Next session*: the concrete block, numbered steps, a "Done when:" line and "Model: Opus | Sonnet" with one reason.
   It includes what step 2 left open (a finding not fixed, a PR not merged). State only (`.claude/rules/harness.md`):
   finished items disappear, nothing is marked done.
4. **Standing changes only** (skip if none): grep the heading in `DECISIONS.md` / `FACTS.md`, read that range, edit.
   Present tense, "(Alan)" when he decided; a replaced decision is overwritten and the commit says what changed. A
   plan for a later phase goes to `_private/phases/phase-N.md`.
5. **Private repo**, one call: `git -C _private status --short`, then commit with subject `Session <id>: <summary>`,
   body ≤ 6 lines (what and why, files removed with their hash; public changes cited by PR number, `#n`), and push
   to `main`.
6. **Reply to Alan**, one short paragraph: what changed, the PR and the private short hash, the alerts the hook raised
   if any, and the next session. Then:
   - **Repeated correction?** If Alan corrected the same thing twice this session, say so and propose turning it into a
     rule with a mechanism (a check, a hook, a rule file), not a memory.
   - **Qué aprender** (≤ 3 lines): a web concept the session used that is worth knowing beyond its steps (what it is,
     why it mattered here). A recap of what was done is not a lesson: with no such concept, leave the section out.
   - **Model for the next task**, one sentence. **Sonnet** for work that follows a settled plan or format (approved
     decisions, text from approved sources, mechanical edits, captures, closes). **Opus** for open design or
     architecture calls, visual direction, a deep audit, or costly trade-offs; in a mixed session, the hardest step decides.

Local memory holds only what is specific to this machine; rules about working with Alan go to `CLAUDE.md`,
`.claude/rules/` or a skill.
