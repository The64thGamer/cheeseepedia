#!/usr/bin/env python3
import json, os, re, urllib.request, urllib.parse
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

CONTENT_DIR   = "content"
OUT_DIR       = os.path.join(os.path.dirname(__file__), "..", "compiled-json")
FAVICON_DIR   = os.path.join(OUT_DIR, "favicons")
FAILED_JSON   = os.path.join(OUT_DIR, "citation_favicons_failed.json")
URL_RE        = re.compile(r'^https?://', re.IGNORECASE)
HEADERS       = {'User-Agent': 'Mozilla/5.0'}

def get_domain(url):
    try:
        p = urllib.parse.urlparse(url)
        return p.scheme + '://' + p.netloc
    except Exception:
        return None

def safe_filename(domain):
    return re.sub(r'[^\w\-.]', '_', re.sub(r'^https?://(www\.)?', '', domain)) + '.png'

def fetch_favicon(domain):
    fname = safe_filename(domain)
    fpath = os.path.join(FAVICON_DIR, fname)
    if os.path.exists(fpath):
        return domain, 'cached'
    for path in ('/favicon.ico', '/favicon.png'):
        try:
            req = urllib.request.Request(domain.rstrip('/') + path, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=5) as r:
                data = r.read()
            if len(data) > 100:
                open(fpath, 'wb').write(data)
                return domain, 'fetched'
        except Exception:
            continue
    return domain, 'failed'

def main():
    os.makedirs(FAVICON_DIR, exist_ok=True)

    # Load previously failed domains to skip retrying them
    failed = set()
    if os.path.exists(FAILED_JSON):
        try: failed = set(json.loads(open(FAILED_JSON).read()))
        except Exception: pass

    all_links, all_domains = set(), set()
    all_downloads = []  # list of {url, label, page} dicts
    seen_downloads = set()

    for folder in Path(CONTENT_DIR).iterdir():
        if not folder.is_dir(): continue
        mp = folder / 'meta.json'
        if not mp.exists(): continue
        try: meta = json.loads(mp.read_text(encoding='utf-8'))
        except Exception: continue

        # Citations
        for c in (meta.get('citations') or []):
            if isinstance(c, str) and URL_RE.match(c.strip()):
                c = c.strip(); all_links.add(c)
                d = get_domain(c)
                if d: all_domains.add(d)

        # Download links
        for dl in (meta.get('downloadLinks') or []):
            if not isinstance(dl, dict): continue
            url   = (dl.get('url') or '').strip()
            label = (dl.get('label') or '').strip()
            if not url or not URL_RE.match(url): continue
            key = url
            if key not in seen_downloads:
                seen_downloads.add(key)
                all_downloads.append({'url': url, 'label': label or url})

    # Skip domains with existing file or previously failed
    todo = sorted(d for d in all_domains
        if not os.path.exists(os.path.join(FAVICON_DIR, safe_filename(d)))
        and d not in failed)

    print(f"Found {len(all_links)} citation URLs, {len(all_domains)} domains, {len(todo)} to fetch")
    print(f"Found {len(all_downloads)} download links")

    new_failed = set()
    if todo:
        with ThreadPoolExecutor(max_workers=16) as ex:
            futures = {ex.submit(fetch_favicon, d): d for d in todo}
            for f in as_completed(futures):
                domain, status = f.result()
                if status == 'failed': new_failed.add(domain)
                print(f"  {status:7} {domain}")

    # Persist updated failed list
    all_failed = failed | new_failed
    with open(FAILED_JSON, 'w', encoding='utf-8') as f:
        json.dump(sorted(all_failed), f, ensure_ascii=False, separators=(',',':'))

    with open(os.path.join(OUT_DIR, 'citation_links.json'), 'w', encoding='utf-8') as f:
        json.dump(sorted(all_links), f, ensure_ascii=False, separators=(',',':'))

    with open(os.path.join(OUT_DIR, 'download_links.json'), 'w', encoding='utf-8') as f:
        json.dump(all_downloads, f, ensure_ascii=False, separators=(',',':'))

    print(f"\ncitation_links.json  — {len(all_links)} URLs")
    print(f"download_links.json  — {len(all_downloads)} entries")
    print(f"favicons/            — checked {len(todo)} new domains ({len(new_failed)} failed)")

def run():
    main()

if __name__ == '__main__':
    main()