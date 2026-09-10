#!/usr/bin/env python3
import json, os, subprocess, sys
from pathlib import Path

CONTENT_DIR = "content"
OUT_TITLE_TO_ID = os.path.join(os.path.dirname(__file__), "..", "compiled-json/titleToFolderIDMap.json")
OUT_ID_TO_TITLE = os.path.join(os.path.dirname(__file__), "..", "compiled-json/folderIDToTitleMap.json")


def main():
    check_no_backslashes()
    title_to_id = build_title_to_id_map()
    id_to_title = build_id_to_title_map(title_to_id)

    write_json(title_to_id, OUT_TITLE_TO_ID)
    write_json(id_to_title, OUT_ID_TO_TITLE)

    print(f'Wrote {len(title_to_id)} titles -> {OUT_TITLE_TO_ID}')
    print(f'Wrote {len(id_to_title)} ids -> {OUT_ID_TO_TITLE}')

    run_solid_build()

def check_no_backslashes():
    content_path = Path(CONTENT_DIR)
    if not content_path.exists():
        return

    found_errors = False
    for folder in content_path.iterdir():
        if not folder.is_dir():
            continue
        md_file = folder / "content.md"
        if not md_file.exists():
            continue

        try:
            content = md_file.read_text(encoding="utf-8")
            if "\\" in content:
                print(f"Error: Backslash '\\' found in {md_file}", file=sys.stderr)
                found_errors = True
        except Exception as e:
            print(f"Error reading {md_file}: {e}", file=sys.stderr)

    if found_errors:
        sys.exit(1)

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


def run_solid_build():
    project_root = os.path.join(os.path.dirname(__file__), "..")
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