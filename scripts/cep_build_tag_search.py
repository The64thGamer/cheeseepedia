#!/usr/bin/env python3
"""
build_tag_map.py

Build a tag map for a Hugo site:

- Extract tags from frontmatter 'tags' and 'categories', page title, pages param, and wiki-link shortcodes in body.
- If a page's frontmatter tags include any of the media tags (Photos, Videos, Transcriptions, Reviews),
  the page title will NOT be added as a tag.
- Apply recursive tag inference using data/tag_infer.json (if present).
- Output:
    data/tags/tags_by_page.json   -> { "content/wiki/some-page.md": ["Tag A", "Tag B", ...], ... }
    data/tags/pages_by_tag.json   -> { "Tag A": [ {"path":"content/wiki/..","title":"..."}, ... ], ... }
    data/tags/tag_counts.json     -> { "Tag A": 12, ... }

Usage:
  import and call run() from your pipeline (preferred),
  or run this file directly.
"""
from __future__ import annotations
import os
import re
import sys
import json
import unicodedata
from pathlib import Path
from collections import defaultdict, OrderedDict

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
INFER_DEFAULT = "scripts/cep_tag_inference.json"   # user-provided inference file (optional)
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

# Frontmatter splitting: TOML +++...+++ or YAML ---...---
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
    # no frontmatter
    return {}, txt

def normalize_tag_preserve_case(tag: str, canonical_map: dict):
    """
    Normalize whitespace/trimming; dedupe case-insensitively using canonical_map.
    canonical_map: lowercase -> canonical-cased tag
    Returns canonical-cased tag string (adds to canonical_map if new).
    """
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
    """
    Extract tags/categories/pages from frontmatter.
    Returns a list (may have duplicates — caller dedupes).
    """
    tags = []
    # tags
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
    # categories
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
    # pages param (new requirement) — treat like tags
    for key in ("pages", "Pages"):
        if key in fm and fm[key]:
            raw = fm[key]
            if isinstance(raw, (list, tuple)):
                for v in raw:
                    n = normalize_tag_preserve_case(str(v), canonical_map)
                    if n:
                        tags.append(n)
            elif isinstance(raw, str):
                # pages usually single items but handle comma-separated defensively
                parts = re.split(r"[;,]", raw)
                for p in parts:
                    p = p.strip()
                    if p:
                        n = normalize_tag_preserve_case(p, canonical_map)
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
    out = sorted(set(out))
    return out

# ---- Tag inference (transitive closure) ----
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
        # BFS/DFS for transitive closure with cycle safety
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
    # lowercase map for infer_closure lookup
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

# ----------------- Path slugification (Hugo-like) -----------------
# Approximate Hugo slugification for page paths:
#  - Unicode NFKD decomposition + remove combining marks
#  - Replace whitespace/punctuation with hyphens
#  - Collapse multiple hyphens, trim leading/trailing hyphens
#  - Lowercase
# Preserve segments beginning with '_' (e.g. _index)
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
    """
    Convert 'content/foo/bar.md' -> 'foo/bar' and slugify segments:
     - remove BASE_CONTENT_DIR prefix
     - remove extension
     - split path segments and slugify each (except segments starting with '_')
     - return joined path (no leading slash)
    """
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

# ---- Main builder ----
def build_tag_map(base_dir=BASE_CONTENT_DIR, out_dir=OUT_DIR, infer_file=INFER_DEFAULT):
    files = collect_content_files(base_dir)
    print(f"[INFO] scanning {len(files)} files under {base_dir}")

    canonical_map = {}  # lower -> canonical-case first seen
    tags_by_page = {}   # page_path -> list of tags (before inference)
    pages_meta = {}     # page_path -> {title, path}

    MEDIA_TAGS_LOWER = {"photos", "videos", "transcriptions", "reviews"}

    # scan pages
    for f in files:
        try:
            fm, body = read_frontmatter(f)
        except Exception as e:
            print(f"[WARN] failed to read {f}: {e}", file=sys.stderr)
            fm, body = {}, ""

        title = fm.get("title") or fm.get("Title") or Path(f).stem

        # collect tags/categories/pages
        raw_tags = extract_tags_from_frontmatter(fm, canonical_map)

        # wiki-link targets from body
        wikilinks = extract_wikilinks_from_body(body, canonical_map)
        raw_tags.extend(wikilinks)

        # Determine whether to add title as a tag:
        # If any frontmatter tag is a media tag, DO NOT include title.
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

        # Only add title if there is NO media tag
        if not has_media_tag:
            t_title = normalize_tag_preserve_case(str(title), canonical_map)
            if t_title:
                raw_tags.append(t_title)

        # --- add startDate year as a tag (Unknown Year for 0000) ---
        startDate = fm.get("startDate") or fm.get("StartDate") or ""
        year_tag = "Unknown Year"
        if startDate and startDate != "0000-00-00":
            parts = startDate.split("-")
            if parts and len(parts) >= 1 and parts[0].isdigit() and parts[0] != "0000":
                year_tag = parts[0]
        t_year = normalize_tag_preserve_case(year_tag, canonical_map)
        if t_year:
            raw_tags.append(t_year)
        # --- end year tag ---

        # dedupe case-insensitively while preserving canonical_case
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

    # load infer map and compute closure
    infer_raw = load_infer_map(infer_file)
    if not infer_raw:
        infer_closure = {}
    else:
        infer_closure = compute_transitive_inference_map(infer_raw)
        # normalize infer_closure keys/values to canonical casing when possible
        norm_closure = {}
        for k, vals in infer_closure.items():
            kc = canonical_map.get(k.lower(), k)
            norm_vals = [canonical_map.get(v.lower(), v) for v in vals]
            norm_closure[kc] = norm_vals
        infer_closure = norm_closure
        print(f"[INFO] loaded inference map ({len(infer_closure)} keys)")

    # expand tags for each page using inference
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

    # write outputs
    os.makedirs(out_dir, exist_ok=True)
    with open(os.path.join(out_dir, "tags_by_page.json"), "w", encoding="utf-8") as fh:
        json.dump(tags_by_page_expanded, fh, indent=2, ensure_ascii=False)
    with open(os.path.join(out_dir, "pages_by_tag.json"), "w", encoding="utf-8") as fh:
        json.dump(pages_by_tag_sorted, fh, indent=2, ensure_ascii=False)
    with open(os.path.join(out_dir, "tag_counts.json"), "w", encoding="utf-8") as fh:
        json.dump(tag_counts, fh, indent=2, ensure_ascii=False)

    print(f"[INFO] wrote outputs in {out_dir}: {len(tags_by_page_expanded)} pages, {len(pages_by_tag_sorted)} tags")

    return tags_by_page_expanded, pages_by_tag_sorted, tag_counts

# ---- CLI / run helper ----
def run():
    build_tag_map()

if __name__ == "__main__":
    run()
