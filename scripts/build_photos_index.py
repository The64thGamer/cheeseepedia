#!/usr/bin/env python3
"""
scripts/build_photos_index.py (harder-to-miss)
Searches both repository content/photos and themes/*/content/photos.
Writes data/photos-by-page.json and prints counts for debug.
"""
import os
import json
import frontmatter

# Config
CONTENT_DIRS = ["content/photos"]
# Also look inside themes/*/content/photos
for theme_dir in [d for d in os.listdir("themes") if os.path.isdir(os.path.join("themes", d))] if os.path.isdir("themes") else []:
    CONTENT_DIRS.append(os.path.join("themes", theme_dir, "content", "photos"))

STATIC_PHOTOS_DIR = "static/photos"
OUT_PATH = "data/photos-by-page.json"
COMMON_EXTS = ["", ".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]

def find_static_file(name):
    candidates = [name] if os.path.splitext(name)[1] else [name + e for e in COMMON_EXTS]
    for c in candidates:
        p = os.path.join(STATIC_PHOTOS_DIR, c)
        if os.path.exists(p):
            return c
    return None

def normalize_pages_field(raw):
    out = []
    if raw is None:
        return out
    if isinstance(raw, str):
        return [raw]
    if isinstance(raw, list):
        for el in raw:
            if isinstance(el, str):
                out.append(el)
            elif isinstance(el, list):
                for inner in el:
                    out.append(str(inner))
            else:
                out.append(str(el))
        return out
    return [str(raw)]

def collect_photo_files():
    files = []
    for base in CONTENT_DIRS:
        if not os.path.isdir(base):
            # no-op but show debug message
            # print(f"DEBUG: content dir not found: {base}")
            continue
        for root, _, fnames in os.walk(base):
            for fname in fnames:
                if fname.lower().endswith((".md", ".markdown", ".mdown")):
                    files.append(os.path.join(root, fname))
    return files

def build_index():
    index = {}
    photo_files = collect_photo_files()
    print(f"DEBUG: scanned {len(photo_files)} photo page files from dirs: {CONTENT_DIRS}")

    for fpath in photo_files:
        try:
            post = frontmatter.load(fpath)
        except Exception as e:
            print(f"WARNING: failed to parse {fpath}: {e}")
            continue

        title = post.get('title') or post.get('Title') or os.path.splitext(os.path.basename(fpath))[0]
        pages = normalize_pages_field(post.get('pages') or post.get('Params', {}).get('pages') if isinstance(post.get('Params', {}), dict) else post.get('pages'))
        start_date = post.get('startDate') or post.get('date') or None

        found_name = find_static_file(title)
        has_file = bool(found_name)
        imageURL = f"/photos/{found_name}" if found_name else "/UI/File Not Found.jpg"

        item = {
            "name": title,
            "page_path": os.path.relpath(fpath).replace(os.sep, "/"),
            "hasFile": has_file,
            "imageURL": imageURL,
            "startDate": start_date
        }

        for p in pages:
            key = str(p)
            index.setdefault(key, []).append(item)

    # sort each list
    for k, arr in index.items():
        arr.sort(key=lambda x: (x.get('startDate') is None, x.get('startDate') or "9999-99-99"))
        index[k] = arr

    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, "w", encoding="utf-8") as fh:
        json.dump(index, fh, indent=2, ensure_ascii=False)
    print(f"Wrote {OUT_PATH} ({len(index)} page keys)")

if __name__ == "__main__":
    build_index()
