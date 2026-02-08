import sys
sys.dont_write_bytecode = True
import subprocess
import os
import gzip
import shutil
import json
import urllib.request
import frontmatter
from frontmatter.default_handlers import TOMLHandler
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
            json.dump(data, f, indent=2)
        
        print(f"Fetched {len(data.get('topic_list', {}).get('topics', []))} news topics")
    except Exception as e:
        print(f"Warning: Could not fetch Discourse news: {e}")

def fetch_discourse_users():
    base_url = "https://forum.cheeseepedia.org"
    all_users = []
    page = 0
    
    gradient_scale = [
        {"min": 0, "max": 1, "start": "#464141", "end": "#464141", "rank": "Bankruptcy"},
        {"min": 2, "max": 4, "start": "#613583", "end": "#613583", "rank": "Toddler Zone"},
        {"min": 5, "max": 9, "start": "#3b538a", "end": "#3b538a", "rank": "Crusty & Greasy"},
        {"min": 10, "max": 24, "start": "#26a269", "end": "#26a269", "rank": "Jumpscare Fodder"},
        {"min": 25, "max": 49, "start": "#d3b31c", "end": "#d3b31c", "rank": "Store Tourist"},
        {"min": 50, "max": 74, "start": "#ff7800", "end": "#ff7800", "rank": "Wiki Wanderer"},
        {"min": 75, "max": 99, "start": "#e01b24", "end": "#e01b24", "rank": "Article Wizard"},
        {"min": 100, "max": 149, "start": "#ff8383", "end": "#ff006d", "rank": "Historian"},
        {"min": 150, "max": 299, "start": "#aaa8bc", "end": "#241f31", "rank": "Guest Star"},
        {"min": 300, "max": 499, "start": "#c97e3c", "end": "#3c6f50", "rank": "Super Chuck"},
        {"min": 500, "max": 749, "start": "#ff7800", "end": "#703820", "rank": "Phase IV"},
        {"min": 750, "max": 999, "start": "#e3e9e8", "end": "#5b5f60", "rank": "CEC Master"},
        {"min": 1000, "max": 99999, "start": "#d9d15a", "end": "#ce6923", "rank": "The Giant Rat That Makes All of the Rules"}
    ]
    
    try:
        while True:
            url = f"{base_url}/directory_items.json?period=all&order=post_count&page={page}"
            print(f"  Fetching page {page}...")
            with urllib.request.urlopen(url) as response:
                data = json.loads(response.read())
            
            items = data.get('directory_items', [])
            if not items: break
            
            for item in items:
                u = item.get('user', {})
                if u: all_users.append(u)
            if not data.get('meta', {}).get('load_more_directory_items'): break
            page += 1

        # Count contributors from Wiki and Transcriptions files
        contributor_counts = {}
        content_dirs = ["./content/wiki", "./content/transcriptions"]
        
        for content_dir in content_dirs:
            if os.path.exists(content_dir):
                print(f"  Counting contributors from {content_dir}...")
                for root, _, files in os.walk(content_dir):
                    for file in files:
                        if file.endswith('.md'):
                            try:
                                with open(os.path.join(root, file), 'r', encoding='utf-8') as f:
                                    # Standardizing TOML loading
                                    post = frontmatter.load(f, handlers=[TOMLHandler()])
                                    contributors = post.get('contributors', [])
                                    if isinstance(contributors, list):
                                        for c in contributors:
                                            if c: contributor_counts[c] = contributor_counts.get(c, 0) + 1
                            except Exception as e:
                                print(f"    Error processing {file}: {e}")

        matched_wiki_names = set()

        # 1. Update Discourse Users
        for user in all_users:
            # Fix: Ensure these are strings or empty strings, never None
            u_name = str(user.get('name') or "").lower()
            u_slug = str(user.get('username') or "").lower()
            count = 0
            
            for c_name, c_count in contributor_counts.items():
                c_name_lower = str(c_name).lower()
                if (u_name and c_name_lower == u_name) or (u_slug and c_name_lower == u_slug):
                    count += c_count
                    matched_wiki_names.add(c_name)
            
            user['contribution_count'] = count
            
            # Default rank
            user['rank'] = "Newcomer"
            user['gradient_start'] = "#464141"
            user['gradient_end'] = "#464141"
            
            for scale in gradient_scale:
                if scale['min'] <= count <= scale['max']:
                    user['rank'] = scale['rank']
                    user['gradient_start'] = scale['start']
                    user['gradient_end'] = scale['end']
                    break

        # 2. Add "Guest" users for Wiki contributors not on Discourse
        for c_name, c_count in contributor_counts.items():
            if c_name not in matched_wiki_names:
                guest_user = {
                    "username": c_name,
                    "name": c_name,
                    "avatar_template": None, 
                    "contribution_count": c_count,
                    "is_guest": True 
                }
                
                # Assign rank/gradient to guests
                guest_user['rank'] = "Newcomer"
                guest_user['gradient_start'] = "#464141"
                guest_user['gradient_end'] = "#464141"
                
                for scale in gradient_scale:
                    if scale['min'] <= c_count <= scale['max']:
                        guest_user['rank'] = scale['rank']
                        guest_user['gradient_start'] = scale['start']
                        guest_user['gradient_end'] = scale['end']
                        break
                all_users.append(guest_user)

        # Sort everything by contribution count
        all_users.sort(key=lambda x: x.get('contribution_count', 0), reverse=True)
        
        os.makedirs("./data", exist_ok=True)
        with open("./data/discourse_users.json", 'w') as f:
            json.dump(all_users, f, indent=2)
        
        print(f"Saved {len(all_users)} total contributors to JSON")
        
    except Exception as e:
        import traceback
        print(f"Warning: Could not process users: {e}")
        traceback.print_exc() # This will help us find the exact line if it fails again

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
    
    # Fetch latest news and user data before building
    fetch_discourse_news()
    fetch_discourse_users()
    
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