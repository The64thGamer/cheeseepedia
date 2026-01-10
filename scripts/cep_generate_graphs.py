#!/usr/bin/env python3
"""
build_location_graphs.py

Scans content/wiki (and other pages), processes pages and builds JSON graphs.
Added: scans pages tagged "Showtapes", parses mediaDuration (H:MM:SS / MM:SS / :SS / SS),
converts to decimal hours, groups by start year, and writes two JSONs:
 - avg_media_duration_ce_showbiz.json  (Creative Engineering + ShowBiz Pizza Place)
 - avg_media_duration_ptt_cec.json     (Pizza Time Theatre + Chuck E. Cheese's)

Also: reads data/article_ratings.json and produces:
 - article_ratings_counts.json
 - article_ratings_score_by_year.json
 - article_ratings_score_by_category.json
 - article_ratings_score_by_tag.json
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

# plotting (left in place for other scripts that might produce PNGs)
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

# ---------- config ----------
BASE_CONTENT_DIR = "content/wiki"
OUT_JSON_DIR = "data/graphs"
ARTICLE_RATINGS_JSON = os.path.join("data", "article_ratings.json")

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

# Date parsing utilities (kept from original)
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

# ---------- parse helper for stages / remodels (preserved) ----------
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

# ---------- tag/category checks ----------
def has_exact_tag(fm: dict, token: str) -> bool:
    if fm is None:
        return False
    tags = fm.get("tags") if "tags" in fm else fm.get("Tags") if "Tags" in fm else None
    if tags is None:
        return False
    if isinstance(tags, (list, tuple)):
        return token in tags
    if isinstance(tags, str):
        tokens = [t.strip() for t in re.split(r"[;,]", tags) if t.strip()]
        return token in tokens
    return False

def normalize_categories(cat_field):
    """Return a list of category strings, normalized and stripped."""
    if cat_field is None:
        return []
    if isinstance(cat_field, (list, tuple)):
        return [str(c).strip() for c in cat_field if c is not None]
    if isinstance(cat_field, str):
        # YAML/toml might store a single string; split on commas if present
        if "," in cat_field:
            return [c.strip() for c in cat_field.split(",") if c.strip()]
        return [cat_field.strip()]
    return []

# ---------- load locations (original) ----------
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

# ---------- timeline helpers (preserved) ----------
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

# ---------- builders (preserved) ----------
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

# ---------- NEW: mediaDuration parsing & showtapes loading ----------
def parse_media_duration_to_minutes(s: str):
    """
    Parse a duration like "1:52:23", "42:52", "4:20", ":52", "52" into total minutes (float).
    """
    if s is None:
        return None
    if not isinstance(s, str):
        s = str(s)
    s = s.strip()
    if s == "":
        return None

    m = re.match(r"^([\d:\s]+)", s)
    core = m.group(1).strip() if m else s

    parts = [p.strip() for p in core.split(":")]
    parts = [p for p in parts if p != ""]

    nums = []
    for p in parts:
        mm = re.search(r"(\d+)", p)
        if mm:
            nums.append(int(mm.group(1)))

    h = m = sec = 0
    if len(nums) >= 3:
        h, m, sec = nums[-3], nums[-2], nums[-1]
    elif len(nums) == 2:
        m, sec = nums
    elif len(nums) == 1:
        sec = nums[0]
    else:
        return None

    total_minutes = (h * 60) + m + (sec / 60.0)
    return total_minutes

def load_showtapes_pages(base_dir=BASE_CONTENT_DIR):
    """
    Return list of dicts for pages tagged "Showtapes". Each dict includes:
      - title
      - page_path
      - start_comp
      - categories (list)
      - mediaDuration_raw
      - mediaDuration_hours (float or None)
    """
    files = collect_markdown_files(base_dir)
    pages = []
    seen = set()
    for f in files:
        try:
            fm = read_frontmatter(f)
        except Exception:
            continue
        if not fm:
            continue
        is_showtape = has_exact_tag(fm, "Showtapes")
        is_live = has_exact_tag(fm, "Live Shows")

        if not (is_showtape or is_live):
            continue

        relpath = os.path.relpath(f).replace(os.sep, "/")
        if relpath in seen:
            continue
        seen.add(relpath)
        title = fm.get("title") or os.path.splitext(os.path.basename(f))[0]
        start_raw = fm.get("startDate") or fm.get("startdate") or ""
        sy, sm, sd, s_unknown = parse_ymd(start_raw)
        if sy is None or s_unknown:
            # skip pages w/o a usable start year
            continue
        categories = normalize_categories(fm.get("categories") or fm.get("Categories") or fm.get("category") or fm.get("Category"))
        media_raw = fm.get("mediaDuration") or fm.get("media_duration") or fm.get("duration") or fm.get("MediaDuration")
        media_minutes = parse_media_duration_to_minutes(media_raw)
        page = {
            "title": title,
            "page_path": relpath,
            "start_raw": start_raw,
            "start_comp": (sy, sm, sd),
            "categories": categories,
            "tags": fm.get("tags") or fm.get("Tags") or [],
            "mediaDuration_raw": media_raw,
            "mediaDuration_minutes": media_minutes
        }
        pages.append(page)
    return pages

def build_avg_media_duration_live_shows(pages, category_filter_set):
    buckets = defaultdict(list)

    for p in pages:
        tags = p.get("tags") or []
        if "Live Shows" not in tags:
            continue

        cats = p.get("categories") or []
        if not any(c in category_filter_set for c in cats):
            continue

        sy = year_of(p.get("start_comp"))
        if sy is None:
            continue

        minutes = p.get("mediaDuration_minutes")
        if not minutes or minutes <= 0:
            continue

        buckets[sy].append(minutes)

    years = sorted(buckets.keys())
    avg = [round(sum(buckets[y]) / len(buckets[y]), 2) for y in years]

    return {
        "years": years,
        "Average Media Duration (Minutes)": avg
    }


# ---------- NEW: build average media duration by start year ----------
def build_avg_media_duration_by_start_year(pages, category_filter_set, require_live_shows=False):
    """
    Returns average media duration in MINUTES.
    """
    buckets = defaultdict(list)

    for p in pages:
        cats = [c.strip() for c in (p.get("categories") or []) if isinstance(c, str)]
        if not cats:
            continue

        if not any(c in category_filter_set for c in cats):
            continue

        if require_live_shows and "Live Shows" not in (p.get("tags") or []):
            continue

        sy = year_of(p.get("start_comp"))
        if sy is None:
            continue

        minutes = p.get("mediaDuration_minutes")
        if not minutes or minutes <= 0:
            continue

        buckets[sy].append(minutes)

    years = sorted(buckets.keys())
    avg = [round(sum(buckets[y]) / len(buckets[y]), 2) for y in years]

    return {
        "years": years,
        "Average Media Duration (Minutes)": avg
    }

# ---------- plotting utils (preserved) ----------
def find_trim_indices(years, series_map, extra_year_lists=None):
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

# ---------- NEW: Article ratings derived graphs ----------
RATING_LABELS = {
    0: "Empty",
    1: "Very Bad",
    2: "Bad",
    3: "Good",
    4: "Great"
}

def load_article_ratings(path=ARTICLE_RATINGS_JSON):
    """
    Load the article_ratings.json produced by your article rating script.
    Returns list of entries (dicts). If file missing, returns [].
    """
    if not os.path.isfile(path):
        return []
    try:
        with open(path, "r", encoding="utf-8") as fh:
            data = json.load(fh)
            if isinstance(data, list):
                return data
            # If someone wrote object with entries inside, try to handle it gracefully
            if isinstance(data, dict) and "entries" in data and isinstance(data["entries"], list):
                return data["entries"]
    except Exception as e:
        print("Error loading article ratings:", e, file=sys.stderr)
    return []

def build_ratings_count_series(entries):
    """
    Count of articles in each rating 0-4.
    Returns object suitable for pie:
      {"series": {"Empty": 10, ...}, "labels": [...], "values":[...]}
    """
    counts = {lbl: 0 for lbl in RATING_LABELS.values()}
    for e in entries:
        r = e.get("rating")
        try:
            r = int(r)
        except Exception:
            r = None
        if r is None or r not in RATING_LABELS:
            # treat missing as 0 (Empty)
            counts[RATING_LABELS[0]] += 1
        else:
            counts[RATING_LABELS[r]] += 1
    labels = list(RATING_LABELS[i] for i in sorted(RATING_LABELS.keys()))
    values = [counts.get(lbl, 0) for lbl in labels]
    return {"series": dict(zip(labels, values)), "labels": labels, "values": values}

# helper: get first meaningful value from several possible keys (string or list)
def _get_first_field(entry, keys):
    """
    entry: dict
    keys: iterable of candidate field names (try in order)
    Returns first non-empty string found, or None.
    """
    for k in keys:
        if k not in entry:
            continue
        v = entry.get(k)
        if v is None:
            continue
        if isinstance(v, (list, tuple)) and len(v) > 0:
            first = v[0]
            if first is not None and str(first).strip() != "":
                return str(first).strip()
        if isinstance(v, str):
            s = v.strip()
            if s != "":
                return s
        # if it's another type (int etc), coerce to string
        try:
            s = str(v).strip()
            if s != "":
                return s
        except Exception:
            continue
    return None

def build_total_rating_by_year(entries):
    """
    Sum of rating numbers per start year.
    Returns: {"years": [...], "Total Rating": [...]}
    Years start at 1970 (threshold) and go through current year.
    Entries with missing/invalid start_year are ignored.
    """
    THRESHOLD_YEAR = 1970
    buckets = defaultdict(int)
    years_present = []
    for e in entries:
        y = e.get("start_year")
        try:
            if y is None:
                continue
            y = int(y)
        except Exception:
            continue
        buckets[y] += int(e.get("rating") or 0)
        years_present.append(y)

    if not years_present:
        return {"years": [], "Total Rating": []}

    miny = min(years_present)
    maxy = max(years_present)
    # enforce threshold like build_year_range
    if miny < THRESHOLD_YEAR:
        miny = THRESHOLD_YEAR
    current_year = datetime.date.today().year
    if maxy < current_year:
        maxy = current_year

    years = list(range(miny, maxy + 1))
    totals = [buckets.get(y, 0) for y in years]
    return {"years": years, "Total Rating": totals}

def build_avg_rating_by_category(entries):
    """
    Average rating grouped by first category.
    Rating 0 articles are ignored (not summed and not counted).
    Returns: {"series": {category: avg_rating}}
    """
    rating_sum = defaultdict(int)
    count = defaultdict(int)

    for e in entries:
        cat = _get_first_field(e, ("first_category", "category", "categories"))
        if not cat:
            cat = "uncategorized"

        r = e.get("rating")
        if r is None:
            continue

        r = int(r)
        if r <= 0:
            continue  # <-- ignore empty / unrated articles

        rating_sum[cat] += r
        count[cat] += 1

    series = {}
    for cat in rating_sum:
        if count[cat] > 0:
            series[cat] = round(rating_sum[cat] / count[cat], 2)

    series = OrderedDict(
        sorted(series.items(), key=lambda kv: kv[1], reverse=True)
    )

    return {"series": series}


def build_avg_rating_by_tag(entries):
    """
    Average rating grouped by first tag.
    Rating 0 articles are ignored (not summed and not counted).
    Returns: {"series": {tag: avg_rating}}
    """
    rating_sum = defaultdict(int)
    count = defaultdict(int)

    for e in entries:
        tag = _get_first_field(e, ("first_tag", "tag", "tags"))
        if not tag:
            tag = "untagged"

        r = e.get("rating")
        if r is None:
            continue

        r = int(r)
        if r <= 0:
            continue  # <-- ignore empty / unrated articles

        rating_sum[tag] += r
        count[tag] += 1

    series = {}
    for tag in rating_sum:
        if count[tag] > 0:
            series[tag] = round(rating_sum[tag] / count[tag], 2)

    series = OrderedDict(
        sorted(series.items(), key=lambda kv: kv[1], reverse=True)
    )

    return {"series": series}


# ---------- IO ----------
def ensure_dirs():
    os.makedirs(OUT_JSON_DIR, exist_ok=True)

def write_json(path, obj):
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(obj, fh, indent=2, ensure_ascii=False)

# ---------- main ----------
def run():
    ensure_dirs()
    # original location-based graphs
    locations = load_locations()
    if not locations:
        print("No Location-tagged pages found or none passed validation. Exiting (no location graphs).", file=sys.stderr)
    else:
        miny, maxy = build_year_range(locations)
        years = list(range(miny, maxy + 1))

        write_json(os.path.join(OUT_JSON_DIR, "openings_vs_closings.json"), build_openings_closings(locations, years))
        write_json(os.path.join(OUT_JSON_DIR, "open_by_stage.json"), build_total_by_stage(locations, years))
        write_json(os.path.join(OUT_JSON_DIR, "remodels_by_start_year.json"), build_remodels_by_start_year(locations, years))
        write_json(os.path.join(OUT_JSON_DIR, "avg_years_open_by_opening_year.json"), build_avg_years_open_by_opening_year(locations))
        write_json(os.path.join(OUT_JSON_DIR, "avg_sqft_by_opening_year.json"), build_avg_sqft_by_opening_year(locations))
        print("Wrote location JSON -> data/graphs", file=sys.stderr)

    # NEW: showtapes -> media duration averages
    showtapes_pages = load_showtapes_pages()
    if not showtapes_pages:
        print("No Showtapes-tagged pages found (or none had usable start year/mediaDuration).", file=sys.stderr)
    else:
        # Define category groups (exact match)
        group_a = {"Creative Engineering", "ShowBiz Pizza Place"}
        group_b = {"Pizza Time Theatre", "Chuck E. Cheese's"}

        a_json = build_avg_media_duration_by_start_year(showtapes_pages, group_a)
        b_json = build_avg_media_duration_by_start_year(showtapes_pages, group_b)

        live_categories = {"Chuck E. Cheese's", "Pizza Time Theatre"}

        live_json = build_avg_media_duration_live_shows(
            showtapes_pages,
            live_categories
        )

        write_json(os.path.join(OUT_JSON_DIR, "avg_media_duration_ce_showbiz.json"), a_json)
        write_json(os.path.join(OUT_JSON_DIR, "avg_media_duration_ptt_cec.json"), b_json)
        write_json(os.path.join(OUT_JSON_DIR, "avg_media_duration_live_shows.json"),live_json)

        print(" - avg_media_duration_live_shows.json", file=sys.stderr)
        print("Wrote Showtapes media duration JSON -> data/graphs:", file=sys.stderr)
        print(" - avg_media_duration_ce_showbiz.json", file=sys.stderr)
        print(" - avg_media_duration_ptt_cec.json", file=sys.stderr)

    # ---------- NEW: article ratings derived graphs ----------
    entries = load_article_ratings(ARTICLE_RATINGS_JSON)
    if not entries:
        print(f"No article_ratings.json found at {ARTICLE_RATINGS_JSON} or it's empty — skipping article rating graphs.", file=sys.stderr)
    else:
        # 1) count of articles in each rating (0-4)
        counts_json = build_ratings_count_series(entries)
        write_json(os.path.join(OUT_JSON_DIR, "article_ratings_counts.json"), counts_json)
        print("Wrote article_ratings_counts.json", file=sys.stderr)

        # 2) breakdown by startDate (sum of rating numbers per year) -> good for a line chart
        by_year_json = build_total_rating_by_year(entries)
        write_json(os.path.join(OUT_JSON_DIR, "article_ratings_score_by_year.json"), by_year_json)
        print("Wrote article_ratings_score_by_year.json", file=sys.stderr)

        # 3) scoring by category
        by_cat_json = build_avg_rating_by_category(entries)
        write_json(os.path.join(OUT_JSON_DIR, "article_ratings_score_by_category.json"), by_cat_json)
        print("Wrote article_ratings_score_by_category.json", file=sys.stderr)

        # 4) scoring by tags
        by_tag_json = build_avg_rating_by_tag(entries)
        write_json(os.path.join(OUT_JSON_DIR, "article_ratings_score_by_tag.json"), by_tag_json)
        print("Wrote article_ratings_score_by_tag.json", file=sys.stderr)

    print("Done.", file=sys.stderr)

if __name__ == "__main__":
    run()
