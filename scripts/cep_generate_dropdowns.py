from __future__ import annotations
import os
import re
import json
import sys
from typing import List, Dict

try:
    import tomllib as toml  # py3.11+
except Exception:
    try:
        import tomli as toml
    except Exception:
        toml = None

try:
    import yaml
except Exception:
    yaml = None

# ---------- config ----------
BASE_CONTENT_DIR = "content/wiki"
OUT_PATH         = "static/data/editor_dropdowns.json"

TYPE_TO_KEY = {
    "Stage Variations":        "stages",
    "Remodels and Initiatives": "remodels",
    "Animatronics":             "animatronics",
    "Showtape Formats":         "showtapeFormats",
}

# ---------- helpers ----------

def read_frontmatter(path: str) -> dict:
    with open(path, "rb") as fh:
        raw = fh.read()
    try:
        txt = raw.decode("utf-8")
    except Exception:
        try:
            txt = raw.decode("latin-1")
        except Exception:
            return {}

    txt = txt.lstrip()

    if txt.startswith("+++"):
        parts = re.split(r"(?m)^\+{3}\s*$", txt)
        if len(parts) >= 3 and toml is not None:
            try:
                data = toml.loads(parts[1])
                return data if isinstance(data, dict) else {}
            except Exception:
                return {}

    elif txt.startswith("---"):
        parts = re.split(r"(?m)^---\s*$", txt)
        if len(parts) >= 3 and yaml is not None:
            try:
                data = yaml.safe_load(parts[1])
                return data if isinstance(data, dict) else {}
            except Exception:
                return {}

    return {}


def collect_markdown_files(base_dir: str) -> List[str]:
    out = []
    if not os.path.isdir(base_dir):
        print(f"Warning: directory not found: {base_dir}", file=sys.stderr)
        return out
    for root, _, files in os.walk(base_dir):
        for fn in files:
            if fn.lower().endswith((".md", ".markdown", ".mdown")):
                out.append(os.path.join(root, fn))
    return out


# ---------- main ----------

def build_dropdowns(base_dir: str = BASE_CONTENT_DIR) -> Dict[str, List[str]]:
    result: Dict[str, List[str]] = {key: [] for key in TYPE_TO_KEY.values()}

    files = collect_markdown_files(base_dir)
    for path in files:
        try:
            fm = read_frontmatter(path)
        except Exception as e:
            print(f"Skipping {path}: {e}", file=sys.stderr)
            continue

        if not fm:
            continue

        # type is now a plain string (not an array)
        page_type = fm.get("type") or fm.get("Type") or ""
        if isinstance(page_type, list):
            page_type = page_type[0] if page_type else ""
        page_type = str(page_type).strip()

        matched_key = TYPE_TO_KEY.get(page_type)
        if matched_key is None:
            continue

        title = fm.get("title") or fm.get("Title")
        if not title:
            title = os.path.splitext(os.path.basename(path))[0]

        title = str(title).strip()
        if title and title not in result[matched_key]:
            result[matched_key].append(title)

    for key in result:
        result[key].sort(key=str.casefold)

    return result


def run():
    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    dropdowns = build_dropdowns(BASE_CONTENT_DIR)

    with open(OUT_PATH, "w", encoding="utf-8") as fh:
        json.dump(dropdowns, fh, indent=2, ensure_ascii=False)

    print(f"Wrote {OUT_PATH}", file=sys.stderr)
    for key, items in dropdowns.items():
        print(f"  {key}: {len(items)} entries", file=sys.stderr)


if __name__ == "__main__":
    run()