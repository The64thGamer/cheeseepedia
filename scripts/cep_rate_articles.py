#!/usr/bin/env python3
"""
build_article_ratings.py

Scans content/wiki (markdown files), rates each article 0-4 based on:
  - content metric (paragraph count):
      0 -> no article body (0 paragraphs)
      1 -> 1 paragraph
      2 -> 2-3 paragraphs
      3 -> 4-6 paragraphs
      4 -> 7+ paragraphs
  - citations metric (number of citations in frontmatter 'citations' list):
      0 -> 0 citations
      1 -> 1-2 citations
      2 -> 3-5 citations
      3 -> 6-10 citations
      4 -> 11+ citations

Final article rating = min(content_metric_score, citations_metric_score).

Produces:
  - data/graphs/article_ratings.json             (big list containing metadata + scores)
  - data/graphs/article_ratings_by_rating.json   (maps rating -> list of brief entries)
  - data/graphs/article_ratings_by_year.json     (maps start-year -> list of brief entries)
  - data/graphs/article_ratings_by_category.json (maps first-category -> list of brief entries)

Each entry in article_ratings.json contains:
  {
    "title": "...",
    "page_path": "...",
    "startDate": "...",                # raw value from frontmatter if present (string)
    "start_year": 1979,                # integer year if parsable else null
    "first_category": "...",           # first category string or null
    "first_tag": "...",                # first tag string or null
    "contributors_count": 2,           # integer
    "paragraph_count": 5,              # integer paragraphs detected in body
    "citations_count": 8,              # integer
    "content_score": 3,                # 0-4
    "citations_score": 3,              # 0-4
    "rating": 3                        # min(content_score, citations_score)
  }

This script intentionally mirrors the style/robustness of your other build scripts:
  - supports TOML (+++ frontmatter) and YAML (--- frontmatter)
  - tolerant parsing of fields that may be lists or single strings
  - writes compact JSON files suitable for feeding your charting code
"""
from __future__ import annotations
import os
import re
import json
import sys
from typing import Optional, List, Dict, Any
import datetime

# toml/yaml frontmatter parsing (best-effort like in your other script)
try:
    import tomllib as toml  # py3.11+
except Exception:
    try:
        import tomli as toml
    except Exception:
        toml = None

try:
    import yaml
except Exception:
    yaml = None

# ---------- config ----------
BASE_CONTENT_DIR = "content/wiki"
OUT_JSON_DIR = "data"

# ---------- helpers ----------
def read_frontmatter_and_body(path: str) -> (dict, str):
    """
    Return (frontmatter_dict, body_text). If parsing fails returns ({}, full_text).
    Supports TOML (+ + +) and YAML (- - -). Mirrors behavior from your other script.
    """
    with open(path, "rb") as fh:
        raw = fh.read()
    try:
        txt = raw.decode("utf-8")
    except Exception:
        try:
            txt = raw.decode("latin-1")
        except Exception:
            return {}, ""
    txt = txt.lstrip()
    if txt.startswith("+++"):
        parts = re.split(r"(?m)^\+{3}\s*$", txt)
        if len(parts) >= 3:
            fm_text = parts[1]
            body = "".join(parts[2:]).lstrip("\n")
            if toml is None:
                return {}, body
            try:
                data = toml.loads(fm_text)
                return (data if isinstance(data, dict) else {}, body)
            except Exception:
                return {}, body
    elif txt.startswith("---"):
        parts = re.split(r"(?m)^---\s*$", txt)
        if len(parts) >= 3:
            fm_text = parts[1]
            body = "".join(parts[2:]).lstrip("\n")
            if yaml is None:
                return {}, body
            try:
                data = yaml.safe_load(fm_text)
                return (data if isinstance(data, dict) else {}, body)
            except Exception:
                return {}, body
    # no recognized frontmatter
    return {}, txt

def collect_markdown_files(base_dir: str) -> List[str]:
    out = []
    if not os.path.isdir(base_dir):
        return out
    for root, _, files in os.walk(base_dir):
        for fn in files:
            if fn.lower().endswith((".md", ".markdown", ".mdown")):
                out.append(os.path.join(root, fn))
    return out

def normalize_list_field(val) -> List[str]:
    """Return a list of strings for YAML/TOML fields that may be string or list."""
    if val is None:
        return []
    if isinstance(val, (list, tuple)):
        return [str(v).strip() for v in val if v is not None]
    if isinstance(val, str):
        # if commas present, treat as CSV fallback
        if "," in val:
            return [p.strip() for p in val.split(",") if p.strip()]
        # else single string
        s = val.strip()
        return [s] if s != "" else []
    return []

def parse_ymd_year(date_str: Optional[str]) -> Optional[int]:
    """Extract the year integer from YYYY-MM-DD style strings; returns None on failure.
       Mirrors parse_ymd behavior from your other script but simplified.
    """
    if not date_str or not isinstance(date_str, str):
        return None
    s = date_str.strip()
    if s == "":
        return None
    parts = s.split("-")
    try:
        y = int(parts[0])
    except Exception:
        return None
    if y == 0:
        return None
    return y

# ---------- paragraph counting ----------
def count_paragraphs(markdown_body: str) -> int:
    """
    Count paragraph blocks in markdown body.
    Approach:
      - Remove frontmatter (already done by caller).
      - Split on two-or-more newlines (one blank line separates paragraphs).
      - For each block, strip whitespace and ignore:
         * headings (lines starting with '#')
         * blocks that are only short metadata/template (like lines starting with '{{<' or '}}')
         * blocks with fewer than 3 non-whitespace characters are ignored
      - Count blocks that contain at least one word-character (alnum).
    This is a pragmatic heuristic tuned for your content style.
    """
    if not markdown_body:
        return 0
    # normalize newlines
    txt = markdown_body.replace("\r\n", "\n").replace("\r", "\n")
    # split on blank-line boundaries (two or more newlines)
    parts = re.split(r"\n\s*\n+", txt)
    count = 0
    for p in parts:
        s = p.strip()
        if not s:
            continue
        # ignore single-line title-only (e.g., '***Title***' is still content; we'll allow)
        # ignore blocks that are mostly markup: starts with heading or short template
        if re.match(r"^#{1,6}\s+", s):
            # headings are not counted as paragraphs (but a heading followed by text in same block could exist)
            # if the block contains other non-heading lines, count those by checking for a sentence-like pattern
            if "\n" not in s:
                # pure heading only -> skip
                continue
        if re.match(r"^{{<.*?>}}$", s) or s.startswith("{{<") or s.startswith("<!--"):
            # skip pure short template/comment blocks
            # if template is embedded in larger block, it won't match this and thus may be counted
            if len(s.splitlines()) == 1:
                continue
        # require at least one alphanumeric character and at least 10 characters to be considered a paragraph
        if re.search(r"\w", s) and len(re.sub(r"\s+", "", s)) >= 3:
            # treat short single-line footers differently? no — count them
            count += 1
    return count

# ---------- scoring helpers ----------
def score_content_by_paragraphs(paragraph_count: int) -> int:
    """
    Map paragraph_count to score 0-4:
      0 -> 0
      1 -> 1
      2-3 -> 2
      4-6 -> 3
      7+ -> 4
    """
    if paragraph_count <= 0:
        return 0
    if paragraph_count == 1:
        return 1
    if 2 <= paragraph_count <= 3:
        return 2
    if 4 <= paragraph_count <= 6:
        return 3
    return 4

def score_citations_by_count(cite_count: int) -> int:
    """
    Map citation count to score 0-4:
      0 -> 0
      1-2 -> 1
      3-5 -> 2
      6-10 -> 3
      11+ -> 4
    """
    if cite_count <= 0:
        return 0
    if 1 <= cite_count <= 2:
        return 1
    if 3 <= cite_count <= 5:
        return 2
    if 6 <= cite_count <= 10:
        return 3
    return 4

# ---------- IO ----------
def ensure_dirs():
    os.makedirs(OUT_JSON_DIR, exist_ok=True)

def write_json(path: str, obj: Any):
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(obj, fh, indent=2, ensure_ascii=False)

# ---------- main processing ----------
def build_article_ratings(base_dir: str = BASE_CONTENT_DIR) -> List[Dict[str, Any]]:
    files = collect_markdown_files(base_dir)
    out = []
    seen = set()
    for path in files:
        try:
            fm, body = read_frontmatter_and_body(path)
        except Exception:
            # skip file on read error
            continue
        if not fm:
            # keep scanning — it's still an article file even if frontmatter is empty
            # but we still want to rate it: treat as 0 if no content/citations
            fm = {}
        relpath = os.path.relpath(path).replace(os.sep, "/")
        if relpath in seen:
            continue
        seen.add(relpath)

        # Basic metadata
        title = fm.get("title") or os.path.splitext(os.path.basename(path))[0]
        start_raw = fm.get("startDate") or fm.get("startdate") or ""
        start_year = parse_ymd_year(start_raw)
        categories = normalize_list_field(fm.get("categories") or fm.get("Categories") or fm.get("category") or fm.get("Category"))
        tags = normalize_list_field(fm.get("tags") or fm.get("Tags") or fm.get("tag") or fm.get("Tag"))
        contributors = normalize_list_field(fm.get("contributors") or fm.get("Contributors") or fm.get("author") or fm.get("authors"))

        # citations from frontmatter; field commonly 'citations'
        citations = normalize_list_field(fm.get("citations") or fm.get("Citations") or fm.get("sources") or fm.get("source"))
        citations_count = len(citations)

        # paragraph counting from body
        paragraph_count = count_paragraphs(body)

        content_score = score_content_by_paragraphs(paragraph_count)
        citations_score = score_citations_by_count(citations_count)
        rating = min(content_score, citations_score)

        entry = {
            "title": title,
            "page_path": relpath,
            "startDate": start_raw if start_raw is not None else None,
            "start_year": start_year,
            "category": categories[0] if categories else None,
            "tag": tags[0] if tags else None,
            "contributors_count": len(contributors),
            "rating": rating
        }
        out.append(entry)
    return out

def run():
    ensure_dirs()
    entries = build_article_ratings(BASE_CONTENT_DIR)
    # main big JSON
    write_json(os.path.join(OUT_JSON_DIR, "article_ratings.json"), entries)

    print(f"Wrote {len(entries)} article ratings to {OUT_JSON_DIR}", file=sys.stderr)
    print("Files written:", file=sys.stderr)
    print(" - article_ratings.json", file=sys.stderr)
    print(" - article_ratings_by_rating.json", file=sys.stderr)
    print(" - article_ratings_by_year.json", file=sys.stderr)
    print(" - article_ratings_by_category.json", file=sys.stderr)

if __name__ == "__main__":
    run()
