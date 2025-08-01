+++
title = "APS Files"
draft = false
tags = ["Showtape Formats"]
categories = []
startDate = ""
endDate = ""
contributors = ["Himitsu","The 64th Gamer","CoolerDude"]
citations = []
+++

The **APS format** is used to store the raw programming data for various animatronic shows. Different stage types are denoted by the file extension used, but the file format otherwise remains the same for each type. Each file represented a segment of a showtape, rather than the entirety of the showtape's runtime. Segments were never programmed for intermissions, and their file names were usually numbered, with accordance to actual segments with performances in the tape.

## Known File Extension Names

- **.mvt** for Random Movements
- **.sho** for 3-Stage and C-Stage (1990)
- **.3st** for 3-Stage (1991-1992)
- **.c&amp;r** for C-Stage and Rocker Stages
- **.roa** for Road Stages (1990-1991)
- **.r12** for Road, 1-Stage, and 2-Stages (1992)
- **.bzr** for Beach Bowsers
- **.hlf**, (maybe Half Cyberamics. 1991?)

## Overall format

APS files are rather minimal and contain a length value, segment name, and control data. Data is stored at 29.97 FPS and each frame contains the state of all bits, so playback can be seeked to any arbitrary location without needing to process any preceding data. Note that APS files do not contain the required information to sync with audio. It is unknown exactly how this was handled by the original programming software, but it is likely that the frame number within each show is determined based on the timecode value from the tape used in the editing system.

## Frame format

Frames are made up of 32 bytes, storing 256 channels of control data. A bit value of 1 indicates the particular bit is active. Any bits unused by the show controller are left as value 0. Show bits are stored with the least significant bit first, and the following table explains the arrangement for a few example bits:

| Show bit (1-indexed) !! Byte offset within frame !! Bit within byte |
|---------------------------------------------------------------------|
|                                                                     |
| 1 \|\| 0x00 \|\| 0                                                  |
| 2 \|\| 0x00 \|\| 1                                                  |
| 8 \|\| 0x00 \|\| 7                                                  |
| 9 \|\| 0x01 \|\| 0                                                  |
| 16 \|\| 0x01 \|\| 7                                                 |

Show types using multiple 'drawers' are stored with the second drawer's data starting at show bit 129. Of course, the exact mapping of bit to movement depends on the show type.

## Chunk format

Frames are stored in 0x400-byte chunks, beginning at offset 0x200 in the file. While it would be possible to fit 32 frames total in each chunk, the last two frames in each chunk are left unused, so each chunk actually contains only 30 frames. It is assumed that this was done to allow easier seeking in the file, since each chunk containing one second worth of data is convenient, but it is also possible that this area was intended to be used for future expansion. None of the files examined so far appear to use it for that purpose, however.

## RAE Signal Scramble Lookup Table

For 3-Stage APS files, all data bytes past the 0x200 header space must be re-ordered for correct playback. This is due to an idiosyncrasy of the original Rock-afire control system, pertaining to the mapping of bits on the tape to original Pianocorder functions. Every 16 bytes must be rearranged into this order (0-indexed) 10, 11, 0, 1, 2, 3, 4, 12, 13, 5, 6, 7, 8, 9, 14, 15

## Header format

The file header starts at offset 0 and is not completely understood, but is easily human-readable in a hex editor for file identification purposes. It appears to be entirely plaintext. The exact size is also unknown, but definitely not larger than 0x200 bytes.

| Offset !! Data !! Example              |
|----------------------------------------|
|                                        |
| 0x00 \|\| Length M:SS \|\| 7:30        |
| 0x0a \|\| Length repeated? \|\| (7:30) |
| 0x10 \|\| Title Line 1 \|\|            |
| 0x32 \|\| Title Line 2 \|\|            |

All gaps in the header should be filled with 0. It is reasonable to assume that strings are intended to be read as null-terminated with a maximum length determined by the location of the next string.

## APS List

APS files for showtapes exist for all shows starting sometime in 1990, all the way to present day. This list narrows the shows provided to just the ones that have their APS files public.

| Show Type  | APS Show                                  | Showtape / Live Show                                  | Earliest File Date              | Latest File Date               | Format     |
|------------|-------------------------------------------|-------------------------------------------------------|---------------------------------|--------------------------------|------------|
| 3-Stage    | CEC September '90 3-Stage APS             | {{< wiki-link "CEC September 1990 Show" >}}     | October 10, 1990, 8:43:02 AM    | October 10, 1990, 9:33:00 AM   | .sho       |
| Cyberamics | CEC Christmas '90 Road Stage APS          | {{< wiki-link "CEC Christmas '90 Wave Bday" >}} | October 26, 1990, 9:57:28 AM    | October 27, 1990, 2:09:08 PM   | .roa       |
| Cyberamics | CEC Jan '91 C-Stage APS                   | {{< wiki-link "CEC Jan '91" >}}                 | October 26, 1990, 4:23:30 PM    | November 14, 1990, 12:35:12 PM | .sho       |
| Cyberamics | CEC Birthday Wave Road Stage APS          | \---                                                  | October 28, 1990, 9:35:34 AM    | \---                           | .roa       |
| Cyberamics | CEC Jan '91 Road Stage APS                | {{< wiki-link "CEC Jan '91" >}}                 | October 31, 1990, 3:08:24 PM    | November 4, 1990, 3:23:34 PM   | .roa       |
| 3-Stage    | CEC Jan '91 3-Stage APS                   | {{< wiki-link "CEC Jan '91" >}}                 | December 5, 1990, 3:38:16 PM    | December 6, 1990, 9:21:14 AM   | .sho       |
| Cyberamics | Chuck E. Cheese's Live '90 Road Stage APS | {{< wiki-link "Chuck E Cheese's Live 90" >}}    | December 6, 1990, 4:23:34 PM    | \---                           | .roa       |
| 3-Stage    | Chuck E. Cheese's Live '90 3-Stage APS    | {{< wiki-link "Chuck E Cheese's Live 90" >}}    | December 12, 1990, 4:06:06 PM   | March 21, 1991, 11:35:42 AM    | .sho, .3st |
| Cyberamics | Random Movements APS                      | \---                                                  | December 16, 1990, 10:43:28 AM  | December 16, 1990, 11:25:00 AM | .mvt       |
| Cyberamics | CEC Future C&amp;R APS                    | {{< wiki-link "CEC Future" >}}                  | January 10, 1991, 9:46:14 AM    | January 21, 1991, 9:36:14 AM   | .c&amp;r   |
| Cyberamics | CEC Future Road Stage APS                 | {{< wiki-link "CEC Future" >}}                  | January 14, 1991, 11:55:36 AM   | January 21, 1991, 9:25:46 AM   | .roa       |
| 3-Stage    | CEC Future 3-Stage APS                    | {{< wiki-link "CEC Future" >}}                  | February 7, 1991, 9:04:18 AM    | February 7, 1991, 9:52:42 AM   | .3st       |
| Cabaret    | Beach Bowsers '91 I APS                   | {{< wiki-link "Beach Bowzers '91 I" >}}         | March 1, 1991, 6:23:54 PM       | March 11, 1991, 9:30:26 AM     | .bzr       |
| Cyberamics | Birthday Star '91 C&amp;R APS             | Birthday Star '91                                     | March 13, 1991, 8:36 AM         | March 22, 1991, 5:17:22 PM     | .c&amp;r   |
| Cyberamics | Birthday Star '91 Road Stage APS          | Birthday Star '91                                     | March 13, 1991, 11:07:18 AM     | March 20, 1991, 4:39:42 PM     | .roa       |
| Cyberamics | CEC American Pride Road Stage APS         | {{< wiki-link "CEC American Pride" >}}          | April 10, 1991, 1:55:38 PM      | April 10, 1991, 2:02:28 PM     | .roa       |
| Cyberamics | CEC American Pride C&amp;R APS            | {{< wiki-link "CEC American Pride" >}}          | April 10, 1991, 4:26:06 PM      | April 11, 1991, 3:56:34 PM     | .c&amp;r   |
| 3-Stage    | CEC American Pride 3-Stage APS            | {{< wiki-link "CEC American Pride" >}}          | April 17, 1991, 6:43:20 PM      | April 29, 1991, 11:55:46 AM    | .3st       |
| Cyberamics | CEC TV Classics '91 Road Stage APS        | CEC TV Classics '91                                   | May 21, 1991, 12:57:42 PM       | May 22, 1991 11:41:56 AM       | .roa       |
| Cyberamics | CEC Games Road Stage APS                  | {{< wiki-link "CEC Games" >}}                   | May 30, 1991 2:11:44 PM         | June 9, 1991, 11:59:44 AM      | .roa       |
| Cyberamics | CEC Games C&amp;R APS                     | {{< wiki-link "CEC Games" >}}                   | June 9, 1991, 6:05:36 PM        | June 9, 1991, 6:51:28 PM       | .c&amp;r   |
| 3-Stage    | CEC Games 3-Stage APS                     | {{< wiki-link "CEC Games" >}}                   | June 17, 1991, 5:04:40 PM       | July 3, 1991, 1:50:36PM        | .3st       |
| ???        | TV Intro HLF APS                          | \---                                                  | June 23, 1991, 12:03:02 PM      | \---                           | .hlf       |
| 3-Stage    | September '91 3-Stage APS                 | {{< wiki-link "CEC September 1991 Show" >}}     | June 23, 1991, 5:07:14 PM       | September 10, 1991, 2:06:04 PM | .3st       |
| 3-Stage    | TV Intro 3-Stage APS                      | \---                                                  | June 24, 1991, 3:34:22 PM       | \---                           | .3st       |
| Cyberamics | CEC Xmas '91 C&amp;R APS                  | {{< wiki-link "CEC Xmas 1991 Show" >}}          | August 10, 1991, 11:26:16 AM    | August 14, 1991, 2:26:52 PM    | .c&amp;r   |
| Cyberamics | September '91 C&amp;R APS                 | {{< wiki-link "CEC September 1991 Show" >}}     | August 26, 1991, 10:30:42 AM    | September 6, 1991, 9:38:02 AM  | .c&amp;r   |
| Cyberamics | September '91 Road Stage APS              | {{< wiki-link "CEC September 1991 Show" >}}     | September 6, 1991, 3:16:36 PM   | September 6, 1991, 12:23:12 PM | .roa       |
| Cyberamics | Land Of 1,000 Dances Road Stage APS       | {{< wiki-link "Land Of 1,000 Dances" >}}        | September 13, 1991, 10:56:48 AM | \---                           | .roa       |
| Cyberamics | Land Of 1,000 Dances C&amp;R APS          | {{< wiki-link "Land Of 1,000 Dances" >}}        | September 13, 1991, 2:00:20 PM  | \---                           | .c&amp;r   |
| 3-Stage    | Land Of 1,000 Dances 3-Stage APS          | {{< wiki-link "Land Of 1,000 Dances" >}}        | September 17, 1991, 4:09:34 PM  | \---                           | .3st       |
| Cyberamics | CEC Xmas '91 3-Stage APS                  | {{< wiki-link "CEC Xmas 1991 Show" >}}          | November 1, 1991, 1:08:38 PM    | November 1, 1991, 1:55:32 PM   | .3st       |
| Cyberamics | CEC Xmas '91 Road Stage APS               | {{< wiki-link "CEC Xmas 1991 Show" >}}          | November 1, 1991, 3:56:44 PM    | November 1, 1991, 4:12:08 PM   | .roa       |
| Cyberamics | Taking Care of Business C&amp;R APS       | Taking Care of Business, Rhyming Rap                  | November 5, 1991, 6:49:46 PM    | \---                           | .c&amp;r   |
| Cyberamics | Taking Care of Business Road Stage APS    | Taking Care of Business, Rhyming Rap                  | November 6, 1991, 1:21:52 PM    | \---                           | .roa       |
| 3-Stage    | Taking Care of Business 3-Stage APS       | Taking Care of Business, Rhyming Rap                  | November 12, 1991, 9:48:10 AM   | \---                           | .3st       |
| 3-Stage    | CEC Rock It In Space 3-Stage APS          | {{< wiki-link "CEC Rock It In Space" >}}        | November 22, 1991, 6:13:50 PM   | December 6, 1991, 11:27:54 AM  | .3st       |
| Cyberamics | CEC Rock It In Space Road Stage APS       | {{< wiki-link "CEC Rock It In Space" >}}        | December 9. 1991. 12:11:32 PM   | December 16, 1991, 3:35:28 PM  | .roa       |
| Cyberamics | CEC Rock It In Space C&amp;R APS          | {{< wiki-link "CEC Rock It In Space" >}}        | December 9, 1991, 3:42:06 PM    | December 13, 1991, 10:08:08 AM | .c&amp;r   |
| Cyberamics | Birthday Star '92 C&amp;R APS             | {{< wiki-link "Birthday Star '92" >}}           | January 10, 1992, 2:07:34 PM    | \---                           | .c&amp;r   |
| Cyberamics | Birthday Star '92 Road Stage APS          | {{< wiki-link "Birthday Star '92" >}}           | January 10, 1992, 4:23:02 PM    | \---                           | .roa       |
| 3-Stage    | Birthday Star '92 3-Stage APS             | {{< wiki-link "Birthday Star '92" >}}           | January 20, 1992, 11:03:56 AM   | \---                           | .3st       |
| 3-Stage    | Physical Fitness 3-Stage APS              | {{< wiki-link "Physical Fitness" >}}            | January 30, 1992, 11:15:36 AM   | February 9, 1992, 9:56:02 AM   | .3st       |
| Cyberamics | Physical Fitness C&amp;R APS              | {{< wiki-link "Physical Fitness" >}}            | February 13, 1992, 10:54:52 AM  | February 18, 1992, 11:36:40 AM | .c&amp;r   |
| Cyberamics | Physical Fitness Road Stage APS           | {{< wiki-link "Physical Fitness" >}}            | February 19, 1992, 11:45:26 AM  | February 19, 1992, 6:36:34 PM  | .roa       |
| Cyberamics | Havin' A Party C&amp;R APS                | Havin' A Party                                        | March 20, 1992, 10:43:44 AM     | \---                           | .c&amp;r   |
| 3-Stage    | Havin' A Party R12 APS                    | Havin' A Party                                        | March 20, 1992, 3:54:44 PM      | \---                           | .r12       |
| Cyberamics | Havin' A Party 3-Stage APS                | Havin' A Party                                        | March 23, 1992 12:01:58 PM      | \---                           | .3st       |
| 3-Stage    | Dance to the Music 3-Stage APS            | {{< wiki-link "Dance To The Music" >}}          | March 26, 1992, 10:55:08 AM     | \---                           | .3st       |
| Cyberamics | Dance to the Music C&amp;R APS            | {{< wiki-link "Dance To The Music" >}}          | March 27, 1992, 2:42:44 PM      | \---                           | .c&amp;r   |
| Cyberamics | Dance to the Music R12 APS                | {{< wiki-link "Dance To The Music" >}}          | March 28, 1992, 11:36:00 AM     | \---                           | .r12       |
| Cyberamics | Environment '92 C&amp;R APS               | {{< wiki-link "Environment '92" >}}             | March 30, 1992, 2:30:40         | April 5, 1992, 4:45:36 PM      | .c&amp;r   |
| Cyberamics | Environment '92 R12 APS                   | {{< wiki-link "Environment '92" >}}             | April 6, 1992, 11:32:50 AM      | April 8, 1992, 9:27:20 AM      | .r12       |
| 3-Stage    | Environment '92 3-Stage APS               | {{< wiki-link "Environment '92" >}}             | April 10, 1992, 2:25:02 PM      | April 18, 1992, 2:48:26 PM     | .3st       |
| Cyberamics | Children of America '92 C&amp;R APS       | {{< wiki-link "Children of America '92" >}}     | June 3, 1992, 3:18:08 PM        | June 9, 1992, 9:30:36 AM       | .c&amp;r   |
| Cyberamics | Children of America '92 R12 APS           | {{< wiki-link "Children of America '92" >}}     | June 3, 1992, 8:37:02 PM        | June 9, 1992, 3:21:46 PM       | .r12       |
| 3-Stage    | Children of America '92 3-Stage APS       | {{< wiki-link "Children of America '92" >}}     | June 12, 1992, 10:48:18 AM      | June 18, 1992, 3:05:12 PM      | .3st       |
| 3-Stage    | Walking On Sunshine 3-Stage APS           | Walking On Sunshine                                   | July 8, 1992, 2:13:32 PM        | \---                           | .3st       |
| Cyberamics | Walking On Sunshine C&amp;R APS           | Walking On Sunshine                                   | July 13, 1992, 8:58:28 AM       | \---                           | .c&amp;r   |
| Cyberamics | Walking On Sunshine R12 APS               | Walking On Sunshine                                   | July 13, 1992, 2:04:54 PM       | \---                           | .r12       |
| 3-Stage    | Working For A Living 3-Stage APS          | {{< wiki-link "Working For A Living" >}}        | July 24, 1992, 3:04:22 PM       | August 14, 1992, 12:55:48 PM   | .3st       |
| Cyberamics | Working For A Living C&amp;R APS          | {{< wiki-link "Working For A Living" >}}        | August 17, 1992, 3:57:38 PM     | August 23, 1992, 11:05:40 AM   | .c&amp;r   |
| Cyberamics | Working For A Living R12 APS              | {{< wiki-link "Working For A Living" >}}        | August 20, 1992, 4:29:42 PM     | August 24, 1992, 11:19:52 AM   | .r12       |