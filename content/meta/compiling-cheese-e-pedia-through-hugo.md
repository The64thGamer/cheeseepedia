+++
title= "Compiling Cheese-E-Pedia through Hugo"
date= 2024-09-26
draft= false
tags = ["Meta"]
categories = []
contributors = ["The 64th Gamer"]
+++
Working on Cheese-E-Pedia directly through GitHub can be slow and with limitations. The proper way for managing lots of contributions is to create a local instance on your computer linked through Github Desktop.

## Benefits

- A live editor to preview any changes you make to articles or the site itself.
- Fully working offline copy you can read and edit without internet.
- Preview all changes you've made in Github Desktop. This also allows undoing entire files, or splitting changes into different commits


You will need just 3 things for this process: Visual Studio Code, Hugo, and GitHub Desktop. This process should only take 10 minutes.

## Steps

- The repository is not the Cheese-E-Pedia website itself, rather a collection of files that will be compiled into a static site. First download the repository from the {{< github-repository >}}.
- It is recommended to fork the site and have [GitHub Desktop](https://desktop.github.com/download/) download the project to your computer, that way any changes can be pushed as Pull Requests to this repository for inclusion.
- Download [Hugo v0.92.2+extended](https://github.com/gohugoio/hugo/releases/tag/v0.92.2) which is the compiler for the site.
- Download Visual Studio Code from your store of choice. Go to `File>Open Folder` and open the `Cheeseepedia` folder.
- Click on the bottom of Visual Studio Code where the `⨂ 0 ⚠ 0` text is. This will open a new section.
- On the tabs at the top of the section, click the `Terminal` window.
- To preview the site, type `hugo server` and let it compile. It will provide a link to a local port to open in your browser. Any changes you make to the files in Visual Studio Code will now auto-update the site (not always though).
- To close out of the preview, hit `Ctrl + C` in the terminal.
- To compile the site for rehosting somewhere else, or to have a permanent compilation to use in the browser, just type `hugo`. The site will be compiled to the `/public/` folder.
