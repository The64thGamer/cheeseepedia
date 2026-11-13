#!/usr/bin/env python3
import json, os, subprocess, sys, calendar, datetime
from pathlib import Path
import re, shutil, tempfile, html, io, heapq, secrets, string, sqlite3, time
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
    "@animdude",
    "@SteelWoolStudios"
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
    "@PhillipJasper1",
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
    "@WatootsiJenkins",
    "@GallaRM",
    "@animatronicswarehouse",
    "@anthonysadventures1977",
    "@CECPizzaMunch",
    "@arcade_wizard",
    "@Outerlimitsgameplay",
    "@cecbros.2335",
    "@mmbbca3268",
    "@CECWestCoast",
    "@ShowbizSouth",
    "@TheRadicalZoneSPT",
    "@cecroadshows6449",
    "@cheesecrawl",
    "@cecadventures",
    "@Big_Chuck_Official",
    "@CASAnimatronics",
    "@tylershannon4945",
    "@Dmanswish",
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
OUT_SORT_KEYS = os.path.join(os.path.dirname(__file__), "..", "compiled-json/sortKeys.json")
SORT_EPOCH = 1577836800
DATE_RE = re.compile(r"\d{4}-\d\d-\d\d")
OUT_TAGS = os.path.join(os.path.dirname(__file__), "..", "compiled-json/tags.json")
OUT_ID_TO_TAGS = os.path.join(os.path.dirname(__file__), "..", "compiled-json/folderIDToTags.json")
BODY_FILES = ("content.md", "old.md")
OUT_SEARCH_DB = os.path.join(os.path.dirname(__file__), "..", "compiled-json/search.sqlite")
CHUNK_WORDS = 150
SNIPPET_WORDS = 24
TS_TOKEN_RE = re.compile(r"\{(\d+:\d\d(?::\d\d)?)\}$")
MD_LINK_RE = re.compile(r"\[([^\]]*)\]\([^)]*\)")
WIKI_SHORTCODE_RE = re.compile(r"""\{\{<?\s*wiki-link\s+(?:"([^"]+)"|'([^']+)'|([^\s}>]+))[^}]*\}\}""", re.I)
CITE_SHORTCODE_RE = re.compile(r"\{\{<?\s*cite\s[^}]*\}\}", re.I)
URL_RE = re.compile(r"https?://\S+")
MD_CHARS_RE = re.compile(r"[*_`#>\[\]!|]")
DICT_TAG_FIELDS = ("remodels", "stages", "animatronics", "franchisees", "attractions", "credits")
STRING_TAG_FIELDS = ("tags", "pages", "page")
NO_TITLE_TAG_TYPES = {"videos", "photos", "reviews", "theories", "steam comment"}
BRACKET_TAG_RE = re.compile(r"\[([^\[\]]+)\](?!\()")
STATE_CODE_RE = re.compile(r", ([A-Z]{2})(?= \(|$)")
US_STATES = {
    "AL": "Alabama", "AK": "Alaska", "AZ": "Arizona", "AR": "Arkansas", "CA": "California",
    "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "DC": "District of Columbia",
    "FL": "Florida", "GA": "Georgia", "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois",
    "IN": "Indiana", "IA": "Iowa", "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana",
    "ME": "Maine", "MD": "Maryland", "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota",
    "MS": "Mississippi", "MO": "Missouri", "MT": "Montana", "NE": "Nebraska", "NV": "Nevada",
    "NH": "New Hampshire", "NJ": "New Jersey", "NM": "New Mexico", "NY": "New York",
    "NC": "North Carolina", "ND": "North Dakota", "OH": "Ohio", "OK": "Oklahoma", "OR": "Oregon",
    "PA": "Pennsylvania", "RI": "Rhode Island", "SC": "South Carolina", "SD": "South Dakota",
    "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont", "VA": "Virginia",
    "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming",
}
COUNTRY_ALIASES = {"U.A.E.": "United Arab Emirates", "UAE": "United Arab Emirates"}
COUNTRIES = [
    "Argentina", "Australia", "Bahamas", "Bahrain", "Bolivia", "Brazil", "Canada", "Chile",
    "China", "Colombia", "Costa Rica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador",
    "Guatemala", "Honduras", "Hong Kong", "India", "Indonesia", "Jamaica", "Japan", "Jordan",
    "Kuwait", "Lebanon", "Malaysia", "Mexico", "Nicaragua", "Oman", "Pakistan", "Panama",
    "Paraguay", "Peru", "Philippines", "Portugal", "Puerto Rico", "Qatar", "Saudi Arabia",
    "Singapore", "South Korea", "Spain", "Taiwan", "Thailand", "Trinidad and Tobago", "Turkey",
    "United Arab Emirates", "United Kingdom", "Uruguay", "Venezuela",
]
COUNTRY_NAMES = {c.lower(): c for c in COUNTRIES}
COUNTRY_NAMES.update({a.lower(): c for a, c in COUNTRY_ALIASES.items()})
COUNTRY_RE = re.compile(
    r"(?<![A-Za-z])(" + "|".join(re.escape(k) for k in sorted(COUNTRY_NAMES, key=len, reverse=True)) + r")(?![A-Za-z])",
    re.I,
)
OUT_RECENT_FAN_VIDEOS = os.path.join(os.path.dirname(__file__), "..", "compiled-json/recentfanvideos.json")
OUT_RECENT_OFFICIAL_VIDEOS = os.path.join(os.path.dirname(__file__), "..", "compiled-json/recentofficialvideos.json")
RECENT_VIDEOS_COUNT = 15
COMPILED_DIR = os.path.join(os.path.dirname(__file__), "..", "compiled-json")
AVATAR_DIR = os.path.join(COMPILED_DIR, "avatars")
NEWS_IMG_DIR = os.path.join(COMPILED_DIR, "images")
NEWS_IMG_URL = "/viewers/cep-solid/compiled-json/images"
BACKGROUND_DIR = os.path.join(COMPILED_DIR, "backgrounds")
OUT_CONTRIBUTORS = os.path.join(COMPILED_DIR, "contributors.json")
OUT_USER_PROFILES = os.path.join(COMPILED_DIR, "userProfiles.json")
PROFILE_TTL_HOURS = 24
BIO_PREVIEW_CHARS = 200
OUT_STATS = os.path.join(COMPILED_DIR, "ExtraStatistics.json")
OUT_NEWS = os.path.join(COMPILED_DIR, "DiscourseNews.json")
OUT_RECENT_TOPICS = os.path.join(COMPILED_DIR, "DiscourseRecent.json")
DISCOURSE = "https://forum.cheeseepedia.org"
NEWS_CATEGORY_ID = 5
NEWS_URL = f"{DISCOURSE}/c/news/{NEWS_CATEGORY_ID}/l/latest.json?order=created"
LATEST_URL = f"{DISCOURSE}/latest.json?order=created"
DISCOURSE_API_KEY = (os.environ.get("DISCOURSE_API_KEY") or "").strip()
DISCOURSE_API_USER = (os.environ.get("DISCOURSE_API_USERNAME") or "system").strip()
DISCOURSE_HEADERS = {"User-Agent": "Mozilla/5.0"}
if DISCOURSE_API_KEY:
    DISCOURSE_HEADERS["Api-Key"] = DISCOURSE_API_KEY
    DISCOURSE_HEADERS["Api-Username"] = DISCOURSE_API_USER
BADGE_TIERS = [
    (1000, 123), (750, 122), (500, 121), (300, 120), (150, 119), (100, 118), (75, 117),
    (50, 116), (25, 115), (10, 114), (5, 113), (2, 112), (1, 111),
]
THUMB_FIELD = "pageThumbnailVideo"
THUMB_FILE_FIELD = "pageThumbnailFile"
TAGGED_BY_TYPES = {"steam comment", "reviews", "videos", "photos", "transcriptions"}
OUT_TAGGED_BY = os.path.join(os.path.dirname(__file__), "..", "compiled-json/taggedByIDs.json")
THUMB_CANDIDATES = ["maxresdefault", "sddefault", "hqdefault", "mqdefault", "default"]
PHOTO_SIM_BITS = 16
PHOTO_HASH_CACHE = os.path.join(os.path.dirname(__file__), "..", "compiled-json/photo_hashes.json")
OUT_REJECTED = os.path.join(os.path.dirname(__file__), "..", "permanent-json/rejected_videos.json")
OUT_FAILED_THUMBS = os.path.join(os.path.dirname(__file__), "..", "permanent-json/failed_thumbnails.json")
MEDIA_TYPES = {"Photos", "Videos"}
ID_ALPHABET = string.ascii_lowercase + string.digits
PREFETCH = 3
MAX_SUGGESTIONS = 8
NO_BODY_TAG_TYPES = {"transcriptions", "videos"}
TAG_OPEN = "Open/Operating/In Production"
TAG_CLOSED = "Closed/Shut Down/Production Stopped"

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
    "CEC Adventure World 2.0 Remodel": "9",
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
    build_search_db()
    copy_search_worker()
    title_to_id = build_title_to_id_map()
    id_to_title = build_id_to_title_map(title_to_id)
    type_to_ids = build_type_to_ids()
    
    force_image_thumbnails()
    sort_keys = build_sort_keys()
    write_json(sort_keys, OUT_SORT_KEYS)
    tags, id_tags = build_tags()
    tagged_by = build_tagged_by(tags)
    write_json(tagged_by, OUT_TAGGED_BY)
    write_json(tags, OUT_TAGS)
    write_json(id_tags, OUT_ID_TO_TAGS)
    write_json(type_to_ids, OUT_TYPE_TO_IDS)
    write_json(title_to_id, OUT_TITLE_TO_ID)
    write_json(id_to_title, OUT_ID_TO_TITLE)
    recent_fan = build_recent_videos(False)
    recent_official = build_recent_videos(True)
    write_json(recent_fan, OUT_RECENT_FAN_VIDEOS)
    write_json(recent_official, OUT_RECENT_OFFICIAL_VIDEOS)
    stats = build_stats(len(tags))
    write_json(stats, OUT_STATS)

    print(green(f'Wrote {len(title_to_id)} titles -> {OUT_TITLE_TO_ID}'))
    print(green(f'Wrote {len(id_to_title)} ids -> {OUT_ID_TO_TITLE}'))
    print(green(f'Wrote {len(type_to_ids)} types -> {OUT_TYPE_TO_IDS}'))
    print(green(f'Wrote {len(sort_keys)} sort keys -> {OUT_SORT_KEYS}'))
    print(green(f'Wrote {len(tagged_by)} tagged-by lists -> {OUT_TAGGED_BY}'))
    print(green(f'Wrote {len(tags)} tags -> {OUT_TAGS}'))
    print(green(f'Wrote {len(id_tags)} articles with tags -> {OUT_ID_TO_TAGS}'))
    print(green(f'Wrote {len(recent_fan)} recent fan videos -> {OUT_RECENT_FAN_VIDEOS}'))
    print(green(f'Wrote {len(recent_official)} recent official videos -> {OUT_RECENT_OFFICIAL_VIDEOS}'))
    print(green(f'Wrote stats: {stats["photos"]} photos, {stats["videos"]} videos, {stats["articles"]} other, {stats["contributors"]} contributors, {stats["tags"]} tags -> {OUT_STATS}'))

    pull_discourse()
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

def build_sort_keys():
    keys = {}
    for folder in sorted(Path(CONTENT_DIR).iterdir()):
        if not folder.is_dir():
            continue
        meta = read_meta(folder)
        if not meta:
            continue
        date = meta.get('startDate') or ''
        start = int(date.replace('-', '')) if DATE_RE.fullmatch(date) and not date.startswith('0000') else 0
        stamps = [(folder / n).stat().st_mtime for n in ('meta.json',) + BODY_FILES if (folder / n).exists()]
        updated = max(0, int((max(stamps) - SORT_EPOCH) // 3600)) if stamps else 0
        keys[folder.name] = [start, updated]
    return keys


def clean_for_search(body):
    s = body.replace("\u2019", "'").replace("\u2018", "'")
    s = CITE_SHORTCODE_RE.sub(" ", s)
    s = WIKI_SHORTCODE_RE.sub(lambda m: m.group(1) or m.group(2) or m.group(3) or "", s)
    s = MD_LINK_RE.sub(r"\1", s)
    s = URL_RE.sub(" ", s)
    return MD_CHARS_RE.sub(" ", s)


def chunk_body(body):
    ts, chunk_ts, words = "", "", []
    for tok in clean_for_search(body).split():
        m = TS_TOKEN_RE.match(tok)
        if m:
            ts = m.group(1)
            continue
        if not words:
            chunk_ts = ts
        words.append(tok)
        if len(words) >= CHUNK_WORDS:
            yield " ".join(words), chunk_ts
            words = []
    if words:
        yield " ".join(words), chunk_ts


def build_search_db():
    os.makedirs(os.path.dirname(OUT_SEARCH_DB), exist_ok=True)
    if os.path.exists(OUT_SEARCH_DB):
        os.remove(OUT_SEARCH_DB)
    con = sqlite3.connect(OUT_SEARCH_DB)
    con.execute("PRAGMA page_size=1024")
    con.execute(
        "CREATE VIRTUAL TABLE chunks USING fts5("
        "text, folder UNINDEXED, ts UNINDEXED, "
        "tokenize=\"unicode61 remove_diacritics 2 tokenchars ''''\", columnsize=0)"
    )
    articles = rows = 0
    for folder in sorted(Path(CONTENT_DIR).iterdir()):
        if not folder.is_dir():
            continue
        body = read_body(folder)
        if not body.strip():
            continue
        batch = [(text, folder.name, ts) for text, ts in chunk_body(body)]
        if batch:
            con.executemany("INSERT INTO chunks(text, folder, ts) VALUES (?, ?, ?)", batch)
            articles += 1
            rows += len(batch)
    con.execute("INSERT INTO chunks(chunks) VALUES ('optimize')")
    con.commit()
    con.execute("VACUUM")
    con.close()
    print(green(f'Wrote search db: {articles} articles, {rows} chunks -> {OUT_SEARCH_DB}'))


def copy_search_worker():
    here = Path(__file__).resolve().parent
    dists = [p / "node_modules" / "sql.js-httpvfs" / "dist" for p in [here, *here.parents]]
    dist = next((d for d in dists if d.is_dir()), None)
    if dist is None:
        print(red("sql.js-httpvfs not found in any node_modules above this script. Run: npm install sql.js-httpvfs"), file=sys.stderr)
        return
    out_dir = Path(os.path.dirname(OUT_SEARCH_DB))
    for name in ("sqlite.worker.js", "sql-wasm.wasm"):
        src = dist / name
        if not src.exists():
            print(red(f"Missing {src}"), file=sys.stderr)
            return
        shutil.copy(src, out_dir / name)
    print(green(f"Copied search worker files -> {out_dir}"))


def fts_query(text):
    text = text.replace("\u2019", "'").replace("\u2018", "'")
    parts = [(m.group(1) or m.group(2)).replace('"', '') for m in re.finditer(r'"([^"]*)"|(\S+)', text)]
    return " ".join(f'"{p}"' for p in parts if p.strip())


def search_text(query, limit=50):
    query = fts_query(query)
    if not query:
        return []
    con = sqlite3.connect(OUT_SEARCH_DB)
    try:
        return con.execute(
            "SELECT folder, ts, found, score FROM ("
            "SELECT folder, ts, found, score, ROW_NUMBER() OVER (PARTITION BY folder ORDER BY score) AS rn FROM ("
            "SELECT folder, ts, snippet(chunks, 0, '<mark>', '</mark>', '…', ?) AS found, bm25(chunks) AS score "
            "FROM chunks WHERE chunks MATCH ?)) WHERE rn = 1 ORDER BY score LIMIT ?",
            (SNIPPET_WORDS, query, limit),
        ).fetchall()
    finally:
        con.close()


def tag_name(val):
    if isinstance(val, dict):
        return str(val.get('n', '')).strip()
    return str(val).split('|', 1)[0].strip()


def read_body(folder):
    for name in BODY_FILES:
        p = folder / name
        if p.exists():
            text = p.read_text(encoding='utf-8')
            if text.strip():
                return text
    return ''


def location_tags(title):
    state = STATE_CODE_RE.search(title)
    if state and state.group(1) in US_STATES:
        return [US_STATES[state.group(1)], "United States"]
    country = COUNTRY_RE.search(title)
    if country:
        return [COUNTRY_NAMES[country.group(1).lower()]]
    return []


def extract_meta_tags(fm):
    tags, seen = [], set()

    def push(v):
        v = str(v).strip()
        if v and v.lower() not in seen:
            seen.add(v.lower())
            tags.append(v)

    for field in DICT_TAG_FIELDS:
        for item in (fm.get(field) or []):
            push(tag_name(item))
    for field in STRING_TAG_FIELDS:
        val = fm.get(field)
        if not val:
            continue
        for item in (val if isinstance(val, list) else [val]):
            push(tag_name(item))
    push(fm.get('videoChannelHandle') or '')
    push(fm.get('type', ''))
    if (fm.get('type', '') or '').strip().lower() not in NO_TITLE_TAG_TYPES:
        push(fm.get('title', ''))
    if (fm.get('type', '') or '').strip().lower() == 'locations':
        for t in location_tags(fm.get('title', '') or ''):
            push(t)
    date = fm.get('startDate', '') or ''
    year = date.split('-')[0] if date != '0000-00-00' else ''
    push(year if year and year != '0000' else 'Unknown Year')
    if (fm.get('type', '') or '').strip().lower() not in NO_TITLE_TAG_TYPES:
        end = (fm.get('endDate') or '').strip()
        if end != '0000-00-00':
            push(TAG_OPEN if not end or end > datetime.date.today().isoformat() else TAG_CLOSED)
    return tags


def extract_body_tags(body):
    out = []
    for m in BRACKET_TAG_RE.finditer(body):
        val = m.group(1).strip()
        if val and not val.isdigit():
            out.append(val)
    return out

def build_tags():
    tag_idx, id_tags, canon = {}, {}, {}
    entries, location_extras = [], {}
    for folder in sorted(Path(CONTENT_DIR).iterdir()):
        if not folder.is_dir():
            continue
        meta = read_meta(folder)
        if not meta:
            continue
        entries.append((folder, meta))
        if (meta.get('type') or '').strip().lower() == 'locations':
            title = (meta.get('title') or '').strip().lower()
            extras = location_tags(meta.get('title') or '')
            if title and extras:
                location_extras[title] = extras
    for folder, meta in entries:
        seen = set()
        kind = (meta.get('type') or '').strip().lower()
        meta_tags = extract_meta_tags(meta)
        article_tags = list(meta_tags)
        if kind not in NO_BODY_TAG_TYPES:
            article_tags += extract_body_tags(read_body(folder))
        if kind in ("photos", "videos"):
            for tag in meta_tags:
                article_tags += location_extras.get(tag.lower(), [])
        for tag in article_tags:
            key = tag.lower()
            if key in seen:
                continue
            seen.add(key)
            name = canon.setdefault(key, tag)
            tag_idx.setdefault(name, []).append(folder.name)
            id_tags.setdefault(folder.name, []).append(name)
    return tag_idx, id_tags


def force_image_thumbnails():
    first_image = {}
    for folder in sorted(Path(CONTENT_DIR).iterdir()):
        if not folder.is_dir():
            continue
        meta = read_meta(folder)
        if (meta.get('type') or '').strip().lower() != 'photos':
            continue
        title = (meta.get('title') or '').strip()
        if not title:
            continue
        for field in DICT_TAG_FIELDS + STRING_TAG_FIELDS:
            val = meta.get(field)
            if not val:
                continue
            for item in (val if isinstance(val, list) else [val]):
                name = tag_name(item).lower()
                if name:
                    first_image.setdefault(name, title)

    updated = 0
    for folder in sorted(Path(CONTENT_DIR).iterdir()):
        if not folder.is_dir():
            continue
        meta = read_meta(folder)
        title = (meta.get('title') or '').strip()
        if not title or meta.get(THUMB_FILE_FIELD):
            continue
        image = first_image.get(title.lower())
        if not image or image == title:
            continue
        raw = (folder / "meta.json").read_text(encoding="utf-8-sig")
        meta[THUMB_FILE_FIELD] = image
        indent = 2 if "\n" in raw.strip() else None
        (folder / "meta.json").write_text(json.dumps(meta, ensure_ascii=False, indent=indent), encoding="utf-8")
        updated += 1
    print(green(f"Set {THUMB_FILE_FIELD} on {updated} article(s)"))


def build_tagged_by(tags):
    lookup = {name.lower(): ids for name, ids in tags.items()}
    types, titles = {}, {}
    for folder in sorted(Path(CONTENT_DIR).iterdir()):
        if not folder.is_dir():
            continue
        meta = read_meta(folder)
        if not meta:
            continue
        types[folder.name] = (meta.get('type') or '').strip().lower()
        titles[folder.name] = (meta.get('title') or '').strip().lower()
    result = {}
    for folder_id, title in titles.items():
        ids = lookup.get(title, []) if title else []
        matched = [i for i in ids if i != folder_id and types.get(i) in TAGGED_BY_TYPES]
        if matched:
            result[folder_id] = matched
    return result


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

def build_stats(tag_count):
    counts = {"photos": 0, "videos": 0, "articles": 0}
    contributors = set()
    for folder in Path(CONTENT_DIR).iterdir():
        if not folder.is_dir():
            continue
        meta = read_meta(folder)
        if not meta:
            continue
        kind = (meta.get('type') or '').strip().lower()
        if kind == 'user':
            continue
        counts[kind if kind in ("photos", "videos") else "articles"] += 1
        for name in meta.get('contributors') or []:
            if isinstance(name, str) and name.strip():
                contributors.add(name.strip())
    generated = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
    return {**counts, "contributors": len(contributors), "tags": tag_count, "generated": generated}


def fetch_json(url):
    with urllib.request.urlopen(url) as r:
        return json.loads(r.read())


def build_news_topic(t):
    thumbs = t.get("thumbnails") or []
    thumb = next((x for x in thumbs if x.get("max_width") == 400), None)
    src = (thumb or {}).get("url") or t.get("image_url")
    local = None
    if src:
        with urllib.request.urlopen(src) as r:
            Path(NEWS_IMG_DIR, f"{t['id']}.jpg").write_bytes(r.read())
        local = f"{NEWS_IMG_URL}/{t['id']}.jpg"
    return {
        "title": t["title"],
        "image_url": local,
        "views": t.get("views"),
        "created_at": t.get("created_at"),
        "url": f"{DISCOURSE}/t/{t['slug']}/{t['id']}",
    }


def pull_discourse():
    if not DISCOURSE_API_KEY:
        print(red("DISCOURSE_API_KEY is not set, skipping Discourse"), file=sys.stderr)
        return
    if ask("Pull/Modify Discourse"):
        build_contributors()
        build_discourse_news()


def build_discourse_news():
    shutil.rmtree(NEWS_IMG_DIR, ignore_errors=True)
    os.makedirs(NEWS_IMG_DIR)

    data = fetch_json(NEWS_URL)
    news = [build_news_topic(t) for t in data.get("topic_list", {}).get("topics", [])]
    write_json(news, OUT_NEWS)

    data = fetch_json(LATEST_URL)
    recent = []
    for t in data.get("topic_list", {}).get("topics", []):
        if t.get("category_id") == NEWS_CATEGORY_ID:
            continue
        entry = build_news_topic(t)
        entry["category_id"] = t.get("category_id")
        recent.append(entry)
    write_json(recent, OUT_RECENT_TOPICS)
    print(green(f"Wrote {len(news)} news topics -> {OUT_NEWS}"))
    print(green(f"Wrote {len(recent)} recent non-news topics -> {OUT_RECENT_TOPICS}"))


def avatar_filename(name):
    return re.sub(r'[^\w\-.]', '_', name) + '.jpg'


def discourse_get(url, timeout=10):
    req = urllib.request.Request(url, headers=DISCOURSE_HEADERS)
    return json.loads(urllib.request.urlopen(req, timeout=timeout).read())


def discourse_get_retry(url, max_retries=6):
    delay = 2
    for attempt in range(1, max_retries + 1):
        try:
            return discourse_get(url, 15)
        except urllib.error.HTTPError as e:
            if e.code == 429 and attempt < max_retries:
                retry_after = e.headers.get('Retry-After')
                wait = float(retry_after) if retry_after else delay
                print(yellow(f"    ! rate limited, waiting {wait:.0f}s (attempt {attempt}/{max_retries})..."))
                time.sleep(wait)
                delay *= 2
                continue
            raise


def fetch_discourse_directory():
    users, page = [], 0
    while True:
        data = discourse_get(f"{DISCOURSE}/directory_items.json?period=all&order=post_count&page={page}")
        items = data.get('directory_items', [])
        if not items:
            break
        users.extend(i['user'] for i in items if i.get('user'))
        if not data.get('meta', {}).get('load_more_directory_items'):
            break
        page += 1
    return users


def fetch_discourse_admin_users():
    all_users, page = [], 0
    while True:
        try:
            batch = discourse_get_retry(f"{DISCOURSE}/admin/users/list/active.json?page={page}")
        except Exception as e:
            print(red(f"Discourse admin users request failed on page {page}, check DISCOURSE_API_KEY and DISCOURSE_API_USERNAME: {e}"), file=sys.stderr)
            return None
        if not batch:
            break
        all_users.extend(batch)
        if len(batch) < 100:
            break
        page += 1
        time.sleep(0.2)
    return all_users


def collect_contributors():
    found = {}
    for folder in Path(CONTENT_DIR).iterdir():
        if not folder.is_dir():
            continue
        meta = read_meta(folder)
        kind = (meta.get('type') or '').strip().lower()
        if kind == 'user' or kind in {t.lower() for t in TAGGED_BY_TYPES}:
            continue
        for name in meta.get('contributors') or []:
            if not name:
                continue
            entry = found.setdefault(name.strip(), {'count': 0, 'articles': []})
            entry['count'] += 1
            entry['articles'].append(folder.name)
    return found

def load_json_file(path):
    try:
        with open(path, encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return {}


def download_background(username, url, replace=False):
    if not url:
        return None
    full = urllib.parse.urljoin(DISCOURSE, url)
    ext = os.path.splitext(urllib.parse.urlparse(full).path)[1] or '.jpg'
    name = re.sub(r'[^\w\-.]', '_', username) + ext
    path = Path(BACKGROUND_DIR, name)
    if replace or not path.exists():
        try:
            req = urllib.request.Request(full, headers=DISCOURSE_HEADERS)
            with urllib.request.urlopen(req, timeout=20) as r:
                path.write_bytes(r.read())
        except Exception:
            return name if path.exists() else None
    return name


def fetch_user_profile(user, old):
    username = user['username']
    try:
        data = discourse_get_retry(f"{DISCOURSE}/u/{urllib.parse.quote(username)}.json")
    except Exception as e:
        print(red(f"    ! could not fetch profile for {username}: {e}"))
        return None
    u = data.get('user') or {}
    background = u.get('profile_background_upload_url') or u.get('card_background_upload_url')
    return {
        'bio': (u.get('bio_raw') or '').strip(),
        'joined': u.get('created_at') or '',
        'bg': download_background(username, background, not old or old.get('src') != background),
        'src': background,
        'avt': user.get('avatar_template'),
        'fetched': int(time.time()),
    }


def download_avatar(user, force=False):
    template = user.get('avatar_template')
    if not template:
        return
    path = Path(AVATAR_DIR, avatar_filename(user['username']))
    if path.exists() and not force:
        return
    try:
        req = urllib.request.Request(DISCOURSE + template.replace('{size}', '128'), headers=DISCOURSE_HEADERS)
        with urllib.request.urlopen(req, timeout=10) as r:
            path.write_bytes(r.read())
    except Exception:
        pass


def owned_badge_ids(username):
    try:
        data = discourse_get_retry(f"{DISCOURSE}/user-badges/{urllib.parse.quote(username)}.json")
    except Exception as e:
        print(red(f"    ! could not fetch existing badges for {username}: {e}"))
        return None
    owned = {ub['badge_id'] for ub in data.get('user_badges', []) if ub.get('badge_id') is not None}
    if not owned:
        owned = {b['id'] for b in data.get('badges', []) if b.get('id') is not None}
    return owned


def grant_badge(username, badge_id):
    body = urllib.parse.urlencode({'username': username, 'badge_id': badge_id}).encode()
    req = urllib.request.Request(
        f"{DISCOURSE}/user_badges",
        data=body,
        method='POST',
        headers={**DISCOURSE_HEADERS, 'Content-Type': 'application/x-www-form-urlencoded'},
    )
    with urllib.request.urlopen(req, timeout=10) as resp:
        return json.loads(resp.read())


def award_badges(contributors, dry_run=False):
    candidates = [e for e in contributors if e.get('fu') and e.get('count', 0) > 0]
    print(cyan(f"Checking badges for {len(candidates)} matched contributors..."))

    granted_total = 0
    removed_total = 0
    for i, e in enumerate(candidates, 1):
        username, count = e['fu'], e['count']
        owed = [(t, bid) for t, bid in BADGE_TIERS if count >= t]
        owed_bids = {bid for _, bid in owed}
        owned = owned_badge_ids(username)
        if owned is None:
            continue
            
        all_tier_bids = {bid for _, bid in BADGE_TIERS}
        for bid in owned:
            if bid in all_tier_bids and bid not in owed_bids:
                if dry_run:
                    print(dim(f"  [dry-run] would revoke badge {bid} from {username} (count {count} too low)"))
                    continue
                try:
                    revoke_badge(username, bid)
                    print(yellow(f"  [{i}/{len(candidates)}] revoked badge {bid} from {username} (count {count} too low)"))
                    removed_total += 1
                    time.sleep(0.3)
                except urllib.error.HTTPError as ex:
                    print(red(f"    ! failed to revoke badge {bid} from {username}: HTTP {ex.code} {ex.read()[:200]}"))
                except Exception as ex:
                    print(red(f"    ! failed to revoke badge {bid} from {username}: {ex}"))

        for threshold, bid in [(t, b) for t, b in owed if b not in owned]:
            if dry_run:
                print(dim(f"  [dry-run] would grant badge {bid} (>= {threshold}) to {username}"))
                continue
            try:
                grant_badge(username, bid)
                print(green(f"  [{i}/{len(candidates)}] granted badge {bid} (>= {threshold}) to {username}"))
                granted_total += 1
                time.sleep(0.3)
            except urllib.error.HTTPError as ex:
                print(red(f"    ! failed to grant badge {bid} to {username}: HTTP {ex.code} {ex.read()[:200]}"))
            except Exception as ex:
                print(red(f"    ! failed to grant badge {bid} to {username}: {ex}"))

    print(green(f"{'Would grant' if dry_run else 'Granted'} {granted_total} new badge(s) and {'would remove' if dry_run else 'removed'} {removed_total} excess badge(s) total."))

def revoke_badge(username, user_badge_id):
    req = urllib.request.Request(
        f"{DISCOURSE}/user_badges/{user_badge_id}.json",
        method='DELETE',
        headers=DISCOURSE_HEADERS,
    )
    with urllib.request.urlopen(req, timeout=10) as resp:
        return json.loads(resp.read())

def build_contributors():
    dry_run = '--dry-run' in sys.argv
    skip_badges = '--no-badges' in sys.argv
    os.makedirs(AVATAR_DIR, exist_ok=True)

    print(cyan("Fetching Discourse users..."))
    users = fetch_discourse_admin_users()
    if users is None:
        return
    print(f"  {len(users)} users")
    try:
        post_counts = {u.get('username', '').lower(): u.get('post_count', 0)
                       for u in fetch_discourse_directory() if u.get('username')}
        for u in users:
            name = (u.get('username') or '').lower()
            if name in post_counts:
                u['post_count'] = post_counts[name]
    except Exception as e:
        print(red(f"  ! could not enrich admin user list with post counts from directory: {e}"))

    contribs = collect_contributors()
    print(f"  {len(contribs)} contributors")

    old_profiles = load_json_file(OUT_USER_PROFILES)
    refresh_all = '--refresh-users' in sys.argv
    ttl = PROFILE_TTL_HOURS * 3600
    now = int(time.time())
    named = [u for u in users if u.get('username')]
    changed_avatar, stale = set(), []
    for u in named:
        key = u['username'].lower()
        old = old_profiles.get(key)
        if old and old.get('fetched') and old.get('avt') != u.get('avatar_template'):
            changed_avatar.add(key)
        if refresh_all or not old or key in changed_avatar or now - old.get('fetched', 0) > ttl:
            stale.append(u)

    with ThreadPoolExecutor(max_workers=16) as ex:
        list(ex.map(lambda u: download_avatar(u, refresh_all or u.get('username', '').lower() in changed_avatar), users))

    os.makedirs(BACKGROUND_DIR, exist_ok=True)
    print(cyan(f"Refreshing {len(stale)} of {len(named)} Discourse profiles..."))
    with ThreadPoolExecutor(max_workers=4) as ex:
        fetched = list(ex.map(lambda u: fetch_user_profile(u, old_profiles.get(u['username'].lower())), stale))
    current = {u['username'].lower() for u in named}
    profiles = {k: v for k, v in old_profiles.items() if k in current}
    for u, p in zip(stale, fetched):
        if p:
            profiles[u['username'].lower()] = p
    write_json(profiles, OUT_USER_PROFILES)
    print(green(f"Wrote {len(profiles)} user profiles -> {OUT_USER_PROFILES}"))

    lookup = {}
    for u in users:
        if u.get('username'):
            lookup[u['username'].lower()] = u
        if u.get('name'):
            lookup[u['name'].lower()] = u

    def forum_fields(u):
        username = u.get('username', '')
        return {
            'fu': username,
            'fn': u.get('name', ''),
            'url': f"{DISCOURSE}/u/{username}",
            'av': avatar_filename(username) if u.get('avatar_template') else None,
            'pc': u.get('post_count', 0),
        }

    def add_bio(entry):
        profile = profiles.get((entry.get('fu') or '').lower()) or {}
        bio = ' '.join((profile.get('bio') or '').split())
        if bio:
            entry['bio'] = bio if len(bio) <= BIO_PREVIEW_CHARS else bio[:BIO_PREVIEW_CHARS].rstrip() + '…'

    out, matched = [], set()
    for name, d in sorted(contribs.items(), key=lambda x: -x[1]['count']):
        entry = {'name': name, 'count': d['count'], 'articles': d['articles']}
        u = lookup.get(name.lower())
        if u:
            matched.add(u.get('username', '').lower())
            entry.update(forum_fields(u))
        add_bio(entry)
        out.append(entry)

    for u in users:
        if u.get('username', '').lower() in matched:
            continue
        entry = {'name': u.get('name') or u.get('username', ''), 'count': 0, 'articles': [], **forum_fields(u)}
        add_bio(entry)
        out.append(entry)

    out.sort(key=lambda x: -x['count'])
    write_json(out, OUT_CONTRIBUTORS)
    print(green(f"Wrote {len(out)} contributors -> {OUT_CONTRIBUTORS}"))

    if not skip_badges:
        award_badges(out, dry_run=dry_run)


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

def load_failed_thumbnails():
    try:
        with open(OUT_FAILED_THUMBS, encoding="utf-8") as f:
            return set(json.load(f))
    except Exception:
        return set()


def save_failed_thumbnail(folder_id):
    try:
        data = set()
        if os.path.exists(OUT_FAILED_THUMBS):
            with open(OUT_FAILED_THUMBS, encoding="utf-8") as f:
                data = set(json.load(f))
        data.add(folder_id)
        write_json(sorted(data), OUT_FAILED_THUMBS)
    except Exception:
        pass

def load_rejected():
    rejected = set()
    for path in [OUT_REJECTED, OUT_FAILED_THUMBS]:
        try:
            with open(path, encoding="utf-8") as f:
                rejected.update(json.load(f))
        except Exception:
            pass
    return rejected


def save_rejected(rejected):
    write_json(sorted(rejected), OUT_REJECTED)


def save_failed_thumbnail(vid):
    try:
        data = set()
        if os.path.exists(OUT_FAILED_THUMBS):
            with open(OUT_FAILED_THUMBS, encoding="utf-8") as f:
                data = set(json.load(f))
        data.add(vid)
        write_json(sorted(data), OUT_FAILED_THUMBS)
    except Exception:
        pass


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
    save_failed_thumbnail(vid)
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

    failed_thumbs = load_failed_thumbnails()
    videos = with_url = 0
    for folder in sorted(Path(CONTENT_DIR).iterdir()):
        meta_path = folder / "meta.json"
        if not folder.is_dir() or not meta_path.exists():
            continue
        if folder.name in failed_thumbs:
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
            if used:
                print(green(f"  saved photo.avif ({used})"))
            else:
                print(red("  all thumbnail sizes failed"))
                save_failed_thumbnail(folder.name)

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
    titles, video_ids, media_titles, unreadable, dates = set(), set(), set(), [], {}
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
            dates[title] = (meta.get("startDate") or "", meta.get("endDate") or "")
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
                dates[title] = (meta.get("startDate") or "", meta.get("endDate") or "")
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
    return titles, video_ids, media_titles, dates


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
    def __init__(self, tags, dates):
        self.pairs = [(t.lower(), t) for t in tags]
        self.dates = dates

    def get_completions(self, document, complete_event):
        text = document.text
        q = text.strip().lower()
        if not q or text.startswith(("/", "!")):
            return
        scored = [(0 if lower.startswith(q) else 1, len(t), t) for lower, t in self.pairs if q in lower]
        for _, _, t in heapq.nsmallest(MAX_SUGGESTIONS, scored):
            start, end = self.dates.get(t, ("", ""))
            yield Completion(t, start_position=-len(text), display=f"{t}  {start or '-'} / {end or '-'}")

def ask_default_tags(session, completer, tag_lookup):
    tags = []
    while True:
        text = session.prompt(ANSI(yellow(f"default tag {len(tags) + 1}> ")), completer=completer, complete_while_typing=True).strip()
        if not text:
            return tags
        if text == "/undo":
            if tags:
                print(dim(f"  Removed: {tags.pop()}"))
            continue
        tag = text[1:].strip() if text.startswith("!") else tag_lookup.get(text.lower())
        if not tag:
            print(red("  No article with that title. Pick a suggestion, or prefix with ! to add it anyway."))
        elif tag in tags:
            print(yellow("  Already added."))
        else:
            tags.append(tag)
            print(green("  Default tags: " + " | ".join(tags)))

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
        if text.lower().startswith("/autoaccept"):
            pattern = text[len("/autoaccept"):].strip()
            if pattern:
                return "autoaccept", [pattern]
            print(red("  Usage: /autoaccept <text>"))
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
    print(dim("Empty line = save.  /reject  /skip  /undo  /quit  /autoreject <text>  /autoaccept <text>"))

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
    site_titles, existing, media_titles, site_dates = load_site_data()
    tag_titles = sorted(t for t in site_titles if not re.match(r"https?://", t, re.I) and not t.lower().endswith(".avif") and t not in media_titles)
    tag_lookup = {t.lower(): t for t in tag_titles}
    completer = TagCompleter(tag_titles, site_dates)
    rejected = load_rejected()
    session = PromptSession()
    executor = ThreadPoolExecutor(max_workers=PREFETCH)
    listing_pool = ThreadPoolExecutor(max_workers=2)
    listings = {}
    saved = auto_rejected = auto_accepted = 0

    try:
        for n, handle in enumerate(CHANNELS):
            for h in CHANNELS[n:n + 2]:
                if h not in listings:
                    listings[h] = listing_pool.submit(list_channel_videos, h)
            print(cyan(f"Listing {handle}..."))
            listing = listings.pop(handle).result()

            reject_patterns = []
            accept_rules = []

            in_wiki = sum(v in existing for v in listing)
            pending = [v for v in listing if v not in existing and v not in rejected]
            print(green(f"{handle}: {len(listing)} videos, {in_wiki} in wiki, {len(pending)} to review"))
            if not pending:
                print(dim(f"{handle}: nothing new, skipping"))
                continue
            if OLDEST_FIRST:
                pending.reverse()
            futures = {v: executor.submit(fetch_details, v) for v in pending}
            total = len(pending)

            while pending:
                vid = pending.pop(0)
                i = total - len(pending)
                details = futures.pop(vid).result()
                if "error" in details:
                    print(red(f"\n[{i}/{total}] Could not load {vid}: {details['error']}"))
                    continue
                if matches_pattern(details["title"], reject_patterns):
                    auto_rejected += 1
                    print(yellow(f"\n[{i}/{total}] Auto-rejected: {details['title']}"))
                    continue
                rule_tags = next((t for p, t in accept_rules if matches_pattern(details["title"], [p])), None)
                if rule_tags is not None:
                    print(green(f"\n[{i}/{total}] Auto-accepted: {details['title']}"))
                    print(green(f"  Saved to {CONTENT_DIR}/{save_video(details, list(rule_tags), site_titles)}"))
                    existing.add(vid)
                    saved += 1
                    auto_accepted += 1
                    continue

                show_video(i, total, details)
                action, tags = ask_tags(session, completer, tag_lookup)

                if action == "quit":
                    return
                if action == "skip":
                    continue
                if action == "autoreject":
                    reject_patterns.append(tags[0])
                    kept = []
                    for v in pending:
                        if matches_pattern(listing[v], reject_patterns):
                            futures.pop(v).cancel()
                        else:
                            kept.append(v)
                    removed = len(pending) - len(kept) + 1
                    pending[:] = kept
                    auto_rejected += removed
                    print(yellow(f"  Auto-rejected {removed} video(s) matching '{tags[0]}' for {handle} only."))
                    continue
                if action == "reject":
                    rejected.add(vid)
                    save_rejected(rejected)
                    print(yellow("  Rejected."))
                    continue
                if action == "autoaccept":
                    pattern = tags[0]
                    print(cyan(f"  Default tags for '{pattern}' (empty line to finish):"))
                    default_tags = ask_default_tags(session, completer, tag_lookup)
                    accept_rules.append((pattern, default_tags))
                    tags = list(default_tags)
                    print(green(f"  Auto-accepting '{pattern}' for {handle} only with tags: {' | '.join(default_tags) or '(none)'}"))

                print(green(f"  Saved to {CONTENT_DIR}/{save_video(details, tags, site_titles)}"))
                existing.add(vid)
                saved += 1
    except (KeyboardInterrupt, EOFError):
        print(yellow("\nStopped."))
    finally:
        executor.shutdown(wait=False, cancel_futures=True)
        listing_pool.shutdown(wait=False, cancel_futures=True)
        print(green(f"Fandom videos: {saved} created ({auto_accepted} auto-accepted), {auto_rejected} auto-rejected by title"))

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
