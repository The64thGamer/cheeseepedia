#!/usr/bin/env python3
import json, os
from pathlib import Path
from datetime import datetime, timezone

CONTENT_DIR = "content"
OUT = os.path.join(os.path.dirname(__file__), "..", "compiled-json", "ExtraStatistics.json")
EXCLUDE = {"reviews","photos","videos","transcriptions"}
now = lambda: datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
ts  = lambda t: datetime.fromtimestamp(t,tz=timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
mt  = lambda f: max((p.stat().st_mtime for p in (f/'meta.json',f/'content.md') if p.exists()), default=0)

def main():
    contribs, articles = set(), 0
    ra, rp, rv = [], [], []

    for folder in Path(CONTENT_DIR).iterdir():
        if not folder.is_dir(): continue
        mp = folder/'meta.json'
        if not mp.exists(): continue
        try: meta = json.loads(mp.read_text(encoding='utf-8'))
        except Exception: continue

        tp = (meta.get('type') or '').lower()
        for c in (meta.get('contributors') or []):
            if c and isinstance(c,str): contribs.add(c.strip())

        e = {'p':folder.name,'t':meta.get('title',''),'m':mt(folder)}
        cp = folder/'content.md'

        if   tp=='photos':                              rp.append(e)
        elif tp=='videos':                              rv.append(e)
        elif tp not in EXCLUDE:
            if cp.exists() and cp.stat().st_size > 0:  articles += 1
            ra.append(e)

    def top(lst):
        lst.sort(key=lambda x:-x['m'])
        return [{'p':e['p'],'t':e['t'],'m':ts(e['m'])} for e in lst[:30]]

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    out = {'contributors':len(contribs),'articles':articles,'generated':now(),
           'recent_articles':top(ra),'recent_photos':top(rp),'recent_videos':top(rv)}
    open(OUT,'w',encoding='utf-8').write(json.dumps(out,ensure_ascii=False,separators=(',',':')))
    print(f"contributors:{len(contribs)} articles:{articles} generated:{out['generated']}")

def run(): main()
if __name__ == '__main__': main()