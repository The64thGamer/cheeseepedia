#!/usr/bin/env python3
"""
Generate low-res placeholders for photos using pyvips.
Creates lowphotos/<same-filename>.webp (or .avif if use_avif=True)
Generates only if target missing or older than source.

Usage:
  python3 scripts/generate_lowphotos.py --src static/photos --dst static/lowphotos \
      --size 64 --format webp --quality 30 --workers 12
"""

import os, sys, argparse, math
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
import pyvips
import multiprocessing
import time

def ensure_dir(p):
    os.makedirs(p, exist_ok=True)

def process_one(src_path: Path, dst_path: Path, size: int, fmt: str, quality: int):
    try:
        # If destination exists and newer than source, skip
        if dst_path.exists() and dst_path.stat().st_mtime >= src_path.stat().st_mtime:
            return (src_path.name, "skipped")

        # read with sequential access (low memory) and create thumbnail
        # pyvips.Image.thumbnail is optimized and memory-friendly
        img = pyvips.Image.thumbnail(str(src_path), size, size="down")   # only downsize
        # decide filename and write params
        if fmt == "webp":
            # Q argument controls quality for webp
            img.write_to_file(str(dst_path), Q=quality)
        elif fmt == "avif":
            # AVIF: libvips may accept "compression" params; Q also common
            img.write_to_file(str(dst_path), Q=quality)
        else:
            img.write_to_file(str(dst_path), Q=quality)
        return (src_path.name, "ok")
    except Exception as e:
        return (src_path.name, f"err:{e}")

def gather_files(src_dir):
    src_dir = Path(src_dir)
    exts = (".avif", ".jpg", ".jpeg", ".png", ".webp", ".gif")
    files = [p for p in src_dir.rglob("*") if p.suffix.lower() in exts]
    return files

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--src", default="static/photos")
    p.add_argument("--dst", default="static/lowphotos")
    p.add_argument("--size", type=int, default=64)
    p.add_argument("--format", choices=("webp","avif","jpg"), default="avif")
    p.add_argument("--quality", type=int, default=30)
    p.add_argument("--workers", type=int, default=max(1, multiprocessing.cpu_count()))
    args = p.parse_args()

    ensure_dir(args.dst)
    files = gather_files(args.src)
    if not files:
        print("No files found in", args.src); return

    start = time.time()
    print(f"Found {len(files)} images. workers={args.workers} size={args.size} fmt={args.format} Q={args.quality}")

    # build src->dst mapping
    jobs = []
    for src in files:
        dst_name = src.name
        # choose extension based on output format
        dst_name_noext = os.path.splitext(dst_name)[0]
        dst = Path(args.dst) / (dst_name_noext + "." + args.format)
        jobs.append((src, dst))

    ok = 0; skipped = 0; errs = []
    with ThreadPoolExecutor(max_workers=args.workers) as ex:
        futures = { ex.submit(process_one, s, d, args.size, args.format, args.quality): (s,d) for (s,d) in jobs }
        for fut in as_completed(futures):
            name, status = fut.result()
            if status == "ok": ok += 1
            elif status == "skipped": skipped += 1
            else: errs.append((name,status))

    elapsed = time.time() - start
    print(f"Done in {elapsed:.1f}s — ok={ok} skipped={skipped} err={len(errs)}")
    if errs:
        print("Errors (sample 10):")
        for e in errs[:10]:
            print(e)

if __name__ == "__main__":
    main()
