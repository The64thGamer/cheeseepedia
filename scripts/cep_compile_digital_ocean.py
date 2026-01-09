import sys
sys.dont_write_bytecode = True

import subprocess
import cep_build_media_index
import cep_generate_graphs
import cep_rate_articles
import cep_build_fuzzy_search
import cep_build_tag_search

cep_build_media_index.run()
cep_rate_articles.run()
cep_generate_graphs.run()
cep_build_fuzzy_search.run()
cep_build_tag_search.run()
