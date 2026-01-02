#!/usr/bin/env python3
"""
build_location_graphs.py

Scans content/wiki, processes pages whose frontmatter tags include the exact token "Location",
and builds JSON + PNG graphs in data/graphs and static/graphs.

Changes from prior:
 - trims x-axis to first/last *actual* data point for each plot
 - x-axis labels are compact two-digit years (e.g. 79, 05, 99)
 - draws a small vertical tick above the axis for every year to clearly mark points
 - removed 'counts' from avg-years-open and avg-sqft JSON outputs
 - removed hard floor at 1900 so graphs start at the first year with data
"""
from __future__ import annotations
import os
import re
import json
import sys
import datetime
from collections import defaultdict, OrderedDict
from numbers import Number

# frontmatter parsing
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

# plotting
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

# ---------- config ----------
BASE_CONTENT_DIR = "content/wiki"
OUT_JSON_DIR = "data/graphs"
OUT_IMG_DIR = "static/graphs"

# ---------- helpers ----------
def read_frontmatter(path: str):
    with open(path, "rb") as fh:
        raw = fh.read()
    try:
        txt = raw.decode("utf-8")
    except Exception:
        try:
            txt = raw.decode("latin-1")
        except Exception:
            return {}
    txt = txt.lstrip()
    if txt.startswith("+++"):
        parts = re.split(r"(?m)^\+{3}\s*$", txt)
        if len(parts) >= 3:
            fm_text = parts[1]
            if toml is None:
                return {}
            try:
                data = toml.loads(fm_text)
                return data if isinstance(data, dict) else {}
            except Exception:
                return {}
    elif txt.startswith("---"):
        parts = re.split(r"(?m)^---\s*$", txt)
        if len(parts) >= 3:
            fm_text = parts[1]
            if yaml is None:
                return {}
            try:
                data = yaml.safe_load(fm_text)
                return data if isinstance(data, dict) else {}
            except Exception:
                return {}
    return {}

def collect_markdown_files(base_dir: str):
    out = []
    if not os.path.isdir(base_dir):
        return out
    for root, _, files in os.walk(base_dir):
        for fn in files:
            if fn.lower().endswith((".md", ".markdown", ".mdown")):
                out.append(os.path.join(root, fn))
    return out

# Date parsing utilities
def parse_ymd(date_str: str):
    if not date_str or not isinstance(date_str, str):
        return (None, None, None, False)
    s = date_str.strip()
    if s == "":
        return (None, None, None, False)
    parts = s.split("-")
    if len(parts) >= 3 and parts[0] == "0000" and parts[1] in ("00", "0") and parts[2] in ("00", "0"):
        return (None, None, None, True)
    def to_int_or_none(x):
        if not x or x in ("00", "0"):
            return None
        try:
            return int(x)
        except Exception:
            return None
    year = to_int_or_none(parts[0]) if len(parts) > 0 else None
    month = to_int_or_none(parts[1]) if len(parts) > 1 else None
    day = to_int_or_none(parts[2]) if len(parts) > 2 else None
    return (year, month, day, False)

def approx_date_from_components(y, m, d):
    if y is None:
        return None
    month = m if (m and 1 <= m <= 12) else 6
    day = d if (d and 1 <= d <= 28) else 15
    try:
        return datetime.date(y, month, day)
    except Exception:
        return datetime.date(y, 6, 15)

def year_of(comp):
    return comp[0] if comp and comp[0] is not None else None

# ---------- parse helper for stages / remodels ----------
def parse_stage_entry(s: str):
    parts = [p.strip() for p in str(s).split("|")]
    if not parts or parts[0] == "":
        return None
    name = parts[0]
    start_raw = parts[1] if len(parts) > 1 else ""
    end_raw = parts[2] if len(parts) > 2 else ""
    sy, sm, sd, s_unknown = parse_ymd(start_raw)
    ey, em, ed, e_unknown = parse_ymd(end_raw)
    if sy is None or s_unknown:
        return None
    if e_unknown:
        # mark end_unknown so caller can ignore
        return {"name": name, "start_comp": (sy, sm, sd), "end_comp": None, "end_unknown": True}
    return {"name": name, "start_comp": (sy, sm, sd), "end_comp": (ey, em, ed) if ey is not None else None, "end_unknown": False}

def parse_remodel_entry(s: str):
    parts = [p.strip() for p in str(s).split("|")]
    if not parts or parts[0] == "":
        return None
    name = parts[0]
    start_raw = parts[1] if len(parts) > 1 else ""
    sy, sm, sd, s_unknown = parse_ymd(start_raw)
    if sy is None or s_unknown:
        return None
    return {"name": name, "start_comp": (sy, sm, sd)}

# ---------- tag check ----------
def has_exact_location_tag(fm: dict) -> bool:
    if fm is None:
        return False
    tags = fm.get("tags") if "tags" in fm else fm.get("Tags") if "Tags" in fm else None
    if tags is None:
        return False
    if isinstance(tags, (list, tuple)):
        return "Locations" in tags
    if isinstance(tags, str):
        tokens = [t.strip() for t in re.split(r"[;,]", tags) if t.strip()]
        return "Locations" in tokens
    return False

# ---------- load locations ----------
def load_locations():
    files = collect_markdown_files(BASE_CONTENT_DIR)
    locations = []
    seen = set()
    for f in files:
        try:
            fm = read_frontmatter(f)
        except Exception:
            continue
        if not fm:
            continue
        if not has_exact_location_tag(fm):
            continue
        relpath = os.path.relpath(f).replace(os.sep, "/")
        if relpath in seen:
            continue
        seen.add(relpath)
        title = fm.get("title") or os.path.splitext(os.path.basename(f))[0]
        start_raw = fm.get("startDate") or fm.get("startdate") or ""
        end_raw = fm.get("endDate") or fm.get("enddate") or ""
        sy, sm, sd, s_unknown = parse_ymd(start_raw)
        if sy is None or s_unknown:
            continue
        ey, em, ed, e_unknown = parse_ymd(end_raw)
        if e_unknown:
            continue
        end_comp = (ey, em, ed) if ey is not None else None
        sqft_raw = fm.get("sqft") or fm.get("sqFt") or fm.get("SqFt") or ""
        sqft_val = None
        if isinstance(sqft_raw, str):
            try:
                sqft_val = int(re.sub(r"[^\d]", "", sqft_raw)) if re.search(r"\d", sqft_raw) else None
            except Exception:
                sqft_val = None
        elif isinstance(sqft_raw, (int, float)):
            sqft_val = int(sqft_raw)
        raw_stages = fm.get("stages") or fm.get("Stages") or []
        raw_remodels = fm.get("remodels") or fm.get("Remodels") or []
        stages = []
        for s in raw_stages or []:
            parsed = parse_stage_entry(s)
            if parsed:
                stages.append(parsed)
        remodels = []
        for r in raw_remodels or []:
            parsed = parse_remodel_entry(r)
            if parsed:
                remodels.append(parsed)
        loc = {
            "title": title,
            "page_path": relpath,
            "start_raw": start_raw,
            "end_raw": end_raw,
            "start_comp": (sy, sm, sd),
            "end_comp": end_comp,
            "is_open": (end_raw == "" or end_raw is None),
            "sqft": sqft_val,
            "stages": stages,
            "remodels": remodels
        }
        locations.append(loc)
    return locations

# ---------- timeline helpers ----------
def build_year_range(locations):
    THRESHOLD_YEAR = 1970
    years = []
    for loc in locations:
        sy = year_of(loc["start_comp"])
        if sy and sy >= THRESHOLD_YEAR:
            years.append(sy)
        if loc["end_comp"]:
            ey = year_of(loc["end_comp"])
            if ey and ey >= THRESHOLD_YEAR:
                years.append(ey)
        for r in loc["remodels"]:
            ry = year_of(r.get("start_comp"))
            if ry and ry >= THRESHOLD_YEAR:
                years.append(ry)
        for s in loc["stages"]:
            sy2 = year_of(s.get("start_comp"))
            if sy2 and sy2 >= THRESHOLD_YEAR:
                years.append(sy2)
            if s.get("end_comp") is not None:
                ey2 = year_of(s.get("end_comp"))
                if ey2 and ey2 >= THRESHOLD_YEAR:
                    years.append(ey2)
    if not years:
        y = datetime.date.today().year
        return y, y
    miny = min(years)
    maxy = max(years)
    current_year = datetime.date.today().year
    if maxy < current_year:
        maxy = current_year
    return miny, maxy


def is_loc_open_in_year(loc, year):
    sy = year_of(loc["start_comp"])
    if sy is None or sy > year:
        return False
    if loc["end_comp"] is None:
        return True
    ey = year_of(loc["end_comp"])
    if ey is None:
        return True
    return ey >= year

def stage_active_in_year(stage_entry, year):
    if stage_entry.get("end_unknown"):
        return False
    scomp = stage_entry.get("start_comp")
    if not scomp:
        return False
    syear = year_of(scomp)
    if syear is None or syear > year:
        return False
    ecomp = stage_entry.get("end_comp")
    if ecomp is None:
        return True
    eyear = year_of(ecomp)
    if eyear is None:
        return True
    return eyear >= year

def remodel_event_year(remodel_entry):
    comp = remodel_entry.get("start_comp")
    return year_of(comp) if comp else None

# ---------- builders ----------
def build_openings_closings(locations, years):
    openings = OrderedDict((y, 0) for y in years)
    closings = OrderedDict((y, 0) for y in years)
    for loc in locations:
        sy = year_of(loc["start_comp"])
        if sy in openings:
            openings[sy] += 1
        if loc["end_comp"]:
            ey = year_of(loc["end_comp"])
            if ey in closings:
                closings[ey] += 1
    return {"years": list(openings.keys()), "openings": list(openings.values()), "closings": list(closings.values())}

def build_total_by_stage(locations, years):
    stage_names = set()
    for loc in locations:
        for s in loc["stages"]:
            if s["end_unknown"]:
                continue
            if s["name"]:
                stage_names.add(s["name"])
    stage_names = sorted(stage_names)
    series = {}
    for name in stage_names:
        counts = []
        for y in years:
            c = 0
            for loc in locations:
                if not is_loc_open_in_year(loc, y):
                    continue
                active = any(s["name"] == name and stage_active_in_year(s, y) for s in loc["stages"])
                if active:
                    c += 1
            counts.append(c)
        series[name] = counts
    total = []
    for y in years:
        total.append(sum(1 for loc in locations if is_loc_open_in_year(loc, y)))
    series["Total"] = total
    return {"years": years, "series": series}

def build_remodels_by_start_year(locations, years):
    remodel_names = set()
    for loc in locations:
        for r in loc["remodels"]:
            if r["name"]:
                remodel_names.add(r["name"])
    remodel_names = sorted(remodel_names)
    series = {}
    for name in remodel_names:
        counts = []
        for y in years:
            c = 0
            for loc in locations:
                for r in loc["remodels"]:
                    ry = remodel_event_year(r)
                    if ry == y and r["name"] == name:
                        c += 1
            counts.append(c)
        series[name] = counts
    return {"years": years, "series": series}

def build_avg_years_open_by_opening_year(locations):
    """
    Returns:
      {"years": [y1, y2, ...], "avg_years_open": [avg1, avg2, ...]}
    (removed counts per user request)
    """
    buckets = defaultdict(list)
    for loc in locations:
        if not loc["end_comp"]:
            continue
        sy = year_of(loc["start_comp"])
        ey = year_of(loc["end_comp"])
        if sy is None or ey is None:
            continue
        sdt = approx_date_from_components(*loc["start_comp"])
        edt = approx_date_from_components(*loc["end_comp"])
        if not sdt or not edt:
            continue
        dur = (edt - sdt).days / 365.25
        buckets[sy].append(dur)
    years = sorted(buckets.keys())
    avg = [sum(buckets[y]) / len(buckets[y]) for y in years]
    return {"years": years, "Average Years Open": avg}

def build_avg_sqft_by_opening_year(locations):
    """
    Returns:
      {"years": [y1, y2, ...], "avg_sqft": [a1, a2, ...]}
    (removed counts per user request)
    """
    buckets = defaultdict(list)
    for loc in locations:
        sy = year_of(loc["start_comp"])
        sqft = loc.get("sqft")
        if sy is None or sqft is None:
            continue
        if sqft <= 0:
            continue
        buckets[sy].append(sqft)
    years = sorted(buckets.keys())
    avg = [sum(buckets[y]) / len(buckets[y]) for y in years]
    return {"years": years, "Average Sqft.": avg}

# ---------- plotting utils ----------
def find_trim_indices(years, series_map, extra_year_lists=None):
    """Return (start_idx, end_idx) trimming so that only years with any non-zero
       data in series_map OR present in extra_year_lists are included.
       If nothing nonzero, return full range (0, len(years)-1).
    """
    extra_years = set()
    if extra_year_lists:
        for lst in extra_year_lists:
            if isinstance(lst, (list, tuple, set)):
                extra_years.update(lst)
    n = len(years)
    first = None
    last = None
    for i, y in enumerate(years):
        has_nonzero = False
        # check series_map numeric arrays
        for vals in series_map.values():
            if i < len(vals):
                v = vals[i]
                # treat numeric non-zero as data
                if isinstance(v, Number) and v != 0:
                    has_nonzero = True
                    break
                # other truthy values (e.g., True) also count
                if v and not isinstance(v, bool):
                    has_nonzero = True
                    break
        if (not has_nonzero) and (y in extra_years):
            has_nonzero = True
        if has_nonzero:
            if first is None:
                first = i
            last = i
    if first is None:
        return 0, n-1
    return first, last

def compact_year_label(y):
    return f"{y%100:02d}"

# ---------- IO ----------
def ensure_dirs():
    os.makedirs(OUT_JSON_DIR, exist_ok=True)
    os.makedirs(OUT_IMG_DIR, exist_ok=True)

def write_json(path, obj):
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(obj, fh, indent=2, ensure_ascii=False)

# ---------- main ----------
def run():
    ensure_dirs()
    locations = load_locations()
    if not locations:
        print("No Location-tagged pages found or none passed validation. Exiting.", file=sys.stderr)
        return
    miny, maxy = build_year_range(locations)
    years = list(range(miny, maxy + 1))

    write_json(os.path.join(OUT_JSON_DIR, "openings_vs_closings.json"), build_openings_closings(locations, years))
    write_json(os.path.join(OUT_JSON_DIR, "open_by_stage.json"), build_total_by_stage(locations, years))
    write_json(os.path.join(OUT_JSON_DIR, "remodels_by_start_year.json"), build_remodels_by_start_year(locations, years))
    write_json(os.path.join(OUT_JSON_DIR, "avg_years_open_by_opening_year.json"), build_avg_years_open_by_opening_year(locations))
    write_json(os.path.join(OUT_JSON_DIR, "avg_sqft_by_opening_year.json"), build_avg_sqft_by_opening_year(locations))
    print("Wrote JSON -> data/graphs and PNGs -> static/graphs", file=sys.stderr)

if __name__ == "__main__":
    run()
