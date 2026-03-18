#!/usr/bin/env python3
import os, re, json, unicodedata
from pathlib import Path
from collections import defaultdict

CONTENT_DIR = "content"
OUT_DIR     = os.path.join(os.path.dirname(__file__), "..", "compiled-json/search")
EXCERPT_LEN = 150
MIN_TRI_FREQ = 2

WIKI_LINK_RE = re.compile(r'\{\{<?\s*wiki-link\s+["\']?([^"\'}\s]+)["\']?[^>]*>?\s*\}\}', re.IGNORECASE)
CITE_RE      = re.compile(r'\{\{<?\s*cite\s+[^>]*>?\s*\}\}', re.IGNORECASE)
MD_RE        = re.compile(r'[*_`#>\[\]!]')
BRACKET_RE   = re.compile(r'\[([^\]]+)\]')
_nonword     = re.compile(r'[^\w\s]', re.UNICODE)
_multispace  = re.compile(r'\s+')

DICT_TAG_FIELDS   = ('remodels','stages','animatronics','franchisees','attractions')
STRING_TAG_FIELDS = ('tags','pages','page')

def normalize(s): return _multispace.sub(' ', _nonword.sub(' ', s.lower())).strip()

def clean_body(s):
    s = CITE_RE.sub('', s)
    s = WIKI_LINK_RE.sub(lambda m: m.group(1), s)
    s = MD_RE.sub(' ', s)
    return _multispace.sub(' ', s).strip()

def excerpt(s):
    s = clean_body(s)[:EXCERPT_LEN*2].strip()
    return (s[:EXCERPT_LEN].rsplit(' ',1)[0]+'…') if len(s)>EXCERPT_LEN else s

def trigrams(s):
    s = normalize(s); padded = f'  {s}  '
    return {padded[i:i+3] for i in range(len(padded)-2) if padded[i:i+3].strip()}

def extract_name(val):
    if isinstance(val, dict): return str(val.get('n','')).strip()
    return str(val).split('|',1)[0].strip()

def mod_time(folder):
    times = [f.stat().st_mtime for f in (folder/'meta.json', folder/'content.md') if f.exists()]
    return max(times) if times else 0

def read_article(folder):
    mp = folder/'meta.json'
    if not mp.exists(): return None, None, 0
    try: fm = json.loads(mp.read_text(encoding='utf-8'))
    except Exception: return None, None, 0
    body = (folder/'content.md').read_text(encoding='utf-8') if (folder/'content.md').exists() else ''
    return fm, body, mod_time(folder)

def extract_wiki_link_tags(body):
    tags = []
    for m in re.finditer(r'\[([^\]]+)\]', body):
        val = m.group(1).strip()
        if val and not val.isdigit(): tags.append(val)
    return tags

def extract_tags(fm):
    tags, seen = [], set()
    def push(v):
        v = str(v).strip()
        if v and v.lower() not in seen: seen.add(v.lower()); tags.append(v)
    for field in DICT_TAG_FIELDS:
        for item in (fm.get(field) or []): push(extract_name(item))
    for field in STRING_TAG_FIELDS:
        val = fm.get(field)
        if not val: continue
        for item in (val if isinstance(val,list) else [val]): push(str(item).split('|',1)[0].strip())
    push(fm.get('type',''))
    for c in (fm.get('credits') or []): push(str(c).split('|',1)[0].strip())
    push(fm.get('title',''))
    date = fm.get('startDate','')
    year = date.split('-')[0] if date and date!='0000-00-00' else ''
    push(year if (year and year!='0000') else 'Unknown Year')
    return tags

def build():
    folders = [f for f in Path(CONTENT_DIR).iterdir() if f.is_dir()]
    print(f'Found {len(folders)} articles')

    photo_map = {}
    for folder in folders:
        fm, _, _ = read_article(folder)
        if fm and (fm.get('type','') or '').lower()=='photos':
            t = fm.get('title','')
            if t: photo_map[t] = folder.name

    docs, tag_idx, tri_idx = [], defaultdict(list), defaultdict(list)

    for doc_id, folder in enumerate(sorted(folders)):
        fm, body, mt = read_article(folder)
        if fm is None: continue
        title = fm.get('title', folder.name)
        tp    = fm.get('type','')
        contribs = fm.get('contributors',[])
        doc = {'t':title,'p':folder.name,'e':excerpt(body),'tp':tp,
               'd':fm.get('startDate',''),'de':fm.get('endDate',''),
               'c':contribs if isinstance(contribs,list) else [contribs],
               'mt':int(mt)}
        if (tp or '').lower()!='photos':
            thumb = fm.get('pageThumbnailFile','')
            if thumb and thumb in photo_map: doc['img'] = photo_map[thumb]
        docs.append(doc)
        for tag in extract_tags(fm): tag_idx[tag].append(doc_id)
        for tag in extract_wiki_link_tags(body): tag_idx[tag].append(doc_id)
        fuzzy = ' '.join([title, tp, fm.get('startDate',''),
            ' '.join(str(v) for v in (fm.get('tags') or [])),
            ' '.join(str(v) for v in (fm.get('contributors') or [])),
            clean_body(body)])
        for tri in trigrams(fuzzy): tri_idx[tri].append(doc_id)

    tri_idx = {k:v for k,v in tri_idx.items() if len(v)>=MIN_TRI_FREQ}
    shards  = defaultdict(dict)
    for tri,ids in tri_idx.items(): shards[tri[0] if tri[0].isalpha() else '_'][tri] = ids

    os.makedirs(OUT_DIR, exist_ok=True)
    w = lambda n,o: open(os.path.join(OUT_DIR,n),'w',encoding='utf-8').write(json.dumps(o,ensure_ascii=False,separators=(',',':')))
    w('docs.json', docs)
    w('tags.json', dict(tag_idx))
    for ch,data in shards.items(): w(f'tri_{ch}.json', data)
    print(f'docs:{len(docs)} tags:{len(tag_idx)} shards:{len(shards)} trigrams:{len(tri_idx)}')

def main(): build()
if __name__ == '__main__': main()