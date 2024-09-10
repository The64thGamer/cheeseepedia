+++
title = "New Rock-afire Explosion Control System"
draft = false
tags = []
date = 2022-08-12T20:52:39Z

[Article]
contributors = ["Himitsu","Ls2018-1"]
gallery = []
+++
The **New Rock-afire Explosion Control System** is a control system designed by .

As the hardware and software comprising this system has been unavailable for analysis by knowledgeable persons, some of the information on this page is incomplete or of a speculative nature.

## Overall system architecture ##
The New Rock-afire Explosion Control System is designed around an Apple IIe computer with several custom cards. Audio, video, and data storage for the show is through one or two (depending on show type) VCRs and a 3.5' floppy disk. The Apple computer manages scheduling of show segments, and outputs data to various pieces of external hardware to allow controlling the animatronic characters, stage turntables, props, and other miscellaneous show systems. The Apple's standard display output is used for administrative functions in conjunction with a lightpen, while show selector and manager panels control the day-to-day operation.

## Apple IIe cards ##
Listed in order from left to right from the front of the computer
# **Decoder** - Accepts video input from the VCRs, decodes the control data from the VBI, and provides a switched video output to the Turntable Board to feed the TVs.
# **Showplay** - Outputs two channels of Pianocorder-format data to drive the character Bit Strippers, and miscellaneous signals to control the Turntable Board.
# **DOC** (acronym unknown) - Implements the 'SCI' serial interface used to communicate with the show selector and manager panels.
# **RS-232** - RS-232 interface for controlling the main VCR. Unknown if custom or COTS.
# **Floppy controller** - Interfaces with the 3.5' floppy disk drive. Unknown if custom or COTS, presumed custom.
# (Empty slot)
# **Lightpen** - Reads lightpen signals to control the computer. Unknown if custom or COTS.

## Turntable Board ##
Also known as the Big Important Board, the **Turntable Board** handles many more show functions than its name implies. It is comprised of four 6801 microcontrollers and various analog and digital circuitry.
* Reads position inputs from the center turntable, and controls its air valve
* Switches the audio to the amplifiers from the two VCR sources
* Buffers the video signal feeding the TVs
* Acts as a passthrough for show data, leading to additional external bit strippers
* Sends remote control signals to the Thank You VCR
* Controls the strobe light

## 27 Bit Strippers ##
The **27 Bit Strippers** in the system accept Pianocorder-format data as input. A 6801 microcontroller decodes the data and controls open-drain outputs for character valves, while a 6805 microcontroller (68705, UVEPROM programmable variant) generates standard 'analog' control signals for servos.

TODO: How many servos? How many outputs? Is the 74'07 buffering the data for passthrough?

## Video Decoder ##
TODO: Data presumed to be in the VBI. Is the actual character movement data in the VBI or is it stored on the floppy and the VBI just has a timestamp or similar?

## SCI Interface ##
TODO: Basically everything. We know it works in a loop... what is the actual protocol?