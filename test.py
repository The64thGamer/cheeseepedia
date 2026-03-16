#!/usr/bin/env python3
import os, re, json, shutil, random, string, sys
from pathlib import Path

try:
    import tomllib as toml
except ImportError:
    try:
        import tomli as toml
    except ImportError:
        print("ERROR: needs tomllib (py3.11+) or tomli: pip install tomli --break-system-packages")
        sys.exit(1)

BASE        = Path(__file__).parent
CONTENT_DIR = BASE / "content"
OUT_DIR     = BASE / "static" / "cep-js" / "content"
PHOTOS_DIR  = BASE / "static" / "photos"
LOWPHOTOS_DIR = BASE / "static" / "lowphotos"
SKIP_DIRS   = {"theoryweb"}
STRIP_KEYS  = {"draft"}

def rand_id(used):
    chars = string.ascii_lowercase + string.digits
    while True:
        s = ''.join(random.choices(chars, k=16))
        if s not in used:
            used.add(s)
            return s

def parse_md(path):
    try:
        raw = Path(path).read_bytes()
        txt = raw.decode("utf-8-sig")
    except Exception:
        txt = raw.decode("latin-1", errors="ignore")
    txt = txt.replace("\r\n", "\n").replace("\r", "\n").lstrip()
    if not txt.startswith("+++"):
        return None, txt
    parts = re.split(r"(?m)^\+{3}\s*$", txt)
    if len(parts) < 3:
        return None, txt
    try:
        fm = toml.loads(parts[1].strip())
    except Exception as e:
        print(f"  TOML error in {path}: {e}", file=sys.stderr)
        return None, txt
    body = "+++".join(parts[2:]).lstrip("\n")
    return fm, body

def find_photo(filename, photo_dir):
    if not filename:
        return None
    direct = photo_dir / filename
    if direct.exists():
        return direct
    for p in photo_dir.rglob(filename):
        return p
    return None

def convert():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    used = set(p.name for p in OUT_DIR.iterdir() if p.is_dir())

    # Collect all source dirs (non-recursive top-level folders under content/)
    source_dirs = [
        d for d in CONTENT_DIR.iterdir()
        if d.is_dir() and d.name not in SKIP_DIRS
    ]

    # Collect all .md files across all source dirs
    md_files = []
    for src_dir in source_dirs:
        for p in src_dir.rglob("*.md"):
            if p.name.startswith("_"):
                continue
            md_files.append(p)

    print(f"Found {len(md_files)} .md files across {len(source_dirs)} folders")
    print(f"Output: {OUT_DIR}\n")

    converted = skipped = photos_moved = photos_missing = 0

    for md_path in sorted(md_files):
        fm, body = parse_md(md_path)
        if fm is None:
            print(f"SKIP (no frontmatter): {md_path.relative_to(BASE)}")
            skipped += 1
            continue

        is_photo = str(fm.get("type", "")).lower() == "photos"
        title = fm.get("title", "")

        # Strip unwanted keys
        for k in STRIP_KEYS:
            fm.pop(k, None)

        folder_id = rand_id(used)
        out_folder = OUT_DIR / folder_id
        out_folder.mkdir()

        # Write meta.json
        (out_folder / "meta.json").write_text(
            json.dumps(fm, indent=2, ensure_ascii=False), encoding="utf-8"
        )

        # Write content.md
        (out_folder / "content.md").write_text(body, encoding="utf-8")

        # Move photo files if this is a photo article
        if is_photo and title:
            src_photo = find_photo(title, PHOTOS_DIR)
            if src_photo:
                shutil.move(str(src_photo), str(out_folder / "photo.avif"))
                photos_moved += 1
            else:
                print(f"  WARNING: photo not found: {title}")
                photos_missing += 1

            src_low = find_photo(title, LOWPHOTOS_DIR)
            if src_low:
                shutil.move(str(src_low), str(out_folder / "lowphoto.avif"))

        # Move the source .md file out of the way (delete after successful conversion)
        md_path.unlink()
        converted += 1

        if converted % 500 == 0:
            print(f"  {converted} converted...")

    print(f"\nDone.")
    print(f"  Converted : {converted}")
    print(f"  Skipped   : {skipped}")
    print(f"  Photos moved  : {photos_moved}")
    print(f"  Photos missing: {photos_missing}")

if __name__ == "__main__":
    convert()