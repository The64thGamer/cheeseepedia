This is a manual for wanting to work with Cheese-E-Pedia's code and understand its layout.

## How it Works

Cheese-E-Pedia is a Single Page Application that uses link parameters (e.g. /?v=cep-js&=434ngf34ngjktegrfh for this page) to fetch various pieces of content and builds the page in real time. The content itself is uncompressed photos, .md files for articles, and .json files for metadata/parameters. This allows for minimal pre-processing and duplication of the data. Some pre-processing is done with the root compile.py, which compiles additional .json used for article linking and the search, but any direct content push to the site should have it immediately show up once its merged in the repository.
Pages are sorted by **type** and **tags**. Type decides how a page renders, like a review/photo/video, but still places articles into a sort of category based on the subject being discussed, like "Locations", "Showtapes", "History". This type is required for the article to work, and there is no base "Article" type, so pages are forced into at least having one piece of organization.
Tags are compiled from various parts of the article or other articles to form the 'Related Tags' section seen at the bottom of all pages, which is also what the site sees when running searches. In meta.json there is a direct 'tags' parameter for forcing a tag, but otherwise any linked articles in the content will also be included, alongside special parameters like "Remodels", "Credits", "Attractions", which within the context of reading the article are also linked pages. (except 'Credits' which allows you to search by names on the site, but to not be intrusive no single person can have a page)
Even with this setup, the site's SPA 'viewer' is fully modular. Arbitrary viewers can be added at the root /viewers/ folder to completely change the setup, though they will still need to deal with the underlying formatting of the articles. Articles are all in one giant list under /content/ with the same file structure, making it easy to parse through them in other ways.

## Structure

### Folders

* **/content/** contains a list of thousands of folders which each represent a single article.
* **/old/** contains both items that were not parsed correctly in the switch from Hugo to CEP-JS, alongside a collection of deleted articles for locations that were deemed too poor in writing to keep on the site, though they still hold valuable info in them. The site never accesses /old/.
* **/viewers/** contains a subfolder for each 'viewer' of the /content/, which comprises of various .js, .py, .html, and .json files to render anything inside /content/. Any scripts at the root directory are just for handing variables put inside the site link to determine which viewer will be accessed. Each viewer is otherwise independent unless scripts are purposefully shared.

### Root

* **compile.py** is used to for making pre-compiled data inside each viewer. It checks if any viewers have a /scripts/compile.py file and runs each..
* **index.html** sets up the basic page before a viewer is loaded.
* **index.js** handles which viewer will be switched to upon loading a page. New viewers have to be explicitly defined in this file. Viewers are started by their default.js file.

### CEP-JS

* **default.js** is the first script accessed in the viewer, which takes over the loading and unloading of various other scripts, alongside dealing with global code to the viewer.
* **Home.html** contains the content present only on the homepage.
* **Base.html** contains the header and footer.
* **Card.html** contains the div structure used for the large card display of articles.
* **main.css** has all styling for the viewer.
* **/js/** contains all javascript files for the pages.
* **/scripts/** contains scripts used for generating .json files for the site to use.
* **/compiled-json/** has the pre-compiled .json files used for linking articles, the search, items from the forums, and other non-article data.
* **/assets/** contains logos, fonts, and other images not inside articles.

### Content Article Folders

* The main article folder is a randomized string that is unrelated to the article title and is used for linking articles together without worrying about the title being changed.
* **content.md** is a markdown file containing all of the written article. In CEP-JS this is also used for creating descriptions for photos, videos, or reviews. Sometimes this file will be used as the article title as it allows more rich text to be used.
* **meta.json** is a set of parameters describing various aspects of the file, which is used for the search engine, tag generation, infobox generation, and other parts of an article not centered around the main text. The most critical components are the "title", "tags" for tagging other articles by title, "pageThumbnailFile" for tagging a photo article to be the thumbnail used, and "type" which tells the viewer how to display the article, such as being a photo, video, transcript, user or review.
* **photo.avif** is a unique image associated with the article. CEP-JS only interprets this file if the meta.json says the article is of type "Photos".
* **lowphoto.avif** is a low-res variant of the main photo used as a temporary display before the main photo loads in. lowphoto is not required to have the photo work.
* **ocr.html** is a (currently unused but still planned) set of HTML divs describing how OCR text should display for photo.avif.