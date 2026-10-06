#!/usr/bin/env python3
import json, os, subprocess, sys, calendar, datetime
from pathlib import Path
import re, shutil, tempfile, html, io, heapq, secrets, string
import urllib.request, urllib.error, urllib.parse
from concurrent.futures import ThreadPoolExecutor
from itertools import zip_longest
from prompt_toolkit import PromptSession
from prompt_toolkit.completion import Completer, Completion
from prompt_toolkit.formatted_text import ANSI
from yt_dlp import YoutubeDL

OFFICIAL_CHANNELS = [
    "@chuckecheese",
    "@fanprograms",
    "@therockafire",
    "@ChuckECheeseArabic",
    "@ChuckECheeseEspañol",
    "@Rockafiremovie",
    "@animdude"
]

#This list of channels is not an endorsement of any listed.
#They are simply semi-popular channels that post mostly
#CEC/RAE/animatronic centric videos that are worth tagging
#for pages to use as citations or further exploration by
#the reader. Channels may be added or removed over time.
FAN_CHANNELS = [
    "@ChuckEEntertainment",
    "@dooklarue",
    "@christhrash9124",
    "@chuckaround",
    "@MattTheFranchize",
    "@ChuckE.CheesesIllinois",
    "@CECNewYork",
    "@RetroPizzaFan",
    "@brianhagan",
    "@FreddyTrap",
    "@spcom",
    "@SmittysSuperService",
    "@CircusShowplace",
    "@NativeNew_Yorker",
    "@chattychucke5535",
    "@sptweb",
    "@GSully",
    "@TheTNTMuffin",
    "@setsstreetseats",
    "@LiamsExplorations",
    "@conceptcheeseentertainment",
    "@CEtalkshow",
    "@ManAndDogFan",
    "@TayJayProductions",
    "@CECFlorida",
    "@michael-armenta",
    "@ShowbizPizzaPlaceAnimatronics",
    "@circuspizzafan",
    "@CECWorld",
    "@showbizpizza",
    "@showbizpizzacom",
    "@ThatColumbusGuyy",
    "@connorleschinsky",
    "@chimeramanticore",
    "@RetrofittedReality",
    "@RockafireAudio",
    "@PasqAnimatronics",
    "@BullFrogsBanjo",
    "@funtownfollies6313",
    "@ItzaRob",
    "@NathanSpies",
    "@WatootsiJenkins",
    "@GallaRM",
    "@animatronicswarehouse",
    "@Dawko",
    "@JonnyBlox"
]
CHANNELS = OFFICIAL_CHANNELS + FAN_CHANNELS
OFFICIAL_HANDLES = {h.lower() for h in OFFICIAL_CHANNELS}
CHANNEL_TABS = ["videos"]
OLDEST_FIRST = False
CONTRIBUTOR = "sudo-trans-pony"

CONTENT_DIR = "content"
OUT_TITLE_TO_ID = os.path.join(os.path.dirname(__file__), "..", "compiled-json/titleToFolderIDMap.json")
OUT_ID_TO_TITLE = os.path.join(os.path.dirname(__file__), "..", "compiled-json/folderIDToTitleMap.json")
OUT_MAP_PINS    = os.path.join(os.path.dirname(__file__), "..", "compiled-json/map_pins.json")
OUT_TYPE_TO_IDS = os.path.join(os.path.dirname(__file__), "..", "compiled-json/typeToIDList.json")
OUT_RECENT_FAN_VIDEOS = os.path.join(os.path.dirname(__file__), "..", "compiled-json/recentfanvideos.json")
OUT_RECENT_OFFICIAL_VIDEOS = os.path.join(os.path.dirname(__file__), "..", "compiled-json/recentofficialvideos.json")
RECENT_VIDEOS_COUNT = 15
THUMB_FIELD = "pageThumbnailVideo"
THUMB_CANDIDATES = ["maxresdefault", "sddefault", "hqdefault", "mqdefault", "default"]
PHOTO_SIM_BITS = 16
PHOTO_HASH_CACHE = os.path.join(os.path.dirname(__file__), ".photo_hashes.json")
OUT_REJECTED = os.path.join(os.path.dirname(__file__), "..", "compiled-json/rejected_videos.json")
MEDIA_TYPES = {"Photos", "Videos"}
ID_ALPHABET = string.ascii_lowercase + string.digits
PREFETCH = 3
MAX_SUGGESTIONS = 8

USE_COLOR = sys.stdout.isatty() and "NO_COLOR" not in os.environ
if USE_COLOR and os.name == "nt":
    os.system("")


def color(text, code):
    return f"\033[{code}m{text}\033[0m" if USE_COLOR else text


def green(t): return color(t, "32")
def yellow(t): return color(t, "33")
def red(t): return color(t, "31")
def cyan(t): return color(t, "36")
def dim(t): return color(t, "2")


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


def ask(question):
    try:
        return input(yellow(f"{question} [y/N] ")).strip().lower() in ("y", "yes")
    except EOFError:
        return False


def main():
    if ask("Add New Fandom Videos"):
        add_fandom_videos()
    if ask("Scrape Video Thumbnails/Transcripts"):
        process_video_articles()
    if ask("Scan for duplicate articles"):
        dedupe_videos()
        dedupe_photos()
    fill_video_channel_handles()
    remove_backslashes()
    title_to_id = build_title_to_id_map()
    id_to_title = build_id_to_title_map(title_to_id)
    type_to_ids = build_type_to_ids()
    
    write_json(type_to_ids, OUT_TYPE_TO_IDS)
    write_json(title_to_id, OUT_TITLE_TO_ID)
    write_json(id_to_title, OUT_ID_TO_TITLE)
    recent_fan = build_recent_videos(False)
    recent_official = build_recent_videos(True)
    write_json(recent_fan, OUT_RECENT_FAN_VIDEOS)
    write_json(recent_official, OUT_RECENT_OFFICIAL_VIDEOS)

    print(green(f'Wrote {len(title_to_id)} titles -> {OUT_TITLE_TO_ID}'))
    print(green(f'Wrote {len(id_to_title)} ids -> {OUT_ID_TO_TITLE}'))
    print(green(f'Wrote {len(type_to_ids)} types -> {OUT_TYPE_TO_IDS}'))
    print(green(f'Wrote {len(recent_fan)} recent fan videos -> {OUT_RECENT_FAN_VIDEOS}'))
    print(green(f'Wrote {len(recent_official)} recent official videos -> {OUT_RECENT_OFFICIAL_VIDEOS}'))

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
                print(yellow(f"Removed backslashes from: {md_file}"))
                modified_count += 1
        except Exception as e:
            print(red(f"Error processing {md_file}: {e}"), file=sys.stderr)

    if modified_count > 0:
        print(green(f"Cleaned backslashes in {modified_count} content.md file(s)."))


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


def build_type_to_ids():
    by_type = {}
    for folder in Path(CONTENT_DIR).iterdir():
        if not folder.is_dir():
            continue
        meta = folder / 'meta.json'
        if not meta.exists():
            continue
        try:
            fm = json.loads(meta.read_text(encoding='utf-8'))
        except Exception:
            continue
        t = (fm.get('type') or '').strip().lower()
        if not t:
            continue
        by_type.setdefault(t, []).append(folder.name)

    for ids in by_type.values():
        ids.sort()
    return dict(sorted(by_type.items()))

def is_official(meta):
    handle = urllib.parse.unquote(meta.get('videoChannelHandle') or '').strip().lower()
    return handle in OFFICIAL_HANDLES


def build_recent_videos(official):
    videos = []
    for folder in Path(CONTENT_DIR).iterdir():
        if not folder.is_dir():
            continue
        meta = read_meta(folder)
        if (meta.get('type') or '').strip().lower() != 'videos':
            continue
        if is_official(meta) != official:
            continue
        date = meta.get('startDate') or ''
        if not date or date.startswith('0000'):
            continue
        videos.append((date, folder.name))
    videos.sort(reverse=True)
    return [name for _, name in videos[:RECENT_VIDEOS_COUNT]]


def fetch_channel_handle(vid):
    options = {"quiet": True, "no_warnings": True, "skip_download": True, "ignore_no_formats_error": True}
    try:
        with YoutubeDL(options) as ydl:
            info = ydl.extract_info(f"https://www.youtube.com/watch?v={vid}", download=False)
    except Exception as e:
        print(red(f"  Could not read {vid}: {e}"))
        return None
    handle = info.get("uploader_id") or ""
    if not handle.startswith("@"):
        m = re.search(r"/(@[^/?#]+)", info.get("uploader_url") or info.get("channel_url") or "")
        handle = m.group(1) if m else ""
    return urllib.parse.unquote(handle)


def fill_video_channel_handles():
    todo = []
    for folder in sorted(Path(CONTENT_DIR).iterdir()):
        if not folder.is_dir():
            continue
        meta = read_meta(folder)
        if (meta.get("type") or "").strip().lower() != "videos" or "videoChannelHandle" in meta:
            continue
        vid = youtube_id(find_video_url(meta))
        if vid:
            todo.append((folder, meta, vid))
    print(cyan(f"{len(todo)} videos missing a channel handle"))
    if not todo:
        return
    filled = 0
    with ThreadPoolExecutor(max_workers=PREFETCH) as executor:
        for (folder, meta, vid), handle in zip(todo, executor.map(lambda t: fetch_channel_handle(t[2]), todo)):
            if handle is None:
                continue
            meta["videoChannelHandle"] = handle
            (folder / "meta.json").write_text(json.dumps(meta, indent=2, ensure_ascii=False), encoding="utf-8")
            filled += 1
            print(green(f"  {folder.name}: {handle or '(none)'}"))
    print(green(f"Channel handles: {filled} filled, {len(todo) - filled} failed"))


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
    print(cyan(f"Scanning {len(folders)} folders for map pins..."))

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

    print(green(f"mapPins.json — {len(locations)} locations written"))
    print(dim(f"  locations with tracked remodels: {locations_with_remodels}"))

YT_ID_RE = re.compile(r"(?:youtu\.be/|[?&]v=|/(?:shorts|embed|live|v|e)/)([A-Za-z0-9_-]{11})")


def youtube_id(url):
    """Video ID from any YouTube URL shape (watch, m., music., youtu.be, shorts, embed, live,
    extra params, backslash-escaped, %-encoded, or HTML-escaped &amp;)."""
    if not isinstance(url, str):
        return None
    s = html.unescape(urllib.parse.unquote(url.replace("\\", "")))
    m = YT_ID_RE.search(s)
    return m.group(1) if m else None


def iter_strings(value):
    if isinstance(value, str):
        yield value
    elif isinstance(value, dict):
        for v in value.values():
            yield from iter_strings(v)
    elif isinstance(value, (list, tuple)):
        for v in value:
            yield from iter_strings(v)


def vtt_to_text(vtt):
    out, prev = [], set()
    for block in re.split(r"\n\s*\n", vtt.replace("\r", "")):
        lines = block.strip().split("\n")
        idx = next((i for i, l in enumerate(lines) if "-->" in l), None)
        if idx is None:
            continue
        m = re.match(r"(?:(\d+):)?(\d+):(\d+)", lines[idx].strip())
        if not m:
            continue
        h, mi, s = int(m.group(1) or 0), int(m.group(2)), int(m.group(3))
        ts = f"{h}:{mi:02}:{s:02}" if h else f"{mi}:{s:02}"
        cur = []
        for l in lines[idx + 1:]:
            l = html.unescape(re.sub(r"<[^>]+>", "", l))
            l = re.sub(r"\s+", " ", re.sub(r"[\x00-\x1f\x7f]+", " ", l.replace("\\", ""))).strip()
            if l:
                cur.append(l)
        out.extend(f"{{{ts}}} {l}" for l in cur if l not in prev)
        prev = set(cur)
    return "\n\n".join(out)

def fetch_transcript(url):
    with tempfile.TemporaryDirectory() as tmp:
        try:
            r = subprocess.run(
                ["yt-dlp", "--skip-download", "--no-playlist", "--write-info-json",
                 "--write-subs", "--write-auto-subs", "--sub-langs", "en.*", "--sub-format", "vtt",
                 "-o", os.path.join(tmp, "%(id)s"), url],
                capture_output=True, text=True, timeout=180,
            )
        except Exception as e:
            print(red(f"  yt-dlp error: {e}"), file=sys.stderr)
            return None
        err = r.stderr.strip().splitlines()
        if r.returncode != 0:
            print(red(f"  yt-dlp failed: {err[-1] if err else r.returncode}"), file=sys.stderr)
            return None

        infos = list(Path(tmp).glob("*.info.json"))
        if not infos:
            print(red("  no video info returned, will retry next time"), file=sys.stderr)
            return None
        try:
            info = json.loads(infos[0].read_text(encoding="utf-8"))
        except Exception:
            return None

        tracks = list((info.get("subtitles") or {}).keys()) + list((info.get("automatic_captions") or {}).keys())
        if not any(t.lower().startswith("en") for t in tracks):
            return ""

        files = sorted(Path(tmp).glob("*.vtt"), key=lambda p: len(p.name))
        if not files:
            print(red(f"  subtitles exist but download failed: {err[-1] if err else 'unknown'}"), file=sys.stderr)
            return None
        return vtt_to_text(files[0].read_text(encoding="utf-8", errors="replace"))
def download_thumbnail(vid, dest):
    try:
        from PIL import Image
    except ImportError:
        print(red("  Pillow is not installed (pip install pillow)"), file=sys.stderr)
        return None
    for name in THUMB_CANDIDATES:
        try:
            req = urllib.request.Request(f"https://i.ytimg.com/vi/{vid}/{name}.jpg", headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = resp.read()
            if len(data) < 1000:
                continue
            Image.open(io.BytesIO(data)).convert("RGB").save(dest, "AVIF", quality=60)
            return name
        except (urllib.error.URLError, OSError, ValueError, KeyError) as e:
            print(yellow(f"  thumbnail '{name}' failed: {e}"), file=sys.stderr)
    return None

def find_video_url(meta):
    v = meta.get(THUMB_FIELD)
    if isinstance(v, str) and v.strip():
        return v.strip()
    for val in meta.values():
        if isinstance(val, str) and re.match(r"https?://", val.strip()) and youtube_id(val):
            return val.strip()
    return ""


def process_video_articles():
    if not Path(CONTENT_DIR).exists():
        print(yellow(f"Content dir '{CONTENT_DIR}' not found, skipping videos"), file=sys.stderr)
        return
    have_ytdlp = shutil.which("yt-dlp") is not None
    if not have_ytdlp:
        print(yellow("yt-dlp not found on PATH, skipping video transcripts"), file=sys.stderr)

    videos = with_url = 0
    for folder in sorted(Path(CONTENT_DIR).iterdir()):
        meta_path = folder / "meta.json"
        if not folder.is_dir() or not meta_path.exists():
            continue
        try:
            meta = json.loads(meta_path.read_text(encoding="utf-8"))
        except Exception:
            continue
        if (meta.get("type") or "").strip().lower() != "videos":
            continue
        videos += 1
        url = find_video_url(meta)
        if not url:
            continue
        with_url += 1

        md = folder / "content.md"
        if have_ytdlp and not md.exists():
            print(cyan(f"Fetching transcript: {folder.name}"))
            text = fetch_transcript(url)
            if text is None:
                print(red("  transcript fetch errored, wrote empty content.md"))
                text = ""
            md.write_text(text, encoding="utf-8")
            if text:
                print(green(f"  wrote content.md ({len(text)} chars)"))
            elif text == "":
                print(yellow("  wrote empty content.md"))

        photo = folder / "photo.avif"
        if not photo.exists():
            vid = youtube_id(url)
            if not vid:
                print(yellow(f"[warn] {folder.name}: no video ID in {url}"), file=sys.stderr)
                continue
            print(cyan(f"Fetching thumbnail: {folder.name}"))
            used = download_thumbnail(vid, photo)
            print(green(f"  saved photo.avif ({used})") if used else red("  all thumbnail sizes failed"))

    print(green(f"Video articles: {videos} found, {with_url} with a YouTube URL"))

def read_meta(folder):
    try:
        return json.loads((folder / "meta.json").read_text(encoding="utf-8-sig"))
    except Exception:
        return {}


def has_md(folder):
    md = folder / "content.md"
    return md.is_file() and md.stat().st_size > 0


def merge_lists(metas, key):
    out, seen = [], set()
    for m in metas:
        for x in (m.get(key) if isinstance(m.get(key), list) else []):
            s = json.dumps(x, sort_keys=True)
            if s not in seen:
                seen.add(s)
                out.append(x)
    return out


def merge_articles(keep, others):
    raw = (keep / "meta.json").read_text(encoding="utf-8")
    km = json.loads(raw)
    metas = [km] + [read_meta(o) for o in others]
    for k in ("tags", "contributors", "citations"):
        merged = merge_lists(metas, k)
        if merged:
            km[k] = merged
    start = next((m["startDate"] for m in metas if m.get("startDate")), None)
    if start:
        km["startDate"] = start
    if not has_md(keep):
        src = next((o for o in others if has_md(o)), None)
        if src:
            shutil.copy(src / "content.md", keep / "content.md")
    (keep / "meta.json").write_text(json.dumps(km, ensure_ascii=False, indent=2 if "\n" in raw.strip() else None), encoding="utf-8")
    for o in others:
        shutil.rmtree(o)


def video_key(s):
    s = (s or "").strip()
    return (youtube_id(s) or s) if re.match(r"https?://", s) else None


def dedupe_videos():
    groups, seen = {}, set()
    for f in sorted(Path(CONTENT_DIR).iterdir()):
        m = read_meta(f) if f.is_dir() else {}
        if (m.get("type") or "").strip().lower() != "videos":
            continue
        for k in {video_key(find_video_url(m)), video_key(m.get("title"))} - {None}:
            groups.setdefault(k, set()).add(f)
    for k, g in groups.items():
        g = sorted(f for f in g if f.exists())
        if len(g) < 2 or tuple(g) in seen:
            continue
        seen.add(tuple(g))
        keep = min(g, key=lambda f: (video_key(read_meta(f).get("title")) is not None, not has_md(f), f.name))
        print(cyan(f"Duplicate video {k}:"))
        for f in g:
            print(dim(f"  {f.name}  {read_meta(f).get('title', '')}"))
        if ask(f"Keep {keep.name} and merge the other {len(g) - 1}?"):
            merge_articles(keep, [f for f in g if f != keep])
            print(green(f"Merged into {keep.name}"))


def photo_hash(path):
    from PIL import Image
    try:
        px = Image.open(path).convert("L").resize((17, 16), Image.BOX).tobytes()
    except Exception:
        return None
    bits = 0
    for i in range(272):
        if i % 17 < 16:
            bits = bits << 1 | (px[i] > px[i + 1])
    return bits


def photo_hashes(folders):
    try:
        with open(PHOTO_HASH_CACHE, encoding="utf-8") as fh:
            cache = json.load(fh)
    except Exception:
        cache = {}
    stamp = lambda f: (f / "photo.avif").stat().st_mtime_ns
    todo = [f for f in folders if cache.get(f.name, [None])[0] != stamp(f)]
    with ThreadPoolExecutor(os.cpu_count() or 4) as ex:
        for i, (f, h) in enumerate(zip(todo, ex.map(lambda f: photo_hash(f / "photo.avif"), todo)), 1):
            if h is not None:
                cache[f.name] = [stamp(f), f"{h:x}"]
            print(cyan(f"\rHashing photos {i}/{len(todo)}"), end="", flush=True)
    if todo:
        print()
        write_json(cache, PHOTO_HASH_CACHE)
    return {f: int(cache[f.name][1], 16) for f in folders if f.name in cache}


def block_rows(path, w):
    from PIL import Image
    im = Image.open(path).convert("RGB")
    im.thumbnail((w, w))
    px = im.load()
    return ["".join("\033[38;2;%d;%d;%dm\033[48;2;%d;%d;%dm▀" % (*px[x, y], *px[x, y + 1]) for x in range(im.width)) + "\033[0m" + " " * (w - im.width) for y in range(0, im.height - 1, 2)]


def show_photos(folders):
    w = min(36, (shutil.get_terminal_size().columns - 2) // len(folders))
    for row in zip_longest(*[block_rows(f / "photo.avif", w) for f in folders], fillvalue=" " * w):
        print("  ".join(row))
    for f in folders:
        m = read_meta(f)
        print(dim(f"  {f.name}  {m.get('title', '')}  start={m.get('startDate') or '-'}  md={'y' if has_md(f) else 'n'}  {(f / 'photo.avif').stat().st_size // 1024}KB"))


def dedupe_photos():
    try:
        import PIL
    except ImportError:
        print(red("Pillow is not installed (pip install pillow)"), file=sys.stderr)
        return
    folders = [f for f in sorted(Path(CONTENT_DIR).iterdir()) if f.is_dir() and (f / "photo.avif").exists() and (read_meta(f).get("type") or "").strip().lower().startswith("photo")]
    print(cyan(f"Hashing {len(folders)} photos..."))
    hashes = photo_hashes(folders)
    fs, hs = list(hashes), list(hashes.values())
    pairs = []
    for i, a in enumerate(hs):
        pairs += [(d, fs[i], fs[j]) for j in range(i + 1, len(hs)) if (d := (a ^ hs[j]).bit_count()) <= PHOTO_SIM_BITS]
    print(cyan(f"Found {len(pairs)} similar photo pair(s)"))
    for d, a, b in sorted(pairs):
        if not (a.exists() and b.exists()):
            continue
        keep = max((a, b), key=lambda f: (f / "photo.avif").stat().st_size)
        auto = (a / "photo.avif").stat().st_size == (b / "photo.avif").stat().st_size
        if not auto:
            print(cyan(f"Similar photos ({d} bits apart):"))
            show_photos([a, b])
        if auto or ask(f"Merge into {keep.name} (larger file)?"):
            merge_articles(keep, [f for f in (a, b) if f != keep])
            print(green(f"Auto-merged {b.name if keep == a else a.name} into {keep.name} (identical file size)" if auto else f"Merged into {keep.name}"))


def sanitize_title(title):
    for q in ('"', "\u201c", "\u201d", "\u201e", "\u201f"):
        title = title.replace(q, "''")
    title = re.sub(r"[\x00-\x1f\x7f]", " ", title.replace("\\", ""))
    return re.sub(r"\s+", " ", title).strip()


def repair_json_text(raw):
    """Best-effort repair of a malformed JSON document. Returns the parsed object, or None."""
    raw = raw.lstrip("\ufeff")
    try:
        return json.loads(raw, strict=False)
    except Exception:
        pass

    def next_sig(i):
        while i < len(raw) and raw[i] in " \t\r\n":
            i += 1
        return i

    def closes_string(i):
        """raw[i] is a quote inside a string; decide whether it ends the string."""
        j = next_sig(i + 1)
        if j >= len(raw):
            return True
        c = raw[j]
        if c in ":}]":
            return True
        if c == ",":
            k = next_sig(j + 1)
            if k >= len(raw):
                return True
            return raw[k] in '"{[}]-0123456789' or raw.startswith(("true", "false", "null"), k)
        return False

    out, i, in_str, n = [], 0, False, len(raw)
    while i < n:
        c = raw[i]
        if in_str:
            if c == "\\":
                nxt = raw[i + 1] if i + 1 < n else ""
                if nxt in '"\\/bfnrt':
                    out.append(c + nxt)
                    i += 2
                    continue
                if nxt == "u" and re.fullmatch(r"[0-9a-fA-F]{4}", raw[i + 2:i + 6]):
                    out.append(raw[i:i + 6])
                    i += 6
                    continue
                i += 1  # invalid escape: drop the backslash
                continue
            if c == '"':
                if closes_string(i):
                    in_str = False
                    out.append(c)
                else:
                    out.append("''")  # stray inner quote, same convention as sanitize_title
                i += 1
                continue
            if ord(c) < 0x20:
                out.append(" ")
                i += 1
                continue
            out.append(c)
            i += 1
            continue
        if c == '"':
            in_str = True
            out.append(c)
        elif c == ",":
            k = next_sig(i + 1)
            if k < n and raw[k] in "}]":
                pass  # trailing comma
            else:
                out.append(c)
        else:
            out.append(c)
        i += 1
    try:
        return json.loads("".join(out))
    except Exception:
        return None


def repair_meta_file(folder):
    """Repair folder/meta.json in place. Returns the parsed meta, or None if it couldn't be fixed."""
    path = folder / "meta.json"
    try:
        raw = path.read_text(encoding="utf-8-sig")
    except Exception:
        return None
    meta = repair_json_text(raw)
    if not isinstance(meta, dict):
        return None
    indent = 2 if "\n" in raw.strip() else None
    path.write_text(json.dumps(meta, ensure_ascii=False, indent=indent), encoding="utf-8")
    return meta


def load_site_data():
    titles, video_ids, media_titles, unreadable = set(), set(), set(), []
    for folder in Path(CONTENT_DIR).iterdir():
        if not folder.is_dir():
            continue
        meta = read_meta(folder)
        if not meta:
            if (folder / "meta.json").exists():
                unreadable.append(folder.name)
            continue
        title = meta.get("title")
        if isinstance(title, str) and title:
            titles.add(title)
            if meta.get("type") in MEDIA_TYPES:
                media_titles.add(title)
        sources = [meta.get(THUMB_FIELD), title]
        if (meta.get("type") or "").strip().lower() == "videos":
            sources.append(meta)  # citations or any other URL field on a video page
        for source in sources:
            for text in iter_strings(source):
                vid = youtube_id(text)
                if vid:
                    video_ids.add(vid)
    if unreadable:
        fixed, failed = 0, []
        for name in unreadable:
            folder = Path(CONTENT_DIR) / name
            meta = repair_meta_file(folder)
            if meta is None:
                failed.append(name)
                continue
            fixed += 1
            title = meta.get("title")
            if isinstance(title, str) and title:
                titles.add(title)
                if meta.get("type") in MEDIA_TYPES:
                    media_titles.add(title)
            sources = [meta.get(THUMB_FIELD), title]
            if (meta.get("type") or "").strip().lower() == "videos":
                sources.append(meta)
            for source in sources:
                for text in iter_strings(source):
                    vid = youtube_id(text)
                    if vid:
                        video_ids.add(vid)
        if fixed:
            print(green(f"Repaired {fixed} malformed meta.json file(s)"))
        if failed:
            print(red(f"Warning: {len(failed)} meta.json file(s) could not be repaired, so their videos can't be deduped:"))
            for name in failed[:10]:
                print(red(f"  {name}"))
    return titles, video_ids, media_titles


def load_rejected():
    try:
        with open(OUT_REJECTED, encoding="utf-8") as f:
            return set(json.load(f))
    except Exception:
        return set()


def save_rejected(rejected):
    write_json(sorted(rejected), OUT_REJECTED)


def matches_pattern(title, patterns):
    lowered = (title or "").lower()
    return any(p.lower() in lowered for p in patterns)


def list_channel_videos(handle):
    videos = {}
    options = {"quiet": True, "no_warnings": True, "extract_flat": True, "skip_download": True}
    with YoutubeDL(options) as ydl:
        for tab in CHANNEL_TABS:
            try:
                info = ydl.extract_info(f"https://www.youtube.com/{handle}/{tab}", download=False)
            except Exception as e:
                print(red(f"Could not read the '{tab}' tab: {e}"))
                continue
            for entry in (info or {}).get("entries") or []:
                vid = entry.get("id")
                if vid and len(vid) == 11:
                    videos.setdefault(vid, entry.get("title") or "")
    return videos


def fetch_details(vid):
    options = {"quiet": True, "no_warnings": True, "skip_download": True, "ignore_no_formats_error": True}
    try:
        with YoutubeDL(options) as ydl:
            info = ydl.extract_info(f"https://www.youtube.com/watch?v={vid}", download=False)
    except Exception as e:
        return {"id": vid, "error": str(e)}
    raw = info.get("upload_date") or info.get("release_date") or ""
    return {
        "id": vid,
        "title": info.get("title") or "",
        "description": info.get("description") or "",
        "date": f"{raw[:4]}-{raw[4:6]}-{raw[6:8]}" if len(raw) == 8 else "0000-00-00",
        "duration": info.get("duration_string") or "",
    }


class TagCompleter(Completer):
    def __init__(self, tags):
        self.pairs = [(t.lower(), t) for t in tags]

    def get_completions(self, document, complete_event):
        text = document.text
        q = text.strip().lower()
        if not q or text.startswith(("/", "!")):
            return
        scored = [(0 if lower.startswith(q) else 1, len(t), t) for lower, t in self.pairs if q in lower]
        for _, _, t in heapq.nsmallest(MAX_SUGGESTIONS, scored):
            yield Completion(t, start_position=-len(text))


def ask_tags(session, completer, tag_lookup):
    tags = []
    while True:
        text = session.prompt(ANSI(yellow(f"tag {len(tags) + 1}> ")), completer=completer, complete_while_typing=True).strip()
        if text in ("/reject", "/skip", "/quit"):
            return text[1:], tags
        if text.lower().startswith("/autoreject"):
            pattern = text[len("/autoreject"):].strip()
            if pattern:
                return "autoreject", [pattern]
            print(red("  Usage: /autoreject <text>"))
            continue
        if text == "/undo":
            if tags:
                print(dim(f"  Removed: {tags.pop()}"))
            continue
        if not text:
            if tags or session.prompt(ANSI(yellow("  No tags. Save anyway? [y/N] "))).strip().lower().startswith("y"):
                return "save", tags
            continue
        tag = text[1:].strip() if text.startswith("!") else tag_lookup.get(text.lower())
        if not tag:
            print(red("  No article with that title. Pick a suggestion, or prefix with ! to add it anyway."))
        elif tag in tags:
            print(yellow("  Already added."))
        else:
            tags.append(tag)
            print(green("  Tags: " + " | ".join(tags)))


def show_video(index, total, d):
    print(cyan("\n" + "=" * 80))
    print(green(f"[{index}/{total}] {d['title']}"))
    print(cyan(f"https://www.youtube.com/watch?v={d['id']}"))
    print(dim(f"Uploaded: {d['date']}    Length: {d['duration'] or 'unknown'}"))
    print(dim("-" * 80))
    print(d["description"].strip() or dim("(no description)"))
    print(dim("-" * 80))
    print(dim("Empty line = save.  /reject  /skip  /undo  /quit  /autoreject <text>"))


def save_video(d, tags, site_titles):
    while True:
        folder = Path(CONTENT_DIR) / "".join(secrets.choice(ID_ALPHABET) for _ in range(16))
        if not folder.exists():
            break
    folder.mkdir(parents=True)
    url = f"https://www.youtube.com/watch?v={d['id']}"
    title = sanitize_title(d["title"]) or folder.name
    if title.lower() in {t.lower() for t in site_titles}:
        title = f"{title} ({d['id']})"
    site_titles.add(title)
    meta = {
        "title": title,
        "type": "Videos",
        "pageThumbnailVideo": url,
        "citations": [url],
        "tags": tags,
        "startDate": d["date"],
        "contributors": [CONTRIBUTOR],
    }
    (folder / "meta.json").write_text(json.dumps(meta, indent=2, ensure_ascii=False), encoding="utf-8")
    return folder.name


def add_fandom_videos():
    if not Path(CONTENT_DIR).is_dir():
        print(red(f"Content dir '{CONTENT_DIR}' not found"), file=sys.stderr)
        return
    site_titles, existing, media_titles = load_site_data()
    tag_titles = sorted(t for t in site_titles if not re.match(r"https?://", t, re.I) and not t.lower().endswith(".avif") and t not in media_titles)
    tag_lookup = {t.lower(): t for t in tag_titles}
    completer = TagCompleter(tag_titles)
    rejected = load_rejected()
    patterns = []
    session = PromptSession()
    executor = ThreadPoolExecutor(max_workers=PREFETCH)
    listing_pool = ThreadPoolExecutor(max_workers=2)
    listings = {}
    saved = auto_rejected = 0

    try:
        for n, handle in enumerate(CHANNELS):
            for h in CHANNELS[n:n + 2]:  # list the next channel while you review this one
                if h not in listings:
                    listings[h] = listing_pool.submit(list_channel_videos, h)
            print(cyan(f"Listing {handle}..."))
            listing = listings.pop(handle).result()

            in_wiki = sum(v in existing for v in listing)
            candidates = [v for v in listing if v not in existing and v not in rejected]
            auto = {v for v in candidates if matches_pattern(listing[v], patterns)}
            pending = [v for v in candidates if v not in auto]
            if auto:
                rejected.update(auto)
                save_rejected(rejected)
                auto_rejected += len(auto)
            print(green(f"{handle}: {len(listing)} videos, {in_wiki} in wiki, {len(auto)} auto-rejected, {len(pending)} to review"))
            if not pending:
                print(dim(f"{handle}: nothing new, skipping"))
                continue
            if ask(f"Skip {handle}"):
                continue
            if OLDEST_FIRST:
                pending.reverse()
            futures = {}

            for i, vid in enumerate(pending):
                if vid in rejected:
                    continue
                if matches_pattern(listing[vid], patterns):
                    rejected.add(vid)
                    save_rejected(rejected)
                    auto_rejected += 1
                    continue

                for nxt in pending[i:i + PREFETCH]:
                    if nxt not in futures and nxt not in rejected and not matches_pattern(listing[nxt], patterns):
                        futures[nxt] = executor.submit(fetch_details, nxt)

                details = futures.pop(vid).result()
                if "error" in details:
                    print(red(f"\n[{i + 1}/{len(pending)}] Could not load {vid}: {details['error']}"))
                    continue
                if matches_pattern(details["title"], patterns):
                    rejected.add(vid)
                    save_rejected(rejected)
                    auto_rejected += 1
                    print(yellow(f"\n[{i + 1}/{len(pending)}] Auto-rejected: {details['title']}"))
                    continue

                show_video(i + 1, len(pending), details)
                action, tags = ask_tags(session, completer, tag_lookup)

                if action == "quit":
                    return
                if action == "skip":
                    continue
                if action == "autoreject":
                    patterns.append(tags[0])
                    action = "reject"
                if action == "reject":
                    rejected.add(vid)
                    save_rejected(rejected)
                    print(yellow("  Rejected."))
                    continue

                print(green(f"  Saved to {CONTENT_DIR}/{save_video(details, tags, site_titles)}"))
                existing.add(vid)
                saved += 1
    except (KeyboardInterrupt, EOFError):
        print(yellow("\nStopped."))
    finally:
        executor.shutdown(wait=False, cancel_futures=True)
        listing_pool.shutdown(wait=False, cancel_futures=True)
        print(green(f"Fandom videos: {saved} created, {auto_rejected} auto-rejected by title"))


def run_solid_build():
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    print(cyan("Running: npm run build:solid"))
    result = subprocess.run(
        ["npm", "run", "build:solid"],
        cwd=project_root,
        shell=(os.name == "nt"),
    )
    if result.returncode != 0:
        print(red(f"npm run build:solid failed with exit code {result.returncode}"), file=sys.stderr)
        sys.exit(result.returncode)


if __name__ == '__main__':
    main()
