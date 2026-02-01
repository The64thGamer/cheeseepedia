#!/bin/bash

set -euo pipefail

shopt -s nullglob

for file in *.md; do
    # Check for required lines
    grep -q 'tags = \["In-Store Merchandise"\]' "$file" || continue
    grep -q 'pageThumbnailFile = ""' "$file" || continue

    # Check that the last +++ is the end of the file (ignoring whitespace)
    if ! awk '
        /^\+\+\+$/ { last = NR }
        END {
            if (!last) exit 1
            for (i = last + 1; i <= NR; i++) {
                if ($i !~ /^[[:space:]]*$/) exit 1
            }
        }
    ' "$file"; then
        continue
    fi

    echo "Deleting: $file"
    rm -- "$file"
done
