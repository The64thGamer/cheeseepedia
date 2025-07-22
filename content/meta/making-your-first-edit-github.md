+++
title = "Making Your First Edit (Github)"
draft = false
tags = ["Meta"]
categories = []
contributors = ["The 64th Gamer"]
+++
Thanks for wanting to contribute to Cheese-E-Pedia! Thankfully this process is easy for any article. For this first example let's just assume you're wanting to do some quick grammar edits to a page and submit your results, here's how:

- First, find the article you want to edit and hit the "Edit Page" button on the top right. You can use this article as an example.
- This will send you to Github.dev, which is a web version of Visual Studio Code that integrates into the site's {{< github-repository >}}. First thing's first, if nothing loads or it says "Unable to resolve resource", this is due to your browser's settings being too strict or your firewall is blocking the site. In Firefox you can just turn "Browser Privacy" from "Strict" to "Standard". If it's your firewall, check [this page here.](https://docs.github.com/en/codespaces/the-githubdev-web-based-editor#using-githubdev-behind-a-firewall)
- Articles are .html files with some TOML formatting at the beginning. If you've ever made a webpage its the same way of writing.
  ![Picture of the Github.Dev interface.](/UI/Github%20Dev%20Help.avif){style="width: 100%;"}
- Go ahead and begin making your edits to the article. Some quick formatting notes: `<b></b>` for **bold**, `<i></i>` for *italics*, `<h2></h2>` for article headings. Places like [w3schools](https://www.w3schools.com/html/) provide all the info you'll need for lists, tables, ect. You can also browse other article's files to see how they do things. Also, press `Alt + Z` to enable text wrapping! This can permanently be turned on in the settings.

## Before you submit!

- First thing you wanna do add your name to the contributors list! At the top of the file there should be a line that says `contributors = ["User 1","User 2"]`. Add your username in quotes with a comma, so it'd now look like `contributors = ["User 1","User 2","User 3"]`. This puts you on the contributors list at the bottom of the page, and also tracks your contribution count in the users list accesible from Contributor Home or the homepage! Be sure to keep your name consistent across article edits! Also don't use quotes or backslashes in your name or it'll break things.

## Submitting

- When you're ready to save, you can click the icon marked "Save" in the image above ^^ to submit your changes.
- Pressing that will pull up this tab going over your changes. This is an important thing to note! You can edit multiple articles and files all in one "Commit", and you can submit multiple "Commits" at once. This lets you break up your work into chunks for moderators. You may also have to submit another commit if a moderator tells you to change some things before they merge it in. Once you've saved all your commits, click the circled icon.
  ![Picture of the Github.Dev source control tab.](/UI/Save%20Changes.avif){style="width: 30%;"}
- This is your final changes screen. Here you give a summary for all your commits, and any additional notes.
  ![Picture of the Github.Dev source control tab.](/UI/Pull%20Request.avif){style="width: 30%;"}

## I submitted! Now what?

- Your edit is now in the review process by the mod team. When we have the time we'll go over your edits and ensure they meet wiki standards and won't break anything. We may leave a comment on the edit asking for more info or letting you know to change something before it's merged, so check on your contributions or set up email notifications!
- Once your edit is approved, it'll be added to the site. The site automatically updates when any changes are merged, but this can take between 5 and 10 minutes to appear on the live site.

And that's it! For more complex article editing such as tags, categories, parameters, image insertions, creating new pages, ect, check the rest of the tutorials!
