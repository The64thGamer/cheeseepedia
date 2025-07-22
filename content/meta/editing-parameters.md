+++
title = "Editing Parameters (GitHub)"
date = 2024-09-24
draft = false
tags = ["Meta"]
categories = []
contributors = ["The 64th Gamer"]
+++

Parameters always start and end with `+++`. Each parameter is also case sensitive. The wiki has a file containing all the parameters [available here](https://github.com/The64thGamer/cheeseepedia/blob/main/archetypes/default.html). If you ever compile the site locally, this is automatically generated with every new article you make. It is extremely important to format parameters the way the wiki expects you to, or it will prevent the site from working.

- Parameters like `title = ""` require the text to be encased in those quotes.
- Parameters like `tags = ["Meta","User"]` which are for multiple inputs, require each item to be in quotes and to be seperated by commas, also contained in the brackets.
- Any parameter requiring a date must be formatted like YEAR-MONTH-DAY, in other words `2024-12-31`. If you don't know part of the date, you'll put `00` in its place. For instance, if you only know "May 1984" it'd be `1984-05-00`, if you don't know the entire date, just put `0000-00-00`
- When dealing with dates considered "right now", just put `""`. The wiki will determine this as "today". This is useful for locations that haven't closed yet. Set their `startdate` to the opening, and leave the `enddate` as `""`
- In the more complex parameters, there will be a "pipe" ( "|" ) input to distinguish multiple pieces of text in one part. These deliminate each section when the wiki reads it. For example: `["Ed Bogas|Producer", "John Widelock|Chuck E. Cheese Voice Actor"]` uses the pipe to seperate the name from the role. Not using the piping correctly may result in breaking the site so check the instructions for the parameter and if it uses pipes!
- Certain characters like quotes " cannot be used alone in a parameter or it will thing its breaking out early. To have a quote inside a quote you mark it as `"`. This will mainly happen when you're trying to link something.

## The Parameters

Here is your full guide to every parameter, when to use it, and what to put in it.

Required Parameters

- `title = ""` The page title. Be aware parameters rely on this title, so if you change it- you'll need to search and replace all instances of it on the site.
- `draft = false` This parameter must always be there and always be false. Turning it true hides it from showing on the site.
- `tags = []` Site tags, what you see on the homepage such as "Locations" or "Animatronics". In 99% of cases there should only be one tag.
- `categories = []` Site categories, what you see on the homepage dropdown menu like "Pizza Time Theatre" or "Creative Engineering". Generally there should only ever be one category. Be aware that 1977-1984 is Pizza Time Theatre, and 1985-Present is Chuck E. Cheese's in how we format things.
- `contributors = []` Your username! Insert it here to have your contributions tracked across the site. Be sure to keep a consistent username across pages!>


General Parameters

- `startDate = ""` When was this locationed opened? When was this item created? When did this media debut?. This always is considered when an item was done, not when it was conceived. In situations like remodels where prototype test locations were done before a full scale initiative, we count the first prototype location's remodel.
- `endDate = ""` When did this location close? When did an item stop selling? What was the last day to watch something?
- `citations = []` Reference links for your sources, such as from archive.org or newspapers.com. In the article, you'll mark each reference by where it appears in the list (1-indexed), so if you have one link and want to reference it, you'd put after the sentence `<sup>(1)</sup>` which looks like this.<sup>(1)</sup>
- `credits = []` Credits for various things in the article. Start with the name, use a pipe "|", and then say their role. This would look like `["Ed Bogas|Producer", "John Widelock|Chuck E. Cheese Voice Actor"]`
- (Hey this part isn't done yet so feel free to ignore for now) User reviews, rating is a yes or no for recommendation, review text can be as long as needed. Review date can be either today, or the last time you visited a place / when you got an item. Let your review be useful! We won't accept reviews made just to be funny or to get on a page. The parameter is formatted as `"Username|Yes/No|DateOfReview|Review Text"`, so one with multiple filled in reviews would look like `["Contrib1|Yes|2024-12-31|Place was clean","Contrib2|No|2026-01-29|Item feels cheap."]`
- `downloadLinks = []` Links to downloadable files. Formatted with a pipe for description such as `downlaodLinks = ["Archive.org|Building Plans","Archive.org|Unused Audio (1993)"]`


Location Parameters

- `latitudeLongitude = []` Latitude and Longitude for addresses. You can easily search online for a tool that converts any address to these coordinates. This is used to place a pin on the locations map. It'll look like `["37.321610", "-121.950000"]`


Item Parameters

- `manufacturer = ""` Name of producer of an item.
- `unitsProduced = ""` Number of known items produced.
- `wholesalePrice = ""` The known wholesale price of an item.
- `prices = []` A list of prices for the item. Formatted by date with a pipe, such as `prices = ["$4.99|1981-12-31","$8.99|1983-00-00"]`.
- `dimensions = ""` The dimensions of an item.
