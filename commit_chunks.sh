#!/usr/bin/env bash
CHUNK=50
BRANCH=$(git rev-parse --abbrev-ref HEAD)

git add -A
git diff --cached --name-only > /tmp/all_staged.txt
TOTAL=$(wc -l < /tmp/all_staged.txt)
echo "Total staged: $TOTAL files"
git reset HEAD

BATCH=0
while true; do
  START=$((BATCH * CHUNK + 1))
  END=$(((BATCH + 1) * CHUNK))
  CHUNK_FILES=$(sed -n "${START},${END}p" /tmp/all_staged.txt)
  if [ -z "$CHUNK_FILES" ]; then break; fi
  COUNT=$(echo "$CHUNK_FILES" | wc -l)
  echo "Batch $((BATCH + 1)): $COUNT files..."
  echo "$CHUNK_FILES" | xargs git add
  git commit -m "Batch $((BATCH + 1)): files $START-$END"
  git push origin "$BRANCH"
  BATCH=$((BATCH + 1))
done

echo "Done. $BATCH batches pushed."
