import os
import tomllib

def process(ContentPaths, OUTPUTPATH):
  pageCount = 0
  print(f"  Output path: \"{OUTPUTPATH}\"")

  for path in ContentPaths:
    name = path.name.lower()
    pathPageCount = 0

    for dirpath, dirnames, filenames in os.walk(path.value):
      for file in filenames:
        pathPageCount += 1
        filepath = os.path.join(dirpath, file)

        with open(filepath, "r") as page:
          pageContent = page.read().split("+++")
          toml = tomllib.loads(pageContent[1])
          md = pageContent[2]

    pageCount += pathPageCount
    print(f"  {name}: \"{path.value}\" ({pathPageCount} pages)")
  
  return pageCount
