Cheese-E-Pedia, in referring to the base wiki website, is a statically hosted site with no server that hosts user data. The only function the site runs from the host is a counter for page views.

### Local / Offline Use

All functions of the site use pre-compiled data or client-side code. Searching, editing, changing settings, and other actions are entirely local and are saved within local storage. The site can be downloaded and ran entirely offline on a host PC without any issue, just requiring the compile.py at the root to be ran if changes are made to the content.

### GitHub

CEP currently uses GitHub as an intermediary for making changes to the website. Users will need to provide a GitHub access token- which is only stored in temporary local session storage and has to be re-filled each time, to submit API calls to change the contents of the site. These calls are then submitted as pull requests on the Cheese-E-Pedia GitHub page. CEP does not log commits or which users submit commits onto the site itself.

User submissions will have a name appended to any changed files to attribute credit. This is defaulted to 'Anonymous', but the user can submit any name. The site will compile the credits of users into user pages, allowing anyone to browse a user's submissions and reviews they left on pages. These pages can also have text, quotes, pictures, and other content written into them to adjust how they are displayed- or how the user shows up in attributions. The amount of attributions a user has will also change the color of their name and assign them a 'rank'.

Because there are no accounts, any user can mark attribution in a submission to any other user, alongside any user being able to edit the contents of another user's page.

### Forums & Integration.
forums.cheeseepedia.org is a separately hosted site on a separate provider that the main wiki will poll information from to construct more detailed user pages and news posts. If a user on that site has the 'username' or 'name' field match an attribution credit, it will link the two. This will add the user's forum page link to the user page on the wiki, alongside adding the profile picture used on the forum to any mention of the user on the wiki. Even if a user has no attributions on the main wiki, the site will still log any remaining forum users as part of the main user list.

The forums also allow users to use GitHub as a means to create an account, meaning GitHub can be used for editing the wiki, alongside signing in to browse/post on the forums.