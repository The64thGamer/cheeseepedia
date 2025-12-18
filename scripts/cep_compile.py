import sys
sys.dont_write_bytecode = True

import subprocess
import cep_build_media_index
import cep_build_photo_date_index

def run():
    print("=== Cheese E. Pedia ===")

    cep_build_media_index.run()
    cep_build_photo_date_index.run()

    subprocess.run(["hugo", "server"])

if __name__ == "__main__":
    run()