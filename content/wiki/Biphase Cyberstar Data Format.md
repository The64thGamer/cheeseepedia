+++
title = "Biphase Cyberstar Data Format"
draft = false
tags = ["Showtape Formats"]
date = "02/16/2024"

[Article]
startDate = ""
endDate = ""
contributors = ["The 64th Gamer","BattleXGamer","Ls2018-1"]
gallery = []
+++


<h2>History</h2>
TODO: Everything

The Biphase Cyberstar Data Format had its origins with the data format used on reel to reel tapes for Pizza Time Theatre shows in the early 80s. 

<h2>Format</h2>
Control data for the show is stored as a [Biphase Mark Code]({{< ref "wiki/Biphase Mark Code.md" >}}) signal on one channel of the show DVD. The BMC signal is an encoded form of 4800 baud 8-N-1 serial data. The data is command-based and includes control data for the show's air valves, in addition to show metadata and commands to stop and start show segments, control the A/V switcher, etc. All data in the serial stream fits within the printable ASCII range.

<h2>Command Format</h2>
The Biphase Cyberstar Data Format consists of two main command types. These are Movement Commands and Control Commands. Movement Commands directly control the state of the outputs of the controller while Control Commands provide information to the control system about skit type, show title, or similar information.

<h2>= Movement Commands </h2>=
The most frequently used command type are 'Movement Commands'. Movement Commands consist of two bytes; however, it is not always necessary to send both bytes. 

<h2>== Card Select Byte </h2>==
The first byte of a Movement Command is the card select byte. In all iterations of the [Cyberamic Control System]({{< ref "wiki/Cyberamic Control System.md" >}}), this byte does two things. It first selects, as the name implies, what driver card is being manipulated. Secondly, it determines whether the output, at this point still undermined, will be turned on or off by the next byte. 

In Pre-93 iterations of the Cyberamic Control System, the scheme is slightly more complicated. Some driver cards may have more than one card select byte, and some cards my share a driver select byte. TODO: Expand on this with the Rosetta chart

In 3-stage systems, the card select bytes, in addition to selecting the driver board and indicating the on or off state, also select which drawer is being selected.

The card select byte is always in the range of 0x26 - 0x3F inclusive in all iterations of this data format. In some early shows, the most significant bit occasionally floats high, rendering the range 0xA6 - 0xBF. This may be corrected by ANDing all bytes with 0x7F. Commands for 'on' are always even and commands for 'off' are always odd.

<h2>== Movement Selection Byte </h2>==
The second byte of a movement command is the movement selection byte. This byte determines which bit on the selected card will be turned on or off. This byte is always between 0x40 and 0x5F inclusive (unless the most significant bit has floated high) in all iterations of this data format. Once this second byte is received by the controller, the bit is turned on or off, determined by the card select byte, on the selected card, determined by the card select byte. Any number of movement selection bytes can be sent without a new card selection byte being necessary. The controller will always assume the previous card select byte. This technique greatly increases data throughput and enables more commands to be sent per unit of time than would otherwise be possible.

TODO: Describe what a 'Rosetta' is and list out the different Rosettas.

<h2>= Control Commands </h2>=
TODO: A lot. I am not done adding details here.

Some commands are interpreted by the controller only and are not directly correlated to the turning on or off of a specific output of the controller, though the outputs may be influenced indirectly by these commands. Such commands are referred to as 'Control Commands'. Except for a few exceptions noted below, all Control Commands consist of two dollar signs ($$) followed by a letter. The function of these commands are detailed in the following table.
{| class='wikitable'
|+Control Command Reference
!Data type
!Command
!Function
!Description
|-
|[Cyberamics Reel]({{< ref "wiki/Cyberamics Reel.md" >}})
|$$$AAA$$$ - $$$ZZZ$$$
|Skit number identifier
|This command is placed before every skit on the reel to act as a chronological number before each skit. The Cyberamics computer at this time was capable of locating different skits on the reel at random, but the algorithm for finding them was primitive and prone to occasional mistakes. Placing a skit number identifier before each skit would give the computer an error checking capability to know if it had located the wrong skit. The command $$$AAA$$ corresponds to the first skit on the tape with each advancing letter corresponding the next skit. While $$$ZZZ$$$ is presumably a legal skit number identifier, it is unclear how high this counter would actually count on a typical tape. 
|-
|[C&R SVHS (Pre-93)]({{< ref "wiki/C&R SVHS (Pre-93).md" >}}), [R12 SVHS (Pre-93)]({{< ref "wiki/R12 SVHS (Pre-93).md" >}})
|$$B
|Birthday show start
|This command indicates to the controller that a birthday show is beginning. If a birthday show has not been selected, the controller will ignore all movement commands after this signal and will instruct the AV switcher to only play intermission/background music in the showroom and game room.
Note: Not to be confused with the birthday warning command.
|-
|[C&R SVHS (Pre-93)]({{< ref "wiki/C&R SVHS (Pre-93).md" >}}), [R12 SVHS (Pre-93)]({{< ref "wiki/R12 SVHS (Pre-93).md" >}})
|$$E
|Birthday show end
|This command indicates to the controller that a birthday show is ending. This returns the controller to the normal state it would be in when a birthday show is not playing.
|-
|[C&R SVHS (Pre-93)]({{< ref "wiki/C&R SVHS (Pre-93).md" >}}), [R12 SVHS (Pre-93)]({{< ref "wiki/R12 SVHS (Pre-93).md" >}})
|$$W
|TODO
|TODO: This is possibly the birthday warning command. Need to check all this again.
|-
|[C&R SVHS (Pre-93)]({{< ref "wiki/C&R SVHS (Pre-93).md" >}}), [R12 SVHS (Pre-93)]({{< ref "wiki/R12 SVHS (Pre-93).md" >}})
|9Z
|Rewind tape
|This control command deviates from the $${letter} format. In this data format, the card select byte 9 otherwise would control bits on the modified character driver card used to control the Triad AV Switcher. It is unclear why a movement command was used for this purpose when $${letter} commands were also being used.
|-
|
|
|
|
|}