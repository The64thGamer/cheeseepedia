#!/bin/bash
# === Cheeseepedia Photo Import Script ===
# Converts an image to lossless .avif, renames it randomly,
# saves it to static/photos, and generates a .md metadata file.

# --- CONFIG ---
STATIC_DIR="/home/the64tharchuser/Desktop/My Websites/cheeseepedia.org/cheeseepedia/static/photos"
CONTENT_DIR="/home/the64tharchuser/Desktop/My Websites/cheeseepedia.org/cheeseepedia/content/photos"

# --- CHECK DEPENDENCIES ---
if ! command -v avifenc &>/dev/null; then
  echo "Error: 'avifenc' not found. Install it with: sudo pacman -S libavif"
  exit 1
fi

# --- INPUT FILE ---
read -p "Enter image file path: " INPUT
if [ ! -f "$INPUT" ]; then
  echo "File not found!"
  exit 1
fi

# --- GENERATE RANDOM FILENAME ---
RAND=$(tr -dc 'a-z0-9' </dev/urandom | head -c 16)
OUTPUT_NAME="${RAND}.avif"
OUTPUT_PATH="${STATIC_DIR}/${OUTPUT_NAME}"

# --- CONVERT TO LOSSLESS AVIF ---
echo "Converting to lossless AVIF..."
avifenc --lossless "$INPUT" "$OUTPUT_PATH"

# --- METADATA PROMPTS ---
# Function to build arrays interactively
collect_items() {
  local prompt="$1"
  local -n arr=$2
  while true; do
    read -p "$prompt: " item
    arr+=("$item")
    read -p "Add another? (y/n): " more
    [[ "$more" =~ ^[Yy]$ ]] || break
  done
}

declare -a categories pages citations

collect_items "Enter a category" categories
collect_items "Enter a page" pages
collect_items "Enter a citation URL" citations

read -p "Enter start date (YYYY-MM-DD or 0000-00-00): " startdate
read -p "Enter short description: " description

# --- FORMAT ARRAYS ---
join_by_comma() {
  local IFS=", "
  printf '"%s"' "${@}"
}

CATEGORIES=$(printf '"%s", ' "${categories[@]}" | sed 's/, $//')
PAGES=$(printf '"%s", ' "${pages[@]}" | sed 's/, $//')
CITATIONS=$(printf '"%s", ' "${citations[@]}" | sed 's/, $//')

# --- CREATE .MD FILE ---
MD_FILE="${CONTENT_DIR}/${RAND}.md"

cat <<EOF >"$MD_FILE"
+++
title = "${OUTPUT_NAME}"
draft = false
tags = ["Photos"]
categories = [${CATEGORIES}]
pages = [${PAGES}]
startDate = "${startdate}"
citations = [${CITATIONS}]
+++
${description}
EOF

echo "✅ Done!"
echo "Saved image: $OUTPUT_PATH"
echo "Created metadata: $MD_FILE"
