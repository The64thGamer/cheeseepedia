#!/usr/bin/env python3
"""
Turn the video tables found in content/*/(content|old).md into new Videos articles.

Input : video-table-report/tables.tsv (file, line, heading, cols, rows, urls, separator, header)
Output: one new folder per YouTube video under content/<16 char id>/ with a meta.json
        shaped exactly like compile.py's save_video(). compile.py later adds the
        thumbnail, transcript (content.md) and channel handle.

Default is a DRY RUN: it writes video-table-report/new-videos.tsv and prints a report.
Pass --write to actually create the folders.

Run from the same directory you run compile.py from (the one containing ./content).

Usage:
    python tables_to_videos.py                    # dry run
    python tables_to_videos.py --write
    python tables_to_videos.py --write --fetch-meta   # fill missing dates via yt-dlp
"""
import argparse, calendar, html, json, re, secrets, string, sys, urllib.parse
from collections import Counter
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

CONTENT_DIR = "content"
REPORT_DIR = Path("video-table-report")
CONTRIBUTOR = "sudo-trans-pony"
ID_ALPHABET = string.ascii_lowercase + string.digits
UNKNOWN_DATE = "0000-00-00"

# Tables whose header mentions any of these are animatronic / location / showtape tables, not footage.
SKIP_HEADER_WORDS = ("animatronic", "serial", "s/n", "store", "stage", "showtape", "song",
                     "character", "manufactur", "installed", "removed", "condition", "whereabouts")

# ---------------------------------------------------------------- helpers copied from compile.py
YT_ID_RE = re.compile(r"(?:youtu\.be/|[?&]v=|/(?:shorts|embed|live|v|e)/)([A-Za-z0-9_-]{11})")
MD_LINK_RE = re.compile(r"\[([^\]]*)\]\([^)]*\)")
WIKI_SHORTCODE_RE = re.compile(r"""\{\{<?\s*wiki-link\s+(?:"([^"]+)"|'([^']+)'|([^\s}>]+))[^}]*\}\}""", re.I)
CITE_SHORTCODE_RE = re.compile(r"\{\{<?\s*cite\s[^}]*\}\}", re.I)
URL_RE = re.compile(r"https?://\S+")


def yt_ids(text):
    """All YouTube IDs in a string, in order, de-duplicated."""
    s = html.unescape(urllib.parse.unquote((text or "").replace("\\", "")))
    out = []
    for m in YT_ID_RE.finditer(s):
        if m.group(1) not in out:
            out.append(m.group(1))
    return out


def youtube_id(url):
    ids = yt_ids(url)
    return ids[0] if ids else None


def iter_strings(value):
    if isinstance(value, str):
        yield value
    elif isinstance(value, dict):
        for v in value.values():
            yield from iter_strings(v)
    elif isinstance(value, (list, tuple)):
        for v in value:
            yield from iter_strings(v)


def read_meta(folder):
    try:
        return json.loads((folder / "meta.json").read_text(encoding="utf-8-sig"))
    except Exception:
        return {}


def sanitize_title(title):
    for q in ('"', "\u201c", "\u201d", "\u201e", "\u201f"):
        title = title.replace(q, "''")
    title = re.sub(r"[\x00-\x1f\x7f]", " ", title.replace("\\", ""))
    return re.sub(r"\s+", " ", title).strip()


# ---------------------------------------------------------------- dates
_MON = r"(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|sept?(?:ember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)"
MONTHS = {m: i for i, m in enumerate(["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"], 1)}
DATE_PAT = re.compile(rf"""
   (?P<iso>(?<!\d)(?P<iy>\d{{4}})[-/.](?P<im>\d{{1,2}})[-/.](?P<id>\d{{1,2}})(?!\d))
 | (?P<isoym>(?<!\d)(?P<iy2>(?:19|20)\d{{2}})[-/](?P<im2>\d{{1,2}})(?![\d/-]))
 | (?P<us>(?<!\d)(?P<ua>\d{{1,2}})[-/.](?P<ub>\d{{1,2}})[-/.](?P<uy>\d{{4}}|\d{{2}})(?!\d))
 | (?P<mdy>\b(?P<mm>{_MON})\.?\s+(?P<md>\d{{1,2}})(?:st|nd|rd|th)?,?\s+(?P<my>\d{{4}}))
 | (?P<dmy>\b(?P<dd>\d{{1,2}})(?:st|nd|rd|th)?\s+(?P<dm>{_MON})\.?,?\s+(?P<dy>\d{{4}}))
 | (?P<mony>\b(?P<mym>{_MON})\.?,?\s+(?P<myy>\d{{4}}))
 | (?P<yr>(?<!\d)(?:19|20)\d{{2}}(?!\d))
""", re.X | re.I)


def _mk(y, m, d):
    y, m, d = int(y), int(m), int(d)
    if not 1950 <= y <= 2100:
        return None
    if not 1 <= m <= 12:
        m, d = 0, 0
    elif not 1 <= d <= calendar.monthrange(y, m)[1]:
        d = 0
    return f"{y:04d}-{m:02d}-{d:02d}"


def parse_dates(text):
    """Every date found in the text, in order, as YYYY-MM-DD (00 for unknown month/day)."""
    out = []
    for m in DATE_PAT.finditer(text or ""):
        g = m.groupdict()
        if g["iso"]:
            r = _mk(g["iy"], g["im"], g["id"])
        elif g["isoym"]:
            r = _mk(g["iy2"], g["im2"], 0)
        elif g["us"]:
            a, b, y = int(g["ua"]), int(g["ub"]), int(g["uy"])
            if y < 100:
                y += 2000 if y <= 29 else 1900
            mo, d = (b, a) if a > 12 >= b else (a, b)
            r = _mk(y, mo, d)
        elif g["mdy"]:
            r = _mk(g["my"], MONTHS[g["mm"][:3].lower()], g["md"])
        elif g["dmy"]:
            r = _mk(g["dy"], MONTHS[g["dm"][:3].lower()], g["dd"])
        elif g["mony"]:
            r = _mk(g["myy"], MONTHS[g["mym"][:3].lower()], 0)
        else:
            r = _mk(g["yr"], 0, 0)
        if r:
            out.append(r)
    return out


# ---------------------------------------------------------------- table parsing
SEP_RE = re.compile(r"^[\s|:\-]+$")
GENERIC_LINK_TEXT = {"link", "links", "video", "watch", "youtube", "yt", "here", "click here",
                     "watch here", "source", "url", "video link", "youtube link", "vid"}


def split_row(line):
    s = line.strip()
    if s.startswith("|"):
        s = s[1:]
    if s.endswith("|") and not s.endswith("\\|"):
        s = s[:-1]
    return [c.replace("\\", "").strip() for c in re.split(r"(?<!\\)\|", s)]


def read_block(lines, start):
    i, blk = start - 1, []
    while 0 <= i < len(lines) and lines[i].lstrip().startswith("|"):
        blk.append(lines[i].rstrip("\r\n"))
        i += 1
    return blk


def parse_table(block):
    """-> (header cells, body rows, block line index of each body row).
    Handles '!!' separated headers and tables with no real header."""
    if "!!" in block[0]:
        block = [block[0].replace("!!", "|")] + block[1:]
    rows = [split_row(l) for l in block]
    first = 1
    if len(block) > 1 and SEP_RE.match(block[1]) and "-" in block[1]:
        first = 2
    header, body = rows[0], rows[first:]
    body_lines = list(range(first, len(block)))
    if yt_ids(" ".join(header)):  # header row is really data (e.g. tjzwx5ggu3ejg36c)
        body = [header] + body
        body_lines = [0] + body_lines
        header = [""] * len(header)
    width = max([len(header)] + [len(r) for r in body])
    header = header + [""] * (width - len(header))
    body = [r + [""] * (width - len(r)) for r in body]
    return header, body, body_lines


def classify(h):
    h = re.sub(r"[*_`!]", "", h).lower().strip()
    if not h:
        return "auto"
    if any(w in h for w in ("credit", "uploader", "owner", "poster")):
        return "credit"
    if "title" in h:
        return "title"
    if "location" in h:
        return "location"
    if "link" in h or h == "youtube":
        return "link"
    if h in ("video", "videos"):
        return "videocol"
    film = [h.find(w) for w in ("film", "footage", "record", "shot") if w in h]
    pub = [h.find(w) for w in ("publish", "pulish", "upload", "release", "posted") if w in h]
    if film and pub:
        return "both_fp" if min(film) < min(pub) else "both_pf"
    if film:
        return "filmed"
    if pub:
        return "published"
    if "year" in h:
        return "date"
    if "date" in h or h == "recorded":
        return "date"
    if any(w in h for w in ("description", "note")):
        return "desc"
    return "auto"


def roles_for(header):
    roles = [classify(h) for h in header]
    # "video | link": the video column is a title. A lone "videos" column is the link.
    sub = "title" if "link" in roles else "link"
    return [sub if r == "videocol" else r for r in roles]


def clean_md(text):
    s = CITE_SHORTCODE_RE.sub(" ", text or "")
    s = WIKI_SHORTCODE_RE.sub(lambda m: m.group(1) or m.group(2) or m.group(3) or "", s)
    s = MD_LINK_RE.sub(r"\1", s)
    s = URL_RE.sub(" ", s)
    s = re.sub(r"[*_`#>\[\]|]", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def title_from_link_text(cell):
    for m in re.finditer(r"\[([^\]]+)\]\(", cell):
        t = m.group(1).strip()
        if t.lower() not in GENERIC_LINK_TEXT and not re.match(r"https?://", t, re.I) and not yt_ids(t) and len(t) > 3:
            return t
    return ""


def title_from_description(desc):
    s = clean_md(desc)
    if not s:
        return ""
    s = re.split(r"(?<=[.!?])\s", s, maxsplit=1)[0].strip().rstrip(".")
    if len(s) > 90:
        s = s[:90].rsplit(" ", 1)[0]
    return s


def process_row(roles, cells):
    link_cells = [c for r, c in zip(roles, cells) if r == "link"] or cells
    ids = []
    for c in link_cells:
        ids += [i for i in yt_ids(c) if i not in ids]
    if not ids:
        return None

    title = link_title = desc = ""
    filmed = pub = None
    generic = []
    for r, c in zip(roles, cells):
        if r == "title" and not title:
            title = clean_md(c)
        elif r == "desc" and not desc:
            desc = c
        elif r == "link":
            link_title = link_title or title_from_link_text(c)
        elif r in ("filmed", "published", "both_fp", "both_pf", "date"):
            ds = parse_dates(c)
            if not ds:
                continue
            if r == "filmed":
                if filmed is None:
                    filmed = ds[0]
                elif pub is None:
                    pub = ds[0]  # duplicate "filming date" column: second one is the publish date
            elif r == "published":
                pub = pub or ds[0]
            elif r == "both_fp":
                filmed = filmed or ds[0]
                if len(ds) > 1:
                    pub = pub or ds[1]
            elif r == "both_pf":
                pub = pub or ds[0]
                if len(ds) > 1:
                    filmed = filmed or ds[1]
            else:
                generic.append(ds[0])
        elif r == "auto" and c and r not in ("credit", "location"):
            ds = parse_dates(c) if len(c) < 30 else []
            if ds:
                generic.append(ds[0])
            elif not desc and not yt_ids(c):
                desc = c
    # unlabeled "date | date" columns: first is filming, second is publish
    if generic:
        if filmed is None:
            filmed = generic.pop(0)
        if generic and pub is None:
            pub = generic[0]

    # a multi-ID cell is unusual; the first link wins
    return {"id": ids[0], "extra_ids": ids[1:], "title": title or link_title or title_from_description(desc),
            "filmed": filmed, "pub": pub}


# ---------------------------------------------------------------- site scan
def load_existing():
    """YouTube IDs and lowercase titles already in the wiki."""
    ids, titles = set(), set()
    for folder in Path(CONTENT_DIR).iterdir():
        if not folder.is_dir():
            continue
        meta = read_meta(folder)
        t = meta.get("title")
        if isinstance(t, str) and t:
            titles.add(t.lower())
        if (meta.get("type") or "").strip().lower() == "videos":
            for s in iter_strings(meta):
                ids.update(yt_ids(s))
    return ids, titles


def fetch_info(vid):
    from yt_dlp import YoutubeDL
    opts = {"quiet": True, "no_warnings": True, "skip_download": True, "ignore_no_formats_error": True}
    try:
        with YoutubeDL(opts) as ydl:
            info = ydl.extract_info(f"https://www.youtube.com/watch?v={vid}", download=False)
    except Exception:
        return {}
    raw = info.get("upload_date") or ""
    return {"title": info.get("title") or "",
            "date": f"{raw[:4]}-{raw[4:6]}-{raw[6:8]}" if len(raw) == 8 else ""}


# ---------------------------------------------------------------- main
def load_index(path):
    seen, out = set(), []
    for line in Path(path).read_text(encoding="utf-8").splitlines():
        p = line.split("\t")
        if len(p) < 8 or p[0] == "file":
            continue
        key = (p[0], int(p[1]))
        if key in seen:
            continue
        seen.add(key)
        out.append({"file": p[0], "line": int(p[1]), "heading": p[2], "urls": int(p[5]), "header": p[7]})
    return out


def scan_index():
    """Rebuild the table index straight from content/*/(content|old).md (same idea as the awk scan)."""
    out = []
    for folder in sorted(Path(CONTENT_DIR).iterdir()):
        for name in ("content.md", "old.md"):
            f = folder / name
            if not f.is_file():
                continue
            lines = f.read_text(encoding="utf-8", errors="replace").splitlines()
            heading, i = "(no heading)", 0
            while i < len(lines):
                ln = lines[i]
                if ln.lstrip().startswith("|"):
                    start = i
                    while i < len(lines) and lines[i].lstrip().startswith("|"):
                        i += 1
                    blk = lines[start:i]
                    urls = sum(1 for b in blk if re.search(r"https?://|youtu", b))
                    if urls:
                        hdr = " | ".join(c.strip().lower() for c in split_row(blk[0].replace("!!", "|")))
                        out.append({"file": f"./{f.as_posix()}", "line": start + 1, "heading": heading,
                                    "urls": urls, "header": hdr})
                    continue
                if re.match(r"#+\s", ln):
                    heading = ln.strip()
                i += 1
    return out


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--index", default=str(REPORT_DIR / "tables.tsv"),
                    help="tables.tsv from the awk scan; if it doesn't exist the script scans content/ itself")
    ap.add_argument("--write", action="store_true", help="create the article folders (default is a dry run)")
    ap.add_argument("--fetch-meta", action="store_true",
                    help="use yt-dlp to fill the upload date when the table had no date (titles stay blank)")
    ap.add_argument("--blank-content", action="store_true",
                    help="also write an empty content.md (note: compile.py skips transcripts when content.md exists)")
    ap.add_argument("--keep-tables", action="store_true",
                    help="with --write, do NOT remove the used video rows / tables / headings from the source markdown")
    ap.add_argument("--workers", type=int, default=3)
    args = ap.parse_args()

    if not Path(CONTENT_DIR).is_dir():
        sys.exit(f"'{CONTENT_DIR}' not found; run from the directory that contains it")

    stats = Counter()
    found = {}  # video id -> record (insertion ordered)
    file_cache = {}
    removals = {}  # path -> list of (start line index, block length, set of block line indexes to delete)

    if Path(args.index).is_file():
        index = load_index(args.index)
    else:
        print(f"{args.index} not found; scanning {CONTENT_DIR}/ directly", file=sys.stderr)
        index = scan_index()
    for t in index:
        header_l = t["header"].lower()
        if t["urls"] == 0:
            stats["tables skipped: no urls"] += 1
            continue
        if any(w in header_l for w in SKIP_HEADER_WORDS):
            stats["tables skipped: animatronic/location/etc"] += 1
            continue
        path = Path(t["file"])
        if path not in file_cache:
            try:
                file_cache[path] = path.read_text(encoding="utf-8").splitlines(keepends=True)
            except Exception as e:
                print(f"! cannot read {path}: {e}", file=sys.stderr)
                file_cache[path] = []
        block = read_block(file_cache[path], t["line"])
        if len(block) < 2:
            stats["tables skipped: not found at recorded line"] += 1
            continue

        header, body, body_lines = parse_table(block)
        roles = roles_for(header)
        source_title = (read_meta(path.parent).get("title") or "").strip() or path.parent.name
        stats["tables parsed"] += 1

        used_lines, junk_lines = set(), set()
        for cells, bl in zip(body, body_lines):
            if all(re.fullmatch(r"[\s:\-]*", c) for c in cells):  # empty "| | |" / "|" / stray separator rows
                junk_lines.add(bl)
                continue
            row = process_row(roles, cells)
            if row is None:
                stats["rows without a youtube link (left in place)"] += 1
                continue
            used_lines.add(bl)
            if row["extra_ids"]:
                stats["rows with several ids (first used)"] += 1
            rec = found.setdefault(row["id"], {"id": row["id"], "title": "", "filmed": None, "pub": None,
                                               "tags": [], "sources": []})
            rec["title"] = rec["title"] or row["title"]
            rec["filmed"] = rec["filmed"] or row["filmed"]
            rec["pub"] = rec["pub"] or row["pub"]
            if source_title not in rec["tags"]:
                rec["tags"].append(source_title)
                rec["sources"].append(f"{path.parent.name}:{t['line']}")
            else:
                stats["duplicate rows in same article"] += 1
        if used_lines:
            removals.setdefault(path, []).append((t["line"] - 1, len(block), used_lines | junk_lines))

    existing_ids, existing_titles = load_existing()
    new = {v: r for v, r in found.items() if v not in existing_ids}
    stats["videos already in wiki (skipped)"] = len(found) - len(new)

    if args.fetch_meta and new:
        print(f"Fetching YouTube info for {len(new)} videos...", file=sys.stderr)
        with ThreadPoolExecutor(max_workers=args.workers) as ex:
            for vid, info in zip(list(new), ex.map(fetch_info, list(new))):
                if info.get("date") and not (new[vid]["filmed"] or new[vid]["pub"]):
                    new[vid]["pub"] = info["date"]
                if not info:
                    stats["yt-dlp lookups failed"] += 1

    REPORT_DIR.mkdir(exist_ok=True)
    preview = ["id\tstartDate\ttitle\ttags\tsources"]
    created = 0
    for vid, r in new.items():
        title = ""  # titles are intentionally left blank
        start = r["filmed"] or r["pub"] or UNKNOWN_DATE
        if start == UNKNOWN_DATE:
            stats["videos with no date"] += 1
        preview.append("\t".join([vid, start, title, " | ".join(r["tags"]), ", ".join(r["sources"])]))

        if args.write:
            while True:
                folder = Path(CONTENT_DIR) / "".join(secrets.choice(ID_ALPHABET) for _ in range(16))
                if not folder.exists():
                    break
            folder.mkdir(parents=True)
            url = f"https://www.youtube.com/watch?v={vid}"
            meta = {"title": title, "type": "Videos", "pageThumbnailVideo": url, "citations": [url],
                    "tags": r["tags"], "startDate": start, "contributors": [CONTRIBUTOR]}
            (folder / "meta.json").write_text(json.dumps(meta, indent=2, ensure_ascii=False), encoding="utf-8")
            if args.blank_content:
                (folder / "content.md").write_text("", encoding="utf-8")
            created += 1

    if args.write and not args.keep_tables:
        for path, edits in removals.items():
            lines, n_rows, n_tables, n_heads = file_cache[path], 0, 0, 0
            for start, length, used in sorted(edits, reverse=True):  # bottom-up keeps indexes valid
                body_total = [i for i in range(length)
                              if i != 0 and not (i == 1 and SEP_RE.match(lines[start + 1]) and "-" in lines[start + 1])]
                if 0 in used:
                    body_total = [0] + body_total
                if used >= set(body_total):  # every data row used: remove the whole table
                    lo, hi = start, start + length
                    n_tables += 1
                    # also remove the heading directly above if the section is now empty
                    h = lo - 1
                    while h >= 0 and not lines[h].strip():
                        h -= 1
                    nxt = hi
                    while nxt < len(lines) and not lines[nxt].strip():
                        nxt += 1
                    if h >= 0 and re.match(r"#{1,6}\s", lines[h]) and (nxt >= len(lines) or re.match(r"#{1,6}\s", lines[nxt])):
                        lo = h
                        n_heads += 1
                    if lo == start:  # keep the heading: drop the table, plus trailing blanks if a blank already precedes it
                        end = nxt if (lo == 0 or not lines[lo - 1].strip()) else hi
                        del lines[lo:end]
                    else:
                        del lines[lo:nxt]
                else:
                    n_rows += len(used)
                    for i in sorted(used, reverse=True):
                        del lines[start + i]
            text = "".join(lines)
            path.write_text(text if text.strip() else "", encoding="utf-8")
            stats["tables removed from markdown"] += n_tables
            stats["headings removed from markdown"] += n_heads
            stats["rows removed from partly-used tables"] += n_rows
            stats["markdown files rewritten"] += 1

    (REPORT_DIR / "new-videos.tsv").write_text("\n".join(preview) + "\n", encoding="utf-8")

    print("\n== report")
    print(f"unique videos found in tables : {len(found)}")
    print(f"new articles {'created' if args.write else 'that would be created'}: {created if args.write else len(new)}")
    for k, v in sorted(stats.items()):
        print(f"{k:55s}{v}")
    print(f"\npreview -> {REPORT_DIR / 'new-videos.tsv'}")
    if not args.write:
        print("dry run only; re-run with --write to create folders")


if __name__ == "__main__":
    main()
