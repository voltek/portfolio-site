#!/usr/bin/env bash
# SessionStart (startup, clear, compact): inject the hot state and flag drift with measurable triggers.
# Plain-text stdout is added to Claude's context. Keep it fast: no network calls.
root="${CLAUDE_PROJECT_DIR:-$(pwd)}"
cd "$root" || exit 0
priv="_private"
handoff="$priv/handoff/HANDOFF.md"
memdir="$HOME/.claude/projects/$(printf '%s' "$root" | sed 's#^/\([a-zA-Z]\)/#\U\1--#; s#^\([A-Za-z]\):[\/]#\1--#; s#[\/ ]#-#g')/memory"
alerts=()

size() { wc -c < "$1" | tr -d ' '; }
lines() { wc -l < "$1" | tr -d ' '; }

gitline() { # repo dir, label
  local d="$1" b dirty ahead last
  b=$(git -C "$d" branch --show-current 2>/dev/null) || return
  dirty=$(git -C "$d" status --porcelain 2>/dev/null | wc -l | tr -d ' ')
  ahead=$(git -C "$d" rev-list --count '@{u}..HEAD' 2>/dev/null || echo "no upstream")
  last=$(git -C "$d" log -1 --format='%h %s' 2>/dev/null)
  echo "- $2: branch \`$b\`, $dirty changed files, unpushed: $ahead. Last: $last"
}

echo "# Session start (from .claude/hooks/session-start.sh)"
echo
echo "## Git"
gitline . "public"
[ -d "$priv/.git" ] && gitline "$priv" "private"

if [ ! -d "$priv" ]; then
  alerts+=("\`_private/\` is missing: clone voltek/portfolio-notes into it (see README of that repo).")
else
  [ -f "$handoff" ] || alerts+=("$handoff is missing.")
  for f in "$priv"/handoff/*.md "$priv"/phases/*.md; do  # sources/ grows with the content: not flagged
    [ -f "$f" ] && [ "$(size "$f")" -gt 30720 ] && alerts+=("$f is $(( $(size "$f") / 1024 )) KB (> 30 KB): prune or split it.")
  done
fi
if [ -f CLAUDE.md ]; then
  [ "$(lines CLAUDE.md)" -gt 100 ] && alerts+=("CLAUDE.md has $(lines CLAUDE.md) lines (> 100).")
  [ "$(size CLAUDE.md)" -gt 8192 ] && alerts+=("CLAUDE.md is $(( $(size CLAUDE.md) / 1024 )) KB (> 8 KB).")
fi
if [ -f "$handoff" ]; then
  [ "$(lines "$handoff")" -gt 60 ] && alerts+=("HANDOFF.md has $(lines "$handoff") lines (> 60).")
  [ "$(size "$handoff")" -gt 4096 ] && alerts+=("HANDOFF.md is $(( $(size "$handoff") / 1024 )) KB (> 4 KB).")
fi
if [ -f "$memdir/MEMORY.md" ]; then
  n=$(grep -c '^- ' "$memdir/MEMORY.md")
  [ "$n" -gt 15 ] && alerts+=("Local memory has $n entries (> 15): move rules to CLAUDE.md, .claude/rules or a skill.")
fi

if [ ${#alerts[@]} -gt 0 ]; then
  echo
  echo "## Alerts (mention them to Alan in one line)"
  printf -- '- %s\n' "${alerts[@]}"
fi

if [ -f "$handoff" ]; then
  echo
  echo "## Handoff ($handoff; already loaded, do not re-read it)"
  echo
  cat "$handoff"
fi
exit 0
