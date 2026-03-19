#!/usr/bin/env python3
import json
from pathlib import Path

CONTENT_DIR = "content"

def load_meta(folder):
    mp = folder / 'meta.json'
    if not mp.exists(): return None, mp
    try: return json.loads(mp.read_text(encoding='utf-8')), mp
    except Exception: return None, mp

def save_meta(mp, meta):
    mp.write_text(json.dumps(meta, indent=2, ensure_ascii=False), encoding='utf-8')

def main():
    folders = [f for f in Path(CONTENT_DIR).iterdir() if f.is_dir()]

    # Build title -> folder map for transcription lookup
    title_map = {}
    for folder in folders:
        meta, _ = load_meta(folder)
        if meta and meta.get('title'):
            title_map[meta['title']] = folder

    fixed_transcriptions = fixed_page = 0

    for folder in folders:
        meta, mp = load_meta(folder)
        if meta is None: continue
        changed = False

        # Fix 'transcriptions' param — add this article's title to each named transcription's tags
        trans = meta.pop('transcriptions', None)
        if trans:
            article_title = meta.get('title', '')
            for name in (trans if isinstance(trans, list) else [trans]):
                name = str(name).strip()
                target_folder = title_map.get(name)
                if not target_folder:
                    print(f"  WARNING: transcription target '{name}' not found")
                    continue
                t_meta, t_mp = load_meta(target_folder)
                if t_meta is None: continue
                tags = t_meta.setdefault('tags', [])
                if article_title and article_title not in tags:
                    tags.append(article_title)
                    save_meta(t_mp, t_meta)
                    print(f"  Tagged '{name}' with '{article_title}'")
            changed = True
            fixed_transcriptions += 1

        # Fix 'page' param — move into tags[]
        page = meta.pop('page', None)
        if page:
            page = str(page).strip()
            tags = meta.setdefault('tags', [])
            if page and page not in tags:
                tags.append(page)
            changed = True
            fixed_page += 1

        if changed:
            save_meta(mp, meta)

    print(f"\nDone. transcriptions fixed: {fixed_transcriptions}, page fixed: {fixed_page}")

def run(): main()
if __name__ == '__main__': main()