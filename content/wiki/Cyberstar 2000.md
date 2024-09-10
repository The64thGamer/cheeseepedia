+++
title = "Cyberstar 2000"
draft = false
tags = [ ]

[Article]
contributors = ["Himitsu","The 64th Gamer","GallaRBX2"]
gallery = []
+++
**Cyberstar 2000** is the primary piece of software used in the [Studio C Control System]({{< ref "wiki/Studio C Control System.md" >}}).

TODO: A lot of stuff on this page. Formatting probably needs some work.

## File formats ##

### CEC ###
This file type contains control data for show segments. TODO more info on overall format.
{| class='wikitable'
|+CEC control commands
!Char
!Description
!Syntax
!Notes
|-
|A
|Set analog value
|A<channel>V<value>
|Channel is 1-indexed
|-
|M
|CCF subroutine call
|M<subroutine id>V<param1>V<param2>V<param3>
|
|-
|R
|Random movement enable
|
|
|-
|K
|CCF karaoke subroutine call
|TODO...
|
|-
|C
|Clear all analog and digital channels
|
|
|-
|E
|TODO...
|
|
|-
|S
|TODO...
|
|
|}

### CCF ###
Always named **CYBRSTAR.CCF** and also referred to as an 'MBP command file' and an 'MCF file' (meanings unknown), this file defines subroutines that can be called from the show segment's CEC file. The subroutines are themselves abstractions around primitive functions provided by the main Cyberstar 2000 application. [To put into programming terms, what Cyberstar 2000 exposes to CCFs is akin to a standard library, the CCF files themselves are like a library written for developers' convenience, and the CEC files are the final application.][Maybe this is a poor comparison? Is it insane to compare CCFs to a bytecode VM?]

As a practical example, the CEC file for a particular show will contain a call to a CCF subroutine to set up the LDP. This CCF subroutine would accept parameters for the LDP number and location on the disk. It would then use those parameters to call basic functions in Cyberstar 2000 to send serial commands to the LDP and set the LDP search flag.

CCF files can be edited using the **EED.EXE** application.
{| class='wikitable'
|+CCF instruction format
!Offset
!Name
!Type
!Notes
|-
|0
|Unknown 1
|uint8?
|
|-
|1
|Unknown 2
|uint8?
|
|-
|2
|Subroutine ID
|uint8
|
|-
|3
|Index into subroutine
|uint8
|
|-
|4
|Opcode
|uint16
|
|-
|6
|Parameter 1
|uint16
|
|-
|8
|Parameter 2
|uint16
|
|-
|a
|Parameter 3
|uint16
|
|-
|c
|Parameter 4
|uint16
|
|}