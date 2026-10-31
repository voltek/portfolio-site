---
paths:
  - "CLAUDE.md"
  - ".claude/**"
  - "_private/handoff/**"
  - "_private/phases/**"
---

# Writing instructions for Claude

Everything in `CLAUDE.md`, rules, skills and the handoff is paid for in tokens every time it loads. Before adding a line:

- **Cut what Claude does anyway**: harness defaults (reply language, read before editing, no `--no-verify`, ask before
  destructive actions), common sense (apply what Alan approves, check the work) and anything a deny rule or hook already
  enforces. Write only where this project differs from the default.
- **Cut what the repo already says**: what code, `git log` or a file name shows (a script's flags, which page links where).
  Point to the file instead of restating it.
- **One home per fact**: a rule lives in one place; others point to it. Before adding, grep for an existing line.
- **Right place by when it is needed**: every session → `CLAUDE.md`; only when certain files are touched →
  `.claude/rules/` with `paths:`; during a procedure → its skill; current state → `HANDOFF.md`; standing decisions →
  `DECISIONS.md`; later-phase plans → `_private/phases/`.
- **No history or aliases**: no "renamed from", "old notes say", "as of"; git keeps the past. Present tense, short lines.
- Limits the SessionStart hook enforces: `CLAUDE.md` ≤ 100 lines / 8 KB, `HANDOFF.md` ≤ 60 lines / 4 KB, any
  `_private/handoff` or `phases` file ≤ 30 KB, local memory ≤ 15 entries.
