---
paths:
  - "CLAUDE.md"
  - ".claude/**"
  - "_private/handoff/**"
  - "_private/phases/**"
---

# Writing instructions and session documents

Everything in `CLAUDE.md`, rules, skills and the handoff is paid for in tokens every time it loads. Before adding a line:

- **Cut what Claude does anyway**: harness defaults (reply language, read before editing, no `--no-verify`, ask before
  destructive actions), common sense, and anything a hook, a deny rule or a GitHub setting already enforces. Write only
  where this project differs from the default.
- **Cut what the repo already says**: what code, a tool's own instructions or a file name shows. Point to the file.
- **One home per fact**; grep for an existing line before adding one.
- **Place by when it is needed**: every session → `CLAUDE.md`; when certain files are touched → `.claude/rules/` with
  `paths:`; during a procedure → its skill; current state → `HANDOFF.md`; standing decisions → `DECISIONS.md`;
  later-phase plans → `_private/phases/`.
- **State only, no history**: these files say what is true now. When something changes, rewrite the line; never append
  "done", ✅ with a date, "replaced X", "moved from", "renamed", "as of" or session names. Finished work disappears; a
  superseded decision is overwritten. "(Alan)" may mark who decided; dates and the story live in git.
- Limits the SessionStart hook flags: `CLAUDE.md` ≤ 100 lines / 8 KB, `HANDOFF.md` ≤ 60 lines / 4 KB, any
  `_private/handoff` or `phases` file ≤ 30 KB, local memory ≤ 15 entries.
