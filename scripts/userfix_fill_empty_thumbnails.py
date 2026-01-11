#!/usr/bin/env python3
"""

Populate missing pageThumbnailFile entries in content/wiki/*.md using the
first matching image name from data/photosbypage.json.

Behavior:
 - Loads data/photosbypage.json (expected format: { "Page Title": [ { "name": "...", "hasFile": true, ...}, ... ], ... })
 - Iterates markdown files under content/wiki (recursive).
 - For each file, parses leading TOML (+++ ... +++) or YAML (--- ... ---) frontmatter as plain text.
 - If frontmatter has no pageThumbnailFile key or it's empty, attempts to find a candidate image:
     1) exact match on title -> photosbypage key
     2) case-insensitive match
     3) normalized match (remove punctuation, collapse spaces, lowercase)
 - If a candidate is found, updates/sets pageThumbnailFile in the original frontmatter block (TOML/YAML style preserved).
 - Prints debug logs for each file and a summary at the end.

Usage:
"""
from __future__ import annotations
import os
import re
import json
import sys
from pathlib import Path
from typing import Optional, Tuple

SITE_ROOT = Path(".")
PHOTOSBYPAGE_PATH = SITE_ROOT / "data" / "photosbypage.json"
WIKI_DIR = SITE_ROOT / "content" / "wiki"

# ---------------- helpers ----------------
def load_photosbypage(path: Path):
    if not path.exists():
        print(f"[ERROR] photosbypage file not found: {path}", file=sys.stderr)
        return {}
    try:
        with path.open("r", encoding="utf-8") as fh:
            return json.load(fh)
    except Exception as e:
        print(f"[ERROR] failed to load {path}: {e}", file=sys.stderr)
        return {}

_nonword_re = re.compile(r"[^\w\s]", flags=re.UNICODE)
_multispace_re = re.compile(r"\s+")

def normalize_text_for_match(s: str) -> str:
    # Lowercase, strip punctuation, collapse whitespace
    if s is None:
        return ""
    s = str(s).strip().lower()
    s = _nonword_re.sub(" ", s)
    s = _multispace_re.sub(" ", s)
    return s.strip()

def candidate_from_photos_list(arr):
    """Return first usable name from photosbypage array (prefer hasFile True if present)"""
    if not isinstance(arr, (list, tuple)) or not arr:
        return None
    # prefer first with hasFile true
    for item in arr:
        if isinstance(item, dict) and item.get("hasFile") and item.get("name"):
            return item.get("name")
    # fall back to first with name
    for item in arr:
        if isinstance(item, dict) and item.get("name"):
            return item.get("name")
    # maybe arr contains strings
    for item in arr:
        if isinstance(item, str) and item.strip():
            return item.strip()
    return None

# frontmatter splitting
TOML_OPEN = "+++"
YAML_OPEN = "---"
# find frontmatter block (style, fm_text, rest)
def split_frontmatter(text: str) -> Tuple[Optional[str], Optional[str], str]:
    """
    Returns (style, fm_text, remainder)
    style: "toml" or "yaml" or None
    fm_text: inner text of frontmatter (without delimiters) or None
    remainder: rest of file after frontmatter (leading newline preserved)
    """
    s = text.lstrip()
    if s.startswith(TOML_OPEN):
        parts = re.split(r"(?m)^\+{3}\s*$", text)
        if len(parts) >= 3:
            # parts[0] is leading prefix before first +++ (should be ""), parts[1] fm, parts[2] rest
            return "toml", parts[1], parts[2]
    if s.startswith(YAML_OPEN):
        parts = re.split(r"(?m)^-{3}\s*$", text)
        if len(parts) >= 3:
            return "yaml", parts[1], parts[2]
    return None, None, text

def set_frontmatter_key(fm_style: str, fm_text: str, key: str, value: str) -> str:
    """
    Given fm_text (string inside frontmatter), set or replace the given key.
    Returns new fm_text (still without the +++ or --- wrappers).
    Preserves simple style: writes TOML as `key = "value"` and YAML as `key: "value"`
    If key present, replace the whole line. Otherwise append prior to end.
    """
    if fm_style == "toml":
        # replace line like: pageThumbnailFile = "..." or pageThumbnailFile= '...' etc.
        pattern = re.compile(r"(?m)^\s*" + re.escape(key) + r"\s*=\s*.*$", flags=re.IGNORECASE)
        replacement = f'{key} = "{value}"'
        if pattern.search(fm_text):
            fm_text_new = pattern.sub(replacement, fm_text)
            return fm_text_new
        else:
            # append with newline
            if fm_text and not fm_text.endswith("\n"):
                fm_text = fm_text + "\n"
            return fm_text + replacement + "\n"
    elif fm_style == "yaml":
        pattern = re.compile(r"(?m)^\s*" + re.escape(key) + r"\s*:\s*.*$", flags=re.IGNORECASE)
        replacement = f'{key}: "{value}"'
        if pattern.search(fm_text):
            fm_text_new = pattern.sub(replacement, fm_text)
            return fm_text_new
        else:
            if fm_text and not fm_text.endswith("\n"):
                fm_text = fm_text + "\n"
            return fm_text + replacement + "\n"
    else:
        # No frontmatter style known; return unchanged
        return fm_text

def get_frontmatter_value(fm_style: str, fm_text: str, key: str) -> Optional[str]:
    if not fm_style or fm_text is None:
        return None
    if fm_style == "toml":
        m = re.search(r'(?m)^\s*' + re.escape(key) + r'\s*=\s*("([^"]*)"|\'([^\']*)\'|([^\n#]+))', fm_text)
        if m:
            v = m.group(2) or m.group(3) or m.group(4) or ""
            return str(v).strip()
    else:  # yaml
        m = re.search(r'(?m)^\s*' + re.escape(key) + r'\s*:\s*("([^"]*)"|\'([^\']*)\'|([^\n#]+))', fm_text)
        if m:
            v = m.group(2) or m.group(3) or m.group(4) or ""
            return str(v).strip()
    return None

def process_md_file(path: Path, photos_map: dict) -> Tuple[bool, str]:
    """
    Process a single markdown file. Returns (changed:bool, reason:str)
    """
    text = path.read_text(encoding="utf-8")
    fm_style, fm_text, remainder = split_frontmatter(text)
    if fm_style is None:
        return False, "no-frontmatter"

    # extract title (try to parse from frontmatter text by regex)
    # look for title key
    title = None
    m = None
    if fm_style == "toml":
        m = re.search(r'(?m)^\s*title\s*=\s*("([^"]*)"|\'([^\']*)\'|([^\n#]+))', fm_text)
        if m:
            title = m.group(2) or m.group(3) or m.group(4)
    else:
        m = re.search(r'(?m)^\s*title\s*:\s*("([^"]*)"|\'([^\']*)\'|([^\n#]+))', fm_text)
        if m:
            title = m.group(2) or m.group(3) or m.group(4)
    if title is None:
        # fallback: use filename (basename without extension)
        title = path.stem

    title = str(title).strip()

    current_thumb = get_frontmatter_value(fm_style, fm_text, "pageThumbnailFile")
    if current_thumb is not None and current_thumb.strip() != "":
        return False, f"already-set ({current_thumb})"

    # Attempt matching
    matched_key = None
    candidate_name = None

    # 1) exact match
    if title in photos_map:
        matched_key = title
        candidate_name = candidate_from_photos_list(photos_map[matched_key])
    else:
        # 2) case-insensitive
        lower_map = {k.lower(): k for k in photos_map.keys()}
        if title.lower() in lower_map:
            matched_key = lower_map[title.lower()]
            candidate_name = candidate_from_photos_list(photos_map[matched_key])
        else:
            # 3) normalized match
            norm_title = normalize_text_for_match(title)
            # build normalized map (compute once would be nicer; it's fine here)
            for k in photos_map.keys():
                if normalize_text_for_match(k) == norm_title:
                    matched_key = k
                    candidate_name = candidate_from_photos_list(photos_map[k])
                    break

    if candidate_name is None:
        return False, f"no-candidate (matched_key={matched_key})"

    # Found candidate_name -> write back frontmatter with pageThumbnailFile set
    new_fm_text = set_frontmatter_key(fm_style, fm_text, "pageThumbnailFile", candidate_name)

    # reconstruct file preserving delimiters
    if fm_style == "toml":
        new_text = TOML_OPEN + "\n" + new_fm_text + "+++\n" + remainder.lstrip("\n")
    else:
        new_text = YAML_OPEN + "\n" + new_fm_text + "---\n" + remainder.lstrip("\n")

    # write only if different
    if new_text != text:
        path.write_text(new_text, encoding="utf-8")
        return True, f"updated -> {candidate_name} (matched_key={matched_key})"
    else:
        return False, "no-change-after-write"

def collect_md_files_under(dirpath: Path):
    if not dirpath.exists():
        return []
    return sorted([p for p in dirpath.rglob("*.md")])

# ---------------- main ----------------
def main():
    photos_map = load_photosbypage(PHOTOSBYPAGE_PATH)
    if not photos_map:
        print("[WARN] photosbypage is empty or missing; nothing to do.", file=sys.stderr)
        return 1

    md_files = collect_md_files_under(WIKI_DIR)
    if not md_files:
        print(f"[WARN] no markdown files found under {WIKI_DIR}", file=sys.stderr)
        return 1

    total = 0
    changed = 0
    skipped = 0
    details = []

    print(f"[INFO] Loaded photosbypage keys: {len(photos_map)}")
    for p in md_files:
        total += 1
        ok, reason = process_md_file(p, photos_map)
        if ok:
            changed += 1
            print(f"[UPDATE] {p} -> {reason}")
            details.append((str(p), reason))
        else:
            skipped += 1
            print(f"[SKIP]   {p} -> {reason}")

    print(f"\nSummary: scanned={total}, updated={changed}, skipped={skipped}")
    return 0

if __name__ == "__main__":
    sys.exit(main())
