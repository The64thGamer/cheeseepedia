#!/usr/bin/env python3

import os, sys, json, subprocess, datetime

STATIC_PHOTOS_DIR = "static/photos"
COMMON_EXTS = ["", ".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]
OUT_PATH = "data/photodates.json"

def find_static_file(basename: str):
    candidates = [basename] if os.path.splitext(basename)[1] else [basename + e for e in COMMON_EXTS]
    for c in candidates:
        p = os.path.join(STATIC_PHOTOS_DIR, c)
        if os.path.exists(p):
            return c
    return None

def get_git_added_dates_bulk():
    out = {}
    try:
        res = subprocess.run(
            ["git", "log", "--diff-filter=A", "--pretty=format:%aI", "--name-only"],
            capture_output=True, text=True, check=True
        )
        lines = res.stdout.splitlines()
        current_date = None
        for line in lines:
            line = line.strip()
            if not line:
                continue
            if line.startswith("20") or line.startswith("19"):
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
        title = os.path.splitext(fname)[0]
        added = git_added_map.get(os.path.relpath(path).replace(os.sep, "/"))
        if not added:
            ts = os.path.getmtime(path)
            added = datetime.datetime.fromtimestamp(ts).astimezone().isoformat()
        photos_added[title] = added

    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(photos_added, f, indent=2)
    print(f"Wrote {OUT_PATH} ({len(photos_added)} photos)")

if __name__ == "__main__":
    run()
