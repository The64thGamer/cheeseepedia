+++
title = "Layton Bit Stripper"
draft = false
tags = ["Products"]
categories = ["Creative Engineering"]


startDate = "2019-00-00"
endDate = "0000-00-00"
contributors = ["Himitsu","Ls2018","2603:6011:AC00:A50:D87E:6765:9A50:675","Mr.Noodles","The 64th Gamer","CECMentor"]
citations = []
pageThumbnailFile = "TEOZUYOwloldRPMY2nsZ.avif"
+++

The ***Layton Bit Stripper*** is an animatronic character controller designed by Layton Sanders in 2018 and available for purchase from {{< wiki-link "Creative Engineering" >}} beginning in 2019. The controller accepts standard Pianocorder format biphase data as input and can drive any {{< wiki-link "Rock-afire Explosion" >}} character, with data passthrough to controllers for additional characters. A movement test feature is also available. 30 LEDs show power, per-channel output status, and data sync. The Layton Bit Stripper is comprised of a custom PCB and off-the-shelf power supplies and outer enclosure. As of September 2024, the 'A' revisions of the Layton Bit Stripper are discontinued with a fully redesigned 'B' revision set for release soon.

## PCB revisions

Three revisions of the Layton Bit Stripper exist:

- **Rev. A** - Green PCB, no bypass switch, no expansion port, unpopulated 5V regulator footprint, no external buttons, individual LED resistors, different output drivers than future revisions, never publicly revealed due to functional problems
- **Rev. A.1** - Green PCB, no bypass switch, no expansion port, unpopulated 5V regulator footprint, no external buttons, individual LED resistors
- **Rev. A.2** - Red PCB, waveshaper bypass switch, 12-pin expansion port footprint, requires both 5V and 24V supplies, two external buttons, resistor networks for LEDs

## Software revisions

There are five public software revisions for the Layton Bit Stripper:

- **Bitstripper V1.0** - Initial release, lacking movement diagnostic external button support, only used in experimental Rev A boards and the first five Rev. A.1 boards
- **Bitstripper V1.1** - Identical to previous release with the addition of diagnostic button support
- **Bitstripper V1.1B** - Fixed a previously undetected bug which caused outputs to be updated 600 microseconds later than they should be
- **Bitstripper V1.1C** - Increased the movement diagnostic cycle time to allow longer stroke movements to fully extend and retract
- **Bitstripper V1.1D** - Fixed a previously undetected bug which erroneously mapped Dook’s right head turn movement to his right elbow bit. Current release as of August 10, 2022.

There are two custom code versions designed for special applications:

- **Dook2.0 V1.1D** - Designed to control second generation Dook. Code is identical to Bitstripper V1.1D, but DIP switch settings have been modified. DIP switch setting 00001 sets the bit stripper to output bits for valves 1-16 and DIP switch setting 00010 sets the bit stripper to output bits for valves 17-32. All other DIP switch settings disable output bits. Identical or very similar movements from first generation Dook are mapped to their corresponding movements on second generation Dook for maximum backwards compatibility. New movements are mapped to previously unusued bits in the data stream.
- **Shavers V1.1D** - Designed to operate the Four Little Shavers, owned by Volo Museum|Volo Auto Museum as of August 10, 2022. Based on Bitstripper 1.1D but has shorter data frames than standard Pianocorder data with only 24 control bits and a different synchronization system. When using movement diagnostic buttons, Curly’s right elbow and right arm twist always actuate at the same time because of the potential of his mirror hitting and damaging his nose if the arm is kept retracted when the arm twist actuates.

## Hardware

### I/O

- Permanently-attached AC power cord
- 2x Transformer Based AC to DC power adapters. (One for 5v, One for 24v)
- Data input (RCA jack)
- Data output (RCA jack)
- Character output connector (TODO: centronics something-or-other)
- 2x momentary pushbuttons (bit test select, bit pulse)
- 30 LEDs (arranged in 3x 10-LED bargraphs)
- 5 DIP switch (character select)
- 12-pin expansion footprint

### Hardware breakdown

- ATmega328 MCU (presumed, covered by sticker)
- 3x 74HC595 (serial to parallel)
- 6x SN75437A (output drivers)
- TODO: unknown audio interface components

### Character select DIP switch settings

| Switch setting !! Name !! # of bits   |
|---------------------------------------|
|                                       |
| 00000 \|\| Disable bitstripper \|\| 0 |
| 00001 \|\| Rolfe and Earl \|\| 22     |
| 00010 \|\| Dook \|\| 17               |
| 00011 \|\| Fatz \|\| 16               |
| 00100 \|\| Organ and Sign \|\| 14     |
| 00101 \|\| Spots \|\| 8               |
| 00110 \|\| Curtains \|\| 6            |
| 00111 \|\| Spots and Curtains \|\| 14 |
| 01000 \|\| Props \|\| 8               |
| 01001 \|\| Beach Bear \|\| 16         |
| 01010 \|\| Looney Bird \|\| 6         |
| 01011 \|\| Mitzi \|\| 19              |
| 01100 \|\| Billy Bob \|\| 20          |
| 01101 \|\| Floods \|\| 12             |
| 01110 \|\| Specials \|\| 3            |
| 01111 \|\| Stage lights \|\| 19       |
| 1xxxx \|\| Future use \|\| -          |