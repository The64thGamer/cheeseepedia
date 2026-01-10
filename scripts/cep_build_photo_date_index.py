#!/usr/bin/env python3

import os
import sys
import json
import subprocess
import datetime
import re

STATIC_PHOTOS_DIR = "static/photos"
PAGES_DIR = "content/photos"  # folder where the photo page markdown files live
OUT_PHOTODATES_PATH = "data/photodates.json"
OUT_PHOTOS_PATH = "data/photos.json"  # optional: for site.Data.photos

# Optional: debug for DigitalOcean build
DEBUG = False
def debug_log(msg):
    if DEBUG:
        print(msg, file=sys.stderr)

# --- Frontmatter / content cleaning ---
try:
    import frontmatter as _pf
except Exception:
    _pf = None

RE_TOML_BLOCK = re.compile(r'(?s)^\+{3}.*?\+{3}')
RE_YAML_BLOCK = re.compile(r'(?s)^-{3}.*?-{3}')
RE_LEADING_KEYVALS = re.compile(
    r'(?s)^(?:[A-Za-z0-9_\-]+\s*=\s*(?:"[^"]*"|\'[^\']*\'|[^"\']\S*)\s*(?:\n|$))+',
    re.MULTILINE
)

def sanitize_content_raw(txt: str) -> str:
    """Remove frontmatter-like blocks from text."""
    if not txt:
        return ""

    s = str(txt)
    s = RE_TOML_BLOCK.sub("", s)
    s = RE_YAML_BLOCK.sub("", s)

    m = RE_LEADING_KEYVALS.match(s)
    if m:
        s = s[m.end():]

    if re.match(r'^\s*[A-Za-z0-9_\-]+\s*=', s):
        p = re.search(r'(\n\s*\n|\+{3})', s)
        if p:
            s = s[p.end():]
        else:
            s = re.sub(r'^[^\n]*\n', '', s, count=1)

    s = s.strip()
    return s

def read_page_and_clean_body(path: str) -> (dict, str):
    """
    Returns (frontmatter_dict_or_empty, cleaned_body)
    """
    text = ""
    try:
        with open(path, "r", encoding="utf-8") as fh:
            text = fh.read()
    except UnicodeDecodeError:
        with open(path, "r", encoding="latin-1") as fh:
            text = fh.read()
    except Exception as e:
        debug_log(f"Error reading {path}: {e}")
        return {}, ""

    if _pf:
        try:
            post = _pf.loads(text)
            fm = post.metadata or {}
            body = sanitize_content_raw(post.content or "")
            return fm, body
        except Exception:
            pass

    fm = {}
    body = text
    m = re.match(r'(?s)^\+{3}(.*?)\+{3}(.*)$', text)
    if m:
        fm_fragment = m.group(1)
        body = m.group(2)
    else:
        m = re.match(r'(?s)^-{3}(.*?)-{3}(.*)$', text)
        if m:
            fm_fragment = m.group(1)
            body = m.group(2)
        else:
            fm_fragment = ""

    body = sanitize_content_raw(body)
    return fm, body

# --- Git helper ---
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

# --- Main ---
def run():
    git_added_map = get_git_added_dates_bulk()
    photos_added = {}
    photos_meta = {}

    # Step 1: iterate static/photos folder
    for fname in os.listdir(STATIC_PHOTOS_DIR):
        path = os.path.join(STATIC_PHOTOS_DIR, fname)
        if not os.path.isfile(path):
            continue

        rel = os.path.relpath(path).replace(os.sep, "/")
        added = git_added_map.get(rel)
        if not added:
            ts = os.path.getmtime(path)
            added = datetime.datetime.fromtimestamp(ts).astimezone().isoformat()

        photos_added[fname] = added

        # Optional: build photos.json metadata by scanning corresponding page
        # assume page filename matches photo name (without extension or exact match)
        possible_page_files = [
            os.path.join(PAGES_DIR, fname + ".md"),
            os.path.join(PAGES_DIR, fname.replace(os.path.splitext(fname)[1], "") + ".md")
        ]
        meta_entry = {"name": fname, "hasFile": True, "fileName": fname, "startDate": added, "content": ""}
        for page_file in possible_page_files:
            if os.path.exists(page_file):
                fm, body = read_page_and_clean_body(page_file)
                meta_entry["content"] = body
                meta_entry["startDate"] = fm.get("startDate", added)
                meta_entry["page_path"] = page_file.replace(os.sep, "/")
                meta_entry["pages"] = fm.get("pages", [])
                meta_entry["citations"] = fm.get("citations", [])
                break

        photos_meta[fname] = meta_entry

    # Step 2: write photodates.json
    os.makedirs(os.path.dirname(OUT_PHOTODATES_PATH), exist_ok=True)
    with open(OUT_PHOTODATES_PATH, "w", encoding="utf-8") as f:
        json.dump(photos_added, f, indent=2, ensure_ascii=False)
    print(f"Wrote {OUT_PHOTODATES_PATH} ({len(photos_added)} photos)")

    # Step 3: write photos.json (site.Data.photos)
    os.makedirs(os.path.dirname(OUT_PHOTOS_PATH), exist_ok=True)
    with open(OUT_PHOTOS_PATH, "w", encoding="utf-8") as f:
        json.dump(photos_meta, f, indent=2, ensure_ascii=False)
    print(f"Wrote {OUT_PHOTOS_PATH} ({len(photos_meta)} photos)")

if __name__ == "__main__":
    run()
