import sys
sys.dont_write_bytecode = True
import subprocess
import os
import gzip
import shutil

# Import the separated scripts
import cep_fetch_discourse
import cep_copy_markdown
import cep_build_media_index
import cep_build_photo_date_index
import cep_rate_articles
import cep_generate_graphs
import cep_build_locations_map

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
    print("=== Cheese E. Pedia Build ===")
    
    cep_fetch_discourse.run()
    
    cep_build_media_index.run()
    cep_build_photo_date_index.run()
    cep_rate_articles.run()
    cep_generate_graphs.run()
    cep_build_locations_map.run()
    cep_copy_markdown.run()

    print("Building site with Hugo...")
    subprocess.run(["hugo", "--destination", "./public"])
    
    precompress_files()
    
    print("Build complete with pre-compressed files!")

if __name__ == "__main__":
    run()