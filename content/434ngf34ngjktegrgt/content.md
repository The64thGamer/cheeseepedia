Cheese-E-Pedia, in referring to the base wiki website, is a statically hosted site with no server that hosts user data. The only function the site runs from the host is a counter for page views.

### Local / Offline Use

All functions of the site use pre-compiled data or client-side code. Searching, editing, changing settings, and other actions are entirely local and are saved within local storage. The site can be downloaded and ran entirely offline on a host PC without any issue, just requiring the compile.py at the root to be ran if changes are made to the content.

### Forums & Editing

forums.cheeseepedia.org is a separately hosted site on a separate provider that the main wiki will poll information from to construct detailed user pages and news posts. If a user on that site has the 'username' or 'name' field match an attribution credit, it will link the two. This will add the user's forum page link to the user page on the wiki, alongside adding the profile picture used on the forum to any mention of the user on the wiki. Even if a user has no attributions on the main wiki, the site will still log any remaining forum users as part of the main user list.

Forum accounts are used to create article edits and submissions for the main site. Users log in once, and their submissions are passed through the forum API to mark each to a specific forum account. This account is then credited in the article submitted by name. These credits are listed on the article changed and link back to the user's forum account.