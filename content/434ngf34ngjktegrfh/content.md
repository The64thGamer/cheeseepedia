This is a manual for wanting to work with Cheese-E-Pedia's code and understand its layout.

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