#!/usr/bin/env python3
import json, os, re, random, string
from pathlib import Path
from urllib.parse import urlparse, parse_qs

CONTENT_DIR = "content"
FOLDER_ID_LEN = 16
FOLDER_ID_CHARS = string.ascii_lowercase + string.digits

YOUTUBE_HOSTS = {
    "youtu.be",
    "youtube.com", "www.youtube.com", "m.youtube.com",
    "music.youtube.com",
}


def extract_video_id(url):
    """Return the canonical YouTube video ID for a URL, or None if not a YouTube video URL."""
    try:
        parsed = urlparse(url.strip())
    except Exception:
        return None

    host = (parsed.hostname or "").lower()
    if host not in YOUTUBE_HOSTS:
        return None

    # youtu.be/<id>
    if host == "youtu.be":
        vid = parsed.path.strip("/").split("/")[0]
        return vid or None

    path = parsed.path

    # youtube.com/watch?v=<id>
    if path == "/watch":
        qs = parse_qs(parsed.query)
        vid = qs.get("v", [None])[0]
        return vid or None

    # youtube.com/shorts/<id>  or  /embed/<id>  or  /live/<id>
    m = re.match(r"^/(shorts|embed|live)/([^/]+)", path)
    if m:
        return m.group(2)

    return None


def canonical_url(video_id):
    return f"https://youtu.be/{video_id}"


def gen_folder_id(existing):
    while True:
        candidate = "".join(random.choices(FOLDER_ID_CHARS, k=FOLDER_ID_LEN))
        if candidate not in existing:
            return candidate


def load_meta(folder):
    mp = folder / "meta.json"
    if not mp.exists():
        return None
    try:
        return json.loads(mp.read_text(encoding="utf-8"))
    except Exception:
        return None


def main():
    content_root = Path(CONTENT_DIR)
    all_folders = [f for f in content_root.iterdir() if f.is_dir()]
    existing_folder_names = {f.name for f in all_folders}

    # Pass 1: build video_id -> existing folder registry (from any page whose title is a YT video URL)
    existing_video_pages = {}  # video_id -> Path (folder)
    page_meta_cache = {}  # folder name -> meta dict (so we don't re-read files)

    for folder in all_folders:
        meta = load_meta(folder)
        if meta is None:
            continue
        page_meta_cache[folder.name] = meta

        title = meta.get("title")
        if isinstance(title, str):
            vid = extract_video_id(title)
            if vid:
                if vid in existing_video_pages and existing_video_pages[vid].name != folder.name:
                    print(f"WARNING: video {vid} has multiple existing pages: "
                          f"{existing_video_pages[vid].name} and {folder.name}")
                else:
                    existing_video_pages[vid] = folder

    # Pass 2: walk citations, collect citing page titles per video id
    # video_id -> set of citing page titles
    video_citing_titles = {}
    # video_id -> whether we've seen it (for logging/order)
    skipped_bad_urls = []

    for folder in all_folders:
        meta = page_meta_cache.get(folder.name)
        if meta is None:
            continue

        citations = meta.get("citations") or []
        page_title = meta.get("title")
        if not isinstance(page_title, str) or not page_title.strip():
            page_title = folder.name  # fallback if page has no title

        for cite in citations:
            if not isinstance(cite, str) or not cite.strip():
                continue
            vid = extract_video_id(cite)
            if vid is None:
                continue  # not a YouTube link, e.g. Instagram citation in your example

            video_citing_titles.setdefault(vid, set()).add(page_title.strip())

    # Remove self-citation: if this exact page IS the existing video page for vid, don't add its own title
    for vid, existing_folder in existing_video_pages.items():
        titles = video_citing_titles.get(vid)
        if not titles:
            continue
        existing_meta = page_meta_cache.get(existing_folder.name, {})
        own_title = existing_meta.get("title")
        titles.discard(own_title)

    # Pass 3: create or update
    created = 0
    updated = 0
    unchanged = 0

    for vid, citing_titles in video_citing_titles.items():
        if not citing_titles:
            continue

        if vid in existing_video_pages:
            folder = existing_video_pages[vid]
            meta = page_meta_cache[folder.name]
            current_tags = set(meta.get("tags") or [])
            merged_tags = current_tags | citing_titles

            if merged_tags != current_tags:
                meta["tags"] = sorted(merged_tags)
                (folder / "meta.json").write_text(
                    json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8"
                )
                updated += 1
                print(f"Updated existing video page {folder.name} ({vid}): "
                      f"+{len(merged_tags - current_tags)} tag(s)")
            else:
                unchanged += 1
        else:
            folder_id = gen_folder_id(existing_folder_names)
            existing_folder_names.add(folder_id)
            new_folder = content_root / folder_id
            new_folder.mkdir(parents=True, exist_ok=False)
            (new_folder / "content.md").write_text("", encoding="utf-8")

            new_meta = {
                "title": canonical_url(vid),
                "type": "Videos",
                "tags": sorted(citing_titles),
            }
            (new_folder / "meta.json").write_text(
                json.dumps(new_meta, ensure_ascii=False, indent=2), encoding="utf-8"
            )
            created += 1
            print(f"Created new video page {folder_id} for {vid} "
                  f"with {len(citing_titles)} tag(s)")

    print()
    print(f"Done. Created: {created}, Updated: {updated}, Unchanged (already up to date): {unchanged}")


def run():
    main()


if __name__ == "__main__":
    main()
