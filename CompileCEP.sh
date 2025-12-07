#!/usr/bin/env bash
set -euo pipefail

echo "Indexing Photos"
source .venv/bin/activate
python3 scripts/build_photos_index.py

hugo serve
