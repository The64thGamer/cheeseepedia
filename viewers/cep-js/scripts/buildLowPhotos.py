#!/usr/bin/env python3
from pathlib import Path
from PIL import Image, ImageOps

CONTENT_DIR = "content"
LOW_MAX_SIDE = 64
AVIF_QUALITY = 50  

def make_lowphoto(src_path: Path, dst_path: Path):
    with Image.open(src_path) as im:
        im = ImageOps.exif_transpose(im)

        w, h = im.size
        longer = max(w, h)
        if longer <= LOW_MAX_SIDE:
            new_w, new_h = w, h
        elif w >= h:
            new_w = LOW_MAX_SIDE
            new_h = max(1, round(h * LOW_MAX_SIDE / w))
        else:
            new_h = LOW_MAX_SIDE
            new_w = max(1, round(w * LOW_MAX_SIDE / h))

        im = im.convert("RGB").resize((new_w, new_h), Image.LANCZOS)
        im.save(dst_path, format="AVIF", quality=AVIF_QUALITY)

def main():
    made = 0
    skipped = 0
    failed = 0

    for folder in Path(CONTENT_DIR).iterdir():
        if not folder.is_dir():
            continue

        photo = folder / "photo.avif"
        lowphoto = folder / "lowphoto.avif"

        if not photo.exists():
            continue
        if lowphoto.exists():
            skipped += 1
            continue

        try:
            make_lowphoto(photo, lowphoto)
            made += 1
        except Exception as e:
            print(f"FAILED: {folder.name}: {e}")
            failed += 1

    print({"made": made, "skipped_existing": skipped, "failed": failed})

def run(): main()
if __name__ == '__main__': main()
