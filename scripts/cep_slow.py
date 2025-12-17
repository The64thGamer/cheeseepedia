import sys
sys.dont_write_bytecode = True

import util.pageParser as pageParser
import subprocess
import enum
import cep_generate_low_quality_photos
import cep

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

print("=== Cheese E. Pedia ===")
print("Running pageParser to create base data...")

#test = input("Test: ")

pageParser.process(ContentPaths, OUTPUTPATH)

cep_generate_low_quality_photos.run()

cep.run()