![image](static/UI/CEPLogo.png)

The animatronic archival website, Cheese-E-Pedia! The site originally ran on MediaWiki through Miraheze, and it is now a Hugo static site that runs right here on GitHub!

The site itself gives instructions on how to contribute in the "Contributor Home" linked on the homepage. Context is given mostly for people who have never used GitHub or done Git merges, but if you're someone already well versed in this type of stuff, I'd encourage reading the general site rules and glancing over things. Any contribution to a page should have your username listed in the contributors, and the page's date updated to today.

**To compile locally (Windows):**
* Make sure that you have Python and Hugo installed.
* Create a virtual environment for python, preferably named `cepvenv` since the `.gitignore` file is configured to ignore that directory. (If using Powershell, first enter the command `set-executionpolicy -scope currentuser remotesigned` and then try running the activation script)
* In the virual environment, run `pip install -r requirements.txt` to install required modules, and then run `.\scripts\build_photos_index.py`
* Build or serve with Hugo.