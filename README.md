![image](static/UI/CEPLogo.png)

Welcome CEP user! CEP is looking into potentially (highly likely) moving from MediaWiki and Miraheze to a static site run on Hugo! This will greatly open up the site's customizability and design when displaying articles and data. Right now it is in the testing process of redesigning all the CSS, but you can download this repository and host it locally to see it in action with the tutorial below!

# Changes
- With this move however, if you're an active contributor this GitHub page will be your new home for submitting edits! You'll fork the repository on your GitHub account, make changes to whatever you need, and then submit a "Pull Request" here to have your changes merged into the live site. This process opens you up to not just working on a single article at a time, but you can edit multiple files as a single commit, and can change any section of the site- including its layout and design! Commits will not be automatically live however so we can review your changes. It may be beneficial to now make larger contributions instead of many tiny edits. Pull Requests also have comment sections now, so we may stop a merge from happening by letting you know if there's something you need to fix first.
- Accounts also technically don't exist anymore! Pages now have a "contributors" section where you'll need to sign off with your username. The site keeps track of every contributor name and will display your contributed pages on your user page, and yes you still do have a user page!
- The site is now going to lock down more of its templating and styling to ensure page formatting is consistent. For example, standard rules wanted pages to have a ``Template:Generic`` with a picture as the article picture to properly embed it in previews and SEO. A lot of pages however just inserted a normal image in that spot. Now each page will have a multitude of prompts to fill out such as images, a gallery, dates, titles, ect- to keep consistency (and to allow us to change the site design easily without changing articles themselves).

![image](https://github.com/user-attachments/assets/d136817e-c93d-4c26-9215-12bad3eb579e)

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
