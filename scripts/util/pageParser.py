def process(ContentPaths, OUTPUTPATH):
  print(f"-> Output path: \"{OUTPUTPATH}\"")
  for path in ContentPaths:
    name = path.name.lower()
    print(f"-> {name}: \"{path.value}\"")
