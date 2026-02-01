import sys
sys.dont_write_bytecode = True
import subprocess
import os
import gzip
import shutil
import json
import urllib.request
import cep_build_media_index
import cep_build_photo_date_index
import cep_rate_articles
import cep_generate_graphs
import cep_build_locations_map

def fetch_discourse_news():
    """Fetch latest news from Discourse forum"""
    print("Fetching latest news from Discourse...")
    
    url = "https://forum.cheeseepedia.org/c/news/5/l/latest.json?order=created"
    
    try:
        with urllib.request.urlopen(url) as response:
            data = json.loads(response.read())
        
        # Save to Hugo data directory
        data_dir = "./data"
        os.makedirs(data_dir, exist_ok=True)
        
        with open(os.path.join(data_dir, "discourse_news.json"), 'w') as f:
            json.dump(data, f)
        
        print(f"Fetched {len(data.get('topic_list', {}).get('topics', []))} news topics")
    except Exception as e:
        print(f"Warning: Could not fetch Discourse news: {e}")

def precompress_files():
    """Pre-compress HTML, CSS, and JS files for nginx gzip_static"""
    print("Pre-compressing files for gzip_static...")
    
    public_dir = "./public"
    compressed_count = 0
    skipped_count = 0
    
    for root, dirs, files in os.walk(public_dir):
        for file in files:
            if file.endswith(('.html', '.css', '.js', '.xml', '.json', '.svg')):
                file_path = os.path.join(root, file)
                gz_path = file_path + '.gz'
                
                # Check if .gz exists and is newer than source file
                if os.path.exists(gz_path):
                    source_mtime = os.path.getmtime(file_path)
                    gz_mtime = os.path.getmtime(gz_path)
                    
                    if gz_mtime >= source_mtime:
                        skipped_count += 1
                        continue
                
                # Compress the file
                with open(file_path, 'rb') as f_in:
                    with gzip.open(gz_path, 'wb', compresslevel=6) as f_out:
                        shutil.copyfileobj(f_in, f_out)
                
                compressed_count += 1
    
    print(f"Compressed {compressed_count} files, skipped {skipped_count} unchanged files")

def run():
    print("=== Cheese E. Pedia ===")
    
    # Fetch latest news before building
    fetch_discourse_news()
    
    cep_build_media_index.run()
    cep_build_photo_date_index.run()
    cep_rate_articles.run()
    cep_generate_graphs.run()
    cep_build_locations_map.run()
    
    cache_dir = "./resources/_gen"
    if os.path.exists(cache_dir):
        print("Clearing Hugo resource cache...")
        shutil.rmtree(cache_dir)
    
    # Build the site
    subprocess.run(["hugo", "--destination", "./public"])
    
    # Pre-compress files for nginx
    precompress_files()
    
    print("Build complete with pre-compressed files!")

if __name__ == "__main__":
    run()