#!/usr/bin/env bash
# Gate for impeccable's design hooks (registered in .claude/settings.local.json): pass the hook input to
# `impeccable hook` only when UI files are involved. PostToolUse: the edited file. Stop: uncommitted changes.
root="${CLAUDE_PROJECT_DIR:-$(pwd)}"
bin="$root/.claude/skills/impeccable/scripts/impeccable"
[ -f "$bin" ] || exit 0
input=$(cat)
ui='(^|/)(src|_comps|assets)/|(^|/)tokens\.css$|\.(html|css)$'

case "$input" in
  *'"PostToolUse"'*)
    paths=$(printf '%s' "$input" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const j=JSON.parse(s);console.log((j.tool_input&&j.tool_input.file_path)||"")}catch{}})') ;;
  *)
    paths=$(git -C "$root" status --porcelain 2>/dev/null | cut -c4-) ;;
esac

printf '%s\n' "$paths" | tr '\\' '/' | grep -Eq "$ui" || exit 0
printf '%s' "$input" | "$bin" hook
