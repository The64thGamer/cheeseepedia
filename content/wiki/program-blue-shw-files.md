+++
draft = false
title = "Program Blue .shw Files"
startDate = ""
endDate = ""
contributors = ["Himitsu", "The 64th Gamer", "BattleXGamer"]
citations = ["Deobfuscation of shw files that have version number V5.01"]
tags = ["Showtape Formats"]
categories = ["Creative Engineering"]
+++
**Program Blue .shw** files are a custom, proprietary format used by the {{< wiki-link "Program Blue" >}} animatronics control software.

## Brief Overview of Format

.shw combines the show's audio program and control data in one file. The audio data is copied as-is in the format in which it was imported, and an XML section is appended after the audio which contains control and metadata. The actual control data is text-based and frames are delimited by newlines.
A brief footer at the end of the file specifies the version of the file format. Program Blue applies some basic obfuscation to its files, and the version number specifies, among other things, some details of the obfuscation. A further footer, readable after deobfuscation, specifies the size of the audio section so that the XML section can be located.
Recent Program Blue releases have modified and increased the amount of obfuscation used.

## Every Format per revision

### Version 5.01 Format

#### Overview

The Version 5.01 shw format (latest version shw file format) has changed obfuscation again. This format now has unobfuscated audio size and audio inside of it instead of obfuscating the entire file. Only the XML is obfuscated. In this version ProgramBlue now puts your registration key in the shw file. While its unsure why its been implemented, it does pose quite the security risk and increases the piratability of ProgramBlue because of this.

#### Obfuscation

The obfuscation used in V5.01 uses a list of 33 different hex values. These values are added to each hex in the file after the audio data as audio is not obfuscated. The obfuscation runs through this list adding to the original hex value. This finishes off the shw file in V5.01 but it leaves the version number at the end.

#### Deobfuscation

To deobfuscate a V5.01 you need to reverse the obfuscation step. You do this by subtracting the original hex by the 33 different hex values in the list. You need to ensure you don't deobfuscate the audio though as the audio has no obfuscation. Make sure you start the list at the first data hex as to ensure it lines up properly.

### TODO

More info on deobfuscation and obfuscation / better explanation. Add screenshots of deobfuscated shw file
