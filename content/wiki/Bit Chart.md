+++
title = "Bit Chart"
draft = false
tags = ["Animatronic Repair & Preservation"]
date = 2024-06-22T19:35:20Z

[Article]
contributors = ["The 64th Gamer","Himitsu"]
gallery = []
+++
{{Generic|image=Road Stage Bit Chart.png|desc=[Cyberamics Road Stage]({{< ref "wiki/Cyberamics Road Stage.md" >}}) Bit Chart}}

A **_Bit Chart**_ refers to a physical or digital chart describing the names given to a list of numbers representing _animation bits_. 

## Description ##
Each bit represents a character movement, light, or special effect, which can either be in an on or off state. The numbers on the chart correlate with the same list used in the animatronic software, allowing store techs to identify, test, and troubleshoot the animatronic systems. These charts can sometimes be separated into two sections, usually referred to as the **_Top Drawer**_ and **_Bottom Drawer**_. 

Bits are usually grouped by character, but otherwise are indeterminately placed in the chart. The [Cyberamic Control System]({{< ref "wiki/Cyberamic Control System.md" >}}) grouped bits by 'Character Cards', which were circuit boards controlling a single character or set of lights that could be swapped out. Charts don't always reveal all show control available however, such as in the Studio C control system, which is capable of controlling DMX lighting and other ancillary devices not listed on the standard bit chart.

Note that the bit numbers as listed on bit charts may not always correlate 1:1 to bit numbers as used on the show's storage medium. For example, the first bit available on a show controller may be labeled as 1 on the bit chart, but actually exist as the lowest-order bit (bit 0) at a certain memory location on the controller. In this case the bit numbers on the chart can be seen as a hardware- and software-agnostic abstraction for consistent identification across the programming and playback lifecycle.