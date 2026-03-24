#!/usr/bin/env python3
import json, os, re, urllib.request
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

CONTENT_DIR = "content"
OUT_DIR     = os.path.join(os.path.dirname(__file__), "..", "compiled-json")
AVATAR_DIR  = os.path.join(OUT_DIR, "avatars")
OUT_JSON    = os.path.join(OUT_DIR, "contributors.json")
DISCOURSE   = "https://forum.cheeseepedia.org"
HEADERS     = {'User-Agent': 'Mozilla/5.0'}
safename    = lambda n: re.sub(r'[^\w\-.]', '_', n) + '.jpg'
req         = lambda u: urllib.request.Request(u, headers=HEADERS)
fetch       = lambda u: json.loads(urllib.request.urlopen(req(u), timeout=10).read())

def get_discourse():
    users, page = [], 0
    while True:
        data = fetch(f"{DISCOURSE}/directory_items.json?period=all&order=post_count&page={page}")
        items = data.get('directory_items', [])
        if not items: break
        for i in items:
            if i.get('user'): users.append(i['user'])
        if not data.get('meta', {}).get('load_more_directory_items'): break
        page += 1
    return users

def get_contribs():
    c = {}
    for folder in Path(CONTENT_DIR).iterdir():
        if not folder.is_dir(): continue
        mp = folder / 'meta.json'
        if not mp.exists(): continue
        try: meta = json.loads(mp.read_text(encoding='utf-8'))
        except Exception: continue
        for name in (meta.get('contributors') or []):
            if not name: continue
            name = name.strip()
            if name not in c: c[name] = {'count': 0, 'articles': []}
            c[name]['count'] += 1
            c[name]['articles'].append(folder.name)
    return c

def dl_avatar(u):
    t = u.get('avatar_template')
    if not t: return
    p = os.path.join(AVATAR_DIR, safename(u['username']))
    if os.path.exists(p): return
    try:
        with urllib.request.urlopen(req(DISCOURSE + t.replace('{size}','128')), timeout=10) as r:
            open(p,'wb').write(r.read())
    except Exception: pass

def main():
    os.makedirs(AVATAR_DIR, exist_ok=True)
    print("Fetching Discourse..."); users = get_discourse()
    print(f"  {len(users)} users")
    print("Scanning contributors..."); contribs = get_contribs()
    print(f"  {len(contribs)} contributors")

    print("Downloading avatars...")
    with ThreadPoolExecutor(max_workers=16) as ex:
        for f in as_completed([ex.submit(dl_avatar, u) for u in users]): f.result()

    lookup = {}
    for u in users:
        if u.get('username'): lookup[u['username'].lower()] = u
        if u.get('name'):     lookup[u['name'].lower()] = u

    out, matched = [], set()
    for name, d in sorted(contribs.items(), key=lambda x: -x[1]['count']):
        e = {'name': name, 'count': d['count'], 'articles': d['articles']}
        u = lookup.get(name.lower())
        if u:
            un = u.get('username','')
            matched.add(un.lower())
            e.update({'fu': un, 'fn': u.get('name',''),
                      'url': f"{DISCOURSE}/u/{un}",
                      'av': safename(un) if u.get('avatar_template') else None,
                      'pc': u.get('post_count', 0)})
        out.append(e)

    for u in users:
        if (u.get('username','').lower()) in matched: continue
        un = u.get('username','')
        out.append({'name': u.get('name') or un, 'count': 0, 'articles': [],
                    'fu': un, 'fn': u.get('name',''),
                    'url': f"{DISCOURSE}/u/{un}",
                    'av': safename(un) if u.get('avatar_template') else None,
                    'pc': u.get('post_count', 0)})

    out.sort(key=lambda x: -x['count'])
    open(OUT_JSON,'w',encoding='utf-8').write(json.dumps(out, ensure_ascii=False, separators=(',',':')))
    print(f"contributors.json — {len(out)} entries")

def run(): main()
if __name__ == '__main__': main()