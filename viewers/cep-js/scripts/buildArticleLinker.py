#!/usr/bin/env python3
import json, os
from pathlib import Path

CONTENT_DIR = "content"
OUT = os.path.join(os.path.dirname(__file__), "..", "compiled-json/ArticleLinker.json")

def main():
    index = {}
    for folder in Path(CONTENT_DIR).iterdir():
        if not folder.is_dir(): continue
        meta = folder / 'meta.json'
        if not meta.exists(): continue
        try:
            fm = json.loads(meta.read_text(encoding='utf-8'))
            t = fm.get('title', '').strip()
            if t: index[t] = folder.name
        except Exception: continue
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w', encoding='utf-8') as f:
        json.dump(index, f, ensure_ascii=False, separators=(',',':'))
    print(f'Wrote {len(index)} titles -> {OUT}')

if __name__ == '__main__':
    main()