#!/usr/bin/env python3
import json, os
from pathlib import Path

CONTENT_DIR = "content"
def parse_animatronic(s):
    p = [x.strip() for x in s.split('|')]
    d = {"n": p[0]}
    if len(p) > 1 and p[1]: d["s"] = p[1]
    if len(p) > 2 and p[2]: d["e"] = p[2]
    if len(p) > 3 and p[3]: d["l"] = p[3]
    if len(p) > 4 and p[4]: d["st"] = p[4]
    return d

def parse_attraction(s):
    p = [x.strip() for x in s.split('|')]
    d = {"n": p[0]}
    if len(p) > 1 and p[1]: d["s"] = p[1]
    if len(p) > 2 and p[2]: d["e"] = p[2]
    if len(p) > 3 and p[3]: d["desc"] = p[3]
    return d

def parse_download(s):
    p = [x.strip() for x in s.split('|')]
    d = {"url": p[0]}
    if len(p) > 1 and p[1]: d["label"] = p[1]
    return d

def parse_remodel(s):
    p = [x.strip() for x in s.split('|')]
    d = {"n": p[0]}
    if len(p) > 1 and p[1]: d["s"] = p[1]
    return d

def parse_stage(s):
    p = [x.strip() for x in s.split('|')]
    d = {"n": p[0]}
    if len(p) > 1 and p[1]: d["s"] = p[1]
    if len(p) > 2 and p[2]: d["e"] = p[2]
    if len(p) > 3 and p[3]: d["desc"] = p[3]
    return d

def parse_franchisee(s):
    p = [x.strip() for x in s.split('|')]
    d = {"n": p[0]}
    if len(p) > 1 and p[1]: d["s"] = p[1]
    if len(p) > 2 and p[2]: d["e"] = p[2]
    return d

PARSERS = {
    "animatronics": parse_animatronic,
    "attractions":  parse_attraction,
    "downloadLinks":parse_download,
    "remodels":     parse_remodel,
    "stages":       parse_stage,
    "franchisees":  parse_franchisee,
}

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

        changed = False
        for field, parser in PARSERS.items():
            val = meta.get(field)
            if not val or not needs_conversion(val): continue
            try:
                meta[field] = [parser(v) for v in val]
                changed = True
            except Exception as e:
                print(f"  ERROR parsing {field} in {folder.name}: {e}")

        if changed:
            mp.write_text(json.dumps(meta, indent=2, ensure_ascii=False), encoding='utf-8')
            converted += 1
        else:
            skipped += 1

    print(f"Done. {converted} files updated, {skipped} unchanged.")

def run():
    main()

if __name__ == '__main__':
    main()
