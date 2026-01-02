+++
title = "Editing Cheese-E-Pedia in DecapCMS"
date = 2026-01-01
draft = false
tags = ["Meta"]
categories = []
contributors = ["Stripes"]
citations = ["https://cheeseepedia.org", "Cheese-E-Pedia"]
+++

This page provides an overview of the steps required to edit Cheese-E-Pedia on the web using DecapCMS. This is the primary method of editing content on Cheese-E-Pedia.

Jump to Section:
* [Intro to DecapCMS](#intro-to-decapcms)
* [First Step: Credit Yourself!](#first-step-credit-yourself)
* [Second Step: Understand Parameters](#second-step-understand-parameters)
* [Third Step: Editing Markdown and Using Shortcodes](#third-step-editing-markdown-and-using-shortcodes)
* [Fourth Step: Save and Mark Ready!](#fourth-step-save-and-mark-ready)
* [What's Next?](#whats-next)

---

Here is the general flow for editing a page:

1. Click "Contribute" and then "Edit Page" while you're on the page you want to edit.
2. Login to DecapCMS and start editing the content.
3. Save, and then mark your content as ready.
4. Moderators will review your edit(s) and may leave comments to make adjustments.
5. Once approved, your changes will appear on the site within 5-10 minutes of approval.

---

**Please note that DecapCMS is unfortunately a system with quite a few issues that we are aware of but cannot solve.** An alternative editor, [SveltiaCMS](https://github.com/sveltia/sveltia-cms), is available but does not support the functionality that allows anyone to edit and submit for review. We are expecting that to be ready in early-to-mid 2026. Stay tuned!

**We _highly_ reccommend that you store your content in a text file or a notes application if you are making significant edits, just in case you are unable to save and need to try again later.**
* If you use Google Docs or another word processor, make sure that "curly"/"curved" quotes are replaced with "straight" quotes or else that will cause issues when the wiki gets rebuilt with your changes.

---

## Intro to DecapCMS

DecapCMS is our primary editor that appears when you click the "Contribute" and then "Edit Page" while you're reading any page on Cheese-E-Pedia.

To make an edit, go to the page you would like to edit and then click the "Contribute" and then the "Edit Page" button.

DecapCMS will ask you to login with GitHub. At this point, you can make an account on GitHub, or sign in with an existing account. 

If you have not made an edit before, DecapCMS will create a clone of Cheese-E-Pedia that stores your changes. When your changes are ready to publish, DecapCMS will push the changes to moderator review on your behalf, without you needing to know how GitHub works. 

* For the technical user, DecapCMS is creating a forked repository of Cheese-E-Pedia, committing your changes to your local forked copy, and submitting a pull request on your behalf. Refer to {{< wiki-link "Editing Cheese-E-Pedia in Local Environments" >}} to understand how this happens when editing locally.

## First Step: Credit Yourself!

Before you make any edits, make sure to add yourself to the contributors list. By adding your name to the list, your name will appear on the page you edited. We have a [User List](/tags/user) that shows all users and their ranking on our contribution leaderboard based on the number of pages credited to them. Get yourself to the top with high-quality edits!

* Be sure that your name is consistent across pages to ensure that the leaderboard count is correct.
* Also be sure to not include _quotes_ (', ") or _backslashes_ (\\) in your name because that will cause issues when the wiki gets rebuilt with your changes.

## Second Step: Understand Parameters

Pages on Cheese-E-Pedia use parameters, which are special fields that are parts of the page you are looking at. For example, the title, the body/content, tags, and categories are all parameters. 

When you edit a page, you are shown the parameters that are relevant to the type of page you are editing. For example, a general wiki page might have a place to add a store number or a show format. However, a transcriptions page might just have a place to add the name of the showtape it is a transcription of.

* For the technical user, refer to {{< wiki-link "Editing Cheese-E-Pedia in Local Environments" >}} for more detailed parameter information and formatting.
* Pages must have **at minimum** a title, at least one tag, at least one category, and at least one contributor.
    * When categorizing PTT/CEC content, 1977-1984 is considered as {{< wiki-link "Pizza Time Theatre" >}} and 1985-present is considered as {{< wiki-link "Chuck E. Cheese's" >}}.
* Dates must be in the format "YYYY-MM-DD" -- if you don't know the full month, day, or year, replace with 0s.
* Citation parameters can either be URLs (such as "https://cheeseepedia.org") or text (such as "Cheese-E-Pedia"). You do not need to include quotes or link formatting from HTML or Markdown.
* Information about how to enter parameters is located on the page editor. If you have any questions, reach out on the {{< forums >}} first!

## Third Step: Editing Markdown and Using Shortcodes

The body content of the site uses Markdown, which provides an easy system to format text. For example, `**bold**` text is **bold** and `_italicized_` text is _italicized_.

We also use common shortcodes that help insert links to other pages or external websites without needing to remember the formatting.

* Use `{{</* wiki-link "Cheese-E-Pedia" */>}}` to create a link to the page named {{< wiki-link "Cheese-E-Pedia" >}}.
    * You can also use `{{</* wiki-link "Cheese-E-Pedia" "wiki" */>}}` to make the link display as {{< wiki-link "Cheese-E-Pedia" "wiki " >}} instead.
    * If the page does not exist, do not worry! The link will simply display as red.
* Use `{{</* link "https://cheeseepedia.org" */>}}` to create a link to the website {{< link "https://cheeseepedia.org" >}} instead.
    * Just like `wiki-link`, you can use `{{</* link "https://cheeseepedia.org" "Cheese-E-Pedia" */>}}` to make the link display as {{< link "https://cheeseepedia.org" "Cheese-E-Pedia" >}} instead.
* To use citations, first you must make sure you have at least one entry in the `citations` paramater.
    * You can use `{{</* cite 1 */>}}` to refer to the first citation in your list, and `{{</* cite 2 */>}}` for the second citation in your list, and so-on. {{< cite 1 >}}{{< cite 2 >}}
    * References (a list of your citations) will appear on the page at the bottom.

When using shortcodes, make sure to use the correct format and to ensure that you always have a closing quote; when using citation shortcodes, make sure you have at least one citation, and that you use a number between 1 and the number of citations, not higher than that! Otherwise, this will cause issues when the wiki gets rebuilt with your changes.

## Fourth Step: Save and Mark Ready!

When you're ready to save your changes, click "Save" on the top of the page, and then click "Publish"/"Ready" -- then you're all set!

## What's Next?

At this point, your edit is now in the review process by the moderation team. When free, they will review your edits and ensure that they meet wiki standards and won't cause issues when the wiki is rebuilt with your changes. This is done on the {{< github >}} in the "Pull Requests" section. Moderators may leave a comment on the edit asking for more info or suggesting changes before merging. Check on your contributions or set up email notifications!

Once your edit is approved, it will be added to the wiki. The wiki automatically rebuilds when any changes are made, but this process can take between 5 to 10 minutes, and then your changes will appear on the live site!

---

Thank you for contributing to Cheese-E-Pedia!

---
