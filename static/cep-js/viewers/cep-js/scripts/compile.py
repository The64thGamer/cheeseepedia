import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

import discourseFetchNews
import buildSearch

def main():
    discourseFetchNews.main()
    buildSearch.main()