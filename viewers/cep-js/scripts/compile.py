import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

import discourseFetchNews
import buildArticleLinker
import buildCitationLinker
import buildContributors
import buildSearch
import buildFinalData
import buildLocationInventoryLinker
import buildRelated

def main():
    print("Start")
    discourseFetchNews.main()
    buildSearch.main()
    buildArticleLinker.main()
    buildCitationLinker.main()
    buildContributors.main()
    buildLocationInventoryLinker.main()
    buildRelated.main()

    buildFinalData.main()