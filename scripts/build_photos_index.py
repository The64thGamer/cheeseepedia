#!/usr/bin/env python3
"""
Robust photo index builder — manual frontmatter parsing.

Writes data/photos-by-page.json mapping:
{
  "Wiki Page Title": [
     { "name": "<photoTitle>", "page_path": "content/photos/xxx.md", "hasFile": true/false, "imageURL": "/photos/xxx.jpg", "startDate": "YYYY-MM-DD" },
     ...
  ]
}

This script:
 - detects TOML front matter wrapped in +++ ... +++,
 - detects YAML front matter wrapped in --- ... ---,
 - parses TOML via tomllib (Py3.11) or tomli (fallback),
 - parses YAML via PyYAML if available,
 - normalizes 'pages' field (string / list / nested lists).
"""
import os
import sys
import json

# parser libs
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

# Config — add more candidate dirs if you have photos elsewhere
PHOTO_DIRS = [
    "content/photos",
    "themes/sixtyth-fortran/content/photos"
]
STATIC_PHOTOS_DIR = "static/photos"
OUT_PATH = "data/photos-by-page.json"
COMMON_EXTS = ["", ".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]

def find_static_file(basename):
    """Try to find a static file for a given basename. Return filename (relative to /photos) or None."""
    # if basename already has extension, try it first
    candidates = [basename] if os.path.splitext(basename)[1] else [basename + e for e in COMMON_EXTS]
    for c in candidates:
        p = os.path.join(STATIC_PHOTOS_DIR, c)
        if os.path.exists(p):
            return c
    return None

def read_frontmatter(path):
    """Read front matter from file and return a dict (or {}).
       Supports TOML (+++ ... +++) and YAML (--- ... ---).
       If no frontmatter, returns {}.
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
        # find closing +++
        # allow either "+++\n" or "+++\r\n"
        end_idx = txt.find("\n+++", 3)
        if end_idx == -1:
            # try searching for '+++' on its own line
            parts = txt.splitlines()
            try:
                # find second occurrence
                first = 0
                second = parts.index("+++", 1)
                fm_lines = parts[1:second]
                fm_text = "\n".join(fm_lines)
            except Exception:
                return {}
        else:
            fm_text = txt[3:end_idx+1].strip()
        if toml is None:
            # toml parser not available
            print(f"WARNING: TOML frontmatter found in {path} but no toml parser available", file=sys.stderr)
            return {}
        try:
            data = toml.loads(fm_text)
            return data if isinstance(data, dict) else {}
        except Exception as e:
            print(f"ERROR parsing TOML frontmatter in {path}: {e}", file=sys.stderr)
            return {}
    elif txt.startswith("---"):
        # YAML frontmatter
        # find second '---' line
        parts = txt.splitlines()
        try:
            # find the index of the second '---'
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
    # fallback
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

def build_index():
    files = collect_photo_files()
    print(f"DEBUG: scanned {len(files)} photo page files from dirs: {PHOTO_DIRS}", file=sys.stderr)

    index = {}
    for path in files:
        try:
            fm = read_frontmatter(path)
        except Exception as e:
            print(f"ERROR reading frontmatter {path}: {e}", file=sys.stderr)
            continue

        if not fm:
            # no frontmatter or parse failed — skip quietly
            continue

        # title fallback to file basename if not present
        title = fm.get("title") or fm.get("Title") or os.path.splitext(os.path.basename(path))[0]

        # pages field may be called 'pages' (as in your files) — normalize it
        pages_raw = fm.get("pages") or fm.get("Pages") or []
        pages = normalize_pages_field(pages_raw)

        start_date = fm.get("startDate") or fm.get("date") or None

        # detect static file if available
        found_name = find_static_file(title)
        has_file = bool(found_name)
        imageURL = f"/photos/{found_name}" if found_name else "/UI/File Not Found.jpg"

        item = {
            "name": title,
            "page_path": os.path.relpath(path).replace(os.sep, "/"),
            "hasFile": has_file,
            "imageURL": imageURL,
            "startDate": start_date
        }

        for p in pages:
            key = str(p)
            index.setdefault(key, []).append(item)

    # optional: sort lists by startDate (missing dates last)
    for k, arr in list(index.items()):
        arr.sort(key=lambda x: (x.get('startDate') is None, x.get('startDate') or "9999-99-99"))
        index[k] = arr

    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, "w", encoding="utf-8") as fh:
        json.dump(index, fh, indent=2, ensure_ascii=False)

    print(f"Wrote {OUT_PATH} ({len(index)} page keys)", file=sys.stderr)
    return index

if __name__ == "__main__":
    build_index()
