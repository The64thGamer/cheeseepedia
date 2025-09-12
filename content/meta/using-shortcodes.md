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
  - `{{< wiki-link "ShowBiz Pizza Place" >}}` gives you a link to {{< wiki-link "ShowBiz Pizza Place" >}}
  - `{{< wiki-link "ShowBiz Pizza Place" "Test" >}}` gives you the linked text {{< wiki-link "ShowBiz Pizza Place" "Test" >}}
- `link` Provides a link to any website.
  - `{{< link "https://youtu.be/ysK77V2_qW0" >}}` gives you a link to {{< link "https://youtu.be/ysK77V2_qW0" >}}
  - `{{< link "https://youtu.be/QQiZ56ntM_s" "Showtape Archive" >}}` gives you the linked text {{< link "https://youtu.be/QQiZ56ntM_s" "Showtape Archive" >}}
- `cite` Provides a citation to the (1-indexed) link in the list. Be sure you cite a link that's actually in the citation parameters or the site will not compile. (Such as citing 2 when there's only 1 citation in the list)
  - `{{< cite 1 >}}` example.
