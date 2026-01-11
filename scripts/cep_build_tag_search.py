#!/usr/bin/env python3
"""
build_tag_map.py (media-last variant)

Behavior changes vs previous version:
 - Process non-media content first (everything except content/{photos,videos,transcriptions,reviews})
 - Write the initial tags JSONs after that first pass (pregenerated tags available)
 - Then process media folders (photos, videos, transcriptions, reviews) last.
   For each media page, read its 'pages' param (an array of page titles/identifiers),
   find the matching pregenerated page key, pull that page's pregenerated tags,
   and add those tags onto the media page before final inference.
 - Finally write the final JSON outputs (overwriting the earlier ones).
 - Logs extensively which pages were matched and what tags were merged.
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
    import tomllib as toml_lib  # Python 3.11+
except Exception:
    try:
        import tomli as toml_lib  # pip install tomli
    except Exception:
        toml_lib = None

try:
    import yaml
except Exception:
    yaml = None

# ---- Config (change if needed) ----
BASE_CONTENT_DIR = "content"
OUT_DIR = "static/data/tags"
OUT_DIR_COPY = "data/tags"
INFER_DEFAULT = "scripts/cep_tag_inference.json"   # user-provided inference file (optional)

# Media folders which should be processed last and whose pages should
# inherit tags from referenced pages in their 'pages' frontmatter.
MEDIA_DIRS = (
    os.path.join("content", "photos"),
    os.path.join("content", "videos"),
    os.path.join("content", "transcriptions"),
    os.path.join("content", "reviews"),
)
# ------------------------------------

# Regexes to find wiki-link shortcode occurrences.
WIKI_LINK_RE = re.compile(r"""
    \{\{\s*<?\s*         # opening {{ or {{<
    wiki-link\s+         # wiki-link token
    (?:
      ["']([^"']+)["']   # "Title" or 'Title' capture group 1
      |
      ([^\s\}]+)         # or unquoted single token capture group 2 (less common)
    )
    [^>]*>?\s*\}\}
""", re.IGNORECASE | re.VERBOSE)

# ---------------- utility helpers ----------------

def is_in_media_dir(path_str: str) -> bool:
    p = Path(path_str).resolve()
    for md in MEDIA_DIRS:
        # compare resolved suffix (works also if media dir doesn't exist)
        try:
            if str(p).startswith(str(Path(md).resolve())):
                return True
        except Exception:
            # fallback: simpler substring check
            if md in str(path_str):
                return True
    return False

# Frontmatter parsing (Toml +++ or YAML ---)
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
                    fm = {"__raw": fm_text}
            else:
                fm = {"__raw": fm_text}
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
                    fm = {"__raw": fm_text}
            else:
                fm = {"__raw": fm_text}
            return fm, body
    # no frontmatter -> empty fm, full text as body
    return {}, txt

# Normalize/canonicalization helpers (same as before)
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

# tag normalization
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

# parse/collect tag-like fields (with pipe handling)
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

    # tags and categories (as before)
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

    # pages param treated like tags
    for key in ("pages", "Pages"):
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

    # handle pipe-delimited parameter fields (take first piece)
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

# inference functions (unchanged)
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

# slugification for page path normalization (Hugo-like)
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

# --- matching helpers to map a 'pages' string to pregenerated page key ---
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
    """
    Try:
     1) exact title match (case-preserving map)
     2) case-insensitive title match
     3) normalized-title match (punctuation removed, collapsed spaces)
     4) fallback: try checking normalized page keys (if title looks like a path)
    Returns matched key or None.
    """
    if not title:
        return None
    t = title.strip()
    # 1) exact (title_to_key_map may hold exact)
    if t in title_to_key_map:
        return title_to_key_map[t]
    # 2) ci
    tl = t.lower()
    for ktitle, key in title_to_key_map.items():
        if ktitle.lower() == tl:
            return key
    # 3) normalized
    nt = normalize_text_for_match(t)
    if nt:
        for ktitle, key in title_to_key_map.items():
            if normalize_text_for_match(ktitle) == nt:
                return key
    # 4) maybe input already looks like a page key or path, try to normalize and compare with tags_by_page keys
    candidate = t.replace("\\", "/").lstrip("/")
    candidate = re.sub(r"\.(md|markdown|mdown)$", "", candidate, flags=re.IGNORECASE)
    candidate = "/".join([slugify_segment(p) for p in candidate.split("/") if p])
    if candidate and candidate in tags_by_page_keys_norm:
        return candidate
    return None

# ---------------- Main builder (split phases) ----------------
def build_tag_map(base_dir=BASE_CONTENT_DIR, out_dir=OUT_DIR, infer_file=INFER_DEFAULT):
    files = collect_content_files(base_dir)
    print(f"[INFO] scanning {len(files)} files under {base_dir}")

    # split files into normal vs media
    normal_files = []
    media_files = []
    for f in files:
        # if path starts with any MEDIA_DIR, treat as media
        if is_in_media_dir(f):
            media_files.append(f)
        else:
            normal_files.append(f)

    print(f"[INFO] normal files: {len(normal_files)}, media files (deferred): {len(media_files)}")

    canonical_map = {}  # lower -> canonical-case first seen
    tags_by_page = {}   # page_path -> list of tags (before inference)
    pages_meta = {}     # page_path -> {title, path}

    MEDIA_TAGS_LOWER = {"photos", "videos", "transcriptions", "reviews"}

    # === Phase 1: process normal files ===
    for f in normal_files:
        try:
            fm, body = read_frontmatter(f)
        except Exception as e:
            print(f"[WARN] failed to read {f}: {e}", file=sys.stderr)
            fm, body = {}, ""

        title = fm.get("title") or fm.get("Title") or Path(f).stem

        raw_tags = extract_tags_from_frontmatter(fm, canonical_map)

        wikilinks = extract_wikilinks_from_body(body, canonical_map)
        raw_tags.extend(wikilinks)

        # skip adding title for media-tagged pages (not relevant in normal phase)
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

        # year tag
        startDate = fm.get("startDate") or fm.get("StartDate") or ""
        year_tag = "Unknown Year"
        if startDate and startDate != "0000-00-00":
            parts = startDate.split("-")
            if parts and len(parts) >= 1 and parts[0].isdigit() and parts[0] != "0000":
                year_tag = parts[0]
        t_year = normalize_tag_preserve_case(year_tag, canonical_map)
        if t_year:
            raw_tags.append(t_year)

        # dedupe case-insensitively preserving canonical
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
        pages_meta[relpath] = {"title": str(title), "path": relpath}

    # ==== After normal files: compute inference closure and expand, then write initial JSONs ====
    infer_raw = load_infer_map(infer_file)
    infer_closure = compute_transitive_inference_map(infer_raw) if infer_raw else {}

    # normalize infer_closure to canonical casing when possible
    if infer_closure:
        norm_closure = {}
        for k, vals in infer_closure.items():
            kc = canonical_map.get(k.lower(), k)
            norm_vals = [canonical_map.get(v.lower(), v) for v in vals]
            norm_closure[kc] = norm_vals
        infer_closure = norm_closure
        print(f"[INFO] loaded inference map ({len(infer_closure)} keys)")

    # Expand tags for normal pages now (pregenerated)
    tags_by_page_expanded = {}
    pages_by_tag = defaultdict(list)
    for path, tags in tags_by_page.items():
        expanded = expand_tags_with_inference(tags, infer_closure, canonical_map)
        tags_by_page_expanded[path] = expanded
        for t in expanded:
            pages_by_tag[t].append({"path": path, "title": pages_meta[path]["title"]})

    # dedupe pages_by_tag
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

    # write initial pregenerated JSONs (so we can read them when processing media files)
    os.makedirs(out_dir, exist_ok=True)
    os.makedirs(OUT_DIR_COPY, exist_ok=True)
    with open(os.path.join(out_dir, "tags_by_page.json"), "w", encoding="utf-8") as fh:
        json.dump(tags_by_page_expanded, fh, indent=2, ensure_ascii=False)
    with open(os.path.join(OUT_DIR_COPY, "tags_by_page.json"), "w", encoding="utf-8") as fh:
        json.dump(tags_by_page_expanded, fh, indent=2, ensure_ascii=False)
    with open(os.path.join(out_dir, "pages_by_tag.json"), "w", encoding="utf-8") as fh:
        json.dump(pages_by_tag_sorted, fh, indent=2, ensure_ascii=False)
    with open(os.path.join(out_dir, "tag_counts.json"), "w", encoding="utf-8") as fh:
        json.dump(tag_counts, fh, indent=2, ensure_ascii=False)

    print(f"[INFO] wrote initial outputs in {out_dir}: {len(tags_by_page_expanded)} pages, {len(pages_by_tag_sorted)} tags (normal pages only)")

    # build helper maps for lookup by title
    title_to_key_map = {}
    for key, meta in pages_meta.items():
        t = meta.get("title", "")
        if t:
            title_to_key_map[t] = key

    # Also build a normalized-keys dict for matching candidate path-like inputs
    tags_by_page_keys_norm = {k: normalize_text_for_match(k) for k in tags_by_page_expanded.keys()}

    # ==== Phase 2: process media files (deferred) ====
    # We'll extend tags_by_page (and pages_meta) with media file entries.
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

        # media pages normally have media tags — determine and do not add title as tag
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

        # year tag for media too
        startDate = fm.get("startDate") or fm.get("StartDate") or ""
        year_tag = "Unknown Year"
        if startDate and startDate != "0000-00-00":
            parts = startDate.split("-")
            if parts and len(parts) >= 1 and parts[0].isdigit() and parts[0] != "0000":
                year_tag = parts[0]
        t_year = normalize_tag_preserve_case(year_tag, canonical_map)
        if t_year:
            raw_tags.append(t_year)

        # --- NEW: inherit tags from pages referenced in this media page ---
        pages_field = fm.get("pages") or fm.get("Pages") or []
        if isinstance(pages_field, str):
            # defensive parse like earlier behavior
            pages_field = [p.strip() for p in re.split(r"[;,]", pages_field) if p.strip()]

        inherited_tags = []
        for page_ref in (pages_field or []):
            if not page_ref:
                continue
            # Try to find the pregenerated page key matching this page_ref
            matched_key = find_key_by_title_or_normalized(str(page_ref), title_to_key_map, tags_by_page_keys_norm)
            if matched_key:
                # pull pregenerated tags for that key
                pulled = tags_by_page_expanded.get(matched_key, [])
                if pulled:
                    inherited_tags.extend(pulled)

        # append inherited tags to raw_tags (they are canonical-case strings already)
        raw_tags.extend(inherited_tags)

        # dedupe and preserve canonical casing (update canonical_map for any new tags)
        seen = set()
        final_tags = []
        for t in raw_tags:
            if not t:
                continue
            # if it's not canonical yet, add to canonical_map
            canon = normalize_tag_preserve_case(str(t), canonical_map)
            lk = canon.lower()
            if lk in seen:
                continue
            seen.add(lk)
            final_tags.append(canonical_map.get(lk, canon))

        # update in-memory maps
        relpath = normalize_page_path(f)
        tags_by_page[relpath] = final_tags
        pages_meta[relpath] = {"title": str(title), "path": relpath}

        # also update title->key map for subsequent lookups (media pages could be referenced by later media)
        if title:
            title_to_key_map[title] = relpath

    # ==== After media pass: re-run inference expansion and produce final JSON outputs ====
    # Recompute infer_closure normalized to canonical_map (in case canonical_map got new entries)
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

    # Expand tags for all pages (including media) using final canonical_map and infer_closure
    tags_by_page_expanded = {}
    pages_by_tag = defaultdict(list)
    for path, tags in tags_by_page.items():
        expanded = expand_tags_with_inference(tags, infer_closure, canonical_map)
        tags_by_page_expanded[path] = expanded
        for t in expanded:
            pages_by_tag[t].append({"path": path, "title": pages_meta[path]["title"]})

    # dedupe pages_by_tag entries and sort
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

    # counts
    tag_counts = {tag: len(arr) for tag, arr in pages_by_tag_sorted.items()}

    # write final outputs (overwrite)
    with open(os.path.join(out_dir, "tags_by_page.json"), "w", encoding="utf-8") as fh:
        json.dump(tags_by_page_expanded, fh, indent=2, ensure_ascii=False)
    with open(os.path.join(OUT_DIR_COPY, "tags_by_page.json"), "w", encoding="utf-8") as fh:
        json.dump(tags_by_page_expanded, fh, indent=2, ensure_ascii=False)
    with open(os.path.join(out_dir, "pages_by_tag.json"), "w", encoding="utf-8") as fh:
        json.dump(pages_by_tag_sorted, fh, indent=2, ensure_ascii=False)
    with open(os.path.join(out_dir, "tag_counts.json"), "w", encoding="utf-8") as fh:
        json.dump(tag_counts, fh, indent=2, ensure_ascii=False)

    print(f"[INFO] wrote final outputs in {out_dir}: {len(tags_by_page_expanded)} pages, {len(pages_by_tag_sorted)} tags (including media pages)")

    return tags_by_page_expanded, pages_by_tag_sorted, tag_counts

# ---- CLI / run helper ----
def run():
    build_tag_map()

if __name__ == "__main__":
    run()
