import os
import random
import re
import subprocess
import sys
from pathlib import Path

from rapidfuzz import fuzz
from rapidfuzz.process import extract
from rich.console import Console, Group
from rich.live import Live
from rich.panel import Panel
from rich.table import Table
import readchar

# ---------------- CONFIG ----------------

WIKI_DIR = Path("content/wiki")
PHOTO_MD_DIR = Path("content/photos")
PHOTO_IMG_DIR = Path("static/photos")

MAX_SUGGESTIONS = 9

console = Console()

TITLE_RE = re.compile(r'^title\s*=\s*"(.+?)"', re.MULTILINE)
PAGES_RE = re.compile(r'^pages\s*=\s*(\[[^\]]*\])', re.MULTILINE)


# ---------------- UTIL ----------------

def read_front_matter(text):
    if text.startswith("+++"):
        return text.split("+++", 2)[1]
    return ""


def write_front_matter(text, fm):
    parts = text.split("+++", 2)
    return f"+++{fm}+++{parts[2]}"


def get_title(fm):
    m = TITLE_RE.search(fm)
    return m.group(1) if m else None


import subprocess

current_img_process = None

def open_image(path: Path):
    global current_img_process

    # Close previous image if still open
    if current_img_process and current_img_process.poll() is None:
        current_img_process.terminate()  # sends SIGTERM
        try:
            current_img_process.wait(timeout=0.5)
        except subprocess.TimeoutExpired:
            current_img_process.kill()  # force kill if it didn't close

    # Open new image
    current_img_process = subprocess.Popen(
        ["gwenview", str(path)],  # or "eog" / "ristretto"
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


# ---------------- LOAD WIKI TITLES ----------------

console.print("[bold cyan]Loading wiki titles...[/]")

wiki_titles = []

for md in WIKI_DIR.rglob("*.md"):
    fm = read_front_matter(md.read_text(encoding="utf-8"))
    title = get_title(fm)
    if title:
        wiki_titles.append(title)

console.print(f"[green]Loaded {len(wiki_titles)} wiki titles[/]\n")


# ---------------- LOAD UNTAGGED PHOTOS ----------------

console.print("[bold cyan]Scanning untagged photos...[/]")

untagged = []

for md in PHOTO_MD_DIR.rglob("*.md"):
    text = md.read_text(encoding="utf-8")
    fm = read_front_matter(text)
    if not fm:
        continue

    pages = PAGES_RE.search(fm)
    if pages and pages.group(1).strip() != "[]":
        continue

    title = get_title(fm)
    if title:
        untagged.append(md)

random.shuffle(untagged)

console.print(f"[green]Found {len(untagged)} untagged photos[/]\n")

if not untagged:
    console.print("[bold green]Nothing to tag. You're done.[/]")
    sys.exit(0)


# ---------------- UI RENDER ----------------

def render_ui(photo_title, query, matches):
    table = Table(show_header=True, header_style="bold magenta")
    table.add_column("#", width=3)
    table.add_column("Match")

    for i, (title, score, _) in enumerate(matches, start=1):
        table.add_row(str(i), title)

    panel = Panel(
        f"[bold]Photo:[/] {photo_title}\n\n"
        f"[bold]Search:[/] {query}\n\n"
        "[dim]1–9 select | ENTER confirm | CTRL+Q quit[/]",
        title="Tagging Simulator",
    )

    return Group(panel, table)


# ---------------- MAIN LOOP ----------------

while untagged:
    md = untagged.pop()
    text = md.read_text(encoding="utf-8")
    fm = read_front_matter(text)
    photo_title = get_title(fm)

    img_path = PHOTO_IMG_DIR / photo_title
    if img_path.exists():
        open_image(img_path)

    query = ""
    selection = None

    with Live(refresh_per_second=30, console=console) as live:
        # state to track tab press
        tab_pressed = False

        while True:
            matches = extract(
                query,
                wiki_titles,
                scorer=fuzz.WRatio,
                limit=MAX_SUGGESTIONS,
            )

            live.update(render_ui(photo_title, query, matches))

            key = readchar.readkey()

            # ---------------- TAB PREFIX ----------------
            if key == readchar.key.TAB:
                tab_pressed = True
                continue

            if tab_pressed:
                tab_pressed = False
                # Tab + number → select fuzzy suggestion
                if key.isdigit():
                    idx = int(key)
                    if 1 <= idx <= len(matches):
                        selection = matches[idx - 1][0]
                        break
                # Tab + s → skip photo
                if key.lower() == "s":
                    console.print(f"[yellow]→ Skipped[/] {photo_title}\n")
                    selection = None
                    break
                # Tab + q → quit
                if key.lower() == "q":
                    console.print("\n[bold yellow]Exiting.[/]")
                    sys.exit(0)
                # Tab + other keys → ignore
                continue

            # ---------------- ENTER → SELECT TOP ----------------
            if key == readchar.key.ENTER:
                if matches:
                    selection = matches[0][0]
                    break

            # ---------------- BACKSPACE ----------------
            if key == readchar.key.BACKSPACE:
                query = query[:-1]
                continue

            # ---------------- NORMAL CHARACTER INPUT ----------------
            query += key


    if not selection:
        continue

    new_pages = f'pages = ["{selection}"]'

    if PAGES_RE.search(fm):
        fm = PAGES_RE.sub(new_pages, fm)
    else:
        fm = fm.strip() + "\n" + new_pages + "\n"

    md.write_text(write_front_matter(text, fm), encoding="utf-8")

    console.print(f"[green]✔ Tagged[/] {photo_title} → {selection}\n")

console.print("[bold green]All photos tagged![/]")
