import urllib.request
import json
import os
import shutil

DIR = os.path.join(os.path.dirname(__file__), "..", "compiled-json")
IMG_DIR = os.path.join(DIR, "images")

FORUM = "https://forum.cheeseepedia.org"
NEWS_CATEGORY_ID = 5
NEWS_URL = f"{FORUM}/c/news/{NEWS_CATEGORY_ID}/l/latest.json?order=created"
LATEST_URL = f"{FORUM}/latest.json?order=created"


def fetch_json(url):
    with urllib.request.urlopen(url) as r:
        return json.loads(r.read())


def build_topic(t):
    thumbs = t.get("thumbnails") or []
    thumb = next((x for x in thumbs if x.get("max_width") == 400), None)
    src = (thumb or {}).get("url") or t.get("image_url")
    local = None
    if src:
        path = os.path.join(IMG_DIR, f"{t['id']}.jpg")
        with urllib.request.urlopen(src) as r:
            open(path, "wb").write(r.read())
        local = f"/viewers/cep-js/compiled-json/images/{t['id']}.jpg"
    return {
        "title": t["title"],
        "image_url": local,
        "views": t.get("views"),
        "created_at": t.get("created_at"),
        "url": f"{FORUM}/t/{t['slug']}/{t['id']}",
    }


def write_json(name, data):
    with open(os.path.join(DIR, name), "w") as f:
        json.dump(data, f, indent=2)


def main():
    shutil.rmtree(IMG_DIR, ignore_errors=True)
    os.makedirs(IMG_DIR)

    data = fetch_json(NEWS_URL)
    topics = [build_topic(t) for t in data.get("topic_list", {}).get("topics", [])]
    write_json("DiscourseNews.json", topics)
    print(f"Fetched {len(topics)} news topics")

    data = fetch_json(LATEST_URL)
    recent = []
    for t in data.get("topic_list", {}).get("topics", []):
        if t.get("category_id") == NEWS_CATEGORY_ID:
            continue
        entry = build_topic(t)
        entry["category_id"] = t.get("category_id")
        recent.append(entry)
    write_json("DiscourseRecent.json", recent)
    print(f"Fetched {len(recent)} recent non-news topics")
