+++
title = "Program Blue .shw Files"
draft = false
tags = []
date = "2022-12-07"

[Article]
startDate = ""
endDate = ""
contributors = ["Himitsu","The 64th Gamer"]
gallery = []
+++


<b>Program Blue .shw</b> files are a custom, proprietary format used by the [Program Blue]({{< ref "wiki/Program Blue.md" >}}) animatronics control software.

<h2> Format </h2>
.shw combines the show's audio program and control data in one file. The audio data is copied as-is in the format in which it was imported, and an XML section is appended after the audio which contains control and metadata. The actual control data is text-based and frames are delimited by newlines.

A brief footer at the end of the file specifies the version of the file format. Program Blue applies some basic obfuscation to its files, and the version number specifies, among other things, some details of the obfuscation. A further footer, readable after deobfuscation, specifies the size of the audio section so that the XML section can be located.

Recent Program Blue releases have modified and increased the amount of obfuscation used.