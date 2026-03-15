#!/usr/bin/env python3
from __future__ import annotations
import os, re, json, unicodedata
from pathlib import Path
from collections import defaultdict

CONTENT_DIR = "content"
OUT_DIR = "compiled-json/search"
EXCERPT_LEN = 150
MIN_TRIGRAM_FREQ = 2

WIKI_LINK_RE = re.compile(r'\{\{<?\s*wiki-link\s+["\']?([^"\'}\s]+)["\']?[^>]*>?\s*\}\}', re.IGNORECASE)
CITE_RE = re.compile(r'\{\{<?\s*cite\s+[^>]*>?\s*\}\}', re.IGNORECASE)
MD_RE = re.compile(r'[*_`#>\[\]!]')
_nonalnum = re.compile(r'[^a-z0-9\-]+')
_multidash = re.compile(r'-{2,}')
_nonword = re.compile(r'[^\w\s]', re.UNICODE)
_multispace = re.compile(r'\s+')

TAG_FIELDS = ('tags', 'remodels', 'stages', 'animatronics', 'franchisees', 'attractions')

def slugify(s):
    s = unicodedata.normalize('NFKD', str(s))
    s = ''.join(c for c in s if not unicodedata.category(c).startswith('M'))
    s = s.lower()
    s = re.sub(r'\s+', '-', s)
    s = _nonalnum.sub('-', s)
    s = _multidash.sub('-', s)
    return s.strip('-')

def normalize(s):
    return _multispace.sub(' ', _nonword.sub(' ', s.lower())).strip()

def clean_body(s):
    s = CITE_RE.sub('', s)
    s = WIKI_LINK_RE.sub(lambda m: m.group(1), s)
    s = MD_RE.sub(' ', s)
    return _multispace.sub(' ', s).strip()

def excerpt(s):
    s = clean_body(s)[:EXCERPT_LEN * 2].strip()
    return (s[:EXCERPT_LEN].rsplit(' ', 1)[0] + '…') if len(s) > EXCERPT_LEN else s

def trigrams(s):
    s = normalize(s)
    padded = f'  {s}  '
    return {padded[i:i+3] for i in range(len(padded) - 2) if padded[i:i+3].strip()}

def read_article(folder):
    meta_path = folder / 'meta.json'
    body_path = folder / 'content.md'
    if not meta_path.exists():
        return None, None
    try:
        fm = json.loads(meta_path.read_text(encoding='utf-8'))
    except Exception:
        return None, None
    body = body_path.read_text(encoding='utf-8') if body_path.exists() else ''
    return fm, body

def extract_tags(fm):
    tags = []
    seen = set()

    def push(v):
        v = str(v).strip()
        if not v:
            return
        k = v.lower()
        if k not in seen:
            seen.add(k)
            tags.append(v)

    for field in TAG_FIELDS:
        val = fm.get(field)
        if not val:
            continue
        items = val if isinstance(val, list) else [val]
        for item in items:
            push(str(item).split('|', 1)[0].strip())

    tp = fm.get('type', '')
    if tp:
        push(tp)

    for c in (fm.get('credits') or []):
        push(str(c).split('|', 1)[0].strip())

    title = fm.get('title', '')
    if title:
        push(title)

    date = fm.get('startDate', '')
    year = date.split('-')[0] if date and date != '0000-00-00' else ''
    push(year if (year and year != '0000') else 'Unknown Year')

    return tags

def build():
    folders = [f for f in Path(CONTENT_DIR).iterdir() if f.is_dir()]
    print(f'Found {len(folders)} articles')

    # First pass: build title -> folder name map for photo-type articles
    photo_title_to_folder = {}
    for folder in folders:
        fm, _ = read_article(folder)
        if fm is None:
            continue
        if (fm.get('type', '') or '').lower() == 'photos':
            t = fm.get('title', '')
            if t:
                photo_title_to_folder[t] = folder.name

    docs = []
    tag_index = defaultdict(list)
    tri_index = defaultdict(list)

    for doc_id, folder in enumerate(sorted(folders)):
        fm, body = read_article(folder)
        if fm is None:
            continue

        title = fm.get('title', folder.name)
        tp = fm.get('type', '')
        date = fm.get('startDate', '')
        contribs = fm.get('contributors', [])
        clean = clean_body(body)
        end_date = fm.get('endDate', '')
        is_photo = tp.lower() == 'photos'

        doc = {
            't': title,
            'p': folder.name,
            'e': excerpt(body),
            'tp': tp,
            'd': date,
            'de': end_date,
            'c': contribs if isinstance(contribs, list) else [contribs],
        }

        # For non-photo articles, resolve pageThumbnailFile title -> folder name
        if not is_photo:
            thumb_title = fm.get('pageThumbnailFile', '')
            if thumb_title and thumb_title in photo_title_to_folder:
                doc['img'] = photo_title_to_folder[thumb_title]

        docs.append(doc)

        tags = extract_tags(fm)
        for tag in tags:
            tag_index[tag].append(doc_id)

        fuzzy_text = ' '.join([
            title, tp, date,
            ' '.join(str(v) for v in (fm.get('tags') or [])),
            ' '.join(str(v) for v in (fm.get('contributors') or [])),
            clean
        ])
        for tri in trigrams(fuzzy_text):
            tri_index[tri].append(doc_id)

    tri_index = {k: v for k, v in tri_index.items() if len(v) >= MIN_TRIGRAM_FREQ}

    shards = defaultdict(dict)
    for tri, ids in tri_index.items():
        ch = tri[0] if tri[0].isalpha() else '_'
        shards[ch][tri] = ids

    os.makedirs(OUT_DIR, exist_ok=True)

    with open(os.path.join(OUT_DIR, 'docs.json'), 'w', encoding='utf-8') as f:
        json.dump(docs, f, ensure_ascii=False, separators=(',', ':'))

    with open(os.path.join(OUT_DIR, 'tags.json'), 'w', encoding='utf-8') as f:
        json.dump(dict(tag_index), f, ensure_ascii=False, separators=(',', ':'))

    for ch, data in shards.items():
        with open(os.path.join(OUT_DIR, f'tri_{ch}.json'), 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, separators=(',', ':'))

    print(f'docs.json       — {len(docs)} docs')
    print(f'tags.json       — {len(tag_index)} tags')
    print(f'tri_*.json      — {len(shards)} shards, {len(tri_index)} trigrams')

def main():
    build()