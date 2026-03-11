import sys
sys.dont_write_bytecode = True
import os
import shutil

def copy_markdown_files():
    """Copy all markdown files from /content/ to /public/ preserving directory structure"""
    print("=== Copying Markdown Files to Public ===")
    
    content_dir = "./content"
    public_dir = "./public"
    
    if not os.path.exists(content_dir):
        print(f"Error: Content directory '{content_dir}' does not exist")
        return
    
    # Create public directory if it doesn't exist
    os.makedirs(public_dir, exist_ok=True)
    
    copied_count = 0
    skipped_count = 0
    
    # Walk through all subdirectories in content
    for root, dirs, files in os.walk(content_dir):
        # Calculate relative path from content directory
        rel_path = os.path.relpath(root, content_dir)
        
        # Create corresponding directory in public
        if rel_path == '.':
            dest_dir = public_dir
        else:
            dest_dir = os.path.join(public_dir, rel_path)
        
        os.makedirs(dest_dir, exist_ok=True)
        
        # Copy all .md files
        for file in files:
            if file.endswith('.md'):
                source_file = os.path.join(root, file)
                dest_file = os.path.join(dest_dir, file)
                
                # Check if file needs to be copied (compare modification times)
                if os.path.exists(dest_file):
                    source_mtime = os.path.getmtime(source_file)
                    dest_mtime = os.path.getmtime(dest_file)
                    
                    if dest_mtime >= source_mtime:
                        skipped_count += 1
                        continue
                
                # Copy the file
                shutil.copy2(source_file, dest_file)
                copied_count += 1
                
                if copied_count % 100 == 0:
                    print(f"  Copied {copied_count} files...")
    
    print(f"Markdown copy complete: {copied_count} copied, {skipped_count} skipped (unchanged)")

def run():
    """Main entry point for copying markdown files"""
    copy_markdown_files()

if __name__ == "__main__":
    run()
