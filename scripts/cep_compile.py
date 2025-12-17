import sys
sys.dont_write_bytecode = True

import util.pageParser as pageParser
import subprocess
import cep_build_media_index

print("=== Cheese E. Pedia ===")

cep_build_media_index.run()

subprocess.run(["hugo", "server"])
