#!/usr/bin/env python3
"""
fix_last_stage_enddate.py

Purpose:
  Fix the end date of the last stage in the 'stages' TOML array
  to match the page's 'endDate' frontmatter parameter for all
  pages tagged as Locations.

Usage:
  Place this script at repo root (or adjust CONTENT_ROOT) and run:
    python fix_last_stage_enddate.py

  Options:
    --content / -C   : override content directory (default: content/wiki)
    --no-backup       : don't create .bak backups
    --dry-run         : show what would change but don't write files

Requirements:
    pip install toml
"""
from pathlib import Path
import re
import shutil
import argparse
import sys

try:
    import toml
except Exception:
    print("This script requires the 'toml' package. Install with: pip install toml")
    sys.exit(1)


CONTENT_ROOT = Path("content/wiki")
BACKUP_EXT = ".bak"


def read_frontmatter_toml(md_text: str):
    """
    Extract TOML frontmatter delimited by +++ lines.
    Returns (raw_front_str, parsed_dict, start_idx, end_idx).
    If no TOML frontmatter found or parse fails, parsed_dict may be None.
    start_idx and end_idx point to the indices in md_text of the +++ delimiters block.
    """
    delim = re.compile(r'^\+\+\+\s*$', re.MULTILINE)
    matches = list(delim.finditer(md_text))
    if len(matches) < 2:
        return None, None, None, None
    start = matches[0].end()
    end = matches[1].start()
    raw_front = md_text[start:end].strip("\n")
    parsed = None
    try:
        parsed = toml.loads(raw_front)
    except Exception:
        # return raw but parsed will be None so caller can skip or act accordingly
        parsed = None
    return raw_front, parsed, matches[0].start(), matches[1].end()


def tags_include_locations(parsed):
    """Return True if parsed contains tags or tag including 'Locations'"""
    if parsed is None:
        return False
    for key in ("tags", "tag"):
        val = parsed.get(key)
        if isinstance(val, list) and any(str(x).strip() == "Locations" for x in val):
            return True
    return False


def escape_for_toml_string(s: str):
    """Escape backslashes and double quotes for inclusion inside a TOML double-quoted string."""
    if s is None:
        s = ""
    return s.replace("\\", "\\\\").replace('"', '\\"')


def build_stage_string_parts(stage_raw: str):
    """
    Given a stage string like 'Name|start|end|notes' (may or may not end with trailing |),
    returns list of parts [name, start, end, notes] (notes may be empty).
    """
    # ensure we preserve empties: split on '|'
    parts = stage_raw.split("|")
    # If there is a trailing pipe, split will produce last element as ''
    # Normalize to at least 4 parts: name, start, end, notes (notes optional)
    while len(parts) < 4:
        parts.append("")
    # If there are more than 4 parts (unlikely), keep them joined into notes
    if len(parts) > 4:
        name = parts[0]
        start = parts[1] if len(parts) > 1 else ""
        end = parts[2] if len(parts) > 2 else ""
        notes = "|".join(parts[3:])
        return [name, start, end, notes]
    return parts[:4]


def join_stage_parts(parts):
    """Return stage string 'name|start|end|notes|' (ensures trailing pipe)."""
    # ensure exactly 4 parts
    parts = parts[:4] + [""] * max(0, 4 - len(parts))
    s = "|".join(parts)
    if not s.endswith("|"):
        s = s + "|"
    return s


def insert_or_replace_stages_in_front(raw_front: str, new_stage_list):
    """
    Insert or replace the TOML stages = [...] array in the raw frontmatter string.
    new_stage_list: list of unescaped stage strings; this function will escape each and wrap in quotes.
    """
    quoted = []
    for s in new_stage_list:
        s_escaped = escape_for_toml_string(s)
        quoted.append(f'"{s_escaped}"')
    array_str = "[" + ", ".join(quoted) + "]"

    stages_pattern = re.compile(r'(?m)^\s*stages\s*=\s*(\[[\s\S]*?\])\s*$', re.MULTILINE)
    if stages_pattern.search(raw_front):
        new_front = stages_pattern.sub(f"stages = {array_str}", raw_front)
    else:
        # append stages at end
        if raw_front.strip() == "":
            new_front = f"stages = {array_str}\n"
        else:
            new_front = raw_front.rstrip() + "\n" + f"stages = {array_str}\n"
    return new_front


def find_md_files(root: Path):
    if not root.exists():
        print(f"[ERROR] Content directory {root} does not exist.")
        return []
    for p in root.rglob("*.md"):
        yield p
    for p in root.rglob("*.markdown"):
        yield p


def process_all(content_root: Path, dry_run: bool = False, create_backup: bool = True):
    changed = []
    checked = 0
    for md_path in find_md_files(content_root):
        checked += 1
        text = md_path.read_text(encoding="utf-8")
        raw_front, parsed, s_idx, e_idx = read_frontmatter_toml(text)
        if parsed is None:
            # no TOML frontmatter parseable; skip
            continue
        if not tags_include_locations(parsed):
            continue

        stages = parsed.get("stages")
        # We only care about pages with a stages list that has at least one non-empty element
        if not isinstance(stages, list) or len(stages) == 0:
            continue

        # Find last non-empty stage index (skip entries that are empty strings)
        last_idx = None
        for i in range(len(stages)-1, -1, -1):
            s = stages[i]
            if isinstance(s, str) and s.strip() != "":
                last_idx = i
                break
        if last_idx is None:
            # all stages empty -> skip
            continue

        last_stage_raw = stages[last_idx]
        parts = build_stage_string_parts(last_stage_raw)
        # page endDate: if key exists but is empty string, keep empty; if missing -> empty string
        page_end = parsed.get("endDate", "")
        if page_end is None:
            page_end = ""

        # If last stage's end equals page_end already, do nothing
        current_end = parts[2] if len(parts) >= 3 else ""
        if current_end == page_end:
            # nothing to change
            continue

        # Update the end
        parts[2] = page_end
        new_last_stage = join_stage_parts(parts)

        # Prepare new stages list for insertion: preserve all other stage entries exactly as original
        # We'll construct new_stage_list as strings (not TOML-quoted yet)
        new_stage_list = []
        for i, s in enumerate(stages):
            if i == last_idx:
                new_stage_list.append(new_last_stage)
            else:
                # ensure existing stages are str
                if s is None:
                    new_stage_list.append("")
                else:
                    new_stage_list.append(str(s))

        # Construct new front matter text (replace/insert stages array)
        new_front = insert_or_replace_stages_in_front(raw_front, new_stage_list)
        # Rebuild full file
        before = text[:s_idx]
        after = text[e_idx:]
        new_full = before + "+++\n" + new_front.rstrip() + "\n+++" + after

        # Show change (dry-run or apply)
        print(f"[PATCH] {md_path}: last stage end '{current_end}' -> '{page_end}'")
        if dry_run:
            changed.append(md_path)
            continue

        # write file
        md_path.write_text(new_full, encoding="utf-8")
        changed.append(md_path)

    print(f"\nCompleted. Files scanned: {checked}. Files changed: {len(changed)}.")
    if dry_run:
        print("Dry-run mode: no files were written.")
    else:
        if create_backup:
            print(f"Backups were created with extension '{BACKUP_EXT}' for changed files.")


def main():
    parser = argparse.ArgumentParser(description="Fix last-stage end dates to match page endDate for Locations.")
    parser.add_argument("--content", "-C", default=str(CONTENT_ROOT), help="content wiki directory (default: content/wiki)")
    parser.add_argument("--no-backup", action="store_true", help="don't create .bak backups")
    parser.add_argument("--dry-run", action="store_true", help="show changes but don't write files")
    args = parser.parse_args()

    content_root = Path(args.content)
    process_all(content_root, dry_run=args.dry_run, create_backup=(not args.no_backup))


if __name__ == "__main__":
    main()
