import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

import discourseFetchNews
import buildArticleLinker
import buildCitationLinker
import buildSearch

def main():
    discourseFetchNews.main()
    buildSearch.main()
    buildArticleLinker.main()
    buildCitationLinker.main()