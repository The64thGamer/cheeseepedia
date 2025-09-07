+++
title= "Using Shortcodes & Linking Pages"
draft= false
tags = ["Meta"]
categories = []
contributors = ["The 64th Gamer"]
+++
Shortcodes are custom functions that can be run in Hugo that expand the default HTML capabilities. Currently these are only used to ease linking pages, but may be expanded in the future.

## Shortcode List

- `wiki-link` Provides a link to any standard page.
  - `{{}}` gives you a link to {{< wiki-link "ShowBiz Pizza Place" >}}
  - `{{}}` gives you the linked text {{< wiki-link "ShowBiz Pizza Place" "Test" >}}
- `link` Provides a link to any website.
  - `{{}}` gives you a link to {{< link "https://youtu.be/ysK77V2_qW0" >}}
  - `{{}}` gives you the linked text {{< link "https://youtu.be/QQiZ56ntM_s" "Showtape Archive" >}}
