#!/bin/bash

# Function to slugify a string
slugify() {
    local input="$1"
    echo "$input" | \
        iconv -t ascii//TRANSLIT | \
        tr '[:upper:]' '[:lower:]' | \
        sed -E 's/[^a-z0-9]+/-/g' | \
        sed -E 's/^-+|-+$//g'
}

# Directory to process
DIRECTORY="${1:-.}"

# Find and process files recursively
find "$DIRECTORY" -depth -type f | while read -r file; do
    dir=$(dirname "$file")
    base=$(basename "$file")
    name="${base%.*}"         # File name without extension
    ext="${base##*.}"         # File extension
    if [[ "$name" == "$ext" ]]; then
        ext=""                # Handle files with no extension
    else
        ext=".$ext"
    fi
    slugified_name=$(slugify "$name")$ext
    if [[ "$base" != "$slugified_name" ]]; then
        mv -v "$file" "$dir/$slugified_name"
    fi
done

# Process directories after files
find "$DIRECTORY" -depth -type d | while read -r dir; do
    base=$(basename "$dir")
    parent=$(dirname "$dir")
    slugified=$(slugify "$base")
    if [[ "$base" != "$slugified" ]]; then
        mv -v "$dir" "$parent/$slugified"
    fi
done

