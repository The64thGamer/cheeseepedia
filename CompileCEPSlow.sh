#!/usr/bin/env bash
set -euo pipefail

echo "Indexing Photos"
source .venv/bin/activate
python3 scripts/build_photos_index.py
echo "Creating Low Quality Photos"
python3 scripts/generate_lowphotos.py
echo "Building Pagefind"
./pagefind --site "public" --output-subdir ../static/pagefind --glob "wiki/**/*.{html}"

hugo serve
