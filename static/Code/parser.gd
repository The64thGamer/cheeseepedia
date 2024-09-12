extends Node
var xml: XMLNode
const invalid_chars = ["/", "\\", "?", "%", "*", ":", "|", "\"", "<", ">", "."]
@export var dictionary: Dictionary
var catTags : Array

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	xml = XML.parse_file("res://ddd.xml").root
	dictionary = xml.to_dict()
	print("XML Loaded")

	var dir = DirAccess.open("res://")
	dir.make_dir("wiki")
	dir = DirAccess.open("res://wiki")
	dir.make_dir("Users")
	
	print("Pages Made")

	for i in range(xml.children.size() - 1):
		if "Category: " in xml.children[1 + i].children[0].content && xml.children[1 + i].children.size() > 3 && "redirect" not in xml.children[1 + i].children[3].name:
			var tag = xml.children[1 + i].children[0].content.replace("Category: ","")
			catTags.append_array(parse_tags(tag,xml.children[1 + i].children[3].children[7].content.replace('\"', '\'')))
		elif "Category:" in xml.children[1 + i].children[0].content && xml.children[1 + i].children.size() > 3 && "redirect" not in xml.children[1 + i].children[3].name:
			var tag = xml.children[1 + i].children[0].content.replace("Category:","")
			catTags.append_array(parse_tags(tag,xml.children[1 + i].children[3].children[7].content.replace('\"', '\'')))
	print("Tags Generated")
	for i in range(xml.children.size() - 1):
		ParsePage(i)
	print("Done")
	#for i in range(catTags.size()):
	#	print(catTags[i])
			

func ParsePage(index):
	var pageXml = xml.children[1 + index]
	var pageTitle = pageXml.children[0].content
	var pageFolder = ""
	var tagLayout = "[]"
	if "File:" in pageTitle ||"Category:" in pageTitle || "MediaWiki:" in pageTitle || "Template:" in pageTitle || "Module:" in pageTitle || "Talk:" in pageTitle || "File talk:" in pageTitle || "Category talk:" in pageTitle || "User talk:" in pageTitle:
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
	
	var rawArticle = pageXml.children[revision].children[7].content.replace('\"', '\'')

	for i in range(catTags.size()):
		if pageTitle == catTags[i] && i % 2 == 0:
			tagLayout = "[\"" + catTags[i+1] + "\"]"
			break

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
	var galleryArray = parse_gallery_section(rawArticle)
	for i in range(galleryArray.size()):
		filePage += "\"" + galleryArray[i] + "\""
		if i + 1 < galleryArray.size():
			filePage += ","
	filePage += "]"
	filePage += "\n+++"
	filePage += "\n" + parse_mediawiki_to_markdown(rawArticle);

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

func parse_gallery_section(text: String) -> Array:
	var file_names = []

	var gallery_start = text.find("<gallery>")
	var gallery_end = text.find("</gallery>", gallery_start)

	if gallery_start != -1 and gallery_end != -1:
		# Extract the text within the gallery section, excluding the <gallery> and </gallery> tags
		var gallery_text = text.substr(gallery_start + len("<gallery>"), gallery_end - gallery_start - len("<gallery>"))
		
		# Use regex to match filenames with the 'File:' prefix
		var file_regex = RegEx.new()
		file_regex.compile(r"File:([^\s]+)") # Match the filename, accounting for spaces
		var result = file_regex.search_all(gallery_text)
		
		# Add matched filenames to the array
		for match in result:
			file_names.append(match.get_string(1).strip_edges().strip_escapes()) # Add filename without extra spaces

	return file_names

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
		if not "|" in capture && not "File" in capture:
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
		if not "|" in capture && not "File" in capture:
			if check_real_title(capture):
				text = text.replace(full_match, "[" + capture + "]({{< ref \"wiki/" + parse_title(capture) + ".md\" >}})")
			else:
				text = text.replace(full_match, capture)
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
	
	output = parse_links(output)
	output = parse_alt_links(output)
	
	output = output.replace("======", "######")
	output = output.replace("=====", "#####")
	output = output.replace("====", "####")
	output = output.replace("===", "###")
	output = output.replace("==", "##")
	output = output.replace("'''", "**")
	output = output.replace("''", "_")

	return output

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

		if "File:" in pageTitle || "User:" in pageTitle ||"Category:" in pageTitle || "MediaWiki:" in pageTitle || "Template:" in pageTitle || "Module:" in pageTitle || "Talk:" in pageTitle || "File talk:" in pageTitle || "Category talk:" in pageTitle || "User talk:" in pageTitle:
			continue
		if pageXml.children.size() > 3 && "redirect" in pageXml.children[3].name:
			continue
		if pageTitle == text:
			return true
		
	return false
