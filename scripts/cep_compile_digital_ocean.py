import sys
sys.dont_write_bytecode = True

import subprocess
import cep_build_media_index
import cep_generate_graphs
import cep_rate_articles


cep_build_media_index.run()
cep_rate_articles.run()
cep_generate_graphs.run()
