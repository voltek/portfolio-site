---
name: close-session
description: Close a portfolio work session - rewrite the hot state in HANDOFF.md, update standing decisions/facts by range only, check memory and commit with the history in the message. Use when Alan says the session ends or the block of work is done.
---

# Close session

The close must be cheap in tokens (Alan, 10-22). **Never read a whole `_private/handoff/` file other than `HANDOFF.md`**, and
never read `_private/archive/`. Gather everything decided in the session first, then write each file once.

**Minimal close:** if the session changed no standing decision or fact, do only steps 1, 5 and 6.

1. **`_private/handoff/HANDOFF.md`** (hot state; it is already in context from the start, so do not re-read it): rewrite its
   state sections in place, kept **≤ 6 KB**:
   - the date and session name in "Última actualización";
   - the phase table (one line per phase; detail lives in `DECISIONS.md`);
   - "Pendientes de Alan": only what he owes; items marked "no recordar" stay but are not mentioned to him;
   - "Siguiente sesión": the concrete next block, numbered steps, a "Terminado cuando:" line, and a line
     "Modelo recomendado: Opus | Sonnet" with one reason (criterion in step 6).
   Nothing historical goes here: no "what we did", no superseded decisions.
2. **`_private/handoff/DECISIONS.md` / `FACTS.md`** (only for decisions or verified facts that outlive the session): Grep the
   topic heading, Read only that range, Edit. Present tense, with date and "(Alan)" when he decided it. A replaced
   decision is **overwritten**, not moved (git keeps it; the commit says what changed). Facts only if verified this
   session (repo, Alan's answers).
3. **Memory**: save only feedback about how Alan wants to work; project facts go to the files above, not to memory.
4. **Pruning**: walk the "Plan de poda" in `HANDOFF.md` and run any step whose trigger was reached this session.
5. **Commit (always, last step; Alan's standing rule since 10-20).** The commit message **is the session log** (there is
   no `LOG.md` any more): a subject naming the session (e.g. "Session 5a-2: ...") and a body with what was done, why,
   references consulted that matter, and files removed with the reason (format of commit `3eeeb54`), plus the attribution
   lines from the system reminder. Run `git status` first so nothing stray goes in (no temp copies, no scratch files),
   stage the session's files by name. Never push. If the commit fails (a hook, for example), fix the cause and commit
   again; report it to Alan if it cannot be done.
6. Tell Alan in one short paragraph (Spanish) what changed, that the commit was made (short hash) and what the next session
   is. No recap of the handoff. **End with the model recommendation for the next task (Opus or Sonnet) and why**, in one
   sentence. Criterion: **Sonnet** is enough for work that follows a settled plan or format (applying approved decisions,
   writing text from approved sources, mechanical edits, captures and checks, closing sessions). **Opus** when the task
   needs open-ended design or architecture decisions (data schema, build or pre-render strategy), visual direction, a deep
   audit or review, or weighing trade-offs where a wrong call is costly. If a session mixes both, recommend the model the
   hardest step needs and say which step that is.
