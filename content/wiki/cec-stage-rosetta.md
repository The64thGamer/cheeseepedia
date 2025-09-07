+++
title = "CEC-Stage Rosetta"
draft = false
tags = ["Programming Systems"]
categories = ["Chuck E. Cheese's"]


startDate = ""
endDate = ""
contributors = ["The 64th Gamer","Ceclife13","ShowBizMidwest","Documentor","CEC Tinley","Bullseye123"]
citations = []
+++

***CEC-Stage Rosetta*** was a special software created by *Dave Philipson* in 1997 used to translate programming from the 3-Stage to the {{< wiki-link "Cyberamics" >}} stage. This was done to reduce unneeded programming of characters across both stages and began use in the {{< wiki-link "August 1997 Show" >}} showtape. The name *CEC-Stage Rosetta* was used as the software could be described as 'Translating' the programming information from the 3-Stage {{< wiki-link "Bit Chart" >}} to the {{< wiki-link "Cyberamics" >}} equivalent bits.

## Conversion Process

The conversion process can be reverse engineered by comparing multiple showtapes' signals from both stages. Given this, showtapes where signal data is lost or private for CEC-Stage can be recreated from the official conversion chart, assuming no bugs or additional programming wasn't added in the official release. Bits will be named and numbered by their conversion to the ***Road, 1 + 2*** {{< wiki-link "Bit Chart" >}} format. Other Cyberamic stages before the creation of the *CEC-Stage Rosetta* software would be using the bits for different purposes.

### Top Drawer

| Group      | 3ST Bit | 3ST Movement       | CEC Bit | CEC-Stage Movement               | Invert Signal |
|------------|---------|--------------------|---------|----------------------------------|---------------|
| Chuck      | 1       | Mouth              | 1       | Mouth                            |               |
| Chuck      | 2       | Left Eyelid        | 6       | Eyelids                          | Yes           |
| Chuck      | 3       | Right Eyelid       |         |                                  |               |
| Chuck      | 4       | Eyes Left          | 8       | Eyes Left                        |               |
| Chuck      | 5       | Eyes Right         | 5       | Eyes Right                       |               |
| Chuck      | 6       | Head Left          | 2       | Head Left                        |               |
| Chuck      | 7       | Head Right         | 3       | Head Right                       |               |
| Chuck      | 8       | Head Up            | 4       | Head Up                          | Yes           |
| Chuck      | 9       | Left Ear           |         |                                  |               |
| Chuck      | 10      | Right Ear          |         |                                  |               |
| Chuck      | 11      | Left Arm Raise     |         |                                  |               |
| Chuck      | 12      | Left Arm Twist     |         |                                  |               |
| Chuck      | 13      | Left Elbow         |         |                                  |               |
| Chuck      | 14      | Body Left          |         |                                  |               |
| Chuck      | 15      | Body Right         |         |                                  |               |
| Chuck      | 16      | Body Lean          |         |                                  |               |
| Chuck      | 17      | Right Arm Raise    |         |                                  |               |
| Chuck      | 18      | Right Arm Twist    |         |                                  |               |
| Chuck      | 19      | Right Elbow        | 7       | Right Arm                        |               |
| *(Unused)* | 20      | *(Unused)*         |         |                                  |               |
| Pasqually  | 21      | Head Right         | 35      | Head Right                       |               |
| Pasqually  | 22      | Head Up            |         |                                  |               |
| *(Unused)* | 23      | *(Unused)*         |         |                                  |               |
| *(Unused)* | 24      | *(Unused)*         |         |                                  |               |
| Pasqually  | 25      | Head Left          | 34      | Head Left                        |               |
| Pasqually  | 26      | Left Eyelid        | 38      | Eyelids                          | Yes           |
| Pasqually  | 27      | Right Eyelid       |         |                                  |               |
| Pasqually  | 28      | Eyes Left          | 40      | Eyes Left                        |               |
| Pasqually  | 29      | Eyes Right         | 37      | Eyes Right                       |               |
| Pasqually  | 30      | Mouth              | 33      | Mouth                            |               |
| Pasqually  | 31      | Right Elbow        | 39      | Right Hand                       | Yes           |
| Pasqually  | 32      | High Hat           |         |                                  |               |
| Pasqually  | 33      | Left Arm Swing     |         |                                  |               |
| Pasqually  | 34      | Right Arm Swing    |         |                                  |               |
| Pasqually  | 35      | Left Elbow         | 36      | Left Arm                         | Yes           |
| *(Unused)* | 36      | *(Unused)*         |         |                                  |               |
| *(Unused)* | 37      | *(Unused)*         |         |                                  |               |
| Props      | 38      | Building Mouth     |         |                                  |               |
| Props      | 39      | Building Up        |         |                                  |               |
| Props      | 40      | Dual Pressure Reg. |         |                                  |               |
| Munch      | 41      | Left Eyelid        | 54      | Eyelids                          | Yes           |
| Munch      | 42      | Right Eyelid       |         |                                  |               |
| Munch      | 43      | Eyes Left          | 56      | Eyes Left                        |               |
| Munch      | 44      | Eyes Right         | 53      | Eyes Right                       |               |
| Munch      | 45      | Mouth              | 49      | Mouth                            |               |
| Props      | 46      | Moon Mouth         |         |                                  |               |
| Props      | 47      | Moon Up            |         |                                  |               |
| *(Unused)* | 48      | *(Unused)*         |         |                                  |               |
| Props      | 49      | Wink               | 10      | Wink                             |               |
| Props      | 50      | Baby Munch         |         |                                  |               |
| Munch      | 51      | Head Tilt Left     |         |                                  |               |
| Munch      | 52      | Head Tilt Right    |         |                                  |               |
| Munch      | 53      | Head Up            |         |                                  |               |
| Munch      | 54      | Head Left          | 50      | Head Left                        |               |
| Munch      | 55      | Head Right         | 51      | Head Right                       |               |
| *(Unused)* | 56      | *(Unused)*         |         |                                  |               |
| Munch      | 57      | Left Arm Swing     |         |                                  |               |
| Munch      | 58      | Right Arm Swing    |         |                                  |               |
| Munch      | 59      | Left Elbow         | 52      | Left Arm                         | Yes           |
| Munch      | 60      | Right Elbow        | 55      | Right Arm                        | Yes           |
| Munch      | 61      | Foot Tap           |         |                                  |               |
| Munch      | 62      | Body Lean          |         |                                  |               |
| *(Unused)* | 63      | *(Unused)*         |         |                                  |               |
| Pasqually  | 64      | Body Lean          |         |                                  |               |
| *(Unused)* | 65      | *(Unused)*         |         |                                  |               |
| Organ      | 66      | Top Blue           |         |                                  |               |
| Organ      | 67      | Top Red            | 110     | Organ Face 1                     |               |
| Organ      | 68      | Top Amber          | 108     | Organ Face 2                     |               |
| Organ      | 69      | Top Green          |         |                                  |               |
| *(Unused)* | 70      | *(Unused)*         |         |                                  |               |
| Organ      | 71      | Top Leg            | 101     | Helen Building/Organ Leg Outer   |               |
| Organ      | 72      | Middle Leg         | 106     | Jasper Building/Organ Leg Middle |               |
| Organ      | 73      | Bottom Leg         | 111     | Organ Leg Inner                  |               |
| Organ      | 74      | Continuous Strobe  |         |                                  |               |
| Organ      | 75      | Flash Stobe        |         |                                  |               |
| Sign       | 76      | Inner Group        |         |                                  |               |
| Sign       | 77      | Middle Group       | 126     | MMBB Sign                        |               |
| Sign       | 78      | Outer Group        |         |                                  |               |
| Sign       | 79      | Continuous Strobe  |         |                                  |               |
| Sign       | 80      | Flash Strobe       |         |                                  |               |
| Spots      | 81      | Wink               | 123     | Wink Spot                        |               |
| Spots      | 82      | Jasper             | 107     | Jasper Spot                      |               |
| Spots      | 83      | Camera             |         |                                  |               |
| Spots      | 84      | Pasqually          | 100     | Pasqually Spot                   |               |
| Spots      | 85      | Munch              | 109     | Munch Spot                       |               |
| Spots      | 86      | Helen              | 102     | Helen Spot                       |               |
| Spots      | 87      | Helicopter Light   | 122     | Helicopter/Gemini                |               |
| Spots      | 88      | Chuck              | 104     | Chuck Spot                       |               |

### Bottom Drawer

| Group           | 3ST Bit | 3ST Movement         | CEC Bit | CEC-Stage Movement      | Invert Signal |
|-----------------|---------|----------------------|---------|-------------------------|---------------|
| Jasper          | 1       | Left Eyelid          | 22      | Eyelids                 | Yes           |
| Jasper          | 2       | Right Eyelid         |         |                         |               |
| Jasper          | 3       | Eyes Cross           |         |                         |               |
| Jasper          | 4       | Guitar Slide         |         |                         |               |
| Jasper          | 5       | Guitar Raise         |         |                         |               |
| Jasper          | 6       | Head Left            | 18 + 24 | Head Left + Eyes Left   |               |
| Jasper          | 7       | Head Right           | 19 + 21 | Head Right + Eyes Right |               |
| Jasper          | 8       | Head Up              | 20      | Head Up                 | Yes           |
| Jasper          | 9       | Left Leg Raise       |         |                         |               |
| Jasper          | 10      | Right Leg Raise      |         |                         |               |
| Jasper          | 11      | Right Arm Raise      |         |                         |               |
| Jasper          | 12      | Right Arm Twist      |         |                         |               |
| Jasper          | 13      | Right Elbow Twist    | 23      | Strum                   |               |
| Jasper          | 14      | Right Wrist          |         |                         |               |
| Jasper          | 15      | Body Lean            |         |                         |               |
| Jasper          | 16      | Mouth                | 17      | Mouth                   |               |
| Camera          | 17      | Mouth                |         |                         |               |
| Helen           | 18      | Right Arm Raise      |         |                         |               |
| Helen           | 19      | Right Elbow          | 71      | Right Arm               |               |
| Helen           | 20      | Right Arm Twist      |         |                         |               |
| Camera          | 21      | Head Right           |         |                         |               |
| Camera          | 22      | Head Raise           |         |                         |               |
| Helen           | 23      | Left Arm Raise       |         |                         |               |
| Helen           | 24      | Left Elbow           |         |                         |               |
| Helen           | 25      | Left Arm Twist       |         |                         |               |
| Helen           | 26      | Left Ear             |         |                         |               |
| Helen           | 27      | Right Ear            |         |                         |               |
| Helen           | 28      | Head Left            | 66      | Head Left               |               |
| Helen           | 29      | Head Right           | 67      | Head Right              |               |
| Helen           | 30      | Head Up              | 68      | Head Up                 | Yes           |
| Helen           | 31      | Left Eyelid          | 70      | Eyelids                 | Yes           |
| Helen           | 32      | Right Eyelid         |         |                         |               |
| Helen           | 33      | Eyes Left            | 72      | Eyes Left               |               |
| Helen           | 34      | Eyes Right           | 69      | Eyes Right              |               |
| Helen           | 35      | Mouth                | 65      | Mouth                   |               |
| Helen           | 36      | Body Turn Left       |         |                         |               |
| Helen           | 37      | Body Turn Right      |         |                         |               |
| Helen           | 38      | Body Lean            |         |                         |               |
| *(Unused)*      | 39      |                      |         |                         |               |
| *(Unused)*      | 40      |                      |         |                         |               |
| Camera          | 41      | Left Eyelid          |         |                         |               |
| Camera          | 42      | Right Eyelid         |         |                         |               |
| Camera          | 43      | Eyescross            |         |                         |               |
| *(Unused)*      | 44      | *(Unused)*           |         |                         |               |
| *(Unused)*      | 45      | *(Unused)*           |         |                         |               |
| *(Unused)*      | 46      | *(Unused)*           |         |                         |               |
| *(Unused)*      | 47      | *(Unused)*           |         |                         |               |
| *(Unused)*      | 48      | *(Unused)*           |         |                         |               |
| *(Unused)*      | 49      | *(Unused)*           |         |                         |               |
| *(Unused)*      | 50      | *(Unused)*           |         |                         |               |
| *(Unused)*      | 51      | *(Unused)*           |         |                         |               |
| *(Unused)*      | 52      | *(Unused)*           |         |                         |               |
| *(Unused)*      | 53      | *(Unused)*           |         |                         |               |
| *(Unused)*      | 54      | *(Unused)*           |         |                         |               |
| *(Unused)*      | 55      | *(Unused)*           |         |                         |               |
| *(Unused)*      | 56      | *(Unused)*           |         |                         |               |
| *(Unused)*      | 57      | *(Unused)*           |         |                         |               |
| *(Unused)*      | 58      | *(Unused)*           |         |                         |               |
| *(Unused)*      | 59      | *(Unused)*           |         |                         |               |
| *(Unused)*      | 60      | *(Unused)*           |         |                         |               |
| *(Unused)*      | 61      | *(Unused)*           |         |                         |               |
| *(Unused)*      | 62      | *(Unused)*           |         |                         |               |
| *(Unused)*      | 63      | *(Unused)*           |         |                         |               |
| House Lights    | 64      | House Lights         | 73      | Dimmer                  |               |
| *(Unused)*      | 65      | *(Unused)*           |         |                         |               |
| Flood Lights    | 66      | Stage Right Blue     |         |                         |               |
| Flood Lights    | 67      | Stage Right Green    |         |                         |               |
| Flood Lights    | 68      | Stage Right Amber    |         |                         |               |
| Flood Lights    | 69      | Stage Right Red      |         |                         |               |
| Special Effects | 70      | Star Burst           | 103     | Chuck Star/Rope Lights  |               |
| Flood Lights    | 71      | Center Stage Blue    | 119     | Blue Overhead           |               |
| Flood Lights    | 72      | Live Floods          | 97      | Live Floods             |               |
| Flood Lights    | 73      | Center Stage Amber   | 117     | Amber Overhead          |               |
| Flood Lights    | 74      | Center Stage Red     | 118     | Red Overhead            |               |
| Special Effects | 75      | Fiber Optic Curtain  | 121     | Fiber Optic Curtain     |               |
| Flood Lights    | 76      | Stage Left Blue      | 127     | CEC Backdrop Blue       |               |
| Flood Lights    | 77      | Stage Left Green     |         |                         |               |
| Flood Lights    | 78      | Stage Left Amber     | 116     | CEC Backdrop Amber      |               |
| Flood Lights    | 79      | Stage Left Red       | 120     | CEC Backdrop Red        |               |
| Special Effects | 80      | Red Snare/Pasqually  |         |                         |               |
| Special Effects | 81      | Green Backdrop       |         |                         |               |
| Special Effects | 82      | Yellow Backdrop      | 113     | Amber Backdrop          |               |
| Special Effects | 83      | Red Buildings        |         |                         |               |
| Special Effects | 84      | Blue Backdrop        | 115     | Blue Backdrop           |               |
| Special Effects | 85      | Red Backdrop         | 114     | Red Backdrop            |               |
| Special Effects | 86      | Red                  |         |                         |               |
| Special Effects | 87      | Blue                 |         |                         |               |
| Special Effects | 88      | Building Spot        |         |                         |               |
| Special Effects | 89      | Moon Spot            |         |                         |               |
| Special Effects | 90      | Baby Munch Spot/Gobo | 124     | CEC Gobo                |               |
| Special Effects | 91      | Yellow Kick Drum     | 99      | Pasqually Drum          |               |
| Special Effects | 92      | Red Backdrop         |         |                         |               |
| Special Effects | 93      | Blue Backdrop        |         |                         |               |
| Special Effects | 94      | CEC Neon Sign        | 105     | CEC Neon/Fiber Optic    |               |
| Special Effects | 95      | Star Tips Blue/Juke  | 125     | Jukebox Top             |               |
| Special Effects | 96      | Guitar Spot          |         |                         |               |