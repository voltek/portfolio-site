#!/usr/bin/env bash
# Recounts the public GameStack numbers the portfolio cites, from the default branch, with the date of the count.
set -euo pipefail
R=voltek/GameStack
tree=$(gh api "repos/$R/git/trees/HEAD?recursive=1" --jq '.tree[].path')
raw(){ gh api "repos/$R/contents/$1" -H "Accept: application/vnd.github.raw"; }
n(){ printf '%s\n' "$tree" | grep -cE "$1" || true; }

echo "GameStack counts · $(date +%Y-%m-%d) · $(gh api "repos/$R/commits/HEAD" --jq '.sha[0:7]')"
echo "ADRs              $(n '^docs/project/decisions/[0-9]{4}-.*\.md$')"
echo "Skills            $(n '^\.claude/skills/[^/]+/SKILL\.md$')   (retired: $(n '^docs/project/retired-skills/.+\.md$'))"
echo "PRs (all states)  $(gh pr list -R $R --state all --limit 1000 --json number --jq length)"
echo "Drift log entries $(raw docs/project/DRIFT-LOG.md | grep -cE '^\| [0-9]{4}-[0-9]{2}-[0-9]{2} ')"
echo "Checklist items   $(raw docs/project/DRIFT-CHECKLIST.md | grep -cE '^- \[ \]')"
echo "Unit test classes $(n '^app/src/test/.+Test\.kt$')   (files under app/src/test: $(n '^app/src/test/.+\.kt$'))"
echo "Screen tests      $(n '^app/src/test/.+ScreenTest\.kt$')"
echo "Workflows         $(printf '%s\n' "$tree" | grep -E '^\.github/workflows/' | sed 's#.*/##' | paste -sd' ')"
