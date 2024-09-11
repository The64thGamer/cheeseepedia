+++
title = "Layton Bit Stripper"
draft = false
tags = []
date = 2022-08-06T11:22:03Z

[Article]
contributors = ["Himitsu","Ls2018-1","2603:6011:AC00:A50:D87E:6765:9A50:675","Mr.Noodles","The 64th Gamer","CECMentor"]
gallery = []
+++
[[File:Layton Bit Stripper - Green PCB.png|thumb|A finished Layton Bit Stripper]]
The **Layton Bit Stripper** is an animatronic character controller designed by Layton Sanders in 2018 and available for purchase from [Creative Engineering]({{< ref "wiki/Creative Engineering.md" >}}) beginning in 2019. The controller accepts standard Pianocorder format biphase data as input and can drive any [Rock-afire Explosion]({{< ref "wiki/Rock-afire Explosion.md" >}}) character, with data passthrough to controllers for additional characters. A movement test feature is also available. 30 LEDs show power, per-channel output status, and data sync.

The Layton Bit Stripper is comprised of a custom PCB and what appears to be off-the-shelf power supplies and outer enclosure.

## Revisions ##
[[File:Layton Bit Stripper Rev. A.2 PCB.png|thumb|Rev. A.2 PCB]]
At least two revisions of the Layton Bit Stripper are known to exist.
* **Rev. A.2** - Red PCB, wave shaper bypass switch, 12-pin expansion port footprint, requires both 5V and 24V supplies, two external buttons, resistor networks for LEDs, MCU sticker 'Bitstripper V1.1B'
* **Unknown rev** - Green PCB, no bypass switch, no expansion port, unpopulated 5V regulator footprint, no external buttons, individual LED resistors, MCU sticker 'Bitstripper V1.0'

## I/O ##
* Permanently-attached AC power cord
* Data input (RCA jack)
* Data output (RCA jack)
* Character output connector (TODO: centronics something-or-other)
* 2x momentary pushbuttons (bit test select, bit pulse)
* 30 LEDs (arranged in 3x 10-LED bargraphs)
* 5 DIP switch (character select)
* 12-pin expansion footprint

## Hardware breakdown ##
* ATmega328 MCU (presumed, covered by sticker)
* 3x 74HC595 (serial to parallel)
* 6x SN75437 (output drivers)
* TODO: unknown audio interface components

## Character select DIP switch settings ##
{| class='wikitable'
|+ Character
|-
! Switch setting !! Name !! # of bits
|-
| 00000 || Disable bitstripper || 0
|-
| 00001 || Rolfe and Earl || 22
|-
| 00010 || Dook || 17
|-
| 00011 || Fatz || 16
|-
| 00100 || Organ and Sign || 14
|-
| 00101 || Spots || 8
|-
| 00110 || Curtains || 6
|-
| 00111 || Spots and Curtains || 14
|-
| 01000 || Props || 8
|-
| 01001 || Beach Bear || 16
|-
| 01010 || Looney Bird || 6
|-
| 01011 || Mitzi || 19
|-
| 01100 || Billy Bob || 20
|-
| 01101 || Floods || 12
|-
| 01110 || Specials || 3
|-
| 01111 || Stage lights || 19
|-
| 1xxxx || Future use || -
|}