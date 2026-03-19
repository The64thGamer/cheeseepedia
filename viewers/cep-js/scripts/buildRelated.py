#!/usr/bin/env python3
import json, os
from pathlib import Path
from collections import defaultdict

CONTENT_DIR = "content"
OUT_DIR     = os.path.join(os.path.dirname(__file__), "..", "compiled-json")
OUT_FILE    = os.path.join(OUT_DIR, "related.json")
LINKER_FILE = os.path.join(OUT_DIR, "ArticleLinker.json")

RELATED_TYPES = {'photos', 'videos', 'reviews', 'transcriptions'}

def main():
    if not os.path.exists(LINKER_FILE):
        print(f"ERROR: {LINKER_FILE} not found — run buildArticleLinker.py first")
        return

    linker = json.loads(open(LINKER_FILE, encoding='utf-8').read())
    # lowercase lookup for case-insensitive matching
    linker_lower = {k.lower(): v for k, v in linker.items()}

    related = defaultdict(lambda: {'photos':[], 'videos':[], 'reviews':[], 'transcriptions':[]})

    folders = [f for f in Path(CONTENT_DIR).iterdir() if f.is_dir()]
    print(f"Scanning {len(folders)} folders...")

    matched = 0
    for folder in folders:
        mp = folder / 'meta.json'
        if not mp.exists(): continue
        try: meta = json.loads(mp.read_text(encoding='utf-8'))
        except Exception: continue

        tp = (meta.get('type') or '').lower()
        if tp not in RELATED_TYPES: continue

        tags = meta.get('tags') or []
        for tag in tags:
            if not isinstance(tag, str): continue
            article_id = linker.get(tag) or linker_lower.get(tag.lower())
            if not article_id: continue

            entry = {'p': folder.name, 't': meta.get('title', folder.name)}
            if meta.get('startDate'): entry['d'] = meta['startDate']
            if tp == 'photos':
                entry['e'] = meta.get('excerpt', '')

            related[article_id][tp].append(entry)
            matched += 1

    # Strip empty buckets and articles with no related content
    out = {}
    for article_id, buckets in related.items():
        cleaned = {k: v for k, v in buckets.items() if v}
        if cleaned: out[article_id] = cleaned

    os.makedirs(OUT_DIR, exist_ok=True)
    open(OUT_FILE, 'w', encoding='utf-8').write(
        json.dumps(out, ensure_ascii=False, separators=(',', ':'))
    )
    print(f"related.json — {len(out)} articles with related content, {matched} total links")

def run(): main()
if __name__ == '__main__': main()
