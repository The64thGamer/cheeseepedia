+++
title = "Chuck E. Cheese's Memory Match"
draft = false
tags = ["Arcade Games"]
categories = ["Chuck E. Cheese's"]


startDate = ""
endDate = "0000-00-00"
contributors = ["The 64th Gamer","Himitsu","DerpJobi","GuestIsJustBest","Stripes"]
citations = []
downloadLinks = ["Cecmatch.zip"]
+++

***Chuck E. Cheese's Memory Match*** is a custom arcade game by [*Coastal Amusements*](https://coastalamusements.com/) made for {{< wiki-link "Chuck E Cheese's" >}} locations in 1993. The game is a standard design arcade cabinet for the time, with artwork of the main Chuck E. cast all around the sides. The game is displayed on a CRT monitor, with two speakers using mono audio output. The control panel consists of nine numbered buttons, which can light up during gameplay. The game required tokens to play, and would dispense tickets at the end of a session. The game used *HAR MadMax hardware*, The cabinet would also see a Spanish release, replacing the Memory Match logo on the control board for a set of instructions.

## Gameplay

The game is a standard memory matching game. Instead of matching 2 hidden objects on the same board however, you only need to match one to the current character on-screen, giving the player double the chances of a correct choice. Nine buttons are available for the player, each to pick which character curtain to unveil. The game dispenses tickets based on how many matches can be made before the time runs out.

## Updated Cabinet

Around 2000-2001, new cabinets produced would contain updated artwork to match the current branding at the time. The marquee, monitor plexi, and control panel would update Chuck E.'s design to the current style, while leaving the rest of the characters the same. All logos and branding were also changed to match the current style. The control panel would see additional changes, scaling up the character artwork, and moving the copyrighted text towards the buttons, removing the '1992' artwork copyright date seen on the original cabinet.

## Flintstones

[*Coastal Amusements*](https://coastalamusements.com/) would later use the cabinet and software as their base for the *Fred Flintstone's Memory Match* machine in 1994. Coincidentally, or due to relations between the companies, the Flintstone's game would appear on the 1997 *Studio C Console* for the left and right monitors. Oddly, the only footage of this shows the language in Chinese, whether due to a mismatched rom, or a specific change by a store technician.

## Voices

All characters are voiced in the game, commenting briefly on the player's actions. Chuck E. also reminds the player to take out their tickets at the end of the game. Scott Wilson, the voice of Chuck E. Cheese at the time, voices all male characters in the game, filling in Bob West's role for Jasper T. Jowls and Pasqually. Helen Henny is voiced by Karisa Mckinney, her current voice actress at the time.

## ROMs

#### Main CPU Program ROM

- *prog0.104* - Program 0
- *prog1.103* - Program 1

#### Audio CPU Program ROM

- *prog.102*

#### Art ROMs

- *art-rom.123*
- *art-rom.127*
- *art-rom.125*

#### BSMT2000 Sample ROMs

- *arom0*
- *arom1*
- *arom2*
- *arom3*

#### Palette ROMs

- *0.144*
- *0.145*

## ROM Strings

All *arom* ROMs contain a string leftover from the toolset used to create them.

```
C:\SOUND\TOOLS\MAKEROM.EXE
cheese.spc
```

*prog.102* contains system information

```
MAD MAX Sound\Novelty Game Operating System
rev. 2.0
2-18-92
```

A set of strings can be found in the ROMs, which are mainly used in the debug menu.

```
%d%dAudits
Adjustments
Diagnostics
A Message from Dave
Return to Game
EXIT
EXIT -
Save Changes
EXIT -
Cancel
Changes
Main Menu
A message from Dave...'Just say 'No, thank you' to drugs!'
%3d%3d%5u%5d%8ld%8ld%6.2f%c
RAM Test
Program ROM
TestSwitch
TestLamp
TestMonitor
AdjustInspect
Graphics
ROMsSound
TestDisplay
EEPROM
Dispense a Ticket
DiagnosticsRAM
TestRAM
Test in progress...
Passed.
Failed at %p
Press center button to exit.
ROM Test
ROM Test in progress...
Passed.
Failed.
calculated checksum = %04X%04Xstored
checksum = %04X%04X
Press center button to exit.
Display Entire GROM space
U126    U127    U128    U129
U122    U123    U124    U125
Press center button to exit.
Use buttons to scroll.
Press center button to exit.
Use buttons to scroll.
Press center button to exit.
Use buttons to scroll.
Press center button to exit.
Use buttons to scroll.
Press center button to exit.
Use buttons to scroll.
Press center button to exit.
Press center button to exit.
Lamp Test
Press center button to exit.
Switch Test
Button 1    :
Button 2    :
Button 3    :
Button 4    :
Button 5    :
Button 6    :
Button 7    :
Button 8    :
Button 9    :
ON
OFF
Left Coin   :
ON
OFF
Right Coin  :
ON
OFF
Service     :
ON
OFF
Ticket Opto : \
ON
OFF
Volume Up   :
ON
OFF
Volume Down :
ON
OFF
Press TEST button to exit.
Sound Test
Playing Sound %u
Press center button to exit.
Sound Test
Playing Sound %u
Press center button to exit.
Sound Test
Playing Sound %u
Press center button to exit.
EEPROM Contents%04X
Press center button to exit.
CoinsLeft    :
Right   :
Total   :
LifetimePeriod
Clear
Lifetime Audits
Clear
Period Audits
TicketsTotal   :
Average :
Games Played
Audits20
Seconds25
Seconds30
Seconds35
Seconds40
Seconds45
Seconds50
Seconds55
Seconds60
SecondsGame
TimeTickets :
No MatchesTickets :
1  MatchTickets :
2  MatchesTickets :
3  MatchesTickets :
4  MatchesTickets :
5  Matches
Coins Per Credit
COINS PER CREDIT = 0 FOR FREE PLAY
FREE PLAY DISABLES TICKET DISPENSER
Ticket Payouts \
CreditsEvery
CycleEvery 2
CyclesEvery 3
CyclesEvery 5
CyclesNever
Attract Mode Sounds
Attract Mode Sounds
Sound Volume
Ticket Payouts \
CreditsGame
TimeCurtain
Mode
All lamps during game
Restore Factory Settings
Adjustments* *               *
Adjust Sound Volume
Use + and - to adjust volume.
Press center button to exit.
%5d%5d%5d%5d%5d%5d%5d
Restore Factory Settings
Coins Per Credit     = %5d
Attract Sounds       = %5d
Game Time            = %5d
Tickets : No Matches = %5d
Tickets : 1  Match   = %5d
Tickets : 2  Matches = %5d
Tickets : 3  Matches = %5d
Tickets : 4  Matches = %5d
Tickets : 5  Matches = %5d
Curtain Mode         = %5d
All lamps during game= %5d
Press test button to accept.
Press center button to cancel.
```

## Technical

The graphics hardware is capable of 8bpp RGB655 color from any one of 256 palettes in ROM. Palettes are selected per-image. Most, if not all blitter palette select writes appear to be from $00891e and $0089b8 which are in cases in a jumptable in the routine at $00881a. Tracing code execution back from the function which calls this ($0087b0) may lead to code which looks up images from an image table, which would be useful for automatic programmatic dumping of images. If there is no table, it would be a case of needing to observe every single image (or find the relevant code) to determine the proper palette to use. Most of the available palette space in the ROMs is unused. Audio is handled by a BSMT2000 DSP. Data in the audio ROMs is stored in signed 8-bit PCM format at a nominal sample rate of 12kHz.

## Parts / Cabinet

## Owners / Locations

| Location / Owner    | Address | Condition                                                | Notes                                          |
|---------------------|---------|----------------------------------------------------------|------------------------------------------------|
| The Arcade Boneyard |         | Dismantled. Outer pieces remaining. Electronics removed. | Can be bought on http://thearcadeboneyard.com/ |