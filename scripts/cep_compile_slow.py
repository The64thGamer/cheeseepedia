import sys
sys.dont_write_bytecode = True

import cep_generate_low_quality_photos
import cep_compile

cep_generate_low_quality_photos.run()
cep_compile.run()