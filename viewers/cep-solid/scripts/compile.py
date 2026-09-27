#!/usr/bin/env python3
import json, os, subprocess, sys, calendar, datetime
from pathlib import Path

CONTENT_DIR = "content"
OUT_TITLE_TO_ID = os.path.join(os.path.dirname(__file__), "..", "compiled-json/titleToFolderIDMap.json")
OUT_ID_TO_TITLE = os.path.join(os.path.dirname(__file__), "..", "compiled-json/folderIDToTitleMap.json")
OUT_MAP_PINS    = os.path.join(os.path.dirname(__file__), "..", "compiled-json/map_pins.json")

REMODEL_PIN_MAP = {
    "PTT Standard Layout": "0",
    "SPP Standard Layout": "1",
    "CEC 2.0 Remodel Program": "2",
    "CEC 2000's Remodel Program": "3",
    "SPT 1990's Remodel Program": "4",
    "Discovery Zone Standard Layout": "5",
    "Peter Piper Pizza 2.0 Remodel Program": "6",
    "Fun Spot Arcade Standard Layout": "7",
    "Charlie Cheese's Standard Layout": "8",
    "CEC Adventure World Standard Layout": "9",
    "Chuck E. Mouse's Pizza Paradise (出奇老鼠薄餅樂園) Standard Layout": "a",
    "2025 Chuck's Arcade Remodel": "b",
}
OTHER_PIN = "c"
SPT80S_PTT_PIN = "d"
SPT80S_SPP_PIN = "e"
PTT_PIN = REMODEL_PIN_MAP["PTT Standard Layout"]
SPP_PIN = REMODEL_PIN_MAP["SPP Standard Layout"]
TRACKED_REMODELS = set(REMODEL_PIN_MAP.keys()) | {
    "SPT 1980's Remodel Program",
    "Concept Unification",
}


def main():
    remove_backslashes()
    title_to_id = build_title_to_id_map()
    id_to_title = build_id_to_title_map(title_to_id)

    write_json(title_to_id, OUT_TITLE_TO_ID)
    write_json(id_to_title, OUT_ID_TO_TITLE)

    print(f'Wrote {len(title_to_id)} titles -> {OUT_TITLE_TO_ID}')
    print(f'Wrote {len(id_to_title)} ids -> {OUT_ID_TO_TITLE}')

    build_map_pins()

    run_solid_build()


def remove_backslashes():
    content_path = Path(CONTENT_DIR)
    if not content_path.exists():
        return

    modified_count = 0
    for folder in content_path.iterdir():
        if not folder.is_dir():
            continue
        md_file = folder / "content.md"
        if not md_file.exists():
            continue

        try:
            content = md_file.read_text(encoding="utf-8")
            if "\\" in content:
                cleaned_content = content.replace("\\", "")
                md_file.write_text(cleaned_content, encoding="utf-8")
                print(f"Removed backslashes from: {md_file}")
                modified_count += 1
        except Exception as e:
            print(f"Error processing {md_file}: {e}", file=sys.stderr)

    if modified_count > 0:
        print(f"Cleaned backslashes in {modified_count} content.md file(s).")


def build_title_to_id_map():
    index = {}
    for folder in Path(CONTENT_DIR).iterdir():
        if not folder.is_dir():
            continue
        meta = folder / 'meta.json'
        if not meta.exists():
            continue
        try:
            fm = json.loads(meta.read_text(encoding='utf-8'))
            t = fm.get('title', '').strip()
            if t:
                index[t] = folder.name
        except Exception:
            continue
    return index


def build_id_to_title_map(title_to_id):
    return {folder_id: title for title, folder_id in title_to_id.items()}


def write_json(data, path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, separators=(',', ':'))

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


def build_remodels(remodels):
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

    remodels = []
    last_ptt_spp = None
    for idx, item in enumerate(raw):
        name = item['n']
        if name == "SPT 1980's Remodel Program":
            if last_ptt_spp == PTT_PIN:
                pin = SPT80S_PTT_PIN
            elif last_ptt_spp == SPP_PIN:
                pin = SPT80S_SPP_PIN
            else:
                pin = OTHER_PIN
        elif name == "Concept Unification":
            if last_ptt_spp == SPP_PIN:
                last_ptt_spp = PTT_PIN
                has_future_80s = any(
                    r['n'] == "SPT 1980's Remodel Program" for r in raw[idx + 1:]
                )
                if not has_future_80s:
                    remodels.append([item['s'], SPT80S_PTT_PIN])
            continue
        else:
            pin = REMODEL_PIN_MAP.get(name, OTHER_PIN)
            if pin in (PTT_PIN, SPP_PIN):
                last_ptt_spp = pin
        remodels.append([item['s'], pin])

    return remodels


def build_map_pins():
    folders = [f for f in Path(CONTENT_DIR).iterdir() if f.is_dir()]
    print(f"Scanning {len(folders)} folders for map pins...")

    locations = []
    locations_with_remodels = 0

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

        remodels = build_remodels(meta.get('remodels'))
        if remodels:
            locations_with_remodels += 1

        locations.append({
            'p': folder.name,
            'c': [lat, lon],
            's': start,
            'e': end,
            'r': remodels,
        })

    os.makedirs(os.path.dirname(OUT_MAP_PINS), exist_ok=True)
    with open(OUT_MAP_PINS, 'w', encoding='utf-8') as f:
        json.dump({'locations': locations}, f, ensure_ascii=False, separators=(',', ':'))

    print(f"mapPins.json — {len(locations)} locations written")
    print(f"  locations with tracked remodels: {locations_with_remodels}")


def run_solid_build():
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    print("Running: npm run build:solid")
    result = subprocess.run(
        ["npm", "run", "build:solid"],
        cwd=project_root,
        shell=(os.name == "nt"),
    )
    if result.returncode != 0:
        print(f"npm run build:solid failed with exit code {result.returncode}", file=sys.stderr)
        sys.exit(result.returncode)


if __name__ == '__main__':
    main()