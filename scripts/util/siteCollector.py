import os
import tomllib

class Page:
  def __init__(self, toml, md):
    self.toml = toml
    self.md = md

class Site:
  def __init__(self, ContentPaths, OUTPUTPATH):
    self.total = 0
    self.sections = {}
    print(f"    -> Output path: \"{OUTPUTPATH}\"")

    for section in ContentPaths:
      sectionName = section.name.lower()
      sectionPages = []

      for dirpath, dirnames, filenames in os.walk(section.value):
        for file in filenames:
          filepath = os.path.join(dirpath, file)

          with open(filepath, "r", encoding="utf-8") as page:
            pageContent = page.read().split("+++")
            toml = tomllib.loads(pageContent[1])
            md = pageContent[2]
            sectionPages.append(Page(toml, md))

      self.total += len(sectionPages)
      self.sections.update({sectionName: sectionPages})
      print(f"    -> {sectionName}: \"{section.value}\" ({len(sectionPages)} pages)")
