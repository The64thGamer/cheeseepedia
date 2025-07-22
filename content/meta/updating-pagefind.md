+++
title= "Updating PageFind"
date= 2024-09-26
draft= false
tags = ["Meta"]
categories = []
contributors = ["The 64th Gamer"]
+++
This tutorial is for updating the PageFind library that runs the site's searchbar for use in your forked or offline instance. It isn't needed to ever use if you're just a contributor to the main site as it is run often enough by the admins, but it is useful if you're spinning off your own instance.

This is only doable after completing [}}">"Compiling Cheese-E-Pedia through Hugo"](%7B%7B%3C%20ref%20){meta="" compiling="" cheese-e-pedia="" through="" hugo"=""} first. PageFind doesn't automatically update itself when the wiki is changed, so every once and a while this should be run to update summaries, titles, and add in new pages.

## Steps

- Once your newest changes have been finished, run `hugo` to generate the entire site to the "cheeseepedia/public" folder.
- When that is complete, run `./pagefind --site "public" --output-subdir ../static/pagefind --glob "wiki/**/*.{html}"`. This should update PageFind in the codebase.
- Run `hugo server` or `hugo` again to see your results. If you don't ever use fully generated sites and just the live ones from `hugo server`, you can delete the "cheeseepedia/public" folder now.
