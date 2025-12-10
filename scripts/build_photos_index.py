#!/usr/bin/env python3
from __future__ import annotations
import os
import sys
import json
import re
import subprocess
from typing import Optional

import frontmatter

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

try:
    from PIL import Image
    PIL_AVAILABLE = True
except Exception:
    PIL_AVAILABLE = False

PHOTO_DIRS = ["content/photos"]
STATIC_PHOTOS_DIR = "static/photos"
LOWPHOTOS_DIR = "static/lowphotos"
OUT_PATH_BY_PAGE = "data/photosbypage.json"
OUT_PATH_BY_PHOTO = "data/photos.json"
OUT_PATH_LOCATIONS = "data/locations-index.json"
COMMON_EXTS = ["", ".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]

PARAM_NAMES = ["animatronics", "attractions", "stages", "remodels"]

LOW_SIZE = 64
LOW_QUALITY = 20
FORCE_WEBP = True


def find_static_file(basename: str) -> Optional[str]:
    candidates = [basename] if os.path.splitext(basename)[1] else [basename + e for e in COMMON_EXTS]
    for c in candidates:
        p = os.path.join(STATIC_PHOTOS_DIR, c)
        if os.path.exists(p):
            return c
    return None


def read_frontmatter(path: str):
    with open(path, "rb") as fh:
        raw = fh.read()
    try:
        txt = raw.decode("utf-8")
    except Exception:
        try:
            txt = raw.decode("latin-1")
        except Exception:
            return {}
    txt = txt.lstrip()
    if txt.startswith("+++"):
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


def collect_all_content_files():
    files = []
    for root, _, fnames in os.walk("content"):
        for fname in fnames:
            if fname.lower().endswith((".md", ".markdown", ".mdown")):
                files.append(os.path.join(root, fname))
    return files


def load_content_only(path: str) -> str:
    with open(path, encoding="utf-8-sig") as f:
        raw = f.read()
    split = re.split(r"(?m)^\+{3}\s*$", raw)
    if len(split) >= 3:
        body = split[2]
    else:
        try:
            post = frontmatter.load(path, encoding="utf-8-sig")
            body = post.content or ""
        except Exception:
            parts = re.split(r"(?m)^---\s*$", raw)
            body = parts[2] if len(parts) >= 3 else raw
    return body.strip()


def ensure_dir_for(path: str):
    d = os.path.dirname(path)
    if d and not os.path.exists(d):
        os.makedirs(d, exist_ok=True)


def shutil_which(name: str) -> Optional[str]:
    try:
        import shutil
        return shutil.which(name)
    except Exception:
        return None


def generate_lowphoto_from_source(src_path: str, dst_path: str, size: int = LOW_SIZE, quality: int = LOW_QUALITY) -> bool:
    ensure_dir_for(dst_path)
    try:
        if os.path.exists(dst_path) and os.path.getmtime(dst_path) >= os.path.getmtime(src_path):
            return True
    except Exception:
        pass

    if PIL_AVAILABLE:
        try:
            with Image.open(src_path) as im:
                if im.mode not in ("RGB", "RGBA"):
                    im = im.convert("RGB")
                w, h = im.size
                if w > size:
                    new_h = max(1, int(h * (size / float(w))))
                    im = im.resize((size, new_h), Image.LANCZOS)
                im.save(dst_path, format="WEBP", quality=quality, method=6)
            return True
        except Exception as e:
            print(f"WARNING: Pillow failed to generate lowphoto for {src_path}: {e}", file=sys.stderr)

    magick_cmd = None
    for cmd in ("magick", "convert"):
        if shutil_which(cmd):
            magick_cmd = cmd
            break
    if magick_cmd:
        try:
            subprocess.run([magick_cmd, src_path, "-strip", "-resize", f"{size}x", "-quality", str(quality), dst_path], check=True)
            return True
        except Exception as e:
            print(f"WARNING: ImageMagick failed for {src_path}: {e}", file=sys.stderr)

    if shutil_which("ffmpeg"):
        try:
            subprocess.run([
                "ffmpeg", "-y", "-i", src_path, "-vf", f"scale={size}:-1", "-vcodec", "libwebp",
                "-lossless", "0", "-q:v", str(max(10, min(60, quality))), dst_path
            ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            return True
        except Exception as e:
            print(f"WARNING: ffmpeg failed for {src_path}: {e}", file=sys.stderr)

    print(f"ERROR: Could not generate lowphoto for {src_path} (no encoder available)", file=sys.stderr)
    return False


def photo_source_candidates(title: str):
    if os.path.splitext(title)[1]:
        yield os.path.join(STATIC_PHOTOS_DIR, title)
    else:
        for ext in COMMON_EXTS:
            yield os.path.join(STATIC_PHOTOS_DIR, title + ext)


def build_photos_indices():
    files = collect_photo_files()
    print(f"DEBUG: scanned {len(files)} photo page files from dirs: {PHOTO_DIRS}", file=sys.stderr)

    by_page = {}
    by_photo = {}
    duplicates = 0

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

        if found_name:
            rel_src = found_name
            base_no_ext = re.sub(r'\.[^.]+$', '', rel_src)
            low_rel = f"{base_no_ext}.webp"
            low_path = os.path.join(LOWPHOTOS_DIR, low_rel)
            low_url = f"/lowphotos/{low_rel.replace(os.sep, '/')}"
            ensure_dir_for(low_path)
            src_path = None
            for candidate in photo_source_candidates(found_name):
                if os.path.exists(candidate):
                    src_path = candidate
                    break
            if src_path:
                ok = generate_lowphoto_from_source(src_path, low_path)
                if not ok:
                    low_url = ""
            else:
                low_url = ""
        else:
            low_url = ""

        item = {
            "name": title,
            "page_path": os.path.relpath(path).replace(os.sep, "/"),
            "hasFile": has_file,
            "lowURL": low_url,
            "startDate": start_date,
            "content": content,
            "pages": pages
        }

        for p in pages:
            key = str(p)
            by_page.setdefault(key, []).append(item)

        if title in by_photo:
            duplicates += 1
            print(f"WARNING: duplicate photo title '{title}' found at {path}; skipping duplicate", file=sys.stderr)
        else:
            by_photo[title] = item

    for k, arr in list(by_page.items()):
        arr.sort(key=lambda x: ((x.get('startDate') == "" or x.get('startDate') is None), x.get('startDate') or "9999-99-99"))
        by_page[k] = arr

    return by_page, by_photo, duplicates


def build_locations_index():
    files = collect_all_content_files()
    index = {}

    for path in files:
        abs_photos = os.path.abspath("content/photos")
        try:
            if os.path.commonpath([os.path.abspath(path), abs_photos]) == abs_photos:
                continue
        except Exception:
            pass

        try:
            fm = read_frontmatter(path)
        except Exception as e:
            print(f"ERROR reading frontmatter (locations) {path}: {e}", file=sys.stderr)
            continue

        if not fm:
            continue

        page_title = fm.get("title") or fm.get("Title") or ""
        relpath = os.path.relpath(path).replace(os.sep, "/")

        page_get = re.sub(r'\.(md|markdown|mdown)$', '', relpath)
        if page_get.startswith("content/"):
            page_get = page_get[len("content/"):]

        for param in PARAM_NAMES:
            entries_raw = fm.get(param) or fm.get(param.title()) or fm.get(param.upper()) or []
            if entries_raw is None:
                entries = []
            elif isinstance(entries_raw, str):
                entries = [entries_raw]
            elif isinstance(entries_raw, list):
                entries = entries_raw
            else:
                entries = [str(entries_raw)]

            for entry in entries:
                parts = [p.strip() for p in str(entry).split("|")]
                if not parts or parts[0] == "":
                    continue
                name = parts[0]
                start = parts[1] if len(parts) > 1 else ""
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

    for k, arr in list(index.items()):
        arr.sort(key=lambda x: x.get("sort") or "99999999")
        index[k] = arr

    return index


def write_json(path: str, obj):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(obj, fh, indent=2, ensure_ascii=False)


def build_index():
    by_page, by_photo, duplicates = build_photos_indices()
    loc_index = build_locations_index()

    write_json(OUT_PATH_BY_PAGE, by_page)
    write_json(OUT_PATH_BY_PHOTO, by_photo)
    write_json(OUT_PATH_LOCATIONS, loc_index)

    print(f"Wrote {OUT_PATH_BY_PAGE} ({len(by_page)} page keys), {OUT_PATH_BY_PHOTO} ({len(by_photo)} photos), {OUT_PATH_LOCATIONS} ({len(loc_index)} keys), duplicates={duplicates}", file=sys.stderr)
    return by_page, by_photo, loc_index


if __name__ == "__main__":
    build_index()
