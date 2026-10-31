---
name: close-session
description: Close a portfolio work session - rewrite the hot state in HANDOFF.md, update standing decisions/facts by range only, commit and push both repos in one call, open the public PR and merge it on Alan's yes. Use when Alan says the session ends or the block of work is done.
---

# Close session

At most **6 tool calls**. The handoff is already in context (the SessionStart hook injected it): never re-read it, and
never read a whole `DECISIONS.md`, `FACTS.md` or anything in `_private/archive/`. Gather everything first, write each
file once.

1. **Filter.** Keep only what the site, the CV or the way of working depends on. Side topics (personal tooling,
   security setup, accounts) were answered in chat and go nowhere. Anything reusable found this session (a shared
   piece, a tool workaround) goes to its home (`DESIGN.md`, `.claude/rules/`, a skill) if it is not there yet.
2. **`_private/handoff/HANDOFF.md`**: rewrite it in English, **≤ 4 KB and ≤ 60 lines** (the hook alerts above that):
   date and session id; one line per phase; *Alan owes* (items marked "do not remind" stay but are not mentioned);
   *Next session*: the concrete block, numbered steps, a "Done when:" line and "Model: Opus | Sonnet" with one reason.
   State only (`.claude/rules/harness.md`): finished items disappear, nothing is marked done.
3. **Standing changes only** (skip if none): grep the heading in `DECISIONS.md` / `FACTS.md`, read that range, edit.
   Present tense, "(Alan)" when he decided; a replaced decision is overwritten and the commit says what changed. A
   plan for a later phase goes to `_private/phases/phase-N.md`.
4. **Git, both repos in one call** (`git status --short` in each first; stage the session's files by name, never
   scratch or temp copies; end every message with the attribution lines from the system reminder):
   - Private: `git -C _private commit`, subject `Session <id>: <summary>`, body ≤ 6 lines (what and why, files
     removed with their hash; public changes cited by PR number, `#n`), then push to `main`.
   - Public (skip if nothing changed; `main` only takes PRs): if still on `main`, create the branch first. Commit
     (`type(scope): Imperative summary`, body ≤ 6 lines), push the branch, and open the PR if the branch has none:
     `gh pr create --base main --title "<commit-style title>" --body-file <scratch file>` with *What changed* · *Why*
     (1–3 sentences each) · *Verification* (what was run or captured). The PR
     is squash-merged: its title and body become the one commit on `main` (GitHub appends the co-authors of
     the branch commits), so keep the body short.
5. **Reply to Alan**, one short paragraph: what changed, both short hashes, the alerts the hook raised if
   any, and the next session. Then:
   - **Repeated correction?** If Alan corrected the same thing twice this session, say so and propose turning it into a
     rule with a mechanism (a check, a hook, a rule file), not a memory.
   - **Qué aprender** (≤ 3 lines): what this session teaches about working with Claude Code or about the web, if
     anything; skip it when there is nothing real.
   - **Model for the next task**, one sentence. **Sonnet** for work that follows a settled plan or format (approved
     decisions, text from approved sources, mechanical edits, captures, closes). **Opus** for open design or
     architecture calls, visual direction, a deep audit, or costly trade-offs; in a mixed session, the hardest step decides.
6. **Merge** (public PR only): after the reply, run `gh pr merge <n> --squash --delete-branch` (deletes the local
   branch; GitHub deletes the remote one), then `git switch main && git pull --ff-only && git fetch --prune` and
   delete any local branch whose remote is gone (`git branch -vv`, `: gone]`; `-D`, since squash leaves it unmerged
   to git). The `ask` rule in `.claude/settings.json` stops that command for Alan's
   explicit yes; if he declines, the PR stays open and the handoff says so.

Local memory holds only what is specific to this machine; rules about working with Alan go to `CLAUDE.md`,
`.claude/rules/` or a skill.
