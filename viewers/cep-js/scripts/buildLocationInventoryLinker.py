#!/usr/bin/env python3
import json, os
from pathlib import Path
from collections import defaultdict

CONTENT_DIR = "content"
OUT_DIR     = os.path.join(os.path.dirname(__file__), "..", "compiled-json")
OUT_FILE    = os.path.join(OUT_DIR, "inventoryIndex.json")

FIELDS = ('stages', 'remodels', 'animatronics', 'attractions')

def main():
    folders = [f for f in Path(CONTENT_DIR).iterdir() if f.is_dir()]
    print(f"Scanning {len(folders)} folders...")

    index = defaultdict(list)
    matched = 0

    for folder in folders:
        mp = folder / 'meta.json'
        if not mp.exists():
            continue
        try:
            meta = json.loads(mp.read_text(encoding='utf-8'))
        except Exception:
            continue

        # Only index Location pages
        if (meta.get('type') or '').lower() != 'locations':
            continue

        title = meta.get('title', folder.name)
        page_id = folder.name

        for field in FIELDS:
            items = meta.get(field) or []
            for item in items:
                if not isinstance(item, dict):
                    continue
                n = (item.get('n') or '').strip()
                if not n:
                    continue

                entry = {
                    'title':   title,
                    'p':       page_id,
                    'field':   field,
                }
                # Include all relevant date/detail fields if present
                for key in ('s', 'e', 'l', 'desc', 'st'):
                    val = item.get(key)
                    if val is not None and val != '':
                        entry[key] = val

                index[n].append(entry)
                matched += 1

    # Sort each entry list by start date, unknowns last
    for n in index:
        index[n].sort(key=lambda e: (
            not e.get('s') or e['s'] == '0000-00-00' or e['s'].startswith('0000'),
            e.get('s', '')
        ))

    os.makedirs(OUT_DIR, exist_ok=True)
    open(OUT_FILE, 'w', encoding='utf-8').write(
        json.dumps(dict(index), ensure_ascii=False, separators=(',', ':'))
    )
    print(f"inventoryIndex.json — {len(index)} keys, {matched} total entries")

def run(): main()
if __name__ == '__main__': main()