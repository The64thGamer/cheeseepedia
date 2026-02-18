#!/usr/bin/env python3
from __future__ import annotations
import os
import sys
import re
import json
from collections import defaultdict
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
OUT_DIR_THEORYWEB = "static/data/search/theoryweb"
THEORYWEB_DIR = os.path.join("content", "theoryweb")

MIN_TOKEN_LEN = 2
TRIGRAM_MIN_DOC_FREQ = 1
EXCERPT_LEN = 150
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
    return [t for t in s.split() if len(t) >= MIN_TOKEN_LEN]

def char_trigrams(s: str):
    if not s:
        return set()
    s = normalize_text(s)
    padded = f"  {s}  "
    trigrams = set()
    for i in range(len(padded) - 2):
        tri = padded[i:i+3]
        if tri.strip():
            trigrams.add(tri)
    return trigrams

def collect_content_files(base_dir=BASE_CONTENT_DIR):
    out = []
    base = Path(base_dir)
    if not base.exists():
        print(f"[WARN] content base dir not found: {base_dir}", file=sys.stderr)
        return out
    for ext in ("*.md", "*.markdown", "*.mdown"):
        for p in base.rglob(ext):
            out.append(str(p))
    return sorted(set(out))

def excerpt_text(s: str, length=EXCERPT_LEN):
    if not s:
        return ""
    s = s.strip()
    if len(s) <= length:
        return s
    cut = s[:length].rsplit(" ", 1)[0]
    return cut + "…"

def is_in_theoryweb_dir(path_str: str) -> bool:
    p = Path(path_str).resolve()
    try:
        return str(p).startswith(str(Path(THEORYWEB_DIR).resolve()))
    except Exception:
        return THEORYWEB_DIR in str(path_str)

# ----------------- Core index builder for a file list -----------------
def build_index_from_files(files: list, out_dir: str):
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
        fm_parsed = fm if isinstance(fm, dict) else {"__raw": str(fm)}

        fulltext = " ".join([str(title), body])
        toks = tokenize(fulltext)
        trigs = char_trigrams(fulltext)

        doc = {
            "id": doc_id,
            "title": str(title),
            "path": normalize_page_path(path),
            "excerpt": excerpt_text(body),
            "tokens": toks,
            "trigrams": list(trigs),
            "frontmatter": fm_parsed,
        }
        docs.append(doc)

        seen_tokens = set()
        for t in toks:
            if t in seen_tokens:
                continue
            inverted_tokens[t].append(doc_id)
            seen_tokens.add(t)
        for tri in trigs:
            inverted_trigrams[tri].append(doc_id)

    if TRIGRAM_MIN_DOC_FREQ > 1:
        inverted_trigrams = {k: v for k, v in inverted_trigrams.items() if len(v) >= TRIGRAM_MIN_DOC_FREQ}

    os.makedirs(out_dir, exist_ok=True)

    docs_path = os.path.join(out_dir, "docs.json")
    tokens_path = os.path.join(out_dir, "inverted_tokens.json")
    trigrams_path = os.path.join(out_dir, "inverted_trigrams.json")

    with open(docs_path, "w", encoding="utf-8") as fh:
        json.dump(docs, fh, ensure_ascii=False, separators=(',', ':'))
    with open(tokens_path, "w", encoding="utf-8") as fh:
        json.dump(dict(inverted_tokens), fh, ensure_ascii=False, separators=(',', ':'))
    with open(trigrams_path, "w", encoding="utf-8") as fh:
        json.dump(dict(inverted_trigrams), fh, ensure_ascii=False, separators=(',', ':'))

    print(f"[INFO] Wrote {len(docs)} docs -> {docs_path}")
    print(f"[INFO] Wrote inverted tokens -> {tokens_path} ({len(inverted_tokens)} tokens)")
    print(f"[INFO] Wrote inverted trigrams -> {trigrams_path} ({len(inverted_trigrams)} trigrams)")

    return docs, inverted_tokens, inverted_trigrams

# ----------------- Entry point -----------------
def build_index(base_dir=BASE_CONTENT_DIR):
    all_files = collect_content_files(base_dir)
    print(f"[INFO] Found {len(all_files)} markdown files under {base_dir}")

    main_files = [f for f in all_files if not is_in_theoryweb_dir(f)]
    tw_files = [f for f in all_files if is_in_theoryweb_dir(f)]

    print(f"[INFO] Main site: {len(main_files)} files | Theoryweb: {len(tw_files)} files")

    print(f"[INFO] Building main site index -> {OUT_DIR}")
    build_index_from_files(main_files, OUT_DIR)

    print(f"[INFO] Building theoryweb index -> {OUT_DIR_THEORYWEB}")
    build_index_from_files(tw_files, OUT_DIR_THEORYWEB)

def run():
    build_index(BASE_CONTENT_DIR)

if __name__ == "__main__":
    run()