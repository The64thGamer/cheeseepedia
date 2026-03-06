+++
title = "Studio C File Formats"
draft = false
tags = ["Showtape Formats"]
categories = []
startDate = ""
endDate = ""
contributors = ["The 64th Gamer","Himitsu"]
citations = []
pageThumbnailFile = "TMOHbhfSCtIl64mjfyvy.avif"
+++

The ***Studio C File Formats*** are a collection of different files found in the {{< wiki-link "Studio C 3x DVD + Floppy" >}} that are used for showtape signals and playback for {{< wiki-link "Studio C" >}}. Files usually must be extracted by running a .exe file embedded in the floppy disk.

## .CEC

This file type contains control data for show segments. TODO more info on overall format.

| Char | Description                           | Syntax | Notes                          |
|------|---------------------------------------|--------|--------------------------------|
| A    | Set analog value                      | AV     | Channel is 1-indexed           |
| M    | CCF subroutine call                   | MVVV   |                                |
| R    | Random movement enable                |        |                                |
| K    | CCF karaoke subroutine call           | K      | Example: K139THIS\_IS\_A\_TEST |
| C    | Clear all analog and digital channels |        |                                |
| E    | TODO...                               |        |                                |
| S    | TODO...                               |        |                                |

Digital channel commands are encoded into a printable ASCII range of 0x30~0x3F (command) and 0x40~0x5F (channel number). This encoding method dates back to the original {{< wiki-link "SongCode" >}} format. The raw format is obtained by subtracting 0x30 from all command bytes and 0x40 from channel number bytes. It appears that CEC files always write digital channel commands in pairs of command and channel number bytes, despite not being technically necessary.

| Byte           | Bit(s) | Function                   | Notes          |
|----------------|--------|----------------------------|----------------|
| Command        | 0      | Channel state              | 1 = channel on |
| Command        | 2~1    | Bank/DTU                   |                |
| Channel Number | 4~0    | Channel number within bank |                |

## .CCF

Always named **CYBRSTAR.CCF** and also referred to as an 'MBP command file' and a 'Synhorst MCF file' (meanings unknown), this file defines subroutines that can be called from the show segment's CEC file. The subroutines are themselves abstractions around primitive functions provided by the main Cyberstar 2000 application. [put into programming terms, what Cyberstar 2000 exposes to CCFs is akin to a standard library, the CCF files themselves are like a library written for developers' convenience, and the CEC files are the final application.](To) [this is a poor comparison? Is it insane to compare CCFs to a bytecode VM?](Maybe) As a practical example, the CEC file for a particular show will contain a call to a CCF subroutine to set up the LDP. This CCF subroutine would accept parameters for the LDP number and location on the disc. It would then use those parameters to call basic functions in Cyberstar 2000 to send serial commands to the LDP and set the LDP search flag. CCF files can be edited using the **EED.EXE** application.

| Offset (hex) | Name                  | Type     | Notes |
|--------------|-----------------------|----------|-------|
| 0            | Unknown 1             | uint8?   |       |
| 1            | Unknown 2             | uint8?   |       |
| 2            | Subroutine ID         | uint8    |       |
| 3            | Index into subroutine | uint8    |       |
| 4            | Opcode                | uint16le |       |
| 6            | Parameter 1           | uint16le |       |
| 8            | Parameter 2           | uint16le |       |
| a            | Parameter 3           | uint16le |       |
| c            | Parameter 4           | uint16le |       |

TODO: document CCF string table

| Opcode (decimal) | Function                 | EED description                                                                                                            | Notes            |
|------------------|--------------------------|----------------------------------------------------------------------------------------------------------------------------|------------------|
| 01               | Digital On               | Turns up to four digital outputs on. Parms 1-4 are output channel numbers. A value of zero has no effect.                  |                  |
| 02               | Digital Off              | Turns up to four digital outputs off. Parms 1-4 are output channel numbers. A value of zero has no effect.                 |                  |
| 03               | Digital Pulse            | Pulses selected digital(s) for 1/2 second. Parms 1-4 are output channel numbers. A value of zero has no effect.            |                  |
| 04               | Set Analog               | Sets selected analog channel to a specific value. Parm 1 is the analog channel number. Parm 2 is the analog value.         |                  |
| 05               | Analog Pulse             | Causes an analog channel to 'pulse' for 1/2 second. Parm 1 is the analog channel number. Parm 2=lo value, Parm3=hi value.  | Unimplemented    |
| 06               | Analog Fade              | Fades selected analog to specific value at a specific rate.                                                                |                  |
| 07               | COM String               | Sends a text string to the selected COM port.                                                                              |                  |
| 08               | COM Byte                 | Sends a single byte value to the selected COM port.                                                                        |                  |
| 09               | LDP Search Flag          | Sets a flag indicating that the laser disc or DVD player connected to the specified port has been sent a 'search' command. |                  |
| 10               | Display Video            | Displays a text string on the COP box video overlay at the specified location.                                             |                  |
| 11               | Display String           | Displays a text string in the 'messages' window at the specified location.                                                 |                  |
| 12               | Arm Subroutine           | Arms a subroutine to execute after a specific number of frames.                                                            |                  |
| 13               | Trigger Subroutine       | Causes a subroutine to be executed when a specific trigger is received.                                                    |                  |
| 14               | Link Subroutine          |                                                                                                                            |                  |
| 15               | Force Clock              |                                                                                                                            |                  |
| 16               | Clock Type               |                                                                                                                            |                  |
| 17               | Enable Data              |                                                                                                                            | Unimplemented    |
| 18               | Select Show              |                                                                                                                            |                  |
| 19               | Set Variable             |                                                                                                                            |                  |
| 20               | If Var EQ                |                                                                                                                            |                  |
| 21               | If Var NEQ               |                                                                                                                            |                  |
| 22               | If Var GT                |                                                                                                                            |                  |
| 23               | If Var LT                |                                                                                                                            |                  |
| 24               | Var Add AND Assign       |                                                                                                                            |                  |
| 25               | Var Sub AND Assign       |                                                                                                                            |                  |
| 26               | Var Div AND Assign       |                                                                                                                            |                  |
| 27               | Var Mul AND Assign       |                                                                                                                            |                  |
| 28               | Var Set from another var |                                                                                                                            |                  |
| 29               | Var (Logic)              |                                                                                                                            | Unimplemented    |
| 30               | Next Show                |                                                                                                                            |                  |
| 31               | CD Init                  |                                                                                                                            | Unimplemented    |
| 32               | Play Track               |                                                                                                                            | Unimplemented    |
| 33               | Random Enable            |                                                                                                                            |                  |
| 34               | Kill Shows               |                                                                                                                            |                  |
| 35               | Swap Time                | Sets the scheduler swap time (24hr fmt). Parm1=hour, Parm2=minute                                                          | Unimplemented??? |
| 47               | Baud Rate                |                                                                                                                            |                  |

## DPC50 communication

Communication with the DPC50 board occurs through dual-port RAM. Overall comms structure appears to be based around updating a block of data and then writing a command. Further analysis is required to determine if there is any kind of mutex locking taking place.

| Address (hex) | Op    | Size (hex) | Data                 | Notes                       |
|---------------|-------|------------|----------------------|-----------------------------|
| 220           | WRITE | TODO       | Digital channel data |                             |
| 230           | WRITE | TODO       | COP data             | Overlay text writes to 230? |
| 3e8           | WRITE | TODO       | Analog channel data  | Needs further analysis.     |
| 3fe           | READ  | 1          | Status? Mutex?       |                             |
| 3ff           | WRITE | 1          | Command              | FB = overlay update         |