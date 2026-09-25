#!/usr/bin/env python3
import json, os, calendar, datetime
from pathlib import Path

CONTENT_DIR = "content"
OUT_DIR     = os.path.join(os.path.dirname(__file__), "..", "compiled-json")
OUT_FILE    = os.path.join(OUT_DIR, "map_pins.json")

REMODEL_PIN_MAP = {
    "PTT Standard Layout": "ptt",
    "SPP Standard Layout": "spp",
    "CEC 2.0 Remodel Program": "cec2",
    "CEC 2000's Remodel Program": "cec2000s",
    "SPT 1990's Remodel Program": "spt90s",
    "Discovery Zone Standard Layout": "dz",
    "Peter Piper Pizza 2.0 Remodel Program": "ppp2",
    "Fun Spot Arcade Standard Layout": "funspotarcade",
    "Charlie Cheese's Standard Layout": "charliecheese",
    "CEC Adventure World Standard Layout": "cecadventureworld",
    "Chuck E. Mouse's Pizza Paradise (出奇老鼠薄餅樂園) Standard Layout": "chuckemouse",
    "2025 Chuck's Arcade Remodel": "chucksarcade2025",
}

TRACKED_REMODELS = set(REMODEL_PIN_MAP.keys()) | {
    "SPT 1980's Remodel Program",
    "Concept Unification",
}

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

def build_eras(remodels):
    raw = []
    if remodels and isinstance(remodels, list):
        for item in remodels:
            if not isinstance(item, dict): continue
            name = (item.get('n') or '').strip()
            if name not in TRACKED_REMODELS: continue
            raw_s = (item.get('s') or '').strip()
            if name == "Concept Unification" and raw_s == '0000-00-00':
                date = '1992-01-01'
            else:
                date = normalize_date(raw_s, kind='cu')
            if not date: continue
            raw.append({'n': name, 's': date})
    raw.sort(key=lambda e: e['s'])

    eras = []
    last_ptt_spp = None
    for idx, item in enumerate(raw):
        name = item['n']
        if name == "SPT 1980's Remodel Program":
            if last_ptt_spp == 'ptt':
                pin = 'spt80s_ptt'
            elif last_ptt_spp == 'spp':
                pin = 'spt80s_spp'
            else:
                pin = 'other'
        elif name == "Concept Unification":
            if last_ptt_spp == 'spp':
                last_ptt_spp = 'ptt'
                has_future_80s = any(
                    r['n'] == "SPT 1980's Remodel Program" for r in raw[idx + 1:]
                )
                if not has_future_80s:
                    eras.append({'s': item['s'], 'pin': 'spt80s_ptt'})
            continue
        else:
            pin = REMODEL_PIN_MAP.get(name, 'other')
            if pin in ('ptt', 'spp'):
                last_ptt_spp = pin
        eras.append({'s': item['s'], 'pin': pin})
    return eras

def main():
    folders = [f for f in Path(CONTENT_DIR).iterdir() if f.is_dir()]
    print(f"Scanning {len(folders)} folders...")

    locations = []
    locations_with_eras = 0

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

        start = normalize_date(meta.get('startDate', ''), 'start') or '1970-01-01'
        end   = normalize_date(meta.get('endDate', ''),   'end')   or '9999-12-31'

        eras = build_eras(meta.get('remodels'))
        if eras:
            locations_with_eras += 1

        locations.append({
            'title':     meta.get('title', folder.name),
            'p':         folder.name,
            'coords':    [lat, lon],
            'startDate': start,
            'endDate':   end,
            'eras':      eras,
        })

    os.makedirs(OUT_DIR, exist_ok=True)
    open(OUT_FILE, 'w', encoding='utf-8').write(
        json.dumps({'locations': locations}, ensure_ascii=False, separators=(',', ':'))
    )
    print(f"map_pins.json — {len(locations)} locations written")
    print(f"  locations with tracked eras: {locations_with_eras}")

def run(): main()
if __name__ == '__main__': main()