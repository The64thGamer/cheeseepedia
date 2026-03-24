import json, re
from pathlib import Path
from flask import Flask, send_from_directory, abort, redirect

categorydict = {}

for content in Path('content').rglob('meta.json'):
  path = content.parent.name
  with open(content, 'r', encoding = 'utf-8') as meta:
    metadata = json.load(meta)
    title = re.sub(r'[^a-z0-9]+', '-', metadata['title'].lower().replace('.', '')).strip('-')
    title = '-'.join(title.split())
    categorydict[title] = path

app = Flask(__name__, static_folder = '/')

@app.route('/')
def index():
  return send_from_directory(app.static_folder, 'index.html')

@app.route('/<category>/<title>', strict_slashes = False)
def category(category, title):
  category = category.lower()
  title = title.lower()
  if categorydict.get(title):
    return redirect(f'/?v=&={categorydict.get(title)}')
  else:
    abort(404)