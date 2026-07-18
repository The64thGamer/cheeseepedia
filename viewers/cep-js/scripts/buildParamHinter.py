#!/usr/bin/env python3
import json, os
from pathlib import Path

CONTENT_DIR = "content"
OUT = os.path.join(os.path.dirname(__file__), "..", "compiled-json", "Suggestions.json")

OBJECT_KEYS = ["remodels", "stages", "franchisees", "animatronics", "attractions", "credits"]
STRING_KEYS = ["showtapeFormats"]

def main():
    result = {k: set() for k in OBJECT_KEYS + STRING_KEYS}

    for folder in Path(CONTENT_DIR).iterdir():
        if not folder.is_dir(): continue
        mp = folder / 'meta.json'
        if not mp.exists(): continue
        try: meta = json.loads(mp.read_text(encoding='utf-8'))
        except Exception: continue

        for key in OBJECT_KEYS:
            for item in meta.get(key) or []:
                if isinstance(item, dict) and item.get('n'):
                    result[key].add(item['n'].strip())

        for key in STRING_KEYS:
            for item in meta.get(key) or []:
                if isinstance(item, str) and item.strip():
                    result[key].add(item.strip())

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    out = {k: sorted(v) for k, v in result.items()}
    open(OUT, 'w', encoding='utf-8').write(json.dumps(out, ensure_ascii=False, separators=(',', ':')))
    print({k: len(v) for k, v in out.items()})

def run(): main()
if __name__ == '__main__': main()