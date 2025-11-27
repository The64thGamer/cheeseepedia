#!/usr/bin/env python3
"""
scripts/build_photos_index.py

Produces data/photos-by-page.json with structure:
{
  "<Wiki Page Title>": [
     { "name": "<photoTitle>", "path": "content/photos/xxx.md", "hasFile": true/false, "imageURL": "/photos/xxx.jpg", "startDate": "YYYY-MM-DD" },
     ...
  ],
  ...
}

Run: pip install python-frontmatter PyYAML
Then: python3 scripts/build_photos_index.py
"""
import os
import json
import frontmatter

# Config
CONTENT_PHOTOS = "content/photos"
STATIC_PHOTOS_DIR = "static/photos"
OUT_PATH = "data/photos-by-page.json"
COMMON_EXTS = ["", ".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]

def find_static_file(name):
    # If name already has extension, try it first; otherwise try common ext.
    candidates = [name] if os.path.splitext(name)[1] else [name + e for e in COMMON_EXTS]
    for c in candidates:
        p = os.path.join(STATIC_PHOTOS_DIR, c)
        if os.path.exists(p):
            return c  # return filename relative to /photos
    return None

def normalize_pages_field(raw):
    # raw may be string, list, nested lists. Return flat list of strings.
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

def build_index():
    index = {}
    # Walk content/photos directory
    for root, dirs, files in os.walk(CONTENT_PHOTOS):
        for fname in files:
            if not (fname.endswith(".md") or fname.endswith(".markdown") or fname.endswith(".mdown")):
                continue
            fpath = os.path.join(root, fname)
            try:
                post = frontmatter.load(fpath)
            except Exception as e:
                print(f"WARNING: failed to parse {fpath}: {e}")
                continue

            title = post.get('title') or post.get('Title') or os.path.splitext(fname)[0]
            pages = normalize_pages_field(post.get('pages') or post.get('Params', {}).get('pages') if isinstance(post.get('Params', {}), dict) else post.get('pages'))
            # support startDate in frontmatter (optional)
            start_date = post.get('startDate') or post.get('date') or None

            # detect static file presence (using title as file basename)
            file_candidate = title
            found_name = find_static_file(file_candidate)
            has_file = bool(found_name)
            imageURL = f"/photos/{found_name}" if found_name else "/UI/File Not Found.jpg"

            item = {
                "name": title,
                "page_path": os.path.relpath(fpath).replace(os.sep, "/"),
                "hasFile": has_file,
                "imageURL": imageURL,
                "startDate": start_date
            }

            # map into index for every referenced wiki page
            for p in pages:
                key = str(p)
                index.setdefault(key, []).append(item)

    # Optionally sort each page's photos by startDate
    for k, arr in index.items():
        # stable sort: missing dates go last
        arr.sort(key=lambda x: (x.get('startDate') is None, x.get('startDate') or "9999-99-99"))
        index[k] = arr

    # Ensure data dir exists
    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, "w", encoding="utf-8") as fh:
        json.dump(index, fh, indent=2, ensure_ascii=False)
    print(f"Wrote {OUT_PATH} ({len(index)} page keys)")

if __name__ == "__main__":
    build_index()
