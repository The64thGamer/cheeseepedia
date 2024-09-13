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

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	print("Welcome, this process will take a few minutes.")
	xml = XML.parse_file("res://ddd.xml").root
	dictionary = xml.to_dict()
	print("XML Loaded")

	var dir = DirAccess.open("res://")
	dir.make_dir("wiki")
	dir = DirAccess.open("res://wiki")
	for file in dir.get_files():
		dir.remove(file)
	dir.make_dir("Users")
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
	for i in range(xml.children.size() - 1):
		if i % 100 == 0:
			print(str(i) + "/" + str(xml.children.size()))
		ParsePage(i)
	for i in range(catTags.size()):
		if i % 2 == 0:
			var pageTitle = catTags[i]
			var pageFolder = ""
			var tagLayout = "[\"" + catTags[i+1] + "\"]"
			if ParseBadTitle(pageTitle):
				continue
			if "User:" in pageTitle:
				pageTitle = pageTitle.replace("User:", "")
				pageFolder = "/Users/"
				tagLayout = "[\"User\"]"
			var filePage = "+++"
			filePage += "\ntitle = \"" + pageTitle.replace('\"', '\'') + "\""
			filePage += "\ndraft = false"
			filePage += "\ntags = " + tagLayout
			filePage += "\ndate = \"\""
			filePage += "\n\n[Article]"
			filePage += "\ncontributors = []"
			filePage += "\ngallery = []"
			filePage += "\n+++"

			pageTitle = parse_title(pageTitle)
			if not FileAccess.file_exists("res://wiki/" + pageFolder + pageTitle + ".md"):
				var fileAcess = FileAccess.open("res://wiki/" + pageFolder + pageTitle + ".md", FileAccess.WRITE)
				fileAcess.store_string(filePage)
				fileAcess = null
	print("Done")
	get_tree().quit()

func ParseBadTitle(pageTitle: String) -> bool:
	if "File:" in pageTitle || "#tabber" in pageTitle ||"Category:" in pageTitle || "MediaWiki:" in pageTitle || "Template:" in pageTitle || "Module:" in pageTitle || "Talk:" in pageTitle || "File talk:" in pageTitle || "Category talk:" in pageTitle || "User talk:" in pageTitle:
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

func ParsePage(index):
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
		if pageTitle == catTags[i] && i % 2 == 0:
			tagLayout = "[\"" + catTags[i+1] + "\"]"
			catTags.remove_at(i)
			catTags.remove_at(i)
			break

	rawArticle = parse_mediawiki_to_markdown(rawArticle)
	
	var filePage = "+++"
	filePage += "\ntitle = \"" + pageTitle.replace('\"', '\'') + "\""
	filePage += "\ndraft = false"
	filePage += "\ntags = " + tagLayout
	filePage += "\ndate = " + time
	filePage += "\n\n[Article]"
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
	filePage += "\ngallery = ["
	for i in range(galleryArray.size()):
		filePage += "\"" + galleryArray[i] + "\""
		if i + 1 < galleryArray.size():
			filePage += ","
	filePage += "]"
	filePage += "\n+++"
	filePage += "\n" + rawArticle;

	pageTitle = parse_title(pageTitle)
	var fileAcess = FileAccess.open("res://wiki/" + pageFolder + pageTitle + ".md", FileAccess.WRITE)
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
	var matches = []
	var regMatch = regex.search_all(text)
	if regMatch == null:
		return dumbs
	# Replace all matches
	for match in regMatch:
		var full_match = match.strings[0]  # Full match (e.g., [[some title]])
		var capture = match.strings[1]     # Capture group 1 (e.g., some title)
		if "|" in capture:
			var parts = capture.split("|")
			capture = parts[0]
		if not "File" in capture:
			dumbs.append(capture)
			dumbs.append(tag)
	return dumbs

func parse_links(text: String) -> String:
	var pattern = r"\[\[(.*?)\]\]"  # Pattern to capture text between [[ and ]]

	var regex = RegEx.new()
	var error = regex.compile(pattern)

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
		var capture = match.strings[1]     # Capture group 1 (e.g., some title)
		if not "|" in capture && not "File:" in capture:
			if check_real_title(capture):
				text = text.replace(full_match, "[" + capture + "]({{< ref \"wiki/" + parse_title(capture) + ".md\" >}})")
			else:
				text = text.replace(full_match, capture)
		elif "File:" in capture:
			text = text.replace(full_match,"")
			galleryArray.append(capture.replace("File:",""))
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



func parse_mediawiki_to_markdown(input: String) -> String:
	var output = input
	galleryArray.clear()
	output = parse_links(output)
	output = parse_alt_links(output)
	output = output.replace("==Gallery==","")
	output = output.replace("== Gallery==","")
	output = output.replace("== Gallery ==","")
	output = destroy_gallery(output)
	output = output.replace("======", "######")
	output = output.replace("=====", "#####")
	output = output.replace("====", "####")
	output = output.replace("===", "###")
	output = output.replace("==", "##")
	output = output.replace("'''", "**")
	output = output.replace("''", "_")

	return output
	
func destroy_gallery(text: String) -> String:
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
		text = text.replace(full_match,"")
	return text

func parse_alt_links(text: String) -> String:
	var regex = RegEx.new()
	var error = regex.compile(r"\[\[(.*?)\|(.*?)\]\]")

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
		var capture = match.strings[1]     # Capture group 1 (e.g., some title)
		var captureB = match.strings[2]    # Capture group 2 (e.g., alias)
		
		if not "File" in capture:
			if check_real_title(parse_title(capture)):
				text = text.replace(full_match,"[" + captureB + "]({{< ref \"wiki/" + parse_title(capture) + ".md\" >}})")
			elif "]]" not in capture && "]]" not in captureB:
				text = text.replace(full_match,capture + " (" + captureB  + ")")
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
