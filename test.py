#!/usr/bin/env python3
"""
Deletes content.md from every article with type "videos".

Usage:
  python3 delete_video_content_md.py --dry-run   # preview only
  python3 delete_video_content_md.py             # delete
  python3 delete_video_content_md.py path/to/content
"""
import json, sys
from pathlib import Path

args = [a for a in sys.argv[1:] if not a.startswith("--")]
DRY = "--dry-run" in sys.argv
CONTENT_DIR = Path(args[0] if args else "content")

deleted = missing = 0

for folder in sorted(CONTENT_DIR.iterdir()):
    meta_path = folder / "meta.json"
    md_path = folder / "content.md"
    if not folder.is_dir() or not meta_path.exists():
        continue

    try:
        meta = json.loads(meta_path.read_text(encoding="utf-8"))
    except Exception as e:
        print(f"[error] {meta_path}: {e}", file=sys.stderr)
        continue

    if (meta.get("type") or "").strip().lower() != "videos":
        continue

    if not md_path.exists():
        missing += 1
        continue

    if "pageThumbnailVideo" not in meta:
        print(f"[warn]  {folder.name}: title not converted yet (no pageThumbnailVideo), skipping")
        continue

    if not DRY:
        md_path.unlink()
    print(f"[del]   {md_path}")
    deleted += 1

print(f"\n{'Would delete' if DRY else 'Deleted'} {deleted} file(s); {missing} video article(s) had no content.md.")
if DRY:
    print("Dry run only. Nothing was deleted.")
