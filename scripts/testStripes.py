import sys
sys.dont_write_bytecode = True

import util.siteCollector as siteCollector
import enum

class ContentPaths(enum.Enum):
  META = "./content/meta"
  NEWS = "./content/news"
  PHOTOS = "./content/photos"
  TRANSCRIPTIONS = "./content/transcriptions"
  VIDEOS = "./content/videos"
  WIKI = "./content/wiki"

class StaticPaths(enum.Enum):
  PHOTOS = "./static/photos"
  LOWRES = "./static/lowphotos"

OUTPUTPATH = "./data"

print(f"\n=== CEP Compilation Script ===\n")

print(f"Running siteCollector to store site data...")
site = siteCollector.Site(ContentPaths, OUTPUTPATH)
print(f"{site.total} pages collected!\n")

print(f"Next step goes here...")

for section in site.sections:
  print(f"    -> {section} - {len(site.sections[section])}")

print(f"\n=== Compilation process complete ===\n")
