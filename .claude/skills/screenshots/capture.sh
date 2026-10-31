#!/usr/bin/env bash
# Screenshots and JS-error check for the portfolio pages, with Edge headless.
#   capture.sh shot   <page.html> <out.png> [width=1440] [height=900] [query]
#   capture.sh errors <page.html> [query]
# <page.html> is a path inside the project; [query] is without "?" (e.g. "theme=dark&open").
set -euo pipefail
EDGE="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
url(){ printf 'file:///%s%s' "$(cygpath -m "$(realpath "$1")")" "${2:+?$2}"; }   # file:///C:/… (never /c/…)

case "${1:-}" in
  shot)
    page=$2 out=$3 w=${4:-1440} h=${5:-900} q=${6:-}
    "$EDGE" --headless=new --disable-gpu --hide-scrollbars --allow-file-access-from-files \
      --window-size="$w,$h" --virtual-time-budget=4000 --screenshot="$(cygpath -w "$(realpath -m "$out")")" "$(url "$page" "$q")" 2>/dev/null
    echo "saved $out (${w}x${h}${q:+, ?$q})" ;;
  errors)
    page=$2 q=${3:-}
    # a sibling copy keeps relative asset paths; window.onerror writes the first error into <title>
    tmp="$(dirname "$page")/.err-$(basename "$page")"
    sed '0,/<head>/s//<head><script>addEventListener("error",e=>{document.title="JSERROR "+e.message+" @"+e.lineno},true)<\/script>/' "$page" > "$tmp"
    title=$("$EDGE" --headless=new --disable-gpu --allow-file-access-from-files --virtual-time-budget=4000 \
      --dump-dom "$(url "$tmp" "$q")" 2>/dev/null | grep -o '<title>[^<]*</title>' | head -1)
    rm -f "$tmp"
    case "$title" in *JSERROR*) echo "$title (line numbers are +0: the injected script sits on the <head> line)"; exit 1 ;; *) echo "no JS errors · $title" ;; esac ;;
  *) sed -n '2,5p' "$0"; exit 2 ;;
esac
