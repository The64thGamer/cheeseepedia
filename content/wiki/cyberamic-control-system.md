+++
title = "Cyberamic Control System"
draft = false
tags = ["Animatronic Control Systems"]
categories = ["Pizza Time Theatre"]
startDate = ""
endDate = ""
contributors = ["The 64th Gamer","Palazzol"]
citations = ["[https://www.youtube.com/watch?v=EdKLsomLbtY&feature=youtu.be](%22https://www.youtube.com/watch?v=EdKLsomLbtY&feature=youtu.be%22)","[https://web.archive.org/web/20200226201702if_/https://www.spttechsupport.com/uploads/6/9/3/7/69377421/68hc11_cpu_manual.pdf](%22https://web.archive.org/web/20200226201702if_/https://www.spttechsupport.com/uploads/6/9/3/7/69377421/68hc11_cpu_manual.pdf%22)","[https://raw.githubusercontent.com/palazzol/CyberamicControlCenter/master/firmware/M6502/HalfAChuck%20-%20no%20label/halfchuck.rst](%22https://raw.githubusercontent.com/palazzol/CyberamicControlCenter/master/firmware/M6502/HalfAChuck%20-%20no%20label/halfchuck.rst%22)","[https://reel-reel.com/tape-recorder/teac-x-7x-7r/](%22https://reel-reel.com/tape-recorder/teac-x-7x-7r/%22)"]
downloadLinks = ["https://archive.org/download/cyberamic-1.6-r-12-27-c-256/Cyberamic_1.6_R12_27C256.BIN|256Kbit VHS Random Movements EPROM v.1.6"]
pageThumbnailFile = "Eoy0bZZfZjyorXT5rLPH.avif"
+++
The ***Cyberamics Control Center* is a computer that plays showtapes and controls animatronics for the {{< wiki-link "Kooser PTT Show" >}} that debuted in December of 1978, and later the {{< wiki-link "Cyberamics" >}} shows that were produced from 1979 onwards, which is still used to the current day.
Originally running showtapes on 7' reels, it would be upgraded in 1988 to support SVHS tapes, and in 2005 to support DVDs.**

## Function

The unit controls a set of animatronic characters, props, speakers, and lights through automatic playback of showtape media. Employees set a showtape reel on the lefthand spool of the tape deck, wind it through, and hit play. The unit will continuously loop the showtape until stopped. Certain buttons can be pressed to queue up special shows on the tape to play. These special shows when detected are usually skipped, but will be allowed to continue playing when correctly assigned.
Later on in the late 80's to the mid 2000's, employees would instead insert a single SVHS tape to play. These tapes got rid of the skippable special segments, instead having hidden audio tracks that would become audible if the Birthday button was pressed. Employees could also run simple diagnostics from a new LCD screen.
After the mid-2000's', employees would now insert a DVD, which could now queue up video diagnostics and Live Shows at any time.
In 2023 the data system would switch over to the {{< wiki-link "Navori System" >}}, now streaming showtapes from an online server.

## History

An early variation of the Cyberamic Control System is seen in the news video for the {{< wiki-link "San Jose, CA (1371 Kooser Rd)" >}} store, being the first to use it,<sup>(1)</sup> The only visible hardware difference is the tape deck, being a TEAC A-2340, rather than the later TEAC X-7. The housing box is also designed differently.
The standard units would be produced for stores from early 1979 to November 1983.

### Upgrades

The {{< wiki-link "Arlington, TX (2216 S Fielder Rd)" >}} would have their unit uniquely upgraded to support the {{< wiki-link "Cyberamics Betamax" >}} format in January of 1987.
From 1988 to 1990, the unit would be upgraded using parts from Triad to support SVHS tapes with scrambled showtape signals, replacing the tape reading functionality. This would be named the Cyberstar (disambiguation)|Cyberstar upgrade to the unit.
Somewhere around the late 80's to early 90's, some variant of upgrades would feature a yellow control panel. This would remove the volume knob, and move over the small metal power switch in its place- now becoming a large red switch.
In 1993, the control system would see an upgrade to the original CPU to a 68HC11, alongside a new LCD display.<sup>(2)</sup>
From 2005 to April 2008 the units would upgrade to replace the SVHS player with a DVD player.

## Parts

### Modified TEAC X-7 Tape Deck

The system houses a modified TEAC X-7 tape deck that allows audio to be outputted even when in rewind mode.<sup>(3)</sup> This is to allow the *Tape Start* {{< wiki-link "Data" >}} to be heard to automatically switch off rewind mode. The signal is around 21 hertz, but is sped up into an audible signal due to the X-7 rewind speed being 144IPS.<sup>(4)</sup>

### CPU Assembly Card

The CPU Assembly Card is the main card controlling the Cyberamic Control Center. The later Triad Cyberstar version contains an EPROM for decoding the scrambled signals sent off of SVHS showtapes, which has changed in version over time:

- 64Kbit EPROM v1.0
- 64Kbit EPROM v1.6 (R12) 11/13/94

### Random Movements Card

The Random Movements Card is an attachment to the CPU Assembly card that provides random movements for characters between showtape segments. This card contains an EPROM of the raw random movement signals that has changed in version number over time:

- 256Kbit VHS Random Movements EPROM v1.0
- 256Kbit VHS Random Movements EPROM v.1.6
- 255Kbit DVD Random Movements EPROM v1.0

### Transfer Control Card (06-0020)

The Transfer Control Card is used for decoding analogue signals from the tape reel into digital bits. On Triad Cyberstar upgraded units, these are unscrambled by the CPU Assembly Card. The card had four revisions up to Revision D.

### Audio Control Card (06-033 / 06-0003)

The Audio Control Card was a card used for managing the audio coming from the tape reel, later the SVHS deck and DVD players. The card had three revisions up to Revision C.
Both board types had support for a volume adjustment knob present on the original red control panel. An Audio Gain Control microphone was also present in the system that would allow the show to increase in volume as the showroom became more crowded.

### Character Drive Card (006-0034-10)

The Character Drive Card controlled animatronic characters from the incoming showtape signals. Seemingly each character had a custom labeled chip on their board. These cards were inserted into the exposed card cage of the unit, and their red lights would blink in accordance to the showtape signals.

### Light Driver Card (06-0021)

The Light Driver Card controlled the lights of the stage and functioned exactly like a Character Drive Card.

### Valve Bank Card (06-0006)

The Valve Bank Card is a card external to the Cyberamic Control System that would manage the airflow of valves in a {{< wiki-link "Cyberamics" >}} character, usually placed at the character's base. Each card was connected to a Character Drive Card.
