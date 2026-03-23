#!/usr/bin/env python3
"""
buildMapPins.py
Scans content/ for Locations pages with latitudeLongitude and writes
compiled-json/map_pins.json for the JS map viewer.

cuDate is sourced from the remodels array entry where n == "Concept Unification".
Falls back to 1992-01-01 if not found.
"""
import json, os, calendar, datetime
from pathlib import Path

CONTENT_DIR = "content"
OUT_DIR     = os.path.join(os.path.dirname(__file__), "..", "compiled-json")
OUT_FILE    = os.path.join(OUT_DIR, "map_pins.json")

CU_DEFAULT = "1992-01-01"

def normalize_date(s, kind="start"):
    if not s or not isinstance(s, str): return None
    s = s.strip()
    parts = s.split("-")
    if len(parts) != 3: return None
    try:
        y, m, d = int(parts[0]), int(parts[1]), int(parts[2])
    except ValueError:
        return None
    if y <= 0: return None

    if kind in ("start", "cu"):
        if m == 0: m = 1
        if d == 0: d = 1
    elif kind == "end":
        if m == 0: m = 12
        if d == 0:
            d = calendar.monthrange(y, m)[1]

    m = max(1, min(12, m))
    d = max(1, min(calendar.monthrange(y, m)[1], d))
    try:
        return datetime.date(y, m, d).isoformat()
    except Exception:
        return None

def find_cu_date(remodels):
    """Scan remodels array for Concept Unification entry and return its normalized date."""
    if not remodels or not isinstance(remodels, list):
        return None
    for item in remodels:
        if not isinstance(item, dict): continue
        if (item.get('n') or '').strip() == 'Concept Unification':
            return normalize_date(item.get('s', ''), kind='cu')
    return None

def main():
    folders = [f for f in Path(CONTENT_DIR).iterdir() if f.is_dir()]
    print(f"Scanning {len(folders)} folders...")

    locations = []
    cu_from_remodels = 0

    for folder in folders:
        mp = folder / 'meta.json'
        if not mp.exists(): continue
        try:
            meta = json.loads(mp.read_text(encoding='utf-8'))
        except Exception:
            continue

        if (meta.get('type') or '').lower() != 'locations':
            continue

        ll = meta.get('latitudeLongitude')
        if not ll or not isinstance(ll, list) or len(ll) < 2:
            continue
        try:
            lat, lon = float(ll[0]), float(ll[1])
        except (ValueError, TypeError):
            continue
        if abs(lat) < 1e-9 and abs(lon) < 1e-9:
            continue

        tags = meta.get('tags') or []
        if isinstance(tags, str): tags = [tags]

        start = normalize_date(meta.get('startDate', ''), 'start') or '1970-01-01'
        end   = normalize_date(meta.get('endDate', ''),   'end')   or '9999-12-31'

        # Prefer Concept Unification date from remodels over cuDate field
        cu = find_cu_date(meta.get('remodels'))
        if cu:
            cu_from_remodels += 1
        else:
            cu = normalize_date(meta.get('cuDate', ''), 'cu') or CU_DEFAULT

        locations.append({
            'title':     meta.get('title', folder.name),
            'p':         folder.name,
            'tags':      tags,
            'coords':    [lat, lon],
            'startDate': start,
            'endDate':   end,
            'cuDate':    cu,
        })

    os.makedirs(OUT_DIR, exist_ok=True)
    open(OUT_FILE, 'w', encoding='utf-8').write(
        json.dumps({'locations': locations}, ensure_ascii=False, separators=(',', ':'))
    )
    print(f"map_pins.json — {len(locations)} locations written")
    print(f"  cuDate from remodels: {cu_from_remodels}, from cuDate/default: {len(locations)-cu_from_remodels}")

def run(): main()
if __name__ == '__main__': main()