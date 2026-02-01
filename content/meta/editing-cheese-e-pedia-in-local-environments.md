+++
title = "Editing Cheese-E-Pedia in Local Environments"
draft = false
tags = ["Meta"]
categories = ["Cheese-E-Pedia"]
contributors = ["Stripes"]
+++

This page provides an overview of the steps required to edit Cheese-E-Pedia in a local environment. 

Edits that can be made in a local environment are far greater than simple page edits. You can directly edit any page, bypassing DecapCMS. You can also upload images and create the appropriate photo pages. Likewise, you can create and maintain a user page that will display on the site.

In a local environment, you have the benefit of compiling Cheese-E-Pedia before uploading your changes -- this is important because you can identify problems before submitting a pull request.

Jump to Section:
* [Understanding Hugo](#understanding-hugo)
    * [Folder Structure](#folder-structure)
    * [Paramaters](#parameters)
* [Creating a User Page](#creating-a-user-page)
* [Creating a Photo Page](#creating-a-photo-page)
* [Compiling Cheese-E-Pedia](#compiling-cheese-e-pedia)
    * [Installing GitHub Desktop, Visual Studio Code, Hugo, and Python (Windows)](#installing-github-desktop-visual-studio-code-hugo-and-python-windows)
        * [Visual Studio Code](#visual-studio-code)
        * [Hugo](#hugo)
        * [Python](#python)
        * [GitHub Desktop](#github-desktop)
    * [Running the Compilation Scripts](#running-the-compilation-scripts)
---

Here is the general flow for making local edits:

1. On GitHub.com (or Git), create a fork of the {{< github >}} and sync to the parent repository.
2. Using GitHub Desktop (or Git), clone your forked repository to your machine.
3. Using Visual Studio Code (or IDE of choice), open the repository and make changes.
4. Using the included Python scripts, compile the site and check your work.
5. Using GitHub Desktop (or Git), stage and commit your changes; push those changes back to your forked repository.
6. On GitHub.com (or Git), from the forked repository, submit a pull request with your commits.
7. Moderators will review your request and may leave comments to make adjustments.
8. Once approved, your changes will appear on the site within 5-10 minutes of approval.

You must have (at minimum): Hugo (refer to the footer of the website for the correct version -- subject to updates), Git, and Python 3.11 or higher.

---

**Please note that this advice is provided without specific operating system requirements!** How you decide to set up your local environment is up to you, but the recommendations below are most suited for Windows users, and can be tailored to other OSes such as macOS and Linux distributions.

---

## Understanding Hugo

**[Hugo](https://gohugo.io)** is a very powerful and dynamic static site generator. 

In basic terms, templates (HTML mixed with custom code mixed in) are created and bundled into a theme. When Hugo runs, it goes through every page and applies the applicable template. Everything gets organized and dumped into a folder which is served over the web.

### Folder Structure
| Folder | Purpose |
| --- | --- |
| archetypes | Contains base templates for new pages created through Hugo's command line. |
| content | Markdown files, or pages, split into sections. |
| content/meta | Pages belonging to the `meta` section. |
| content/news | Pages belonging to the `news` section. |
| content/photos | Pages belonging to the `photos` section -- **not** the photo files. |
| content/reviews | Pages belonging to the `reviews` section. |
| content/transcriptions | Pages belonging to the `transcriptions` section. |
| content/users | Pages belonging to the `users` section -- your personal user page goes here. |
| content/videos | Pages belonging to the `videos` section -- we do **not** host video files. |
| content/wiki | Pages belonging to the `wiki` section -- all articles. |
| data | JSON files that are used to support the site's layout engine (like lists of photos) or to be used in JavaScript on the site (since the site is static). |
| layouts | HTML files/templates that make up the actual layout of the site, separate from the pages. These are **global**, meaning available to all themes (see `themes` below) |
| layouts/_partials | Templates that can be re-used within other templates. |
| layouts/_shortcodes | Templates that can be re-used within other pages. |
| scripts | Python script files that are run in the local environment to compile the site. |
| static | Files that are not changed, and available to all themes (see `themes` below) -- any files are served on the website root (replace `static` with `cheeseepedia.org`). |
| static/admin | The directory in which DecapCMS resides (`cheeseepedia.org/admin`). |
| static/lowphotos | Low-res versions of all of the site's photos (`cheeseepedia.org/lowphotos/*.avif`). |
| static/photos | Original versions of all of the site's photos (`cheeseepedia.org/photos/*.avif`). |
| themes | A directory containing all of the themes available on compile. The theme can be switched in `config.toml` -- only one theme can be used at a time, and is only switchable on the backend, not to the user. Themes may have their own folders that act the same as the root folders and included in the build. |
| themes/sixtyth-fortran | The directory containing the current theme, built by {{< wiki-link "The 64th Gamer" >}} |

### Parameters
Each Markdown page in Hugo uses TOML (Tom's Obvious, Minimal Language) for its "front matter" -- this is template content at the top of every page. Parameters are how Hugo parse pages for data, which templates take advantage of to generate lists of pages, link pages to other pages, etc.

The front matter always starts and ends with `+++`, and each parameter is case sensitive. You can refer to the DecapCMS configuration (`static/admin/config.yaml`) which has "collections" (sections) with their own sets of parameters (refer to the `name` element of each field listed).

See the below table for types of parameters used on the wiki:

| Parameter Type | Example | Notes |
| --- | --- | --- |
| Text | `title = ""` | Text must be in quotes. |
| Array | `tags = ["Meta", "User"]` | Each item must be in quotes, separated by a comma, between a set of square brackets. |
| Date | `startDate = "1900-01-01"` | Format must be in YYYY-MM-DD; replace with 0s if unknown (for example `1984-05-00` is May 1984). For the `endDate` parameter, you can use `""` to represent no end date. |
| Table | `credits = ["John Doe\|Producer", "Jane Doe\|Voice Actor"]` | Similar to an Array, but each item is delimited by a pipe (`\|`) -- templates will use this to create tables dynamically, with each item being a row in the array.

Information about each parameter is displayed when editing in DecapCMS. You can refer to the configuration to understand what each field is used for.

**Please note that with the switch to Sveltia CMS in early-to-mid 2026, the Table parameter type might change to a more user-friendly format in the editor.** 

## Creating a User Page
To create a user page, use the Hugo command line within the repository folder, and type `hugo new content users/username.md` (where `username` will be your username). Replace any spaces with dashes (`-`).

The title of the page will be pre-filled in Title Case, but you can adjust that to your liking.

Type the body of your page underneath the front matter (ending in `+++`). 

## Creating a Photo Page
To create a photo page, first place your photo into `static/photos` as an AVIF file. **We only accept AVIF files due to their small filesize, thank you for your understanding.** You can convert your image files to AVIF with online converters or photo editing programs. 

**Be careful, because on Windows, names are NOT case-sensitive ("title.avif" and "Title.avif" are _the same_ file). On macOS/Linux, names ARE case-sensitive ("title.avif and "Title.avif" are _different_ files).** This could cause you to inadvertently overwrite an image. Please make sure the name of your image is completely unique. Preferably keep file names alphanumeric (A-Z, a-z, 0-9) with no symbols or spaces.

To create a photo page, use the Hugo command line within the repository folder, and type `hugo new content photos/titleavif.md` (where `title.avif` is the photo). Replace any spaces with dashes (`-`), and replace ".avif" with "avif" -- not replacing ".avif" with "avif" could cause issues when the wiki is rebuilt with your changes.

To link a photo page to an article, add an entry in the `pages` Array parameter with the exact title of the page.

## Compiling Cheese-E-Pedia

### Installing GitHub Desktop, Visual Studio Code, Hugo, and Python (Windows)

#### Visual Studio Code
Go to [https://code.visualstudio.com/download](https://code.visualstudio.com/download) and install Visual Studio Code.

#### Hugo
Open your Command Prompt, and then type `winget install Hugo.Hugo --version {{< hugoversion >}}` (this is the same version as the site and is updated automatically). Then press Enter.

#### Python
Open your Command Prompt, and then type `winget search Python.Python.3` -- a list will appear with all available Python versions. Find the latest version (anything higher than 3.10.x -- such as 3.11.x, 3.12.x, 3.13.x, etc.) -- then type `winget install Python.Python.` followed by the version number. If we're installing Python 3.14.2, you can type `winget install Python.Python.3.14.2`, as an example. Then press Enter.

#### GitHub Desktop
Go to [https://desktop.github.com/download/](https://desktop.github.com/download/) and install GitHub Desktop. When prompted, sign in with your GitHub account. If it asks about a name and email associated with your commits, keep the defaults.

Then, go to your repository on GitHub, and make sure it is synced to the main repository. Back in GitHub Desktop, go to "File > Clone Repository" and select your version of Cheese-E-Pedia. You can save it wherever you desire.

In GitHub Desktop, click "Open in Visual Studio Code" and then Visual Studio Code will open up with the repository as the working directory.

### Running the Compilation Scripts
When your changes are complete, we offer a Python script to update the `data` directory and also run Hugo's server command which provides a live preview of the site.

In the main directory of the repository, we recommend creating a Python virtual environment named `.venv` -- this folder name is ignored by Git by default. The dot (`.`) is important.

To create the virtual environment, first open a terminal in Visual Studio Code ("Terminal" > "New Terminal"), then type `py -m venv .venv` -- this will create a folder in the repository called ".venv" and it will be ignored by GitHub Desktop.

To activate the virtual environment, type `.\.venv\scripts\activate`, then press Enter. 
* If you are using PowerShell, it may complain about running scripts locally. You might need to open PowerShell as an Administrator, and then enter `Set-ExecutionPolicy RemoteSigned`, and then return to Visual Studio Code and try again.

To confirm you are in the virtual environment, you will see `(.venv)` at the beginning of your command line.

To install the dependencies to run the Python scripts, type `py -m pip install -r requirements.txt`, then press Enter.

Then run one of the following scripts:

* cep_compile_slow.py
    * Creates low-res images, and then performs general compilation process.
* cep_compile.py
    * General complication process; creates data for site, then runs Hugo server.

To run a script such as "cep_compile.py", type `py .\scripts\cep_compile.py`, then press Enter.

If the build is successful, you can browse the site using the URL provided in the command line. The site will be located in a folder called `public` which is ignored by Git, and can be copied elsewhere without consequence once the server is stopped.

You can stop the server by clicking into the terminal and pressing Ctrl+C to interrupt, or by closing the terminal.
