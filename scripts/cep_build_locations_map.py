#!/usr/bin/env python3
"""
scripts/build_locations_data.py

Scan content/ for pages tagged "Locations", normalize frontmatter fields,
filter out pages without lat/lon (or with ["0","0"]) and write data/map_pins.json
for Hugo site.Data consumption.

Usage:
  python3 scripts/build_locations_data.py
"""
from __future__ import annotations
import os
import re
import json
import sys
import datetime
import calendar
from typing import Optional, List, Dict, Any

# toml/yaml frontmatter parsing (try to support common setups)
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

# config (adjust if your repo layout is different)
BASE_CONTENT_DIR = "content"
OUT_JSON_DIR = "data"
OUT_JSON_FILE = "map_pins.json"

DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")

# ---------------- helpers ----------------
def read_frontmatter_and_body(path: str) -> (dict, str):
    """Return (frontmatter_dict, body_text). Supports TOML (+++) or YAML (---)."""
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
    if txt.startswith("---"):
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
    if val is None:
        return []
    if isinstance(val, (list, tuple)):
        return [str(v).strip() for v in val if v is not None and str(v).strip() != ""]
    if isinstance(val, str):
        if "|" in val and not "," in val:
            return [p.strip() for p in val.split("|") if p.strip()]
        if "," in val:
            return [p.strip() for p in val.split(",") if p.strip()]
        s = val.strip()
        return [s] if s != "" else []
    return []

def parse_latlon_field(val) -> Optional[List[str]]:
    """
    Try to normalize latitudeLongitude from frontmatter into [lat_str, lon_str].
    Accept list-like, CSV, or 'lat,lon' string.
    """
    if val is None:
        return None
    if isinstance(val, (list, tuple)):
        if len(val) >= 2:
            return [str(val[0]).strip(), str(val[1]).strip()]
        return None
    if isinstance(val, str):
        s = val.strip()
        if s.startswith("[") and s.endswith("]"):
            inner = s[1:-1]
            parts = re.split(r"\s*,\s*", inner)
            parts = [p.strip().strip('"').strip("'") for p in parts if p.strip()]
            if len(parts) >= 2:
                return [parts[0], parts[1]]
            return None
        if "," in s:
            parts = [p.strip() for p in s.split(",")]
            if len(parts) >= 2:
                return [parts[0], parts[1]]
        if " " in s:
            parts = [p.strip() for p in s.split() if p.strip()]
            if len(parts) >= 2:
                return [parts[0], parts[1]]
    return None

def is_zero_coord(latlon_list: List[str]) -> bool:
    try:
        lat = float(latlon_list[0])
        lon = float(latlon_list[1])
        return abs(lat) < 1e-9 and abs(lon) < 1e-9
    except Exception:
        return False

def normalize_date(field_val: Optional[str], kind: str = "start") -> Optional[str]:
    if not field_val or not isinstance(field_val, str):
        return None
    s = field_val.strip()
    parts = s.split("-")
    if len(parts) < 3:
        return None
    try:
        year = int(parts[0])
        month = int(parts[1])
        day = int(parts[2])
    except Exception:
        return None
    if year <= 0:
        return None

    if kind == "start":
        if month == 0:
            month = 1
            day = 1
        elif day == 0:
            day = 1
    elif kind == "cu":
        if month == 0:
            month = 1
        if day == 0:
            day = 1
    elif kind == "end":
        if month == 0:
            month = 12
            day = 31
        elif day == 0:
            last_day = calendar.monthrange(year, month)[1]
            day = last_day

    try:
        dt = datetime.date(year, month, day)
    except Exception:
        month = max(1, min(12, month))
        last_day = calendar.monthrange(year, month)[1]
        day = max(1, min(last_day, day if day != 0 else 1))
        dt = datetime.date(year, month, day)
    return dt.isoformat()

def guess_url_from_path(content_path: str, fm: dict) -> str:
    for key in ("url", "permalink", "relpermalink"):
        v = fm.get(key)
        if v and isinstance(v, str) and v.strip():
            return v.strip()

    rel = os.path.relpath(content_path, BASE_CONTENT_DIR).replace(os.sep, "/")
    rel = re.sub(r"\.(md|markdown|mdown)$", "", rel, flags=re.IGNORECASE)
    base = os.path.basename(rel).lower()
    if base in ("index", "_index"):
        rel = os.path.dirname(rel)
    rel = "/" + rel.strip("/")
    rel = rel + "/"
    return rel

def ensure_dirs():
    os.makedirs(OUT_JSON_DIR, exist_ok=True)

def write_json(path: str, obj: Any):
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(obj, fh, indent=2, ensure_ascii=False)

# ---------------- main ----------------
def build_locations(base_dir: str = BASE_CONTENT_DIR) -> List[Dict[str, Any]]:
    files = collect_markdown_files(base_dir)
    out = []
    seen = set()
    for path in files:
        try:
            fm, body = read_frontmatter_and_body(path)
        except Exception:
            continue
        if not fm:
            fm = {}

        # type is now a plain string (old tags[0])
        page_type = str(fm.get("type") or fm.get("Type") or "").strip()
        if page_type.lower() != "locations":
            continue

        relpath = os.path.relpath(path).replace(os.sep, "/")
        if relpath in seen:
            continue
        seen.add(relpath)

        title = fm.get("title") or os.path.splitext(os.path.basename(path))[0]

        # tags is now the franchise/category array (old categories)
        group = normalize_list_field(fm.get("tags") or fm.get("Tags") or fm.get("tag") or fm.get("Tag"))

        raw_latlon = fm.get("latitudeLongitude") or fm.get("latlong") or fm.get("latitude_longitude")
        latlon = parse_latlon_field(raw_latlon)
        if not latlon:
            continue
        if is_zero_coord(latlon):
            continue
        try:
            coords = [float(latlon[0]), float(latlon[1])]
        except Exception:
            continue

        start_raw = fm.get("startDate") or fm.get("startdate") or ""
        end_raw = fm.get("endDate") or fm.get("enddate") or ""
        cu_raw = fm.get("cuDate") or fm.get("cudate") or ""

        start_norm = normalize_date(start_raw, kind="start") or "1970-01-01"
        end_norm = normalize_date(end_raw, kind="end") or "9999-12-31"
        cu_norm = normalize_date(cu_raw, kind="cu") or "1992-01-01"

        url = guess_url_from_path(path, fm)

        entry = {
            "title": title,
            "group": group,
            "coords_str": latlon,
            "coords": coords,
            "url": url,
            "startDate": start_norm,
            "endDate": end_norm,
            "cuDate": cu_norm,
            "page_path": relpath
        }
        out.append(entry)
    return out

def run():
    ensure_dirs()
    entries = build_locations(BASE_CONTENT_DIR)
    payload = {
        "generated_at": datetime.datetime.utcnow().replace(microsecond=0).isoformat() + "Z",
        "count": len(entries),
        "locations": entries
    }
    out_path = os.path.join(OUT_JSON_DIR, OUT_JSON_FILE)
    write_json(out_path, payload)
    print(f"Wrote {len(entries)} locations to {out_path}", file=sys.stderr)

if __name__ == "__main__":
    run()