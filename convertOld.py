#!/usr/bin/env python3
"""
matchPhotos.py
Scans old/photos/ for .avif files, looks up each filename stem in
ArticleLinker.json to find the matching content folder, then copies
the .avif in as photo.avif (and lowphoto.avif from old/lowphotos/ if present).

Also looks up old/lowphotos/ for matching low-res versions.

Run from repo root:
    python3 matchPhotos.py
"""
import json, shutil, sys
from pathlib import Path

PHOTOS_DIR    = Path("old/photos")
LOWPHOTOS_DIR = Path("old/lowphotos")
CONTENT_DIR   = Path("content")
LINKER_FILE   = Path("viewers/cep-js/compiled-json/ArticleLinker.json")

def main():
    if not PHOTOS_DIR.exists():
        print(f"ERROR: {PHOTOS_DIR} not found"); sys.exit(1)
    # Build title->folder_id map by scanning every meta.json in content/
    print("Scanning content/ meta.json files...")
    title_to_id = {}
    for meta_path in CONTENT_DIR.rglob('meta.json'):
        try:
            meta = json.loads(meta_path.read_text(encoding='utf-8'))
            title = meta.get('title', '').strip()
            if title:
                folder_id = meta_path.parent.name
                title_to_id[title] = folder_id
                title_to_id[title.lower()] = folder_id
        except Exception:
            pass
    print(f"Loaded {len(title_to_id)//2} articles from content/")

    avifs = list(PHOTOS_DIR.glob('*.avif'))
    print(f"Found {len(avifs)} .avif files in {PHOTOS_DIR}")

    matched = 0
    unmatched = []

    for avif in sorted(avifs):
        # The filename stem is the article title (with spaces as underscores or encoded)
        # Try a few normalizations
        stem = avif.stem

        # Try full filename, stem, and space variants — exact then lowercase
        candidates = [
            avif.name,                            # "c1o28lxop9u.avif"
            stem,                                 # "c1o28lxop9u"
            stem.replace('_', ' '),
            stem.replace('-', ' '),
            stem.replace('_', ' ').replace('-', ' '),
        ]

        article_id = None
        for c in candidates:
            article_id = title_to_id.get(c) or title_to_id.get(c.lower())
            if article_id:
                break

        if not article_id:
            unmatched.append(avif.name)
            continue

        folder = CONTENT_DIR / article_id
        if not folder.exists():
            unmatched.append(f"{avif.name} (folder {article_id} missing)")
            continue

        # Copy photo.avif
        dest = folder / 'photo.avif'
        shutil.copy2(avif, dest)

        # Look for matching lowphoto
        low_src = None
        if LOWPHOTOS_DIR.exists():
            for low_candidate in [
                LOWPHOTOS_DIR / avif.name,
                LOWPHOTOS_DIR / (stem + '.avif'),
            ]:
                if low_candidate.exists():
                    low_src = low_candidate
                    break

        if low_src:
            shutil.copy2(low_src, folder / 'lowphoto.avif')
            low_note = ' + lowphoto'
        else:
            low_note = ''

        title = article_id
        print(f"  ✓ {avif.name} -> {article_id} ({title}){low_note}")
        matched += 1

    print(f"\nDone: {matched} matched, {len(unmatched)} unmatched")
    if unmatched:
        print("Unmatched:")
        for u in unmatched:
            print(f"  ✗ {u}")

if __name__ == '__main__':
    main()
