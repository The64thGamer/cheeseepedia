#!/usr/bin/env python3
"""
Build a fuzzy-capable search index for Hugo content.

Outputs:
  - data/search/docs.json            : list of doc objects (id, title, path, excerpt, tokens, trigrams)
  - data/search/inverted_tokens.json : mapping token -> [doc_id, ...]
  - data/search/inverted_trigrams.json: mapping trigram -> [doc_id, ...]

OPTIMIZED VERSION:
- Removed full content/body storage (only excerpt kept)
- Removed frontmatter storage (not used in search)
- Minified JSON output (no indentation)
- Reduced excerpt length
"""
from __future__ import annotations
import os
import sys
import re
import json
import argparse
from collections import defaultdict, Counter
from pathlib import Path
import unicodedata

# Try to import TOML/YAML parsers for frontmatter; optional
try:
    import tomllib as toml  # py3.11+
except Exception:
    try:
        import tomli as toml  # pip install tomli
    except Exception:
        toml = None

try:
    import yaml  # pip install PyYAML
except Exception:
    yaml = None

# ----------------- Config -----------------
BASE_CONTENT_DIR = "content"
OUT_DIR = "static/data/search"
DOCS_JSON = os.path.join(OUT_DIR, "docs.json")
INVERTED_TOKENS_JSON = os.path.join(OUT_DIR, "inverted_tokens.json")
INVERTED_TRIGRAMS_JSON = os.path.join(OUT_DIR, "inverted_trigrams.json")

MIN_TOKEN_LEN = 2
TRIGRAM_MIN_DOC_FREQ = 1
EXCERPT_LEN = 150  # Reduced from 220
# ------------------------------------------

def read_file_bytes(path: str) -> bytes:
    with open(path, "rb") as fh:
        return fh.read()

def decode_text(raw: bytes) -> str:
    for enc in ("utf-8", "latin-1"):
        try:
            return raw.decode(enc)
        except Exception:
            continue
    return raw.decode("utf-8", errors="ignore")

# ----------------- Path slugification (Hugo-like) -----------------
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

def read_frontmatter_and_body(path: str):
    raw = read_file_bytes(path)
    txt = decode_text(raw).lstrip()
    if txt.startswith("+++"):
        parts = re.split(r"(?m)^\+{3}\s*$", txt)
        if len(parts) >= 3:
            fm_text = parts[1]
            body = parts[2]
            if toml is not None:
                try:
                    fm = toml.loads(fm_text)
                except Exception:
                    fm = {}
            else:
                fm = {}
            return fm, body.strip()
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
            return fm, body.strip()
    return {}, txt

# Normalize text for tokenization and trigram generation
RE_NON_WORD = re.compile(r"[^\w\s]", re.UNICODE)
RE_WHITESPACE = re.compile(r"\s+", re.UNICODE)

def normalize_text(s: str) -> str:
    if not s:
        return ""
    s = s.lower()
    s = RE_NON_WORD.sub(" ", s)
    s = RE_WHITESPACE.sub(" ", s).strip()
    return s

def tokenize(s: str):
    s = normalize_text(s)
    if not s:
        return []
    toks = s.split()
    toks = [t for t in toks if len(t) >= MIN_TOKEN_LEN]
    return toks

def char_trigrams(s: str):
    if not s:
        return set()
    n = 3
    s = normalize_text(s)
    padded = f"  {s}  "
    trigrams = set()
    for i in range(len(padded) - n + 1):
        tri = padded[i:i+n]
        if tri.strip():
            trigrams.add(tri)
    return trigrams

def collect_content_files(base_dir=BASE_CONTENT_DIR):
    out = []
    base = Path(base_dir)
    if not base.exists():
        print(f"[WARN] content base dir not found: {base_dir}", file=sys.stderr)
        return out
    for p in base.rglob("*.md"):
        out.append(str(p))
    for ext in (".markdown", ".mdown"):
        for p in base.rglob(f"*{ext}"):
            out.append(str(p))
    out = sorted(set(out))
    return out

def excerpt_text(s: str, length=EXCERPT_LEN):
    if not s:
        return ""
    s = s.strip()
    if len(s) <= length:
        return s
    cut = s[:length].rsplit(" ", 1)[0]
    return cut + "…"

# ----------------- Index builder -----------------
def build_index(base_dir=BASE_CONTENT_DIR, out_dir=OUT_DIR):
    files = collect_content_files(base_dir)
    print(f"[INFO] Found {len(files)} markdown files under {base_dir}")

    docs = []
    inverted_tokens = defaultdict(list)
    inverted_trigrams = defaultdict(list)

    for doc_id, path in enumerate(files):
        try:
            fm, body = read_frontmatter_and_body(path)
        except Exception as e:
            print(f"[ERROR] reading {path}: {e}", file=sys.stderr)
            fm, body = {}, ""

        title = fm.get("title") or fm.get("Title") or Path(path).stem

        # Build searchable text from title and body only
        # Removed: frontmatter fields that bloat the index
        fulltext = " ".join([title, body])

        toks = tokenize(fulltext)
        trigs = char_trigrams(fulltext)

        # OPTIMIZED: Store only what's needed for search UI
        doc = {
            "id": doc_id,
            "title": str(title),
            "path": normalize_page_path(path),
            "excerpt": excerpt_text(body),
            "tokens": toks,
            "trigrams": list(trigs)
            # Removed: frontmatter dict (not used in search)
            # Removed: tags (handled by tag_search.py)
        }
        docs.append(doc)

        # Fill inverted indices
        seen_tokens = set()
        for t in toks:
            if t in seen_tokens:
                continue
            inverted_tokens[t].append(doc_id)
            seen_tokens.add(t)
        for tri in trigs:
            inverted_trigrams[tri].append(doc_id)

    # Prune rare trigrams if configured
    if TRIGRAM_MIN_DOC_FREQ > 1:
        pruned_trigrams = {}
        for k, arr in inverted_trigrams.items():
            if len(arr) >= TRIGRAM_MIN_DOC_FREQ:
                pruned_trigrams[k] = arr
        inverted_trigrams = pruned_trigrams

    os.makedirs(out_dir, exist_ok=True)

    # OPTIMIZED: Write minified JSON (no indent, no ensure_ascii for smaller size)
    with open(DOCS_JSON, "w", encoding="utf-8") as fh:
        json.dump(docs, fh, ensure_ascii=False, separators=(',', ':'))
    with open(INVERTED_TOKENS_JSON, "w", encoding="utf-8") as fh:
        json.dump({k: v for k, v in inverted_tokens.items()}, fh, ensure_ascii=False, separators=(',', ':'))
    with open(INVERTED_TRIGRAMS_JSON, "w", encoding="utf-8") as fh:
        json.dump({k: v for k, v in inverted_trigrams.items()}, fh, ensure_ascii=False, separators=(',', ':'))

    print(f"[INFO] Wrote {len(docs)} docs -> {DOCS_JSON}")
    print(f"[INFO] Wrote inverted tokens -> {INVERTED_TOKENS_JSON} ({len(inverted_tokens)} tokens)")
    print(f"[INFO] Wrote inverted trigrams -> {INVERTED_TRIGRAMS_JSON} ({len(inverted_trigrams)} trigrams)")

    return docs, inverted_tokens, inverted_trigrams

def run():
    global BASE_CONTENT_DIR, OUT_DIR, DOCS_JSON, INVERTED_TOKENS_JSON, INVERTED_TRIGRAMS_JSON

    DOCS_JSON = os.path.join(OUT_DIR, "docs.json")
    INVERTED_TOKENS_JSON = os.path.join(OUT_DIR, "inverted_tokens.json")
    INVERTED_TRIGRAMS_JSON = os.path.join(OUT_DIR, "inverted_trigrams.json")

    build_index(BASE_CONTENT_DIR, OUT_DIR)

if __name__ == "__main__":
    run()