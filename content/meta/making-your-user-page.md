+++
title= "Making Your User Page (Github)"
draft= false
tags = ["Meta"]
categories = []
date= 2024-09-26
contributors = ["The 64th Gamer"]
+++
Even though the wiki is now a static site with no accounts or live elements, users and their contributions are still tracked! The [}}">Users List](%7B%7B%3C%20ref%20){tags="" user="" "=""} is where you can see every user's contribution count and user page link. It is not required to make a user page, but you are free to put whatever you want ^within reason^ on there if you do. This link will show up anywhere on the site that mentions you.

## Steps

- First go into the editor, you can just click "Edit Page" up top. (Or open Visual Studio Code if you're doing this locally)

- Open the file menu on the top left and go to the `/content/users` folder. You should see a list of user .html files.

- Right click the `users` folder and hit "Add New File". Name it to `yourusername.html`.

- Next, add this into the file as the parameters.

      +++
      title = ""
      draft = false
      tags = ["User"]
      startDate = ""
      +++

- Set `title` to be your username you use across the site. This is case-sensitive so make sure it's consistent! Keep `draft` and `tags` the same as they are, and set `date` updated to today's date any time you change the article. The date is formatted like `startDate = "2024-12-31"`

- Anything below the `+++` is free for you to write. Introduce yourself and such! After that you're basically done, commit the changes and pull request to the site.

- Once your user page is up it will also auto-populate with a link to every article you've contributed to. Over time more automated lists may show up on your page.
