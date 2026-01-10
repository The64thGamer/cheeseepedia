#!/usr/bin/env python3
"""
Robust photo, video & locations index builder.

Outputs:
 - data/photosbypage.json
 - data/photos.json
 - data/videosbypage.json
 - data/locations-index.json
"""
from __future__ import annotations
import os
import sys
import json
import re
import frontmatter

# parser libs
try:
    import tomllib as toml
except Exception:
    try:
        import tomli as toml
    except Exception:
        toml = None

try:
    import yaml
except Exception:
    yaml = None

# ---------------- Config ----------------
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
PARAM_NAMES = ["animatronics", "attractions", "stages", "remodels"]

# ---------------- Hugo-style slugification ----------------

RE_NON_URL = re.compile(r"[^\w\-]+", re.UNICODE)
RE_DASHES = re.compile(r"-{2,}")

def hugo_slugify(s: str) -> str:
    """
    Approximate Hugo's urlize behavior for path segments.
    """
    if not s:
        return ""
    s = s.strip().lower()
    s = s.replace(" ", "-")
    s = RE_NON_URL.sub("-", s)
    s = RE_DASHES.sub("-", s)
    return s.strip("-")

def sanitize_page_path(path: str) -> str:
    """
    Apply Hugo-style sanitization to each path segment.
    Keeps slashes, removes extension.
    """
    path = path.replace(os.sep, "/")
    path = re.sub(r"\.(md|markdown|mdown)$", "", path, flags=re.IGNORECASE)

    segments = path.split("/")
    sanitized = [hugo_slugify(seg) for seg in segments if seg]
    return "/".join(sanitized)

# ---------------- Helpers ----------------

def find_static_file(basename: str):
    candidates = [basename] if os.path.splitext(basename)[1] else [basename + e for e in COMMON_EXTS]
    for c in candidates:
        if os.path.exists(os.path.join(STATIC_PHOTOS_DIR, c)):
            return c
    return None

def read_frontmatter(path: str):
    """Return frontmatter dict, robust to line endings."""
    with open(path, "rb") as fh:
        raw = fh.read()

    try:
        txt = raw.decode("utf-8-sig")  # remove BOM if exists
    except Exception:
        txt = raw.decode("latin-1", errors="ignore")

    # normalize line endings
    txt = txt.replace("\r\n", "\n").replace("\r", "\n").lstrip()

    # TOML frontmatter
    if txt.startswith("+++"):
        parts = re.split(r"(?m)^\+{3}\s*$", txt)
        if len(parts) >= 3 and toml:
            fm_txt = parts[1].strip()
            try:
                return toml.loads(fm_txt)
            except Exception:
                return {}
    # YAML frontmatter
    elif txt.startswith("---"):
        parts = re.split(r"(?m)^---\s*$", txt)
        if len(parts) >= 3 and yaml:
            fm_txt = parts[1].strip()
            try:
                return yaml.safe_load(fm_txt) or {}
            except Exception:
                return {}

    return {}


def normalize_pages_field(raw):
    if raw is None:
        return []
    if isinstance(raw, str):
        return [raw]
    if isinstance(raw, list):
        return [str(x) for x in raw]
    return [str(raw)]

def collect_md_files(base_dirs):
    out = []
    for base in base_dirs:
        if not os.path.isdir(base):
            continue
        for root, _, files in os.walk(base):
            for f in files:
                if f.lower().endswith((".md", ".markdown", ".mdown")):
                    out.append(os.path.join(root, f))
    return out

def load_content_only(path: str):
    """Return content after frontmatter."""
    with open(path, "rb") as fh:
        raw = fh.read()
    try:
        txt = raw.decode("utf-8-sig")
    except Exception:
        txt = raw.decode("latin-1", errors="ignore")

    txt = txt.replace("\r\n", "\n").replace("\r", "\n").lstrip()

    # remove TOML frontmatter
    if txt.startswith("+++"):
        parts = re.split(r"(?m)^\+{3}\s*$", txt)
        if len(parts) >= 3:
            return parts[2].strip()
    # remove YAML frontmatter
    elif txt.startswith("---"):
        parts = re.split(r"(?m)^---\s*$", txt)
        if len(parts) >= 3:
            return parts[2].strip()

    return txt.strip()


# ---------------- Builders ----------------

def build_photos_indices():
    files = collect_md_files(PHOTO_DIRS)
    by_page = {}
    by_photo = {}
    duplicates = 0

    for path in files:
        fm = read_frontmatter(path)
        if not fm:
            continue

        title = fm.get("title") or os.path.splitext(os.path.basename(path))[0]
        pages = normalize_pages_field(fm.get("pages"))
        content = load_content_only(path)
        start_date = fm.get("startDate") or fm.get("date") or ""

        rel = os.path.relpath(path)
        page_path = sanitize_page_path(rel)

        item = {
            "name": title,
            "page_path": page_path,
            "hasFile": bool(find_static_file(title)),
            "startDate": start_date,
            "content": content,
        }

        for p in pages:
            by_page.setdefault(str(p), []).append(item)

        if title in by_photo:
            duplicates += 1
        else:
            by_photo[title] = item

    for k, arr in by_page.items():
        arr.sort(key=lambda x: x.get("startDate") or "9999-99-99")

    return by_page, by_photo, duplicates

def build_videos_indices():
    files = collect_md_files(VIDEO_DIRS)
    by_page = {}

    for path in files:
        fm = read_frontmatter(path)
        if not fm:
            continue

        title = fm.get("title") or os.path.splitext(os.path.basename(path))[0]
        pages = normalize_pages_field(fm.get("pages"))
        content = load_content_only(path)
        start_date = fm.get("startDate") or fm.get("date") or ""

        rel = os.path.relpath(path)
        page_path = sanitize_page_path(rel)

        item = {
            "name": title,
            "page_path": page_path,
            "startDate": start_date,
            "content": content,
        }

        for p in pages:
            by_page.setdefault(str(p), []).append(item)

    for k, arr in by_page.items():
        arr.sort(key=lambda x: x.get("startDate") or "9999-99-99")

    return by_page

def build_locations_index():
    index = {}

    for root, _, files in os.walk("content"):
        for f in files:
            if not f.lower().endswith((".md", ".markdown", ".mdown")):
                continue

            path = os.path.join(root, f)
            fm = read_frontmatter(path)
            if not fm:
                continue

            title = fm.get("title") or ""
            rel = os.path.relpath(path)
            page_path = sanitize_page_path(rel)
            page_get = page_path.replace("content/", "", 1)

            for param in PARAM_NAMES:
                values = fm.get(param) or []
                if isinstance(values, str):
                    values = [values]

                for v in values:
                    parts = [p.strip() for p in str(v).split("|")]
                    if not parts or not parts[0]:
                        continue

                    start = parts[1] if len(parts) > 1 else ""
                    sort = (start or "9999-99-99").replace("-", "")

                    key = f"{param}|{parts[0]}"
                    index.setdefault(key, []).append({
                        "page_get": page_get,
                        "page_path": page_path,
                        "page_title": title,
                        "parts": parts,
                        "sort": sort
                    })

    for k in index:
        index[k].sort(key=lambda x: x["sort"])

    return index

# ---------------- Write ----------------

def write_json(path, obj):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f, indent=2, ensure_ascii=False)

def run():
    photos_by_page, photos_by_photo, dupes = build_photos_indices()
    videos_by_page = build_videos_indices()
    locations = build_locations_index()

    write_json(OUT_PATH_BY_PAGE, photos_by_page)
    write_json(OUT_PATH_BY_PHOTO, photos_by_photo)
    write_json(OUT_PATH_VIDEOS_BY_PAGE, videos_by_page)
    write_json(OUT_PATH_LOCATIONS, locations)

    print(
        f"Wrote photos={len(photos_by_photo)}, "
        f"videos={len(videos_by_page)}, "
        f"locations={len(locations)}, "
        f"duplicates={dupes}",
        file=sys.stderr
    )

if __name__ == "__main__":
    run()
