import sys
sys.dont_write_bytecode = True

import cep_generate_low_quality_photos
import cep_compile
import cep_build_fuzzy_search
import cep_build_tag_search

cep_generate_low_quality_photos.run()
cep_build_fuzzy_search.run()
cep_build_tag_search.run()
cep_compile.run()