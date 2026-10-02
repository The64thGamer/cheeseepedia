#!/usr/bin/env python3
import os
import sys
import importlib.util

VIEWERS_DIR = os.path.join(os.path.dirname(__file__), "viewers")

YELLOW = "\033[33m"
RESET = "\033[0m"

BANNER = """\
█▀▀ █░█ █▀▀ █▀▀ █▀ █▀▀ ▄▄ █▀▀ ▄▄ █▀█ █▀▀ █▀▄ █ ▄▀█
█▄▄ █▀█ ██▄ ██▄ ▄█ ██▄ ░░ ██▄ ░░ █▀▀ ██▄ █▄▀ █ █▀█"""


def print_banner():
    if sys.stdout.isatty() and "NO_COLOR" not in os.environ:
        print(f"{YELLOW}{BANNER}{RESET}\n")
    else:
        print(f"{BANNER}\n")


print_banner()

for viewer in os.scandir(VIEWERS_DIR):
    if not viewer.is_dir():
        continue
    script = os.path.join(viewer.path, "scripts", "compile.py")
    if not os.path.isfile(script):
        continue
    spec = importlib.util.spec_from_file_location(f"{viewer.name}.compile", script)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    if hasattr(mod, "main"):
        mod.main()
