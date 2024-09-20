# A Godot GDScript abomination that converts a Miraheze Mediawiki XML dump file
# into a set of Hugo pages in a very specific way
# If you are unclear how to parse the XML file this will help you
# But you will need to wrangle it to output something you want and not what I needed.
# Btw install the XMLNode addon to get this working. It also
# Lets you preview the entire site as an exported variable so you can navigate
# Manually.
# Also ignore the everything being bad I had to take the rare occasion to 
# consult ChatGPT for this nightmare of parsing. None of the comments are mine.

extends Node
var xml: XMLNode
const invalid_chars = ["/", "\\", "?", "%", "*", ":", "|", "\"", "<", ">", "."]
@export var dictionary: Dictionary
var catTags : Array
var galleryArray : Array
var currentStartDate : String
var currentEndDate : String
var httpActive : bool
var resultA
var responsecode
var theBody
var finalLatLong
var locationsList = ""
var theLocations : Array

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	print("Welcome, this process will take a few minutes.")
	xml = XML.parse_file("res://ddd.xml").root
	dictionary = xml.to_dict()
	print("XML Loaded")
	theLocations = preload("res://latlong.csv").records
	var dir = DirAccess.open("res://")
	dir.make_dir("wiki")
	dir = DirAccess.open("res://wiki")
	for file in dir.get_files():
		dir.remove(file)
	dir.make_dir("Users")
	dir = DirAccess.open("res://wiki/Users")
	dir = DirAccess.open("res://")
	dir.make_dir("photos")
	dir = DirAccess.open("res://wiki")
	for file in dir.get_files():
		dir.remove(file)
	dir = DirAccess.open("res://photos")
	for file in dir.get_files():
		dir.remove(file)
	dir = DirAccess.open("res://wiki/Users")
	for file in dir.get_files():
		dir.remove(file)
		
	for i in range(xml.children.size() - 1):
		if "Category: " in xml.children[1 + i].children[0].content && xml.children[1 + i].children.size() > 3 && "redirect" not in xml.children[1 + i].children[3].name:
			print(xml.children[1 + i].children[0].content)
			ParseCategory("Category: ",i)
		elif "Category:" in xml.children[1 + i].children[0].content && xml.children[1 + i].children.size() > 3 && "redirect" not in xml.children[1 + i].children[3].name:
			print(xml.children[1 + i].children[0].content)
			ParseCategory("Category:",i)
		elif "Template:Blurb" in xml.children[1 + i].children[0].content && xml.children[1 + i].children.size() > 3 && "redirect" not in xml.children[1 + i].children[3].name && "User:" not in xml.children[1 + i].children[0].content:
			print(xml.children[1 + i].children[0].content)
			ParseCategory("Template:Blurb",i)
	print("Tags Generated")
	var exSize = str(xml.children.size())
	for i in range(xml.children.size() - 1):
		#if i % 100 == 0:
		#	print(str(i) + "/" + str(xml.children.size()))
		#print(str(i) + "/" + exSize)
		print(str(i) + "/" + exSize + " ( "+xml.children[1 + i].children[0].content+" )")
		ParsePage(i)
	var exSizeB =str(catTags.size())
	for i in range(catTags.size()):
		if i % 4 == 0:
			print(str(i) + "/" + exSizeB + " ( "+catTags[i]+" )")
			var pageTitle = catTags[i]
			var tagLayout = "[\"" + catTags[i+1] + "\"]"
			var catLayout = "[\"" + catTags[i+3] + "\"]"
			if ParseBadTitle(pageTitle):
				continue
			if "User:" in pageTitle:
				continue
			var filePage = "+++"
			filePage += "\ntitle = \"" + pageTitle.replace('\"', '\'') + "\""
			filePage += "\ndraft = false"
			filePage += "\ntags = " + tagLayout
			filePage += "\ncategories = " + catLayout
			filePage += "\ndate = \"\""
			filePage += "\n\n[Article]"
			filePage += "\npageThumbnailFile = \"\""
			filePage += "\nstartDate = \""+catTags[i+2]+"\""
			filePage += "\nendDate = \"\""
			filePage += "\ncontributors = []"
			filePage += "\nreviews = []"
			filePage += "\n+++"

			pageTitle = parse_title(pageTitle)
			if not FileAccess.file_exists("res://wiki/" + pageTitle + ".html"):
				var fileAcess = FileAccess.open("res://wiki/"+ pageTitle + ".html", FileAccess.WRITE)
				fileAcess.store_string(filePage)
				fileAcess = null
	for i in range(galleryArray.size()):
		var list = galleryArray[i].split("|")
		var pageTitle = list[1]
		if ".jpg" in pageTitle || ".gif" in pageTitle || ".jpeg" in pageTitle || ".png" in pageTitle && "New Graphic" not in pageTitle:
			pageTitle = pageTitle.trim_prefix(' ').trim_suffix(' ').replace(".jpg","").replace(".gif","").replace(".jpeg","").replace(".png","").replace(" ","_").replace("\n","") + ".avif"
			var filePage = "+++"
			filePage += "\ntitle = \"" + pageTitle + "\""
			filePage += "\ndraft = false"
			filePage += "\ntags = [\"Photos\"]"
			filePage += "\npages = [\"" + list[0] + "\"]"
			filePage += "\ndate = \"\""
			if list.size() > 2:
				for e in range(2,list.size()):
					if not "thumb" in list[e]:
						filePage += "\ndescription = \"" + list[e].replace('\"', '\'').replace("\n","") + "\""
						break
			filePage += "\n+++"

			pageTitle = parse_title(pageTitle)
			if not FileAccess.file_exists("res://photos/" + pageTitle + ".html"):
				var fileAcess = FileAccess.open("res://photos/" + pageTitle + ".html", FileAccess.WRITE)
				fileAcess.store_string(filePage)
				fileAcess = null
	DisplayServer.clipboard_set(locationsList)
	print("Done")
	get_tree().quit()
	
# List of starting identifiers to search for
var start_identifiers = ["daterelease=","daterelease =","date=","date =","opened on", "started on","released on","opened in", "started in","released in","opened", "started","released"]
var end_identifiers = ["dateremove=","dateremove =","closed on","closed in","closed"]

# Month conversion dictionary
var month_names = {
	"January": 1, "February": 2, "March": 3, "April": 4, "May": 5, "June": 6,
	"July": 7, "August": 8, "September": 9, "October": 10, "November": 11, "December": 12
}

# Regular expressions to match different date formats
var date_patterns = [
	r"([A-Za-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})",  # e.g., "December 19th, 2001"
	r"([A-Za-z]+)\s+(\d{4})",                              # e.g., "April 1980"
	r"(\d{4})"                                             # e.g., "1943"
]

func parse_text_for_dates(identifiers: Array, text: String) -> String:
	# Loop through each starting identifier to find a match
	for identifier in identifiers:
		if text.find(identifier) != -1:
			var matched_text = text.substr(text.find(identifier), 50)

			# Try matching each date pattern
			for pattern in date_patterns:
				var regex = RegEx.new()
				regex.compile(pattern)
				var match = regex.search(matched_text)

				if match:
					var date_str = format_date(match)
					#print(str(match.get_group_count()) + " " +match.get_string(1) +match.get_string(2) +match.get_string(3) + "  "+ date_str)
					if date_str != "":
						return date_str

	return ""

func format_date(match: RegExMatch) -> String:
	# Check for specific date format and return formatted string
	if match.get_string(1) in month_names:
		if match.get_group_count() == 3:
			# Format: Month Day, Year
			var month = month_names[match.get_string(1)]
			var day = match.get_string(2).to_int()
			var year = match.get_string(3).to_int()
			return str(year, "-", month, "-", day)
		elif match.get_group_count() == 2:
			# Format: Month Year
			var month = month_names[match.get_string(1)]
			var year = match.get_string(2).to_int()
			return str(year, "-", month, "-", "00")
	elif match.get_string(1).is_valid_int():
		# Format: Year only
		var year = match.get_string(1).to_int()
		return str(year, "-", "00", "-", "00")
	return ""

var citArrars: Array = []

func replace_references_with_superscript(wikitext: String) -> String:
	# Use a regular expression to find references
	var ref_pattern = r"<ref(?: name=\"[^\"]*\")?>(.*?)<\/ref>|<ref name=\"[^\"]*\" \/>"
	var matches = []
	
	# Get all matches for references
	var regex = RegEx.new()
	regex.compile(ref_pattern)
	matches = regex.search_all(wikitext)
	
	# Replace references with superscript numbers
	var index = 0
	for match in matches:
		
		var reference_text = match.get_string(1)  # The captured reference text
		if reference_text != "":
			# Add to global array
			citArrars.append(reference_text)
		else:
			# Handle named references
			reference_text = match.get_string(0)  # For empty name references, we can use a placeholder
			citArrars.append(reference_text)

		# Replace the reference in the original string with a superscript number
		wikitext = wikitext.replace(match.get_string(0), "<sup>[" + str(index+1) + "]</sup>")
		index += 1

	return wikitext


func ParseBadTitle(pageTitle: String) -> bool:
	if "File:" in pageTitle ||"Data:" in pageTitle || "#tabber" in pageTitle ||"Category:" in pageTitle || "MediaWiki:" in pageTitle || "Template:" in pageTitle || "Module:" in pageTitle || "Talk:" in pageTitle || "File talk:" in pageTitle || "Category talk:" in pageTitle || "User talk:" in pageTitle:
		return true
	return false

func ParseCategory(replaceText : String, i : int):
	var timesArr : Array
	var indexArr : Array
	var revision = 0
	for e in range(3,xml.children[1 + i].children.size()):
		var timeChild = FindChildren(xml.children[1 + i].children[e].children,"timestamp")
		if timeChild != null:
			timesArr.append(timeChild.content)
			indexArr.append(e)
	var check : int = find_latest_date_index(timesArr)
	if check == -1:
		print(xml.children[1 + i].children[0].content + " failed to find revisions")
		return
	revision = indexArr[check]
	if "#REDIRECT" in FindChildren(xml.children[1 + i].children[revision].children,"text").content:
		print(xml.children[1 + i].children[0].content + " Recent page was redirect.")
		return
	var tag = xml.children[1 + i].children[0].content.replace(replaceText,"")
	catTags.append_array(parse_tags(tag, FindChildren(xml.children[1 + i].children[revision].children,"text").content.replace('\"', '\'')))

func find_line_with_equals_above_substring(input_string: String, substring: String) -> String:
	var lines = input_string.split("\n")
	var found_index = -1

	# Find the index of the substring
	for i in range(lines.size()):
		if lines[i].find(substring) != -1:
			found_index = i
			break

	# If the substring was found, check lines above it
	if found_index != -1:
		var text = ""
		for i in range(found_index - 1, -1, -1):
			text = lines[i].find("=")
			if text != -1:
				if "==" not in lines[i]:
					return lines[i]  # Return the line with "="

	return ""  # Return empty if not found
	
func find_line_with_categ_substring(input_string: String, substring: String) -> String:
	var lines = input_string.split("\n")
	var found_index = -1

	# Find the index of the substring
	for i in range(lines.size()):
		if lines[i].find(substring) != -1:
			found_index = i
			break

	# If the substring was found, check lines above it
	if found_index != -1:
		var text = ""
		for i in range(found_index - 1, -1, -1):
			text = lines[i].find("|-|")
			if text != -1:
				return lines[i]  # Return the line with "="

	return ""  # Return empty if not found

func ParsePage(index):
	citArrars.clear()
	var pageXml = xml.children[1 + index]
	var pageTitle = pageXml.children[0].content
	var pageFolder = ""
	var tagLayout = "[]"
	if ParseBadTitle(pageTitle):
		return
	var time = ""
	var timesArr : Array
	var indexArr : Array
	var revision = 0
	for i in range(3,pageXml.children.size()):
		var timeChild = FindChildren(pageXml.children[i].children,"timestamp")
		if timeChild != null:
			timesArr.append(timeChild.content)
			indexArr.append(i)
	var check : int = find_latest_date_index(timesArr)
	if check == -1:
		print(pageTitle + " failed to find revisions")
		return
	time = timesArr[check]
	var timeList = time.split("-")
	time = timeList[0] + "-" + timeList[1] + "-" + timeList[2].substr(0,2)
	
	revision = indexArr[check]
	if "redirect" in pageXml.children[revision].name:
		return
	if "User:" in pageTitle:
		pageTitle = pageTitle.replace("User:", "")
		pageFolder = "/Users/"
		tagLayout = "[\"User\"]"
	
	var rawArticle = FindChildren(pageXml.children[revision].children,"text").content.replace('\"', '\'')
	if "#REDIRECT" in rawArticle:
		print(pageTitle + " Recent page was redirect.")
		return
	for i in range(catTags.size()):
		if pageTitle == catTags[i] && i % 4 == 0:
			tagLayout = "[\"" + catTags[i+1] + "\"]"
			catTags.remove_at(i)
			catTags.remove_at(i)
			catTags.remove_at(i)
			catTags.remove_at(i)
			break
	currentStartDate = ""
	currentEndDate = ""
	var newTags = extract_templates(rawArticle,parse_title(pageTitle))
	rawArticle = parse_mediawiki_to_markdown(rawArticle,parse_title(pageTitle))
	rawArticle = replace_references_with_superscript(rawArticle)
	if currentStartDate == "":
		currentStartDate = parse_text_for_dates(start_identifiers,rawArticle.substr(0,200))
	if currentEndDate == "":
		currentEndDate = parse_text_for_dates(end_identifiers,rawArticle.substr(0,350))
	var filePage = "+++"
	filePage += "\ntitle = \"" + pageTitle.replace('\"', '\'') + "\""
	filePage += "\ndraft = false"
	filePage += "\ntags = " + tagLayout
	filePage += "\ndate = \"" + time + "\""
	filePage += "\n\n[Article]"
	filePage += "\nstartDate = \"" + currentStartDate + "\""
	filePage += "\nendDate = \"" + currentEndDate + "\""
	filePage += "\ncontributors = ["
	var contributorArray: Array
	for i in range(3, pageXml.children.size()):
		var contributor = FindChildren(pageXml.children[i].children, "contributor")
		if contributor != null && contributor.children.size() > 0:
			contributorArray.push_back(contributor.children[0].content.replace('\"', '\'').replace("imported>", ''))
	var d := {}
	for n in contributorArray:
		if not n in d:
			d[n] = null
	var unique_values := d.keys()
	for i in range(unique_values.size()):
		filePage += "\"" + unique_values[i] + "\""
		if i + 1 < unique_values.size():
			filePage += ","
	filePage += "]"
	filePage += "\ncitations = ["
	for i in range(citArrars.size()):
		filePage += "\"" + citArrars[i] + "\""
		if i + 1 < citArrars.size():
			filePage += ","
	filePage += "]"
	for i in range(newTags.size()):
		filePage += "\n"+newTags[i]
	if "Locations" in tagLayout:
			locationsList += str(pageTitle + "\n")
			var lat = "0"
			var lon = "0"
			for i in range(theLocations.size()):
				if pageTitle == theLocations[i][0]:
					lat = theLocations[i][1]
					lon = theLocations[i][2]
					break
			filePage += "\n[Location]"
			filePage += "\nlatitudeLongitude = [\"" + lat.replace(',','.') + "\",\"" + lon.replace(',','.') + "\"]"


	filePage += "\n+++"
	filePage += "\n" + rawArticle;

	pageTitle = parse_title(pageTitle)
	var fileAcess = FileAccess.open("res://wiki/" + pageFolder + pageTitle + ".html", FileAccess.WRITE)
	fileAcess.store_string(filePage)
	fileAcess = null


func find_latest_date_index(dates: Array) -> int:
	if(dates.size() == 1):
		return 0
	var latest_index = 0
	var check = -1
	for i in range(dates.size()):
		if dates[i] > dates[latest_index]:
			latest_index = i
			check = i
	return check

func FindChildren(array: Array, stringName: String):
	for i in range(array.size()):
		if array[i].name == stringName:
			return array[i]
	return null

func parse_title(text: String) -> String:
	text.replace("???", "Unknown")
	for charIllegal in invalid_chars:
		text = text.replace(charIllegal, "")
	return text

func parse_tags(tag: String, text: String) -> Array:
	var pattern = r"\[\[(.*?)\]\]"  # Pattern to capture text between [[ and ]]
	var dumbs : Array

	var regex = RegEx.new()
	var error = regex.compile(pattern)

	if error != OK:
		print("Regex compilation failed.")
		return dumbs
	# Gather all matches
	var regMatch = regex.search_all(text)
	if regMatch == null:
		return dumbs
	# Replace all matches
	for match in regMatch:
		var full_match = match.strings[0]  # Full match (e.g., [[some title]])
		var capture = match.strings[1]     # Capture group 1 (e.g., some title)
		var year = find_line_with_equals_above_substring(text,full_match).replace("=","").trim_suffix(" ")
		var categ = find_line_with_categ_substring(text,full_match).replace("|-|","").replace("=","").trim_suffix(" ").trim_prefix(" ")
		categ.replace("Showbiz","ShowBiz")
		categ.replace("Theater","Theatre")
		if categ != "Chuck E. Cheese's" && "Cheese" in categ:
			categ = "Chuck E. Cheese's"
		if "Unknown Year" in year:
			year = "0000-00-00"
		elif year.length() != 4:
			year = ""
		else:
			year += "-00-00"
		if "|" in capture:
			var parts = capture.split("|")
			capture = parts[0]
		if not "File" in capture:
			dumbs.append(capture)
			dumbs.append(tag)
			dumbs.append(year)
			dumbs.append(categ)
	return dumbs

func parse_links(text: String, pageTitle: String) -> String:
	var pattern = r"\[\[(.*?)\]\]"  # Pattern to capture text between [[ and ]]

	var regex = RegEx.new()
	var error = regex.compile(pattern)

	if error != OK:
		print("Regex compilation failed.")
		return text
	# Gather all matches
	var regMatch = regex.search_all(text)
	if regMatch == null:
		return text
	# Replace all matches
	for match in regMatch:
		var full_match = match.strings[0]  # Full match (e.g., [[some title]])
		var capture = match.strings[1]     # Capture group 1 (e.g., some title)
		if not "|" in capture && not "File:" in capture:
			if check_real_title(capture):
				text = text.replace(full_match, "<a href=\"{{< ref \"wiki/" + parse_title(capture) + "\" >}}\">"+capture+"</a>")
			else:
				text = text.replace(full_match, capture)
		elif "File:" not in capture && "|" in capture:
			var splitter = capture.split("|")
			if check_real_title(splitter[0]):
				text = text.replace(full_match, "<a href=\"{{< ref \"wiki/" + parse_title(splitter[0]) + "\" >}}\">"+splitter[1]+"</a>")
			else:
				text = text.replace(full_match, capture)
		elif "File:" in capture:
			text = text.replace(full_match,"")
			galleryArray.append(pageTitle + "|" + capture.replace("File:",""))
	return text

	# Helper function to sort replacements in descending order
func manual_sort_replacements(replacements: Array) -> void:
	var size = replacements.size()
	for i in range(size):
		for j in range(i + 1, size):
			if replacements[j][0] > replacements[i][0]:
				# Swap elements
				var temp = replacements[i]
				replacements[i] = replacements[j]
				replacements[j] = temp

func extract_templates(input: String, pageTitle: String) -> Array:
	var vars : Array
	
	var regex = RegEx.new()
	var error = regex.compile(r"(?s)\{\{(.*?)\}\}")
	var stopGeneric : bool
	
	if error != OK:
		print("Regex compilation failed.")
		return vars
	# Gather all matches
	var regMatch = regex.search_all(input)
	if regMatch == null:
		return vars
	# Replace all matches
	for match in regMatch:
		var full_match = match.strings[0]
		var capture = match.strings[1]    
		if "{{Generic" in full_match:
			if stopGeneric:
				var list = capture.split('|')
				if list.size() == 2:
					galleryArray.append(pageTitle + "|" + list[1].replace("image=",""))	
				elif list.size() > 2:
					galleryArray.append(pageTitle + "|" + list[1].replace("image=","") + "|" + list[2].replace("desc=",""))
			else:
				stopGeneric = true
				var list = capture.split('|')
				if list.size() == 2 && "image" in list[1]:
					var listB = list[1].split('=')
					vars.append("pageThumbnailFile = \"" + listB[1].trim_prefix(' ').trim_suffix(' ').replace(".jpg","").replace(".gif","").replace(".jpeg","").replace(".png","").replace(" ","_").replace("\n","") + ".avif\"")	
					galleryArray.append(pageTitle + "|" + listB[1])	
				elif list.size() > 2 && "image" in list[1] && "desc" in list[2]:
					var listB = list[1].split('=')
					var listC = list[2].split('=')
					vars.append("pageThumbnailFile = \"" + listB[1].trim_prefix(' ').trim_suffix(' ').replace(".jpg","").replace(".gif","").replace(".jpeg","").replace(".png","").replace(" ","_").replace("\n","") + ".avif\"")	
					galleryArray.append(pageTitle + "|" + listB[1] + "|" + listC[1])
		elif "{{Showtape" in full_match:
			var list = capture.split('|')
			var creditCheck = false
			var credits = ""
			for i in range(list.size()):
				if "date" in list[i]:
					currentStartDate = parse_text_for_dates(start_identifiers,list[i])
				if "image" in list[i]:
					var listB = list[i].split('=')
					vars.append("pageThumbnailFile = \"" + listB[1].trim_prefix(' ').trim_suffix(' ').replace(".jpg","").replace(".gif","").replace(".jpeg","").replace(".png","").replace(" ","_").replace("\n","") + ".avif\"")	
					galleryArray.append(pageTitle + "|" + listB[1])	
				if "credit" in list[i]:
					var listB = list[i].split('=')
					var listC = listB[1].split("-")
					if listC.size() > 1:
						if creditCheck:
							credits += ",\"" + listC[0].trim_prefix(' ').trim_suffix(' ').replace("\n","") + "|" + listC[1].trim_prefix(' ').trim_suffix(' ').replace("\n","") + "\""
						else:
							creditCheck = true
							credits += "credits = [\"" + listC[0].trim_prefix(' ').trim_suffix(' ').replace("\n","") + "|" + listC[1].trim_prefix(' ').trim_suffix(' ').replace("\n","") + "\""
			if credits != "":
				vars.append(credits + "]")
		elif "{{Menu Item" in full_match:
			var list = capture.split('|')
			var creditCheck = false
			var credits = ""
			for i in range(list.size()):
				if "daterelease" in list[i]:
					currentStartDate = parse_text_for_dates(start_identifiers,list[i])
				if "dateremove" in list[i]:
					currentEndDate = parse_text_for_dates(end_identifiers,list[i])
				if "image" in list[i]:
					var listB = list[i].split('=')
					vars.append("pageThumbnailFile = \"" + listB[1].trim_prefix(' ').trim_suffix(' ').replace(".jpg","").replace(".gif","").replace(".jpeg","").replace(".png","").replace(" ","_").replace("\n","") + ".avif\"")	
					galleryArray.append(pageTitle + "|" + listB[1])	
	return vars

func parse_mediawiki_to_markdown(output: String, pageTitle: String) -> String:
	var regex = RegEx.new()
	regex.compile(r"(?s)\{\{(.*?)\}\}")
	output = regex.sub(output, "",true)
	output = destroy_gallery(output,pageTitle)
	output = parse_links(output,pageTitle)
	output = output.replace("==Showtape Scans / Images==","")
	output = output.replace("== Showtape Scans / Images==","")
	output = output.replace("== Showtape Scans / Images ==","")
	output = output.replace("==Showtape Scans / Images:==","")
	output = output.replace("== Showtape Scans / Images:==","")
	output = output.replace("== Showtape Scans / Images: ==","")
	output = output.replace("==Gallery==","")
	output = output.replace("== Gallery==","")
	output = output.replace("== Gallery ==","")
	output = output.replace("==References==","")
	output = output.replace("== References==","")
	output = output.replace("== References ==","")
	output = output.replace("==Reference==","")
	output = output.replace("== Reference==","")
	output = output.replace("== Reference ==","")
	output = wikitext_to_html(output)
	output = wikitextbullets_to_html(output)
	output = convert_wikitable_to_html(output)
	return output
func find_list_level(line: String, marker: String) -> int:
	var count = 0
	for c in line:
		if c == marker:
			count += 1
		else:
			break
	return count
func wikitextbullets_to_html(input: String) -> String:
	var lines = input.split("\n")
	var output = ""
	var open_list_tag = ""
	var list_depth = 0
	
	for line in lines:
		if line.strip_edges() == "":
			continue
		
		var level = 0
		var list_type = ""
		
		if line.begins_with("*"):
			list_type = "ul"
			level = find_list_level(line, "*")
		elif line.begins_with("#"):
			list_type = "ol"
			level = find_list_level(line, "#")
		
		var content = line.trim_prefix("*").trim_prefix("*").trim_prefix("*").trim_prefix("#").trim_prefix("#").trim_prefix("#")
		content = content.strip_edges()
		
		if list_type != "":
			# Handle nesting
			if level > list_depth:
				output += "<%s>" % list_type
				list_depth += 1
			elif level < list_depth:
				for _i in range(list_depth - level):
					output += "</%s>" % open_list_tag
				list_depth = level
				
			output += "<li>%s</li>" % content
			open_list_tag = list_type
		
		else:
			# Close any open lists before plain text
			if list_depth > 0:
				for _i in range(list_depth):
					output += "</%s>" % open_list_tag
				list_depth = 0
			if content != "":
				output += "\n<p>%s</p>" % content
	
	# Close any remaining open lists
	if list_depth > 0:
		for _i in range(list_depth):
			output += "</%s>" % open_list_tag
	
	return output
	
# Function to scan for wikitables and convert them to HTML tables
func convert_wikitable_to_html(wiki_text: String) -> String:
	var wiki_table_regex = RegEx.new()
	var table_pattern = r'(?s){\|\s*(.*?)\|\}'
	var error = wiki_table_regex.compile(table_pattern)
	if error != OK:
		print("Regex compilation failed.")
		return wiki_text
	var regMatch = wiki_table_regex.search_all(wiki_text)
	if regMatch == null:
		return wiki_text
	for match in regMatch:
		var full_match = match.strings[0]
		wiki_text = wiki_text.replace(full_match,_convert_wiki_table_to_html(full_match))
	return wiki_text

# Internal function to convert a single wiki table to HTML table
func _convert_wiki_table_to_html(wiki_table: String) -> String:
	var rows = wiki_table.split("\n")
	var html_table = "<table>\n<tr>\n"
	var in_caption = false

	for row in rows:
		row = row.strip_edges()
		if row.begins_with("|}"):  # Caption
			continue
		if row.begins_with("{|"):  # Caption
			continue
		if row.begins_with("|+"):  # Caption
			continue
		elif row.begins_with("!"):  # Header row
			html_table += "<th>" + row.trim_prefix("!") + "</th>\n"
		elif row.begins_with("|-"):  # Row delimiter in wikitable
			html_table += "</tr>\n<tr>\n"
			continue
		elif row.begins_with("|"):  # Regular row
			html_table += "<td>" + row.trim_prefix("|") + "</td>\n"

	html_table += "</tr>\n</table>\n"
	return html_table
	
func destroy_gallery(text: String, pageTitle: String) -> String:
	var regex = RegEx.new()
	var error = regex.compile(r"(?s)<gallery>(.*?)</gallery>")

	if error != OK:
		print("Regex compilation failed.")
		return text
	# Gather all matches
	var matches = []
	var regMatch = regex.search_all(text)
	if regMatch == null:
		return text
	# Replace all matches
	for match in regMatch:
		var full_match = match.strings[0]  # Full match (e.g., [[some title]])
		var list = match.strings[0].split("\n")
		for e in range(list.size()):
			if "File:" in list[e]:
				galleryArray.append(pageTitle + "|" + list[e].replace("File:",""))
		text = text.replace(full_match,"")
	return text

func check_real_title(text : String) -> bool:
	for i in range(xml.children.size() - 1):
		var pageXml = xml.children[1 + i]
		var pageTitle = pageXml.children[0].content

		if ParseBadTitle(pageTitle):
			continue
		if pageXml.children.size() > 3 && "redirect" in pageXml.children[3].name:
			continue
		if pageTitle == text:
			return true
		
	return false

func wikitext_to_html(wikitext: String) -> String:
	var regex = RegEx.new()
	regex.compile(r"\'\'\'(.*?)\'\'\'")
	wikitext = regex.sub(wikitext, r"<b>$1</b>",true)
	regex.compile(r"\*\*(.*?)\*\*")
	wikitext = regex.sub(wikitext, r"<b>$1</b>",true)
	regex.compile(r"\'\'(.*?)\'\'")
	wikitext = regex.sub(wikitext, r"<i>$1</i>",true)
	regex.compile(r"\/\/(.*?)\/\/")
	wikitext = regex.sub(wikitext, r"<i>$1</i>",true)
	regex.compile('=====(.+?)=====')
	wikitext = regex.sub(wikitext, r'<h5>$1</h5>',true)
	regex.compile('====(.+?)====')
	wikitext = regex.sub(wikitext, r'<h4>$1</h4>',true)
	regex.compile('===(.+?)===')
	wikitext = regex.sub(wikitext, r'<h3>$1</h3>',true)
	regex.compile('==(.+?)==')
	wikitext = regex.sub(wikitext, r'<h2>$1</h2>',true)
	return wikitext
