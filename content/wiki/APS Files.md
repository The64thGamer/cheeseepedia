+++
title = "APS Files"
draft = false
tags = [ ]

[Article]
contributors = ["Himitsu","The 64th Gamer","CoolerDude"]
gallery = []
+++
The **APS format** is used to store the raw programming data for various animatronic shows. Different stage types are denoted by the file extension used, but the file format otherwise remains the same for each type.

##  Overall format ## 
APS files are rather minimal and contain a length value, segment name, and control data. Data is stored at 29.97 FPS and each frame contains the state of all bits, so playback can be seeked to any arbitrary location without needing to process any preceding data.

Note that APS files do not contain the required information to sync with audio. It is unknown exactly how this was handled by the original programming software, but it is likely that the frame number within each show is determined based on the timecode value from the tape used in the editing system.

##  Frame format ## 
Frames are made up of 32 bytes, storing 256 channels of control data. A bit value of 1 indicates the particular bit is active. Any bits unused by the show controller are left as value 0. Show bits are stored with the least significant bit first, and the following table explains the arrangement for a few example bits:
{| class='wikitable'
|+ Example frame locations
|-
! Show bit (1-indexed) !! Byte offset within frame !! Bit within byte
|-
| 1 || 0x00 || 0
|-
| 2 || 0x00 || 1
|-
| 8 || 0x00 || 7
|-
| 9 || 0x01 || 0
|-
| 16 || 0x01 || 7
|}

Show types using multiple 'drawers' are stored with the second drawer's data starting at show bit 129. Of course, the exact mapping of bit to movement depends on the show type.

##  Chunk format ## 
Frames are stored in 0x400-byte chunks, beginning at offset 0x200 in the file. While it would be possible to fit 32 frames total in each chunk, the last two frames in each chunk are left unused, so each chunk actually contains only 30 frames. It is assumed that this was done to allow easier seeking in the file, since each chunk containing one second worth of data is convenient, but it is also possible that this area was intended to be used for future expansion. None of the files examined so far appear to use it for that purpose, however.

##  Header format ## 
The file header starts at offset 0 and is not completely understood, but is easily human-readable in a hex editor for file identification purposes. It appears to be entirely plaintext. The exact size is also unknown, but definitely not larger than 0x200 bytes.
{| class='wikitable'
|+ Preliminary header format
|-
! Offset !! Data !! Example
|-
| 0x00 || Length M:SS || 7:30
|-
| 0x0a || Length repeated? || (7:30)
|-
| 0x10 || Title Line 1 || 
|-
| 0x32 || Title Line 2 || 
|}
All gaps in the header should be filled with 0. It is reasonable to assume that strings are intended to be read as null-terminated with a maximum length determined by the location of the next string.