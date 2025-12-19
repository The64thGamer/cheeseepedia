import sys
sys.dont_write_bytecode = True

import util.pageParser as pageParser
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

print("\n=== Cheese E. Pedia ===\n")
print("Running pageParser to create base data...")
pages = pageParser.process(ContentPaths, OUTPUTPATH)
print(f"{pages} pages parsed")
print("\n=== Process Complete ===\n")
