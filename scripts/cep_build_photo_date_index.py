#!/usr/bin/env python3

import os
import sys
import json
import subprocess
import datetime
import re

STATIC_PHOTOS_DIR = "static/photos"
OUT_PATH = "data/photodates.json"

def get_git_added_dates_bulk():
    out = {}
    try:
        res = subprocess.run(
            ["git", "log", "--diff-filter=A", "--pretty=format:%aI", "--name-only"],
            capture_output=True,
            text=True,
            check=True,
        )
        current_date = None
        for line in res.stdout.splitlines():
            line = line.strip()
            if not line:
                continue
            if re.match(r"\d{4}-\d{2}-\d{2}T", line):
                current_date = line
            else:
                out[line] = current_date
    except Exception as e:
        print(f"WARNING: failed to get git added dates: {e}", file=sys.stderr)
    return out

def run():
    git_added_map = get_git_added_dates_bulk()
    photos_added = {}

    for fname in os.listdir(STATIC_PHOTOS_DIR):
        path = os.path.join(STATIC_PHOTOS_DIR, fname)
        if not os.path.isfile(path):
            continue

        rel = os.path.relpath(path).replace(os.sep, "/")
        added = git_added_map.get(rel)

        if not added:
            ts = os.path.getmtime(path)
            added = datetime.datetime.fromtimestamp(ts).astimezone().isoformat()

        # 🔑 USE FULL FILENAME (WITH EXTENSION)
        photos_added[fname] = added

    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(photos_added, f, indent=2, ensure_ascii=False)

    print(f"Wrote {OUT_PATH} ({len(photos_added)} photos)")

if __name__ == "__main__":
    run()
