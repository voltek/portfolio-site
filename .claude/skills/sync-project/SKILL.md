---
name: sync-project
description: Bring the portfolio in line with a project's public repo after it changed, or take in a new project. Use when Alan says a repo moved (GameStack, ModernNotes, a future app), asks for a re-pin, or adds a project. Pass the project id from data/portfolio.js as the argument.
---

# Sync a project with its repo

The site says only what the repo shows at the pinned commit. This finds what stopped being true, what is newly
worth saying, and moves the pin. Stop where a step says so; nothing reaches `data/` before Alan approves the copy.

1. **See what moved.** `node tools/repo-changes.js <id>`. "Nothing changed" ends the sync.
2. **Read, narrowest first.** The README whole (a guide to what the owner thinks matters, never a source by
   itself); every source the tool listed under a claim; the areas it names as new. Read through `gh api
   repos/<repo>/contents/<path> -H "Accept: application/vnd.github.raw"` or a local clone (ask Alan where). Re-run
   every `gh` read the ledger names: a setting changes without a file changing.
3. **Judge each ledger row:** *holds* (the source still shows it), *reword* (true in another form: a rename, a
   new mechanism), or *dead* (the source is gone or says otherwise). A README sentence counts only once the file or
   setting behind it was read.
4. **Look for what is new, and test it for value.** A candidate enters only if all four hold:
   - it shows how Alan works or decides, not how much there is (no counts of files, ADRs, PRs, tests);
   - it will still be true after the repo's next fifty commits, or it is a result measured once and dated;
   - it exists and is switched on at HEAD (a workflow enabled, a rule enforced), never planned;
   - Alan can defend it in an interview: say what it is, why, and what it cost.
   Note beside each one the nuance that keeps it honest (what it does not cover).
5. **Update the truth, private repo:** the project's section in `FACTS.md`, its section in `case-inventory.md`,
   and the ledger (new rows, new sources, dead rows deleted).
6. **Stop: copy.** In `copy-deck.md`, one table of every row that changes: current · proposed · source. Say where
   Alan's own framing holds or not. Wait for his answer on each row; ask him for anything only he knows (roadmap,
   learning path, intentions).
7. **Apply:** the approved rows in `data/portfolio.js` (and the case file, if the project has one, with its `pin`),
   then `pin` to HEAD's commit and date. Docs that name a renamed thing follow (`PRODUCT.md`).
8. **Verify:** `node tools/build.js`; `node tools/repo-changes.js <id>` says nothing changed; grep the repo and
   `_private/` for every name step 3 marked dead; the `screenshots` skill on each page that shows the project.
9. **Report** what changed on the site, what was dropped and why, and what waits for Alan. PR as `CLAUDE.md` says.

A new project runs the same steps with no pin: every claim is a candidate (step 4), the ledger is written from
scratch, and `DATA.md` → *New case study* takes over once it has a case.
