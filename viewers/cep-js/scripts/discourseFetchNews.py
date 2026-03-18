import urllib.request
import json
import os
import shutil

DIR = os.path.join(os.path.dirname(__file__), "..", "compiled-json")
IMG_DIR = os.path.join(DIR, "images")

def main():
    shutil.rmtree(IMG_DIR, ignore_errors=True)
    os.makedirs(IMG_DIR)

    with urllib.request.urlopen("https://forum.cheeseepedia.org/c/news/5/l/latest.json?order=created") as r:
        data = json.loads(r.read())

    os.makedirs(IMG_DIR, exist_ok=True)
    topics = []

    for t in data.get("topic_list", {}).get("topics", []):
        thumbs = t.get("thumbnails") or []
        thumb = next((x for x in thumbs if x.get("max_width") == 400), None)
        src = (thumb or {}).get("url") or t.get("image_url")
        local = None
        if src:
            path = os.path.join(IMG_DIR, f"{t['id']}.jpg")
            with urllib.request.urlopen(src) as r:
                open(path, "wb").write(r.read())
            local = f"/viewers/cep-js/compiled-json/images/{t['id']}.jpg"
        topics.append({"title": t["title"], "image_url": local, "views": t.get("views"), "created_at": t.get("created_at"), "url": f"https://forum.cheeseepedia.org/t/{t['slug']}/{t['id']}"})

    with open(os.path.join(DIR, "DiscourseNews.json"), "w") as f:
        json.dump(topics, f, indent=2)
    print(f"Fetched {len(topics)} topics")