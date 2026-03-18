#!/usr/bin/env python3
import json
from pathlib import Path

CONTENT_DIR = "content"

def parse_credit(s):
    p = [x.strip() for x in s.split('|')]
    d = {"n": p[0]}
    if len(p) > 1 and p[1]: d["role"] = p[1]
    return d

def needs_conversion(val):
    return isinstance(val, list) and val and isinstance(val[0], str) and '|' in val[0]

def main():
    converted = skipped = 0
    for folder in Path(CONTENT_DIR).iterdir():
        if not folder.is_dir(): continue
        mp = folder / 'meta.json'
        if not mp.exists(): continue
        try:
            meta = json.loads(mp.read_text(encoding='utf-8'))
        except Exception as e:
            print(f"  ERROR reading {mp}: {e}")
            continue
        val = meta.get('credits')
        if val and needs_conversion(val):
            try:
                meta['credits'] = [parse_credit(v) for v in val]
                mp.write_text(json.dumps(meta, indent=2, ensure_ascii=False), encoding='utf-8')
                converted += 1
            except Exception as e:
                print(f"  ERROR parsing credits in {folder.name}: {e}")
        else:
            skipped += 1
    print(f"Done. {converted} files updated, {skipped} unchanged.")

if __name__ == '__main__':
    main()