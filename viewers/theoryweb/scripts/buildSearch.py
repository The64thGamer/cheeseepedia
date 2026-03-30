
import os, re, json
from pathlib import Path
from collections import defaultdict

# ── Config ────────────────────────────────────────────────────────────────────
CONTENT_DIR  = "content"
OUT_DIR      = os.path.join(os.path.dirname(__file__), "..", "compiled-json/search")
EXCERPT_LEN  = 150
MIN_TRI_FREQ = 2

FNAF_TAG     = "Five Nights at Freddy's"   # gate: article must carry this tag
THEORY_TYPE  = "theory"                    # lowercase — type to detect

# ── Regex ─────────────────────────────────────────────────────────────────────
WIKI_LINK_RE = re.compile(r'\{\{<?\s*wiki-link\s+["\']?([^"\'}\s]+)["\']?[^>]*>?\s*\}\}', re.IGNORECASE)
CITE_RE      = re.compile(r'\{\{<?\s*cite\s+[^>]*>?\s*\}\}', re.IGNORECASE)
MD_RE        = re.compile(r'[*_`#>\[\]!]')
_nonword     = re.compile(r'[^\w\s]', re.UNICODE)
_multispace  = re.compile(r'\s+')

DICT_TAG_FIELDS   = ('remodels', 'stages', 'animatronics', 'franchisees', 'attractions', 'credits')
STRING_TAG_FIELDS = ('tags', 'pages', 'page')

# ── Helpers ───────────────────────────────────────────────────────────────────
def normalize(s):
    return _multispace.sub(' ', _nonword.sub(' ', s.lower())).strip()

def clean_body(s):
    s = CITE_RE.sub('', s)
    s = WIKI_LINK_RE.sub(lambda m: m.group(1), s)
    s = MD_RE.sub(' ', s)
    return _multispace.sub(' ', s).strip()

def excerpt(s):
    s = clean_body(s)[: EXCERPT_LEN * 2].strip()
    return (s[:EXCERPT_LEN].rsplit(' ', 1)[0] + '…') if len(s) > EXCERPT_LEN else s

def trigrams(s):
    s = normalize(s)
    padded = f'  {s}  '
    return {padded[i:i+3] for i in range(len(padded) - 2) if padded[i:i+3].strip()}

def extract_name(val):
    if isinstance(val, dict):
        return str(val.get('n', '')).strip()
    return str(val).split('|', 1)[0].strip()

def mod_time(folder):
    times = [f.stat().st_mtime for f in (folder / 'meta.json', folder / 'content.md') if f.exists()]
    return max(times) if times else 0

def read_article(folder):
    mp = folder / 'meta.json'
    if not mp.exists():
        return None, None, 0
    try:
        fm = json.loads(mp.read_text(encoding='utf-8'))
    except Exception:
        return None, None, 0
    body = (folder / 'content.md').read_text(encoding='utf-8') if (folder / 'content.md').exists() else ''
    return fm, body, mod_time(folder)

def extract_bracket_links(body):
    """Return all [text] bracket values from content.md that look like article slugs."""
    tags = []
    for m in re.finditer(r'\[([^\]]+)\]', body):
        val = m.group(1).strip()
        if val and not val.isdigit():
            tags.append(val)
    return tags

def extract_tags(fm):
    """Collect canonical display tags from a frontmatter dict."""
    tags, seen = [], set()

    def push(v):
        v = str(v).strip()
        if v and v.lower() not in seen:
            seen.add(v.lower())
            tags.append(v)

    for field in DICT_TAG_FIELDS:
        for item in (fm.get(field) or []):
            push(extract_name(item))
    for field in STRING_TAG_FIELDS:
        val = fm.get(field)
        if not val:
            continue
        for item in (val if isinstance(val, list) else [val]):
            push(str(item).split('|', 1)[0].strip())
    push(fm.get('type', ''))
    for c in (fm.get('credits') or []):
        push(str(c).split('|', 1)[0].strip())
    push(fm.get('title', ''))
    date = fm.get('startDate', '')
    year = date.split('-')[0] if date and date != '0000-00-00' else ''
    push(year if (year and year != '0000') else 'Unknown Year')
    return tags

def has_fnaf_tag(fm):
    """Return True if the article carries the FNaF gate tag."""
    for field in STRING_TAG_FIELDS:
        val = fm.get(field)
        if not val:
            continue
        items = val if isinstance(val, list) else [val]
        for item in items:
            if str(item).split('|', 1)[0].strip() == FNAF_TAG:
                return True
    return False

def has_theory_tag(fm):
    """Return True if 'Theory' appears explicitly as a tag (not just as the type field)."""
    for field in STRING_TAG_FIELDS:
        val = fm.get(field)
        if not val:
            continue
        items = val if isinstance(val, list) else [val]
        for item in items:
            if str(item).split('|', 1)[0].strip().lower() == 'theory':
                return True
    return False

def is_excluded_theory(fm):
    """
    Return True if the article should be excluded.
    Excluded = type is "Theory" AND "Theory" is NOT also an explicit tag.
    """
    tp = (fm.get('type', '') or '').lower()
    if tp == THEORY_TYPE and not has_theory_tag(fm):
        return True
    return False

# ── Main build ────────────────────────────────────────────────────────────────
def build():
    folders = [f for f in Path(CONTENT_DIR).iterdir() if f.is_dir()]
    print(f'Found {len(folders)} total articles')

    # ── Pass 0: build photo-thumbnail map (same logic as original) ────────────
    photo_map = {}
    for folder in folders:
        fm, _, _ = read_article(folder)
        if fm and (fm.get('type', '') or '').lower() == 'photos':
            t = fm.get('title', '')
            if t:
                photo_map[t] = folder.name

    # ── Pass 1: index non-Theory FNaF articles ────────────────────────────────
    # slug → set of tag strings (for theory enrichment in pass 2)
    slug_to_tags: dict[str, set] = {}

    docs         = []
    tag_idx      = defaultdict(list)   # tag string → [doc_ids]
    tri_idx      = defaultdict(list)   # trigram   → [doc_ids]

    # Collect theory articles for deferred processing
    theory_queue = []   # list of (folder, fm, body, mt)

    doc_id = 0

    for folder in sorted(folders):
        fm, body, mt = read_article(folder)
        if fm is None:
            continue

        # Gate: must carry the FNaF tag
        if not has_fnaf_tag(fm):
            continue

        tp = (fm.get('type', '') or '').lower()

        # Defer Theory articles to pass 2
        if tp == THEORY_TYPE:
            theory_queue.append((folder, fm, body, mt))
            continue

        # Exclude anything else that meets exclusion criteria
        if is_excluded_theory(fm):
            continue

        title    = fm.get('title', folder.name)
        contribs = fm.get('contributors', [])
        doc = {
            't':  title,
            'p':  folder.name,
            'e':  excerpt(body),
            'tp': fm.get('type', ''),
            'd':  fm.get('startDate', ''),
            'de': fm.get('endDate', ''),
            'c':  contribs if isinstance(contribs, list) else [contribs],
            'mt': int(mt),
        }
        if tp != 'photos':
            thumb = fm.get('pageThumbnailFile', '')
            if thumb and thumb in photo_map:
                doc['img'] = photo_map[thumb]

        docs.append(doc)

        article_tags = extract_tags(fm)
        bracket_tags = extract_bracket_links(body)
        all_tags     = list(dict.fromkeys(article_tags + bracket_tags))  # dedupe, preserve order

        slug_to_tags[folder.name] = set(all_tags)

        for tag in all_tags:
            tag_idx[tag].append(doc_id)

        fuzzy_text = ' '.join([
            title, fm.get('type', ''), fm.get('startDate', ''),
            ' '.join(str(v) for v in (fm.get('tags') or [])),
            ' '.join(str(v) for v in (fm.get('contributors') or [])),
            clean_body(body),
        ])
        for tri in trigrams(fuzzy_text):
            tri_idx[tri].append(doc_id)

        doc_id += 1

    print(f'Pass 1: indexed {doc_id} non-Theory FNaF articles, deferred {len(theory_queue)} Theory articles')

    # ── Pass 2: index Theory articles with enriched tags ─────────────────────
    for folder, fm, body, mt in sorted(theory_queue, key=lambda x: x[0].name):
        title    = fm.get('title', folder.name)
        contribs = fm.get('contributors', [])
        doc = {
            't':  title,
            'p':  folder.name,
            'e':  excerpt(body),
            'tp': fm.get('type', ''),
            'd':  fm.get('startDate', ''),
            'de': fm.get('endDate', ''),
            'c':  contribs if isinstance(contribs, list) else [contribs],
            'mt': int(mt),
        }
        thumb = fm.get('pageThumbnailFile', '')
        if thumb and thumb in photo_map:
            doc['img'] = photo_map[thumb]

        # Base tags for this theory article
        article_tags = extract_tags(fm)
        bracket_refs = extract_bracket_links(body)

        # Enrich: for each [linked-slug] found in content.md, fold in all
        # tags that were collected for that article in pass 1.
        enriched_tags: list[str] = list(article_tags)
        seen_lower = {t.lower() for t in enriched_tags}

        for ref in bracket_refs:
            # bracket refs may be slugs (folder names) or display titles;
            # try slug match first, then normalised title match
            ref_tags = slug_to_tags.get(ref, set())
            if not ref_tags:
                # fallback: scan slug_to_tags by normalising
                ref_norm = normalize(ref)
                for slug, stags in slug_to_tags.items():
                    if normalize(slug) == ref_norm:
                        ref_tags = stags
                        break
            for t in ref_tags:
                if t.lower() not in seen_lower:
                    seen_lower.add(t.lower())
                    enriched_tags.append(t)

        # Also add plain bracket refs themselves as tags (original behaviour)
        for ref in bracket_refs:
            if ref.lower() not in seen_lower:
                seen_lower.add(ref.lower())
                enriched_tags.append(ref)

        slug_to_tags[folder.name] = set(enriched_tags)

        docs.append(doc)
        for tag in enriched_tags:
            tag_idx[tag].append(doc_id)

        fuzzy_text = ' '.join([
            title, fm.get('type', ''), fm.get('startDate', ''),
            ' '.join(str(v) for v in (fm.get('tags') or [])),
            ' '.join(str(v) for v in (fm.get('contributors') or [])),
            clean_body(body),
            ' '.join(enriched_tags),
        ])
        for tri in trigrams(fuzzy_text):
            tri_idx[tri].append(doc_id)

        doc_id += 1

    print(f'Pass 2 complete. Total docs: {len(docs)}')

    # ── Trim trigrams & shard ─────────────────────────────────────────────────
    tri_idx  = {k: v for k, v in tri_idx.items() if len(v) >= MIN_TRI_FREQ}
    shards   = defaultdict(dict)
    for tri, ids in tri_idx.items():
        shards[tri[0] if tri[0].isalpha() else '_'][tri] = ids

    # ── Write output ──────────────────────────────────────────────────────────
    os.makedirs(OUT_DIR, exist_ok=True)

    def w(name, obj):
        path = os.path.join(OUT_DIR, name)
        with open(path, 'w', encoding='utf-8') as fh:
            fh.write(json.dumps(obj, ensure_ascii=False, separators=(',', ':')))

    w('docs.json', docs)
    w('tags.json', dict(tag_idx))
    for ch, data in shards.items():
        w(f'tri_{ch}.json', data)

    print(
        f'docs:{len(docs)}  tags:{len(tag_idx)}  '
        f'shards:{len(shards)}  trigrams:{len(tri_idx)}'
    )


def main():
    build()


if __name__ == '__main__':
    main()
