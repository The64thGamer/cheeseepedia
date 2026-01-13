import sys
sys.dont_write_bytecode = True

import subprocess
import cep_build_media_index
import cep_build_photo_date_index
import cep_rate_articles
import cep_generate_graphs
import cep_build_fuzzy_search
import cep_build_tag_search
import cep_build_locations_map

def run():
    print("=== Cheese E. Pedia ===")

    cep_build_media_index.run()
    cep_build_photo_date_index.run()
    cep_rate_articles.run()
    cep_generate_graphs.run()
    cep_build_fuzzy_search.run()
    cep_build_tag_search.run()
    cep_build_locations_map.run()

    subprocess.run(["hugo", "server"])

if __name__ == "__main__":
    run()