---
paths:
  - "data/**"
  - "DATA.md"
  - "PRODUCT.md"
  - "_private/sources/**"
---

# Content and claims

- Before writing any skill, span or claim, check how deep it really goes: `_private/handoff/FACTS.md` → *What can be
  claimed* (grep the heading, read that range).
- Claim a workflow only if it is actually enabled: AI code review in GameStack is Claude Code's `/code-review` run
  locally before each PR, not a CI workflow.
- GameStack numbers are not recounted while building: a GitHub Action will keep them from `tools/count-gamestack.sh`.
