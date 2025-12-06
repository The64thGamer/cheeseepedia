#!/usr/bin/env python3
"""
Robust photo index builder — manual frontmatter parsing.

Outputs:
 - data/photosbypage.json   : mapping "Wiki Page Title" -> [photo metadata...]
 - data/photos.json         : mapping "photoFileName" -> metadata (single object) for O(1) lookup

Each photo metadata object contains:
  {
    "name": "<photoFilename>",
    "page_path": "content/photos/xxx.md",
    "hasFile": true|false,
    "imageURL": "/photos/xxx.avif" or "/UI/File Not Found.jpg",
    "startDate": "YYYY-MM-DD" or "",
    "content": "<body text>",
    "pages": ["Wiki Title 1", ...]
  }
"""
import os
import sys
import json
import re
import frontmatter

# parser libs: toml/yaml used only when manually parsing frontmatter blocks
try:
    import tomllib as toml  # Python 3.11+
except Exception:
    try:
        import tomli as toml  # pip install tomli
    except Exception:
        toml = None

try:
    import yaml
except Exception:
    yaml = None

# Config
PHOTO_DIRS = [
    "content/photos",
    "themes/sixtyth-fortran/content/photos"
]
STATIC_PHOTOS_DIR = "static/photos"
OUT_PATH_BY_PAGE = "data/photosbypage.json"   # existing output (user-named)
OUT_PATH_BY_PHOTO = "data/photos.json"       # new per-photo index for fast lookup
COMMON_EXTS = ["", ".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]

def find_static_file(basename):
    """Try to find a static file for a given basename. Return filename (relative to /photos) or None."""
    candidates = [basename] if os.path.splitext(basename)[1] else [basename + e for e in COMMON_EXTS]
    for c in candidates:
        p = os.path.join(STATIC_PHOTOS_DIR, c)
        if os.path.exists(p):
            return c
    return None

def read_frontmatter(path):
    """Read front matter from file and return a dict (or {}).
       Supports TOML (+++ ... +++) and YAML (--- ... ---).
    """
    with open(path, "rb") as fh:
        raw = fh.read()

    # try to decode as utf-8 with fallback
    try:
        txt = raw.decode("utf-8")
    except Exception:
        try:
            txt = raw.decode("latin-1")
        except Exception:
            return {}

    txt = txt.lstrip()
    if txt.startswith("+++"):
        # TOML frontmatter
        end_idx = txt.find("\n+++", 3)
        if end_idx == -1:
            # try searching for '+++' on its own line
            parts = txt.splitlines()
            try:
                second = parts.index("+++", 1)
                fm_lines = parts[1:second]
                fm_text = "\n".join(fm_lines)
            except Exception:
                return {}
        else:
            fm_text = txt[3:end_idx+1].strip()
        if toml is None:
            print(f"WARNING: TOML frontmatter found in {path} but no toml parser available", file=sys.stderr)
            return {}
        try:
            data = toml.loads(fm_text)
            return data if isinstance(data, dict) else {}
        except Exception as e:
            print(f"ERROR parsing TOML frontmatter in {path}: {e}", file=sys.stderr)
            return {}
    elif txt.startswith("---"):
        parts = txt.splitlines()
        try:
            second = parts.index("---", 1)
            fm_lines = parts[1:second]
            fm_text = "\n".join(fm_lines)
        except Exception:
            return {}
        if yaml is None:
            print(f"WARNING: YAML frontmatter found in {path} but PyYAML not installed", file=sys.stderr)
            return {}
        try:
            data = yaml.safe_load(fm_text)
            return data if isinstance(data, dict) else {}
        except Exception as e:
            print(f"ERROR parsing YAML frontmatter in {path}: {e}", file=sys.stderr)
            return {}
    else:
        return {}

def normalize_pages_field(raw):
    """Return flat list of strings from raw pages field (string, list, nested lists)"""
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
    for base in PHOTO_DIRS:
        if not os.path.isdir(base):
            continue
        for root, _, fnames in os.walk(base):
            for fname in fnames:
                if fname.lower().endswith((".md", ".markdown", ".mdown")):
                    files.append(os.path.join(root, fname))
    return files

def load_content_only(path):
    """Return the body (content) only. Prefer manual split for TOML (+++)."""
    with open(path, encoding="utf-8-sig") as f:
        raw = f.read()
    # Split off TOML frontmatter delimited by +++ ... +++
    split = re.split(r"(?m)^\+{3}\s*$", raw)
    if len(split) >= 3:
        body = split[2]
    else:
        # fallback to python-frontmatter to get body (works for YAML and many cases)
        try:
            post = frontmatter.load(path, encoding="utf-8-sig")
            body = post.content or ""
        except Exception:
            # ultimate fallback: try to remove YAML frontmatter manually
            parts = re.split(r"(?m)^---\s*$", raw)
            body = parts[2] if len(parts) >= 3 else raw
    return body.strip()

def build_index():
    files = collect_photo_files()
    print(f"DEBUG: scanned {len(files)} photo page files from dirs: {PHOTO_DIRS}", file=sys.stderr)

    by_page = {}
    by_photo = {}   # new per-photo index
    duplicates = 0

    for path in files:
        try:
            fm = read_frontmatter(path)
        except Exception as e:
            print(f"ERROR reading frontmatter {path}: {e}", file=sys.stderr)
            continue

        if not fm:
            # skip files without frontmatter
            continue

        # title fallback to file basename if not present
        title = fm.get("title") or fm.get("Title") or os.path.splitext(os.path.basename(path))[0]

        # pages field may be called 'pages' — normalize it
        pages_raw = fm.get("pages") or fm.get("Pages") or []
        pages = normalize_pages_field(pages_raw)

        content = load_content_only(path)
        start_date = fm.get("startDate") or fm.get("date") or ""

        # detect static file if available
        found_name = find_static_file(title)
        has_file = bool(found_name)
        imageURL = f"/photos/{found_name}" if found_name else "/UI/File Not Found.jpg"

        item = {
            "name": title,
            "page_path": os.path.relpath(path).replace(os.sep, "/"),
            "hasFile": has_file,
            "imageURL": imageURL,
            "startDate": start_date,
            "content": content,
            "pages": pages
        }

        # append to by_page mapping (one entry may belong to multiple pages)
        for p in pages:
            key = str(p)
            by_page.setdefault(key, []).append(item)

        # add to per-photo index (warning on duplicates; preserve first)
        if title in by_photo:
            duplicates += 1
            # if you want to prefer later entries, replace below; for now we keep first and log
            print(f"WARNING: duplicate photo title '{title}' found at {path}; skipping duplicate", file=sys.stderr)
        else:
            by_photo[title] = item

    # optional: sort lists in by_page by startDate (missing dates last)
    for k, arr in list(by_page.items()):
        arr.sort(key=lambda x: (x.get('startDate') == "" or x.get('startDate') is None, x.get('startDate') or "9999-99-99"))
        by_page[k] = arr

    # ensure data/ exists
    os.makedirs(os.path.dirname(OUT_PATH_BY_PAGE), exist_ok=True)

    # write by-page mapping
    with open(OUT_PATH_BY_PAGE, "w", encoding="utf-8") as fh:
        json.dump(by_page, fh, indent=2, ensure_ascii=False)

    # write per-photo index
    with open(OUT_PATH_BY_PHOTO, "w", encoding="utf-8") as fh:
        json.dump(by_photo, fh, indent=2, ensure_ascii=False)

    print(f"Wrote {OUT_PATH_BY_PAGE} ({len(by_page)} page keys), {OUT_PATH_BY_PHOTO} ({len(by_photo)} photos), duplicates={duplicates}", file=sys.stderr)
    return by_page, by_photo

if __name__ == "__main__":
    build_index()
