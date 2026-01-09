#!/usr/bin/env python3
"""
Build a fuzzy-capable search index for Hugo content.

Outputs:
  - data/search/docs.json            : list of doc objects (id, title, path, excerpt, tokens, trigrams, frontmatter dict if parsed)
  - data/search/inverted_tokens.json : mapping token -> [doc_id, ...]
  - data/search/inverted_trigrams.json: mapping trigram -> [doc_id, ...]

Indexing approach:
 - Tokenize words (simple word tokens, lowercased, punctuation stripped)
 - Character trigrams (sliding window) of the normalized fulltext are used for fuzzy matching
 - Search scoring: weighted combination of trigram Jaccard and token overlap, with a title match boost.
 - Supports minus-exclusions in queries: tokens prefixed with '-' will remove docs containing that token.

Usage:
  python3 scripts/build_search_index.py --build
  python3 scripts/build_search_index.py --query "pizza -concord"

Config (at top of script): adjust BASE_CONTENT_DIR, OUT_DIR, MIN_TOKEN_LEN etc.
"""
from __future__ import annotations
import os
import sys
import re
import json
import argparse
from collections import defaultdict, Counter
from pathlib import Path

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
BASE_CONTENT_DIR = "content"      # directory to scan (recurses)
OUT_DIR = "static/data/search"               # output JSON files
DOCS_JSON = os.path.join(OUT_DIR, "docs.json")
INVERTED_TOKENS_JSON = os.path.join(OUT_DIR, "inverted_tokens.json")
INVERTED_TRIGRAMS_JSON = os.path.join(OUT_DIR, "inverted_trigrams.json")

MIN_TOKEN_LEN = 2         # min token length to keep
TRIGRAM_MIN_DOC_FREQ = 1  # keep trigrams that occur in at least this many docs (1 => keep all)
EXCERPT_LEN = 220         # characters for excerpt
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
    # fallback
    return raw.decode("utf-8", errors="ignore")
def normalize_page_path(path: str):
    """
    Convert 'content/foo/bar.md' -> 'foo/bar'
    Removes BASE_CONTENT_DIR prefix and markdown extension.
    """
    rel = os.path.relpath(path).replace(os.sep, "/")
    # remove base content dir
    if rel.startswith(BASE_CONTENT_DIR + "/"):
        rel = rel[len(BASE_CONTENT_DIR)+1:]
    # remove extension
    rel = re.sub(r"\.(md|markdown|mdown)$", "", rel, flags=re.IGNORECASE)
    return rel

# Frontmatter parsing: support TOML (+++ ... +++) and YAML (--- ... ---).
def read_frontmatter_and_body(path: str):
    raw = read_file_bytes(path)
    txt = decode_text(raw).lstrip()
    if txt.startswith("+++"):
        # TOML frontmatter block
        parts = re.split(r"(?m)^\+{3}\s*$", txt)
        if len(parts) >= 3:
            fm_text = parts[1]
            body = parts[2]
            if toml is not None:
                try:
                    fm = toml.loads(fm_text)
                except Exception:
                    fm = {"__raw": fm_text}
            else:
                fm = {"__raw": fm_text}
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
                    fm = {"__raw": fm_text}
            else:
                fm = {"__raw": fm_text}
            return fm, body.strip()
    # no frontmatter, return empty dict and whole text as body
    return {}, txt

# Normalize text for tokenization and trigram generation
RE_NON_WORD = re.compile(r"[^\w\s]", re.UNICODE)
RE_WHITESPACE = re.compile(r"\s+", re.UNICODE)
def normalize_text(s: str) -> str:
    if not s:
        return ""
    s = s.lower()
    # replace punctuation with spaces
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
    """Return set of character trigrams for string s (normalized)."""
    if not s:
        return set()
    n = 3
    s = normalize_text(s)
    # also pad with spaces so start/end are captured
    padded = f"  {s}  "
    trigrams = set()
    for i in range(len(padded) - n + 1):
        tri = padded[i:i+n]
        if tri.strip():  # skip all-space trigram
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
    # include other markdown extensions
    for ext in (".markdown", ".mdown"):
        for p in base.rglob(f"*{ext}"):
            out.append(str(p))
    # dedupe and sort
    out = sorted(set(out))
    return out

def excerpt_text(s: str, length=EXCERPT_LEN):
    if not s:
        return ""
    s = s.strip()
    if len(s) <= length:
        return s
    # attempt to cut at word boundary
    cut = s[:length].rsplit(" ", 1)[0]
    return cut + "…"

# ----------------- Index builder -----------------
def build_index(base_dir=BASE_CONTENT_DIR, out_dir=OUT_DIR):
    files = collect_content_files(base_dir)
    print(f"[INFO] Found {len(files)} markdown files under {base_dir}")

    docs = []  # list of doc dicts
    inverted_tokens = defaultdict(list)   # token -> [doc_id]
    inverted_trigrams = defaultdict(list) # trigram -> [doc_id]

    for doc_id, path in enumerate(files):
        try:
            fm, body = read_frontmatter_and_body(path)
        except Exception as e:
            print(f"[ERROR] reading {path}: {e}", file=sys.stderr)
            fm, body = {}, ""

        # prefer explicit frontmatter title else file basename
        title = fm.get("title") or fm.get("Title") or Path(path).stem
        # tags/categories if available (keep as-is; frontmatter may be dict/list)
        tags = fm.get("tags") or fm.get("Tags") or fm.get("categories") or fm.get("Categories") or []
        # We will also include the entire frontmatter serialized for context if parsers worked
        fm_parsed = fm if isinstance(fm, dict) else {"__raw": str(fm)}

        # combine body + frontmatter textual params into a single "searchable" blob
        # include common frontmatter keys that are often useful as text context
        fm_text_parts = []
        for k in ("title","storeNumber","startDate","endDate","sqft","stages","remodels"):
            v = fm.get(k) or fm.get(k.title()) or fm.get(k.upper())
            if v:
                fm_text_parts.append(str(v))
        fm_text = " ".join(fm_text_parts)
        fulltext = " ".join([title, fm_text, body])

        toks = tokenize(fulltext)
        trigs = char_trigrams(fulltext)

        doc = {
            "id": doc_id,
            "title": str(title),
            "path": normalize_page_path(path),
            "excerpt": excerpt_text(body),
            "tokens": toks,
            "trigrams": list(trigs),
            "tags": tags,
            "frontmatter": fm_parsed
        }
        docs.append(doc)

        # fill inverted indices
        seen_tokens = set()
        for t in toks:
            if t in seen_tokens:
                continue
            inverted_tokens[t].append(doc_id)
            seen_tokens.add(t)
        # trigrams
        for tri in trigs:
            inverted_trigrams[tri].append(doc_id)

    # Optionally prune trigrams that are too rare (keeps index size lower)
    if TRIGRAM_MIN_DOC_FREQ > 1:
        pruned_trigrams = {}
        for k, arr in inverted_trigrams.items():
            if len(arr) >= TRIGRAM_MIN_DOC_FREQ:
                pruned_trigrams[k] = arr
        inverted_trigrams = pruned_trigrams

    # ensure output dir exists
    os.makedirs(out_dir, exist_ok=True)

    # write JSON (convert keys -> lists)
    with open(DOCS_JSON, "w", encoding="utf-8") as fh:
        json.dump(docs, fh, indent=2, ensure_ascii=False)
    with open(INVERTED_TOKENS_JSON, "w", encoding="utf-8") as fh:
        json.dump({k: v for k, v in inverted_tokens.items()}, fh, indent=2, ensure_ascii=False)
    with open(INVERTED_TRIGRAMS_JSON, "w", encoding="utf-8") as fh:
        json.dump({k: v for k, v in inverted_trigrams.items()}, fh, indent=2, ensure_ascii=False)

    print(f"[INFO] Wrote {len(docs)} docs -> {DOCS_JSON}")
    print(f"[INFO] Wrote inverted tokens -> {INVERTED_TOKENS_JSON} ({len(inverted_tokens)} tokens)")
    print(f"[INFO] Wrote inverted trigrams -> {INVERTED_TRIGRAMS_JSON} ({len(inverted_trigrams)} trigrams)")

    return docs, inverted_tokens, inverted_trigrams

# ----------------- Search utilities (in-memory) -----------------
def load_index(out_dir=OUT_DIR):
    with open(DOCS_JSON, "r", encoding="utf-8") as fh:
        docs = json.load(fh)
    with open(INVERTED_TOKENS_JSON, "r", encoding="utf-8") as fh:
        inverted_tokens = json.load(fh)
    with open(INVERTED_TRIGRAMS_JSON, "r", encoding="utf-8") as fh:
        inverted_trigrams = json.load(fh)
    # convert inverted lists to sets for faster operations
    inv_tok_sets = {k: set(v) for k, v in inverted_tokens.items()}
    inv_tri_sets = {k: set(v) for k, v in inverted_trigrams.items()}
    return docs, inv_tok_sets, inv_tri_sets

def jaccard(a: set, b: set) -> float:
    if not a or not b:
        return 0.0
    inter = len(a & b)
    union = len(a | b)
    return inter / union if union else 0.0

def search_query(q: str, docs, inv_tokens, inv_trigrams, top_n=20):
    """
    Query grammar:
      - terms separated by whitespace
      - prefix a term with '-' to exclude docs that contain that token
    Matching:
      - compute char-trigrams of query and tokens
      - rank by weighted score: 0.7*trigram_jaccard + 0.3*token_overlap + title_boost
    Returns top_n docs with scores.
    """
    raw = q or ""
    # split into positive and negative tokens
    parts = raw.strip().split()
    pos_terms = []
    neg_terms = []
    for p in parts:
        p = p.strip()
        if not p:
            continue
        if p.startswith("-") and len(p) > 1:
            neg_terms.append(p[1:].lower())
        else:
            pos_terms.append(p.lower())

    # normalized sets for query
    query_text = " ".join(parts)
    q_toks = set(tokenize(query_text))  # word tokens
    q_tris = char_trigrams(query_text)

    # Candidate doc ids: union of inverted indices for tokens + trigrams to limit search space
    candidate_ids = set()
    for t in q_toks:
        if t in inv_tokens:
            candidate_ids.update(inv_tokens[t])
    for tri in q_tris:
        if tri in inv_trigrams:
            candidate_ids.update(inv_trigrams[tri])

    # if no candidates found via inverted indices, fall back to brute force all docs
    if not candidate_ids:
        candidate_ids = set(d["id"] for d in docs)

    results = []
    for doc_id in candidate_ids:
        doc = docs[doc_id]
        doc_toks = set(doc.get("tokens", []))
        doc_tris = set(doc.get("trigrams", []))

        # apply neg_terms: if any neg term present in doc tokens -> skip
        skip = False
        for nt in neg_terms:
            if nt in doc_toks:
                skip = True
                break
        if skip:
            continue

        # compute scores
        t_jacc = jaccard(q_tris, doc_tris)
        tok_overlap = 0.0
        if q_toks:
            tok_overlap = len(q_toks & doc_toks) / len(q_toks)

        # title boost if any query token appears in title
        title = doc.get("title", "").lower()
        title_boost = 0.0
        for t in q_toks:
            if t and t in title:
                title_boost = 0.12
                break

        score = 0.72 * t_jacc + 0.26 * tok_overlap + title_boost
        results.append((score, doc))

    # sort by score descending
    results.sort(key=lambda x: x[0], reverse=True)
    return results[:top_n]

def run():
    global BASE_CONTENT_DIR, OUT_DIR, DOCS_JSON, INVERTED_TOKENS_JSON, INVERTED_TRIGRAMS_JSON

    DOCS_JSON = os.path.join(OUT_DIR, "docs.json")
    INVERTED_TOKENS_JSON = os.path.join(OUT_DIR, "inverted_tokens.json")
    INVERTED_TRIGRAMS_JSON = os.path.join(OUT_DIR, "inverted_trigrams.json")

    build_index(BASE_CONTENT_DIR, OUT_DIR)


if __name__ == "__main__":
    run()
