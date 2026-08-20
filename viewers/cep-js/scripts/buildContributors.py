#!/usr/bin/env python3
import json, os, re, sys, time, urllib.request, urllib.parse, urllib.error
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

CONTENT_DIR = "content"
OUT_DIR     = os.path.join(os.path.dirname(__file__), "..", "compiled-json")
AVATAR_DIR  = os.path.join(OUT_DIR, "avatars")
OUT_JSON    = os.path.join(OUT_DIR, "contributors.json")
DISCOURSE   = "https://forum.cheeseepedia.org"

API_KEY  = os.environ.get('DISCOURSE_API_KEY')
API_USER = os.environ.get('DISCOURSE_API_USERNAME', 'system')

HEADERS = {'User-Agent': 'Mozilla/5.0'}
if API_KEY:
    HEADERS['Api-Key'] = API_KEY
    HEADERS['Api-Username'] = API_USER

safename = lambda n: re.sub(r'[^\w\-.]', '_', n) + '.jpg'
req      = lambda u: urllib.request.Request(u, headers=HEADERS)
fetch    = lambda u: json.loads(urllib.request.urlopen(req(u), timeout=10).read())

TIERS = [
    (1000, 123),
    (750,  122),
    (500,  121),
    (300,  120),
    (150,  119),
    (100,  118),
    (75,   117),
    (50,   116),
    (25,   115),
    (10,   114),
    (5,    113),
    (2,    112),
    (1,    111),
]


def _get_with_retry(url, max_retries=6):
    delay = 2
    for attempt in range(1, max_retries + 1):
        try:
            return json.loads(urllib.request.urlopen(req(url), timeout=15).read())
        except urllib.error.HTTPError as e:
            if e.code == 429 and attempt < max_retries:
                retry_after = e.headers.get('Retry-After')
                wait = float(retry_after) if retry_after else delay
                print(f"    ! rate limited, waiting {wait:.0f}s (attempt {attempt}/{max_retries})...")
                time.sleep(wait)
                delay *= 2
                continue
            raise


def get_discourse():
    users, page = [], 0
    while True:
        data = fetch(f"{DISCOURSE}/directory_items.json?period=all&order=post_count&page={page}")
        items = data.get('directory_items', [])
        if not items: break
        for i in items:
            if i.get('user'): users.append(i['user'])
        if not data.get('meta', {}).get('load_more_directory_items'): break
        page += 1
    return users


def get_admin_users():
    if not API_KEY:
        return None
    all_users, page = [], 0
    while True:
        try:
            batch = _get_with_retry(f"{DISCOURSE}/admin/users/list/active.json?page={page}")
        except Exception as e:
            print(f"  ! admin users list request failed on page {page}: {e}")
            return None
        if not batch:
            break
        all_users.extend(batch)
        if len(batch) < 100:
            break
        page += 1
        time.sleep(0.2)
    return all_users


def get_contribs():
    c = {}
    for folder in Path(CONTENT_DIR).iterdir():
        if not folder.is_dir(): continue
        mp = folder / 'meta.json'
        if not mp.exists(): continue
        try: meta = json.loads(mp.read_text(encoding='utf-8'))
        except Exception: continue
        for name in (meta.get('contributors') or []):
            if not name: continue
            name = name.strip()
            if name not in c: c[name] = {'count': 0, 'articles': []}
            c[name]['count'] += 1
            c[name]['articles'].append(folder.name)
    return c


def dl_avatar(u):
    t = u.get('avatar_template')
    if not t: return
    p = os.path.join(AVATAR_DIR, safename(u['username']))
    if os.path.exists(p): return
    try:
        with urllib.request.urlopen(req(DISCOURSE + t.replace('{size}','128')), timeout=10) as r:
            open(p,'wb').write(r.read())
    except Exception: pass


def get_owned_badge_ids(username):
    try:
        data = fetch(f"{DISCOURSE}/user-badges/{urllib.parse.quote(username)}.json")
    except Exception as e:
        print(f"    ! could not fetch existing badges for {username}: {e}")
        return None

    owned = set()
    for ub in data.get('user_badges', []):
        bid = ub.get('badge_id')
        if bid is not None:
            owned.add(bid)
    if not owned:
        for b in data.get('badges', []):
            bid = b.get('id')
            if bid is not None:
                owned.add(bid)
    return owned


def grant_badge(username, badge_id):
    body = urllib.parse.urlencode({'username': username, 'badge_id': badge_id}).encode()
    r = urllib.request.Request(
        f"{DISCOURSE}/user_badges",
        data=body,
        method='POST',
        headers={**HEADERS, 'Content-Type': 'application/x-www-form-urlencoded'},
    )
    with urllib.request.urlopen(r, timeout=10) as resp:
        return json.loads(resp.read())


def award_badges(out, dry_run=False):
    if not API_KEY:
        print("Skipping badge awarding: DISCOURSE_API_KEY not set in environment.")
        return

    candidates = [e for e in out if e.get('fu') and e.get('count', 0) > 0]
    print(f"Checking badges for {len(candidates)} matched contributors...")

    granted_total = 0
    for i, e in enumerate(candidates, 1):
        username, count = e['fu'], e['count']
        owed = [(t, bid) for t, bid in TIERS if count >= t]
        if not owed:
            continue

        owned = get_owned_badge_ids(username)
        if owned is None:
            continue

        missing = [(t, bid) for t, bid in owed if bid not in owned]
        if not missing:
            continue

        for threshold, bid in missing:
            if dry_run:
                print(f"  [dry-run] would grant badge {bid} (>= {threshold}) to {username}")
                continue
            try:
                grant_badge(username, bid)
                print(f"  [{i}/{len(candidates)}] granted badge {bid} (>= {threshold}) to {username}")
                granted_total += 1
                owned.add(bid)
                time.sleep(0.3)
            except urllib.error.HTTPError as ex:
                print(f"    ! failed to grant badge {bid} to {username}: HTTP {ex.code} {ex.read()[:200]}")
            except Exception as ex:
                print(f"    ! failed to grant badge {bid} to {username}: {ex}")

    verb = "Would grant" if dry_run else "Granted"
    print(f"{verb} {granted_total} new badge(s) total.")


def main():
    dry_run = '--dry-run' in sys.argv
    skip_badges = '--no-badges' in sys.argv

    os.makedirs(AVATAR_DIR, exist_ok=True)

    print("Fetching Discourse users...")
    users = get_admin_users()
    if users is not None:
        print(f"  {len(users)} users (live admin API)")
        try:
            directory_users = get_discourse()
            pc_by_username = {u.get('username', '').lower(): u.get('post_count', 0)
                               for u in directory_users if u.get('username')}
            for u in users:
                un = (u.get('username') or '').lower()
                if un in pc_by_username:
                    u['post_count'] = pc_by_username[un]
        except Exception as e:
            print(f"  ! could not enrich admin user list with post counts from directory: {e}")
    else:
        print("  no usable admin API key — falling back to public directory dump")
        users = get_discourse()
        print(f"  {len(users)} users")

    print("Scanning contributors..."); contribs = get_contribs()
    print(f"  {len(contribs)} contributors")

    print("Downloading avatars...")
    with ThreadPoolExecutor(max_workers=16) as ex:
        for f in as_completed([ex.submit(dl_avatar, u) for u in users]): f.result()

    lookup = {}
    for u in users:
        if u.get('username'): lookup[u['username'].lower()] = u
        if u.get('name'):     lookup[u['name'].lower()] = u

    out, matched = [], set()
    for name, d in sorted(contribs.items(), key=lambda x: -x[1]['count']):
        e = {'name': name, 'count': d['count'], 'articles': d['articles']}
        u = lookup.get(name.lower())
        if u:
            un = u.get('username','')
            matched.add(un.lower())
            e.update({'fu': un, 'fn': u.get('name',''),
                      'url': f"{DISCOURSE}/u/{un}",
                      'av': safename(un) if u.get('avatar_template') else None,
                      'pc': u.get('post_count', 0)})
        out.append(e)

    for u in users:
        if (u.get('username','').lower()) in matched: continue
        un = u.get('username','')
        out.append({'name': u.get('name') or un, 'count': 0, 'articles': [],
                    'fu': un, 'fn': u.get('name',''),
                    'url': f"{DISCOURSE}/u/{un}",
                    'av': safename(un) if u.get('avatar_template') else None,
                    'pc': u.get('post_count', 0)})

    out.sort(key=lambda x: -x['count'])
    open(OUT_JSON,'w',encoding='utf-8').write(json.dumps(out, ensure_ascii=False, separators=(',',':')))
    print(f"contributors.json — {len(out)} entries")

    if not skip_badges:
        award_badges(out, dry_run=dry_run)

def run(): main()
if __name__ == '__main__': main()
