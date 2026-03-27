import json, re
from pathlib import Path
from flask import Flask, send_from_directory, abort, redirect

categoryDict = None

def generateCategorydict():
  global categoryDict
  if categoryDict is not None:
    return categoryDict

  print("Generating category dictionary...")
  categoryDict = {}

  for content in Path('content').rglob('meta.json'):
    path = content.parent.name
    with open(content, 'r', encoding = 'utf-8') as meta:
      metadata = json.load(meta)
      title = re.sub(r'[^a-z0-9]+', '-', metadata['title'].lower().replace('.', '')).strip('-')
      title = '-'.join(title.split())
      categoryDict[title] = path

  print("Category dictionary complete!")
  return categoryDict

app = Flask(__name__, static_folder = '/')

@app.route('/')
def index():
  return send_from_directory(app.static_folder, 'index.html')

@app.route('/<category>/<title>', strict_slashes = False)
def category(category, title):
  localDict = generateCategorydict()
  category = category.lower()
  title = title.lower()
  if localDict.get(title):
    return redirect(f'/?v=&={localDict.get(title)}')
  else:
    abort(404)