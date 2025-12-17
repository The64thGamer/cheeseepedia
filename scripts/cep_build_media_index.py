#!/usr/bin/env python3
"""
Robust photo, video & locations index builder.

Outputs:
 - data/photosbypage.json   : mapping "Wiki Page Title" -> [photo metadata...]
 - data/photos.json         : mapping "photoFileName" -> metadata (single object) for O(1) lookup
 - data/videosbypage.json   : mapping "Wiki Page Title" -> [video metadata...]
 - data/locations-index.json: mapping "<paramName>|<LocationTitle>" -> [entry...]
    where each entry is:
      {
        "page_get": "locations/some-page",   # use with site.GetPage
        "page_path": "content/locations/some-page.md",
        "page_title": "Some Page Title",
        "parts": ["Location Title", "YYYY-MM-DD", "..."],
        "sort": "YYYYMMDD"  # sortable string
      }
"""
from __future__ import annotations
import os
import sys
import json
import re
import frontmatter
import subprocess
import datetime


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
VIDEO_DIRS = [
    "content/videos",
    "themes/sixtyth-fortran/content/videos"
]
STATIC_PHOTOS_DIR = "static/photos"
OUT_PATH_BY_PAGE = "data/photosbypage.json"
OUT_PATH_BY_PHOTO = "data/photos.json"
OUT_PATH_VIDEOS_BY_PAGE = "data/videosbypage.json"
OUT_PATH_LOCATIONS = "data/locations-index.json"
COMMON_EXTS = ["", ".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]

# The param names we care about for the locations index.
PARAM_NAMES = ["animatronics", "attractions", "stages", "remodels"]

def find_static_file(basename: str):
    """Try to find a static file for a given basename. Return filename (relative to /photos) or None."""
    candidates = [basename] if os.path.splitext(basename)[1] else [basename + e for e in COMMON_EXTS]
    for c in candidates:
        p = os.path.join(STATIC_PHOTOS_DIR, c)
        if os.path.exists(p):
            return c
    return None

def get_git_added_dates_bulk():
    """
    Returns a dict: {relative_path: ISO_date} for all files added in git.
    Much faster than running git log per file.
    """
    try:
        res = subprocess.run(
            ["git", "log", "--diff-filter=A", "--pretty=format:%aI", "--name-only"],
            capture_output=True, text=True, check=True
        )
        out = {}
        lines = res.stdout.splitlines()
        current_date = None
        for line in lines:
            line = line.strip()
            if not line:
                continue
            if re.match(r"\d{4}-\d{2}-\d{2}T", line):
                # It's a date line
                current_date = line
            else:
                # It's a filename
                out[line] = current_date
        return out
    except Exception as e:
        print(f"WARNING: failed to get git added dates: {e}", file=sys.stderr)
        return {}


def read_frontmatter(path: str):
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

def collect_video_files():
    """Collect all video .md/.markdown/.mdown files under video dirs (content/videos...)"""
    files = []
    for base in VIDEO_DIRS:
        if not os.path.isdir(base):
            continue
        for root, _, fnames in os.walk(base):
            for fname in fnames:
                if fname.lower().endswith((".md", ".markdown", ".mdown")):
                    files.append(os.path.join(root, fname))
    return files

def collect_all_content_files():
    """Collect all .md/.markdown/.mdown files under content/ (including theme content if needed)"""
    files = []
    for root, _, fnames in os.walk("content"):
        for fname in fnames:
            if fname.lower().endswith((".md", ".markdown", ".mdown")):
                files.append(os.path.join(root, fname))
    return files

def load_content_only(path: str):
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
            parts = re.split(r"(?m)^---\s*$", raw)
            body = parts[2] if len(parts) >= 3 else raw
    return body.strip()

def build_photos_indices():
    """
    Build photo indices by page and by photo, with added dates.
    Uses bulk git info for speed; falls back to filesystem timestamps.
    """
    files = collect_photo_files()
    print(f"DEBUG: scanned {len(files)} photo page files from dirs: {PHOTO_DIRS}", file=sys.stderr)

    by_page = {}
    by_photo = {}
    duplicates = 0

    # --- bulk git added dates (for speed) ---
    git_added_map = {}
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
            if re.match(r"\d{4}-\d{2}-\d{2}T", line):
                current_date = line
            else:
                git_added_map[line] = current_date
    except Exception:
        print("WARNING: git info not available, will use filesystem timestamps.", file=sys.stderr)

    for path in files:
        try:
            fm = read_frontmatter(path)
        except Exception as e:
            print(f"ERROR reading frontmatter {path}: {e}", file=sys.stderr)
            continue

        if not fm:
            continue

        title = fm.get("title") or fm.get("Title") or os.path.splitext(os.path.basename(path))[0]
        pages_raw = fm.get("pages") or fm.get("Pages") or []
        pages = normalize_pages_field(pages_raw)
        content = load_content_only(path)
        start_date = fm.get("startDate") or fm.get("date") or ""

        found_name = find_static_file(title)
        has_file = bool(found_name)

        # --- base item metadata ---
        item = {
            "name": title,
            "page_path": os.path.relpath(path).replace(os.sep, "/"),
            "hasFile": has_file,
            "startDate": start_date,
            "content": content,
        }

        # --- added date for content file ---
        relpath_key = os.path.relpath(path).replace(os.sep, "/")
        added = git_added_map.get(relpath_key)
        if added:
            item["added"] = added
        else:
            try:
                ts = os.path.getmtime(path)
                item["added"] = datetime.datetime.fromtimestamp(ts).astimezone().isoformat()
            except Exception:
                item["added"] = None

        # --- added date for static image file ---
        if found_name:
            static_path = os.path.join(STATIC_PHOTOS_DIR, found_name)
            static_rel = os.path.relpath(static_path).replace(os.sep, "/")
            static_added = git_added_map.get(static_rel)
            if static_added:
                item["staticAdded"] = static_added
            else:
                try:
                    ts2 = os.path.getmtime(static_path)
                    item["staticAdded"] = datetime.datetime.fromtimestamp(ts2).astimezone().isoformat()
                except Exception:
                    item["staticAdded"] = None

        # --- map to pages ---
        for p in pages:
            key = str(p)
            by_page.setdefault(key, []).append(item)

        # --- map to photo title ---
        if title in by_photo:
            duplicates += 1
            print(f"WARNING: duplicate photo title '{title}' found at {path}; skipping duplicate", file=sys.stderr)
        else:
            by_photo[title] = item

    # --- sort each page list by startDate ---
    for k, arr in list(by_page.items()):
        arr.sort(key=lambda x: ((x.get('startDate') == "" or x.get('startDate') is None), x.get('startDate') or "9999-99-99"))
        by_page[k] = arr

    return by_page, by_photo, duplicates


def build_videos_indices():
    """
    Build a mapping like photosbypage but for videos.
    Output shape: { "Page Title": [ { "name": title, "page_path": "...", "startDate": "...", "content": "...", "pages": [...], "tags": [...], "categories": [...], "draft": False }, ... ] }
    Note: for your setup the frontmatter 'title' is the video URL (e.g. https://youtu.be/...)
    """
    files = collect_video_files()
    print(f"DEBUG: scanned {len(files)} video page files from dirs: {VIDEO_DIRS}", file=sys.stderr)

    by_page = {}

    for path in files:
        try:
            fm = read_frontmatter(path)
        except Exception as e:
            print(f"ERROR reading frontmatter (video) {path}: {e}", file=sys.stderr)
            continue

        if not fm:
            continue

        title = fm.get("title") or fm.get("Title") or os.path.splitext(os.path.basename(path))[0]
        pages_raw = fm.get("pages") or fm.get("Pages") or []
        pages = normalize_pages_field(pages_raw)
        content = load_content_only(path)
        start_date = fm.get("startDate") or fm.get("date") or ""

        item = {
            "name": title,
            "page_path": os.path.relpath(path).replace(os.sep, "/"),
            "startDate": start_date,
            "content": content,
        }

        for p in pages:
            key = str(p)
            by_page.setdefault(key, []).append(item)

    # sort by startDate (same logic as photos)
    for k, arr in list(by_page.items()):
        arr.sort(key=lambda x: ((x.get('startDate') == "" or x.get('startDate') is None), x.get('startDate') or "9999-99-99"))
        by_page[k] = arr

    return by_page

def build_locations_index():
    """Scan content/ for pages with PARAM_NAMES in frontmatter and build index."""
    files = collect_all_content_files()
    index = {}

    for path in files:
        # skip photos content since those are handled separately
        if os.path.commonpath([os.path.abspath(path), os.path.abspath("content/photos")]) == os.path.abspath("content/photos"):
            continue

        try:
            fm = read_frontmatter(path)
        except Exception as e:
            print(f"ERROR reading frontmatter (locations) {path}: {e}", file=sys.stderr)
            continue

        if not fm:
            continue

        # normalize title
        page_title = fm.get("title") or fm.get("Title") or ""
        relpath = os.path.relpath(path).replace(os.sep, "/")  # e.g., content/locations/foo.md

        # compute page_get value for Hugo's site.GetPage: remove leading "content/" and extension
        page_get = re.sub(r'\.(md|markdown|mdown)$', '', relpath)
        if page_get.startswith("content/"):
            page_get = page_get[len("content/"):]

        # for each param name, look for values
        for param in PARAM_NAMES:
            # allow both lowercase and Titlecase keys commonly used in frontmatter
            entries_raw = fm.get(param) or fm.get(param.title()) or fm.get(param.upper()) or []
            # normalize to list
            if entries_raw is None:
                entries = []
            elif isinstance(entries_raw, str):
                entries = [entries_raw]
            elif isinstance(entries_raw, list):
                entries = entries_raw
            else:
                # fallback
                entries = [str(entries_raw)]

            for entry in entries:
                # split on '|' and strip whitespace
                parts = [p.strip() for p in str(entry).split("|")]
                if not parts or parts[0] == "":
                    continue
                name = parts[0]
                # start date at index 1 if present
                start = parts[1] if len(parts) > 1 else ""
                # normalize start to sortable key
                s = start or "9999-99-99"
                sp = s.split("-")
                year = sp[0] if len(sp) > 0 else "9999"
                month = sp[1] if len(sp) > 1 else "99"
                day = sp[2] if len(sp) > 2 else "99"
                if year == "0000":
                    year = "9999"
                if month == "00":
                    month = "99"
                if day == "00":
                    day = "99"
                sort_key = f"{year:0>4}{month:0>2}{day:0>2}"

                entry_dict = {
                    "page_get": page_get,
                    "page_path": relpath,
                    "page_title": page_title,
                    "parts": parts,
                    "sort": sort_key
                }

                map_key = f"{param}|{name}"
                index.setdefault(map_key, []).append(entry_dict)

    # sort each list by sort key
    for k, arr in list(index.items()):
        arr.sort(key=lambda x: x.get("sort") or "99999999")
        index[k] = arr

    return index

def write_json(path: str, obj):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(obj, fh, indent=2, ensure_ascii=False)

def run():
    by_page, by_photo, duplicates = build_photos_indices()
    videos_by_page = build_videos_indices()
    loc_index = build_locations_index()

    write_json(OUT_PATH_BY_PAGE, by_page)
    write_json(OUT_PATH_BY_PHOTO, by_photo)
    write_json(OUT_PATH_VIDEOS_BY_PAGE, videos_by_page)
    write_json(OUT_PATH_LOCATIONS, loc_index)

    print(f"Wrote {OUT_PATH_BY_PAGE} ({len(by_page)} page keys), "
          f"{OUT_PATH_BY_PHOTO} ({len(by_photo)} photos), "
          f"{OUT_PATH_VIDEOS_BY_PAGE} ({len(videos_by_page)} page keys), "
          f"{OUT_PATH_LOCATIONS} ({len(loc_index)} keys), duplicates={duplicates}", file=sys.stderr)
    return by_page, by_photo, videos_by_page, loc_index

if __name__ == "__main__":
    run()