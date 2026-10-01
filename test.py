#!/usr/bin/env python3
"""
For every article with type "videos":
  - meta.title  <- sanitized contents of content.md
  - meta.pageThumbnailVideo <- the original title

Usage:
  python3 convert_video_titles.py --dry-run   # preview only
  python3 convert_video_titles.py             # apply
  python3 convert_video_titles.py path/to/content
"""
import json, re, sys
from pathlib import Path

args = [a for a in sys.argv[1:] if not a.startswith("--")]
DRY = "--dry-run" in sys.argv
CONTENT_DIR = Path(args[0] if args else "content")


def sanitize(text):
    text = text.replace("\\", "")                            # no backslashes
    text = text.replace('"', "''")                           # double quote -> two single quotes
    text = text.replace("\u201c", "''").replace("\u201d", "''")  # curly double quotes
    text = text.replace("\u201e", "''").replace("\u201f", "''")  # low/reversed curly quotes
    text = text.replace("\u00ab", "''").replace("\u00bb", "''")  # « » guillemets
    text = re.sub(r"[\x00-\x1f\x7f]+", " ", text)            # newlines, tabs, control chars -> space
    text = text.replace("\u2028", " ").replace("\u2029", " ")
    text = re.sub(r"\s+", " ", text).strip()                 # collapse whitespace
    return text


changed = skipped = 0

for folder in sorted(CONTENT_DIR.iterdir()):
    meta_path = folder / "meta.json"
    md_path = folder / "content.md"
    if not folder.is_dir() or not meta_path.exists():
        continue

    try:
        raw = meta_path.read_text(encoding="utf-8")
        meta = json.loads(raw)
    except Exception as e:
        print(f"[error] {meta_path}: {e}", file=sys.stderr)
        continue

    if (meta.get("type") or "").strip().lower() != "videos":
        continue

    if "pageThumbnailVideo" in meta:
        print(f"[skip]  {folder.name}: already converted")
        skipped += 1
        continue

    if not md_path.exists():
        print(f"[skip]  {folder.name}: no content.md")
        skipped += 1
        continue

    new_title = sanitize(md_path.read_text(encoding="utf-8"))
    if not new_title:
        print(f"[skip]  {folder.name}: content.md is empty")
        skipped += 1
        continue

    old_title = meta.get("title", "")
    meta["pageThumbnailVideo"] = old_title
    meta["title"] = new_title

    print(f"[ok]    {folder.name}: {old_title!r} -> {new_title[:60]!r}")

    if not DRY:
        # keep the file's existing style (pretty-printed vs compact)
        indent = 2 if "\n" in raw.strip() else None
        seps = None if indent else (",", ":")
        meta_path.write_text(
            json.dumps(meta, ensure_ascii=False, indent=indent, separators=seps),
            encoding="utf-8",
        )
    changed += 1

print(f"\n{'Would change' if DRY else 'Changed'} {changed}, skipped {skipped}.")
if DRY:
    print("Dry run only. Nothing was written.")
elif changed:
    print("Now run compile.py to rebuild the title/ID maps.")
