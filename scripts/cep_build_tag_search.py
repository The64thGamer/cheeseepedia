#!/usr/bin/env python3
"""
build_tag_map.py (optimized variant)

OPTIMIZED VERSION:
- Minified JSON output (no indentation)
- Removed unused frontmatter storage where not needed
- Kept all functionality intact
"""
from __future__ import annotations
import os
import re
import sys
import json
import unicodedata
from pathlib import Path
from collections import defaultdict

# try tomllib (py3.11+) or tomli; yaml optional
try:
    import tomllib as toml_lib
except Exception:
    try:
        import tomli as toml_lib
    except Exception:
        toml_lib = None

try:
    import yaml
except Exception:
    yaml = None

# ---- Config ----
BASE_CONTENT_DIR = "content"
OUT_DIR = "static/data/tags"
OUT_DIR_COPY = "data/tags"
INFER_DEFAULT = "scripts/cep_tag_inference.json"

MEDIA_DIRS = (
    os.path.join("content", "photos"),
    os.path.join("content", "videos"),
    os.path.join("content", "transcriptions"),
    os.path.join("content", "reviews"),
)

# Regexes
WIKI_LINK_RE = re.compile(r"""
    \{\{\s*<?\s*
    wiki-link\s+
    (?:
      ["']([^"']+)["']
      |
      ([^\s\}]+)
    )
    [^>]*>?\s*\}\}
""", re.IGNORECASE | re.VERBOSE)

def is_in_media_dir(path_str: str) -> bool:
    p = Path(path_str).resolve()
    for md in MEDIA_DIRS:
        try:
            if str(p).startswith(str(Path(md).resolve())):
                return True
        except Exception:
            if md in str(path_str):
                return True
    return False

def read_frontmatter(path: str):
    b = Path(path).read_bytes()
    try:
        txt = b.decode("utf-8")
    except Exception:
        try:
            txt = b.decode("latin-1")
        except Exception:
            txt = b.decode("utf-8", errors="ignore")
    txt = txt.lstrip()
    if txt.startswith("+++"):
        parts = re.split(r"(?m)^\+{3}\s*$", txt)
        if len(parts) >= 3:
            fm_text = parts[1]
            body = parts[2]
            if toml_lib is not None:
                try:
                    fm = toml_lib.loads(fm_text)
                except Exception:
                    fm = {}
            else:
                fm = {}
            return fm, body
    elif txt.startswith("---"):
        parts = re.split(r"(?m)^---\s*$", txt)
        if len(parts) >= 3:
            fm_text = parts[1]
            body = parts[2]
            if yaml is not None:
                try:
                    fm = yaml.safe_load(fm_text) or {}
                except Exception:
                    fm = {}
            else:
                fm = {}
            return fm, body
    return {}, txt

RE_NON_URL = re.compile(r"[^\w\-]+", re.UNICODE)
RE_DASHES = re.compile(r"-{2,}")

def hugo_slugify(s: str) -> str:
    if not s:
        return ""
    s = s.strip().lower()
    s = s.replace(" ", "-")
    s = RE_NON_URL.sub("-", s)
    s = RE_DASHES.sub("-", s)
    return s.strip("-")

def sanitize_page_path(path: str) -> str:
    path = path.replace(os.sep, "/")
    path = re.sub(r"\.(md|markdown|mdown)$", "", path, flags=re.IGNORECASE)
    segments = path.split("/")
    sanitized = [hugo_slugify(seg) for seg in segments if seg]
    return "/".join(sanitized)

def normalize_tag_preserve_case(tag: str, canonical_map: dict):
    if tag is None:
        return None
    t = str(tag).strip()
    if t == "":
        return None
    key = t.lower()
    if key in canonical_map:
        return canonical_map[key]
    canonical_map[key] = t
    return t

def extract_tags_from_frontmatter(fm: dict, canonical_map: dict):
    tags = []

    def _push_raw_val(val):
        if val is None:
            return
        s = str(val).strip()
        if s == "":
            return
        n = normalize_tag_preserve_case(s, canonical_map)
        if n:
            tags.append(n)

    def _iter_values(raw):
        if raw is None:
            return []
        if isinstance(raw, (list, tuple)):
            return list(raw)
        if isinstance(raw, str):
            parts = re.split(r"[;,]", raw)
            return [p for p in (p.strip() for p in parts) if p]
        return [str(raw)]

    for key in ("tags", "Tags"):
        if key in fm and fm[key]:
            raw = fm[key]
            if isinstance(raw, (list, tuple)):
                for v in raw:
                    n = normalize_tag_preserve_case(str(v), canonical_map)
                    if n:
                        tags.append(n)
            elif isinstance(raw, str):
                parts = re.split(r"[;,]", raw)
                for p in parts:
                    p = p.strip()
                    if p:
                        n = normalize_tag_preserve_case(p, canonical_map)
                        if n:
                            tags.append(n)

    for key in ("categories", "Categories"):
        if key in fm and fm[key]:
            raw = fm[key]
            if isinstance(raw, (list, tuple)):
                for v in raw:
                    n = normalize_tag_preserve_case(str(v), canonical_map)
                    if n:
                        tags.append(n)
            elif isinstance(raw, str):
                parts = re.split(r"[;,]", raw)
                for p in parts:
                    p = p.strip()
                    if p:
                        n = normalize_tag_preserve_case(p, canonical_map)
                        if n:
                            tags.append(n)

    for key in ("pages", "Pages", "page", "Page"):
        if key in fm and fm[key]:
            raw = fm[key]
            if isinstance(raw, (list, tuple)):
                for v in raw:
                    n = normalize_tag_preserve_case(str(v), canonical_map)
                    if n:
                        tags.append(n)
            elif isinstance(raw, str):
                parts = re.split(r"[;,]", raw)
                for p in parts:
                    p = p.strip()
                    if p:
                        n = normalize_tag_preserve_case(p, canonical_map)
                        if n:
                            tags.append(n)

    special_params = [
        ("remodels", "Remodels"),
        ("stages", "Stages"),
        ("animatronics", "Animatronics"),
        ("franchisees", "Franchisees"),
        ("attractions", "Attractions"),
    ]
    for lower_key, alt_key in special_params:
        for key in (lower_key, alt_key):
            if key in fm and fm[key]:
                raw = fm[key]
                for val in _iter_values(raw):
                    if not val:
                        continue
                    first_piece = str(val).split("|", 1)[0].strip()
                    if first_piece:
                        _push_raw_val(first_piece)

    for key in ("credits", "Credits"):
        if key in fm and fm[key]:
            raw = fm[key]
            vals = _iter_values(raw)
            for v in vals:
                if not v:
                    continue
                s = str(v).strip()
                if "|" in s:
                    name = s.split("|", 1)[0].strip()
                    if name:
                        n = normalize_tag_preserve_case(name, canonical_map)
                        if n:
                            tags.append(n)

    return tags

def extract_wikilinks_from_body(body: str, canonical_map: dict):
    out = []
    if not body:
        return out
    for m in WIKI_LINK_RE.finditer(body):
        title = m.group(1) or m.group(2)
        if title:
            n = normalize_tag_preserve_case(title.strip(), canonical_map)
            if n:
                out.append(n)
    return out

def collect_content_files(base_dir=BASE_CONTENT_DIR):
    p = Path(base_dir)
    if not p.exists():
        print(f"[WARN] base content dir not found: {base_dir}", file=sys.stderr)
        return []
    out = []
    for ext in ("*.md", "*.markdown", "*.mdown"):
        for f in p.rglob(ext):
            out.append(str(f))
    return sorted(set(out))

def load_infer_map(path=INFER_DEFAULT):
    p = Path(path)
    if not p.exists():
        return {}
    try:
        j = json.loads(p.read_text(encoding="utf-8"))
        out = {}
        for k, v in j.items():
            if isinstance(v, (list, tuple)):
                out[str(k)] = [str(x) for x in v]
            elif isinstance(v, str):
                out[str(k)] = [v]
            else:
                out[str(k)] = [str(v)]
        return out
    except Exception as e:
        print(f"[WARN] failed to parse infer file {path}: {e}", file=sys.stderr)
        return {}

def compute_transitive_inference_map(infer_map_raw):
    adj = {}
    for a, arr in infer_map_raw.items():
        adj.setdefault(str(a), [])
        for b in arr or []:
            adj[str(a)].append(str(b))

    closure = {}
    for node in adj.keys():
        seen = set()
        stack = list(adj.get(node, []))
        result = set()
        while stack:
            cur = stack.pop()
            if cur == node:
                continue
            if cur in result:
                continue
            result.add(cur)
            if cur in adj:
                for nb in adj[cur]:
                    if nb not in result and nb not in stack:
                        stack.append(nb)
        closure[node] = sorted(result)
    return closure

def expand_tags_with_inference(tags_in: list, infer_closure: dict, canonical_map: dict):
    out_set = set()
    for t in tags_in:
        out_set.add(t)
    lower_to_key = {k.lower(): k for k in infer_closure.keys()}
    changed = True
    while changed:
        changed = False
        current = list(out_set)
        for tag in current:
            lk = tag.lower()
            if lk in lower_to_key:
                key = lower_to_key[lk]
                for implied in infer_closure.get(key, []):
                    implied_canon = canonical_map.get(implied.lower(), implied)
                    if implied_canon not in out_set:
                        out_set.add(implied_canon)
                        changed = True
    out = sorted(out_set, key=lambda s: s.lower())
    return out

_re_non_alnum = re.compile(r"[^a-z0-9\-]+", re.IGNORECASE)
_re_hyphens = re.compile(r"-{2,}")

def slugify_segment(s: str) -> str:
    if not s:
        return ""
    s = unicodedata.normalize("NFKD", str(s))
    s = "".join(ch for ch in s if not unicodedata.category(ch).startswith("M"))
    s = s.lower()
    s = re.sub(r"\s+", "-", s)
    s = _re_non_alnum.sub("-", s)
    s = _re_hyphens.sub("-", s)
    s = s.strip("-")
    return s

def normalize_page_path(path: str):
    if not path:
        return ""
    rel = os.path.relpath(path).replace(os.sep, "/")
    if rel.startswith(BASE_CONTENT_DIR + "/"):
        rel = rel[len(BASE_CONTENT_DIR)+1:]
    if rel.startswith("/"):
        rel = rel[1:]
    rel = re.sub(r"\.(md|markdown|mdown)$", "", rel, flags=re.IGNORECASE)
    parts = [p for p in rel.split("/") if p != ""]
    out_parts = []
    for seg in parts:
        if seg.startswith("_"):
            out_parts.append(seg)
        else:
            out_parts.append(slugify_segment(seg))
    return "/".join(out_parts)

_nonword_re = re.compile(r"[^\w\s]", flags=re.UNICODE)
_multispace_re = re.compile(r"\s+")

def normalize_text_for_match(s: str) -> str:
    if s is None:
        return ""
    s = str(s).strip().lower()
    s = _nonword_re.sub(" ", s)
    s = _multispace_re.sub(" ", s)
    return s.strip()

def find_key_by_title_or_normalized(title: str, title_to_key_map: dict, tags_by_page_keys_norm: dict):
    if not title:
        return None
    t = title.strip()
    if t in title_to_key_map:
        return title_to_key_map[t]
    tl = t.lower()
    for ktitle, key in title_to_key_map.items():
        if ktitle.lower() == tl:
            return key
    nt = normalize_text_for_match(t)
    if nt:
        for ktitle, key in title_to_key_map.items():
            if normalize_text_for_match(ktitle) == nt:
                return key
    candidate = t.replace("\\", "/").lstrip("/")
    candidate = re.sub(r"\.(md|markdown|mdown)$", "", candidate, flags=re.IGNORECASE)
    candidate = "/".join([slugify_segment(p) for p in candidate.split("/") if p])
    if candidate and candidate in tags_by_page_keys_norm:
        return candidate
    return None

def build_tag_map(base_dir=BASE_CONTENT_DIR, out_dir=OUT_DIR, infer_file=INFER_DEFAULT):
    files = collect_content_files(base_dir)

    normal_files = []
    media_files = []
    for f in files:
        if is_in_media_dir(f):
            media_files.append(f)
        else:
            normal_files.append(f)

    canonical_map = {}
    tags_by_page = {}
    pages_meta = {}

    MEDIA_TAGS_LOWER = {"photos", "videos", "transcriptions", "reviews"}

    # Phase 1: normal files
    for f in normal_files:
        try:
            fm, body = read_frontmatter(f)
        except Exception as e:
            print(f"[WARN] failed to read {f}: {e}", file=sys.stderr)
            fm, body = {}, ""

        title = fm.get("title") or fm.get("Title") or Path(f).stem
        raw_tags = extract_tags_from_frontmatter(fm, canonical_map)

        fm_tags_raw = []
        for key in ("tags", "Tags"):
            if key in fm and fm[key]:
                raw = fm[key]
                if isinstance(raw, (list, tuple)):
                    fm_tags_raw.extend([str(x).strip() for x in raw if x and str(x).strip()])
                elif isinstance(raw, str):
                    fm_tags_raw.extend([p.strip() for p in re.split(r"[;,]", raw) if p.strip()])

        fm_categories_raw = []
        for key in ("categories", "Categories"):
            if key in fm and fm[key]:
                raw = fm[key]
                if isinstance(raw, (list, tuple)):
                    fm_categories_raw.extend([str(x).strip() for x in raw if x and str(x).strip()])
                elif isinstance(raw, str):
                    fm_categories_raw.extend([p.strip() for p in re.split(r"[;,]", raw) if p.strip()])

        fm_tags = []
        for v in fm_tags_raw:
            n = normalize_tag_preserve_case(v, canonical_map)
            if n:
                fm_tags.append(n)
        fm_categories = []
        for v in fm_categories_raw:
            n = normalize_tag_preserve_case(v, canonical_map)
            if n:
                fm_categories.append(n)

        wikilinks = extract_wikilinks_from_body(body, canonical_map)
        raw_tags.extend(wikilinks)

        has_media_tag = False
        for key in ("tags", "Tags"):
            if key in fm and fm[key]:
                raw = fm[key]
                if isinstance(raw, (list, tuple)):
                    for v in raw:
                        if isinstance(v, str) and v.strip().lower() in MEDIA_TAGS_LOWER:
                            has_media_tag = True
                            break
                elif isinstance(raw, str):
                    parts = re.split(r"[;,]", raw)
                    for p in parts:
                        if p.strip().lower() in MEDIA_TAGS_LOWER:
                            has_media_tag = True
                            break
            if has_media_tag:
                break

        if not has_media_tag:
            t_title = normalize_tag_preserve_case(str(title), canonical_map)
            if t_title:
                raw_tags.append(t_title)

        startDate = fm.get("startDate") or fm.get("StartDate") or ""
        year_tag = "Unknown Year"
        if startDate and startDate != "0000-00-00":
            parts = startDate.split("-")
            if parts and len(parts) >= 1 and parts[0].isdigit() and parts[0] != "0000":
                year_tag = parts[0]
        t_year = normalize_tag_preserve_case(year_tag, canonical_map)
        if t_year:
            raw_tags.append(t_year)

        seen = set()
        final_tags = []
        for t in raw_tags:
            if not t:
                continue
            lk = t.lower()
            if lk in seen:
                continue
            seen.add(lk)
            final_tags.append(canonical_map.get(lk, t))

        relpath = normalize_page_path(f)
        tags_by_page[relpath] = final_tags
        pages_meta[relpath] = {
            "title": str(title),
            "path": relpath,
            "fm_tags": fm_tags,
            "fm_categories": fm_categories
        }

    infer_raw = load_infer_map(infer_file)
    infer_closure = compute_transitive_inference_map(infer_raw) if infer_raw else {}

    if infer_closure:
        norm_closure = {}
        for k, vals in infer_closure.items():
            kc = canonical_map.get(k.lower(), k)
            norm_vals = [canonical_map.get(v.lower(), v) for v in vals]
            norm_closure[kc] = norm_vals
        infer_closure = norm_closure

    tags_by_page_expanded = {}
    pages_by_tag = defaultdict(list)
    for path, tags in tags_by_page.items():
        expanded = expand_tags_with_inference(tags, infer_closure, canonical_map)
        tags_by_page_expanded[path] = expanded
        for t in expanded:
            pages_by_tag[t].append({"path": path, "title": pages_meta[path]["title"]})

    pages_by_tag_sorted = {}
    for tag, arr in pages_by_tag.items():
        seenp = set()
        uniq = []
        for o in arr:
            if o["path"] in seenp:
                continue
            seenp.add(o["path"])
            uniq.append(o)
        uniq.sort(key=lambda x: (x["title"].lower(), x["path"]))
        pages_by_tag_sorted[tag] = uniq

    tag_counts = {tag: len(arr) for tag, arr in pages_by_tag_sorted.items()}

    os.makedirs(out_dir, exist_ok=True)
    os.makedirs(OUT_DIR_COPY, exist_ok=True)
    
    # OPTIMIZED: Write minified JSON
    main_tbp = {k: v for k, v in tags_by_page_expanded.items() if not k.startswith("theoryweb/")}
    main_pbt = {tag: [p for p in arr if not p["path"].startswith("theoryweb/")] 
                for tag, arr in pages_by_tag_sorted.items()}
    main_pbt = {k: v for k, v in main_pbt.items() if v}
    main_tc = {tag: len(arr) for tag, arr in main_pbt.items()}

    os.makedirs(out_dir, exist_ok=True)
    os.makedirs(OUT_DIR_COPY, exist_ok=True)
    with open(os.path.join(out_dir, "tags_by_page.json"), "w", encoding="utf-8") as fh:
        json.dump(main_tbp, fh, ensure_ascii=False, separators=(',', ':'))
    with open(os.path.join(OUT_DIR_COPY, "tags_by_page.json"), "w", encoding="utf-8") as fh:
        json.dump(main_tbp, fh, ensure_ascii=False, separators=(',', ':'))
    with open(os.path.join(out_dir, "pages_by_tag.json"), "w", encoding="utf-8") as fh:
        json.dump(main_pbt, fh, ensure_ascii=False, separators=(',', ':'))
    with open(os.path.join(out_dir, "tag_counts.json"), "w", encoding="utf-8") as fh:
        json.dump(main_tc, fh, ensure_ascii=False, separators=(',', ':'))
    with open(os.path.join(OUT_DIR_COPY, "tag_counts.json"), "w", encoding="utf-8") as fh:
        json.dump(main_tc, fh, ensure_ascii=False, separators=(',', ':'))

    title_to_key_map = {}
    for key, meta in pages_meta.items():
        t = meta.get("title", "")
        if t:
            title_to_key_map[t] = key

    tags_by_page_keys_norm = {k: normalize_text_for_match(k) for k in tags_by_page_expanded.keys()}

    # Phase 2: media files
    for f in media_files:
        try:
            fm, body = read_frontmatter(f)
        except Exception as e:
            print(f"[WARN] failed to read {f}: {e}", file=sys.stderr)
            fm, body = {}, ""

        title = fm.get("title") or fm.get("Title") or Path(f).stem
        raw_tags = extract_tags_from_frontmatter(fm, canonical_map)
        wikilinks = extract_wikilinks_from_body(body, canonical_map)
        raw_tags.extend(wikilinks)

        fm_tags_raw = []
        for key in ("tags", "Tags"):
            if key in fm and fm[key]:
                raw = fm[key]
                if isinstance(raw, (list, tuple)):
                    fm_tags_raw.extend([str(x).strip() for x in raw if x and str(x).strip()])
                elif isinstance(raw, str):
                    fm_tags_raw.extend([p.strip() for p in re.split(r"[;,]", raw) if p.strip()])

        fm_categories_raw = []
        for key in ("categories", "Categories"):
            if key in fm and fm[key]:
                raw = fm[key]
                if isinstance(raw, (list, tuple)):
                    fm_categories_raw.extend([str(x).strip() for x in raw if x and str(x).strip()])
                elif isinstance(raw, str):
                    fm_categories_raw.extend([p.strip() for p in re.split(r"[;,]", raw) if p.strip()])

        fm_tags = [normalize_tag_preserve_case(v, canonical_map) for v in fm_tags_raw if v]
        fm_categories = [normalize_tag_preserve_case(v, canonical_map) for v in fm_categories_raw if v]

        has_media_tag = False
        for key in ("tags", "Tags"):
            if key in fm and fm[key]:
                raw = fm[key]
                if isinstance(raw, (list, tuple)):
                    for v in raw:
                        if isinstance(v, str) and v.strip().lower() in MEDIA_TAGS_LOWER:
                            has_media_tag = True
                            break
                elif isinstance(raw, str):
                    parts = re.split(r"[;,]", raw)
                    for p in parts:
                        if p.strip().lower() in MEDIA_TAGS_LOWER:
                            has_media_tag = True
                            break
            if has_media_tag:
                break

        if not has_media_tag:
            tt = normalize_tag_preserve_case(str(title), canonical_map)
            if tt:
                raw_tags.append(tt)

        startDate = fm.get("startDate") or fm.get("StartDate") or ""
        year_tag = "Unknown Year"
        if startDate and startDate != "0000-00-00":
            parts = startDate.split("-")
            if parts and len(parts) >= 1 and parts[0].isdigit() and parts[0] != "0000":
                year_tag = parts[0]
        t_year = normalize_tag_preserve_case(year_tag, canonical_map)
        if t_year:
            raw_tags.append(t_year)

        pages_field = fm.get("pages") or fm.get("Pages") or fm.get("page") or fm.get("Page") or []

        if isinstance(pages_field, str):
            pages_field = [p.strip() for p in re.split(r"[;,]", pages_field) if p.strip()]

        inherited_tags = []
        for page_ref in (pages_field or []):
            if not page_ref:
                continue
            matched_key = find_key_by_title_or_normalized(str(page_ref), title_to_key_map, tags_by_page_keys_norm)
            if matched_key:
                meta = pages_meta.get(matched_key, {})
                pulled_tags = meta.get("fm_tags", []) or []
                pulled_cats = meta.get("fm_categories", []) or []
                if pulled_tags or pulled_cats:
                    inherited_tags.extend(pulled_tags)
                    inherited_tags.extend(pulled_cats)
                else:
                    fallback = tags_by_page_expanded.get(matched_key, [])
                    if fallback:
                        inherited_tags.extend(fallback)

        raw_tags.extend(inherited_tags)

        seen = set()
        final_tags = []
        for t in raw_tags:
            if not t:
                continue
            canon = normalize_tag_preserve_case(str(t), canonical_map)
            lk = canon.lower()
            if lk in seen:
                continue
            seen.add(lk)
            final_tags.append(canonical_map.get(lk, canon))

        relpath = normalize_page_path(f)
        tags_by_page[relpath] = final_tags
        pages_meta[relpath] = {
            "title": str(title),
            "path": relpath,
            "fm_tags": fm_tags,
            "fm_categories": fm_categories
        }

        if title:
            title_to_key_map[title] = relpath

    # Re-run inference expansion
    infer_raw = load_infer_map(infer_file)
    if not infer_raw:
        infer_closure = {}
    else:
        infer_closure = compute_transitive_inference_map(infer_raw)
        norm_closure = {}
        for k, vals in infer_closure.items():
            kc = canonical_map.get(k.lower(), k)
            norm_vals = [canonical_map.get(v.lower(), v) for v in vals]
            norm_closure[kc] = norm_vals
        infer_closure = norm_closure

    tags_by_page_expanded = {}
    pages_by_tag = defaultdict(list)
    for path, tags in tags_by_page.items():
        expanded = expand_tags_with_inference(tags, infer_closure, canonical_map)
        tags_by_page_expanded[path] = expanded
        for t in expanded:
            pages_by_tag[t].append({"path": path, "title": pages_meta[path]["title"]})

    pages_by_tag_sorted = {}
    for tag, arr in pages_by_tag.items():
        seenp = set()
        uniq = []
        for o in arr:
            if o["path"] in seenp:
                continue
            seenp.add(o["path"])
            uniq.append(o)
        uniq.sort(key=lambda x: (x["title"].lower(), x["path"]))
        pages_by_tag_sorted[tag] = uniq

    tag_counts = {tag: len(arr) for tag, arr in pages_by_tag_sorted.items()}

    # OPTIMIZED: Write final minified JSON
    main_tbp = {k: v for k, v in tags_by_page_expanded.items() if not k.startswith("theoryweb/")}
    main_pbt = {tag: [p for p in arr if not p["path"].startswith("theoryweb/")] 
                for tag, arr in pages_by_tag_sorted.items()}
    main_pbt = {k: v for k, v in main_pbt.items() if v}
    main_tc = {tag: len(arr) for tag, arr in main_pbt.items()}

    with open(os.path.join(out_dir, "tags_by_page.json"), "w", encoding="utf-8") as fh:
        json.dump(main_tbp, fh, ensure_ascii=False, separators=(',', ':'))
    with open(os.path.join(OUT_DIR_COPY, "tags_by_page.json"), "w", encoding="utf-8") as fh:
        json.dump(main_tbp, fh, ensure_ascii=False, separators=(',', ':'))
    with open(os.path.join(out_dir, "pages_by_tag.json"), "w", encoding="utf-8") as fh:
        json.dump(main_pbt, fh, ensure_ascii=False, separators=(',', ':'))
    with open(os.path.join(out_dir, "tag_counts.json"), "w", encoding="utf-8") as fh:
        json.dump(main_tc, fh, ensure_ascii=False, separators=(',', ':'))
    with open(os.path.join(OUT_DIR_COPY, "tag_counts.json"), "w", encoding="utf-8") as fh:
        json.dump(main_tc, fh, ensure_ascii=False, separators=(',', ':'))

    # Theoryweb-only outputs
    tw_out_dir = os.path.join(out_dir, "theoryweb")
    tw_out_dir_copy = os.path.join(OUT_DIR_COPY, "theoryweb")
    os.makedirs(tw_out_dir, exist_ok=True)
    os.makedirs(tw_out_dir_copy, exist_ok=True)

    tw_tbp = {k: v for k, v in tags_by_page_expanded.items() if k.startswith("theoryweb/")}
    tw_pbt = {tag: [p for p in arr if p["path"].startswith("theoryweb/")] 
              for tag, arr in pages_by_tag_sorted.items()}
    tw_pbt = {k: v for k, v in tw_pbt.items() if v}
    tw_tc = {tag: len(arr) for tag, arr in tw_pbt.items()}

    with open(os.path.join(tw_out_dir, "tags_by_page.json"), "w", encoding="utf-8") as fh:
        json.dump(tw_tbp, fh, ensure_ascii=False, separators=(',', ':'))
    with open(os.path.join(tw_out_dir_copy, "tags_by_page.json"), "w", encoding="utf-8") as fh:
        json.dump(tw_tbp, fh, ensure_ascii=False, separators=(',', ':'))
    with open(os.path.join(tw_out_dir, "pages_by_tag.json"), "w", encoding="utf-8") as fh:
        json.dump(tw_pbt, fh, ensure_ascii=False, separators=(',', ':'))
    with open(os.path.join(tw_out_dir, "tag_counts.json"), "w", encoding="utf-8") as fh:
        json.dump(tw_tc, fh, ensure_ascii=False, separators=(',', ':'))
    with open(os.path.join(tw_out_dir_copy, "tag_counts.json"), "w", encoding="utf-8") as fh:
        json.dump(tw_tc, fh, ensure_ascii=False, separators=(',', ':'))

    return tags_by_page_expanded, pages_by_tag_sorted, tag_counts

def run():
    build_tag_map()

if __name__ == "__main__":
    run()