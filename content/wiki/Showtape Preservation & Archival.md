+++
title = "Showtape Preservation & Archival"
draft = false
tags = [ ]
date = 2021-12-06T00:14:35Z

[Article]
contributors = ["Himitsu","The 64th Gamer","Nebbytales","Ls2018-1","2600:1700:F731:2980:B150:72D8:193D:BC72"]
gallery = []
+++
This page details some rough guidelines to follow when preserving data of various types.

Please feel free to contact D3 for assistance with preserving any type of media. We're happy to help!

## Audio ##
### CD ###
CDs are by far the easiest format to rip. They should be ripped using a high quality program, preferably Exact Audio Copy. The target audio format should be a single file in a lossless format (WAV or FLAC), with a cue sheet. This ensures the information on gaps between tracks is preserved. The audio file and cue sheet can later be split into individual files for normal playback in media players. Do not apply any normalization or other processing (ReplayGain tagging is OK).
### Cassette tape ###
Most cassette media is in standard 2-channel per side format and can be ripped using consumer equipment. It's important to use a high quality cassette deck - all new modern decks sold are of poor quality and will result in poor quality rips. A good name brand component deck from the 80s or 90s is preferred, especially if it has been serviced recently and is verified to run at the correct speed. Speed test tapes are available via eBay and other outlets.
3- and 4-channel per side tapes require the use of special decks. Contact D3 for assistance with these.
### Open reel tape ###
TODO, but largely the same rules as cassette applies.
### MiniDisc ###
MiniDisc can be a frustrating format to deal with due to Sony's insistence on heavy-handed copy protection. MDs which have been recorded directly on the device and not transferred via NetMD can have the data copied directly to the PC using a supported player (MZ-RH1, MZ-M200). Other players are not capable of this, and the best option for ripping is an optical output if available, and analog output if not.
### Vinyl records ###
### Notes on audio input ###
Do a dry run and make a test recording of the media before you do your final rip. Make sure that the audio levels are strong, but never clip. A good target is to have the absolute loudest peaks of the audio registering around -6dBFS in the recording software. This ensures a good signal to noise ratio without the risk of clipping. If the audio level is too low, it can be amplified later in software, but amplifying very quiet audio will result in additional noise.
When ripping from analog media, it's important to use a good quality audio interface. The line input on a PC is usually good enough quality for 2-channel content, but make a test recording of a few seconds without the source device playing, to ensure there isn't any excessive background noise, as this is a common issue on built-in inputs. Also be aware that many PCs have removed the line input and may only offer a microphone input -- this is not the same as a proper line input, as it works at different signal levels, supplies bias power for the microphone, may be mono, etc.
On formats that use more than 2 channels, please do not be tempted to make separate rips 2 channels at a time -- purchase a proper interface that supports enough simultaneous channels and _always rip all channels simultaneously_. Ripping the same tape multiple times and combining the files later will cause timing issues.
**Recommended USB audio interfaces**, with good performance for the cost:
***2-channel (budget)**: Behringer UCA202/UCA222
***2-channel**: Behringer UMC202HD, Focusrite Scarlett 2i2
***4-channel**: Behringer UMC404HD, MOTU M4
### Notes on audio post-processing ###
The goal is to preserve the signal in the most raw form possible, which provides the best basis for any further restoration or cleanup efforts. It's okay to make processed versions of audio, for example to add EQ or reduce noise, but please save and provide the original unmodified files as well.
### Notes on noise reduction ###
Many tape-based formats use various noise reduction systems, such as Dolby or DBX. If noise reduction is used, it is preferable to make separate rips both with and without noise reduction enabled on the deck. Note this does not apply to Dolby HX/HX Pro as this system is applied at record time only, and is not decoded upon playback.
### Notes on tape ###
Please clean all parts in the tape path before each recording. This includes the playback head, pinch roller, and capstan. 90% or higher isopropyl alcohol and a Q-tip is suitable for heads and the capstan. 

## Video ##
### DVD ###
Correctly preserving DVDs can be done in multiple ways, and the available options depend on the type of disc. DVDs without copy protection (such as Chuck E Cheese showtapes) can simply be ripped to an ISO and this is the preferred method. DVDs with copy protection need special handling - TODO.
### VHS/Beta ###
TODO. Add note about capturing all 4 audio channels simultaneously on VHS era CEC showtapes.
### LaserDisc ###
Domesday Duplicator is the way to go here. TODO.

## Data ##
### CD-ROM/DVD-ROM ###
TODO. ISO is good enough if there is no copy protection.
### Floppy ###
TODO. Use a good drive, save multiple separate copies if there are read errors, try cleaning heads. Most of our knowledge applies to 3.5' HD disks, 5.25' stuff is not really seen.
### USB, SD card, hard drive ###
TODO. Images always preferred rather than simple copies of files. Best to do under Clonezilla or something that won't mount it and spray random files all over the disk (Windows likes to add 'System Volume Information' directories, Mac OS adds DS_Store, etc)
### ROM/EPROM/EEPROM/Flash/etc ###
TODO. TL866ii is a good general purpose programmer to dump ROMs. NEVER remove stickers over UV erasure windows! Make multiple dumps and make sure they match. Include a photo of the device itself and its location and refdes in the device, any labels, etc.

## Printed material ##
### Photos ###
TODO.
### Newspaper articles, magazine clippings, etc ###
TODO.
### Posters ###
TODO. Maybe some notes on how to handle large items that can't fit in normal scanners.
### General notes ###
TODO. Worth mentioning that scans should note the DPI it was scanned at so the exact physical size can be determined from the size in pixels (or use PDF or a format that preserves this info). Also don't use any auto rotation correction as it might be using lower quality rotation algorithms.

## Other ##
TODO. Maybe some notes about 3D scanning photogrammetry stuff, how to take good photos of bot mechanisms (include some object for scale, multiple angles, etc).