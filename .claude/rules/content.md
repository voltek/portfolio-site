---
paths:
  - "data/**"
  - "DATA.md"
  - "PRODUCT.md"
  - "_private/sources/**"
---

# Content and claims

- Before writing any skill, span or claim, check how deep it really goes: `_private/handoff/FACTS.md` → *Qué se puede
  afirmar* (grep the heading, read that range). Examples: Bitrise only for QC builds, Room only in ModernNotes,
  accessibility not claimable.
- Check that a workflow is actually enabled before claiming it: AI code review in GameStack is Claude Code's
  `/code-review` run locally before each PR, not a CI workflow.
- Source precedence: public repos > `_private/sources/sources.md` (Alan's answers, LinkedIn export, course notes).
- GameStack numbers are not recounted while building (Alan, 10-20): a GitHub Action will keep them from
  `tools/count-gamestack.sh`; they are checked before deploy.
- Data changes follow the recipes in `DATA.md`; run `node tools/check-data.js` after each.
