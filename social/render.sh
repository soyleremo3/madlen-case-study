#!/usr/bin/env bash
# Renders carousel.html into 1080x1350 PNGs (Instagram portrait) with headless Chrome.
# Usage: bash social/render.sh
set -euo pipefail
cd "$(dirname "$0")"
CHROME="/c/Program Files/Google/Chrome/Application/chrome.exe"
SRC="file:///$(pwd -W)/carousel.html"
mkdir -p out
for lang in tr en; do
  for n in 1 2 3 4 5; do
    "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
      --window-size=1080,1350 --virtual-time-budget=2500 \
      --screenshot="$(pwd -W)/out/${lang}-${n}.png" "${SRC}?lang=${lang}&slide=${n}" >/dev/null 2>&1
    echo "out/${lang}-${n}.png"
  done
done
