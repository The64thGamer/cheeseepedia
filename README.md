This is a test repository to hopefully bring the Cheese-E-Pedia website off of Mediawiki and into Hugo.


# Compiling for beginners
- This repository is not the Cheese-E-Pedia website itself, rather a collection of files that will be compiled into a static site. To run the site locally for use in live visual editing or viewing the site, download this repository.
- It is reccomended to fork the site and have GitHub Desktop create a repository for it, that way any changes can be pushed as Pull Requests to this repository for inclusion.
- Download [Hugo v0.92.2+extended](https://github.com/gohugoio/hugo/releases/tag/v0.92.2) which is the compiler for the site.
- Download Visual Studio Code from your store of choice. Go to ``File>Open Folder`` and open the ``Cheeseepedia`` folder.
- Click on the bottom of Visual Studio Code where the ``⨂ 0 ⚠ 0`` text is. This will open a new section.
- On the tabs at the top of the section, click the ``Terminal`` window.
- To preview the site, type ``hugo server`` and let it compile. It will provide a link to a local port to open in your browser. Any changes you make to the files in Visual Studio Code will now auto-update the site (not always though).
- To close out of the preview, hit ``Ctrl + C`` in the terminal.
- To compile the site for rehosting somewhere else, or to have a permanent compilation to use in the browser, just type ``hugo``. The site will be compiled to the ``/public/`` folder.
