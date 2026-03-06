+++
title = "CEI Apple II Programmer"
draft = false
tags = ["Programming Systems"]
categories = ["Creative Engineering"]
startDate = ""
endDate = ""
contributors = ["The 64th Gamer","Ls2018","Ls2018"]
citations = []
pageThumbnailFile = "2Zc4xcSjZjfa5vgnwKA6.avif"
+++
The ***CEI Apple II Programming System* is a collection of programming software used to program *Rock-afire Explosion* shows starting around 1982, and continuing to present day to some capacity, with some functions being supplanted by the RAE Show Programmer.
The original prototype of this system was designed and written around early 1982 by Aaron Fechter for the Apple II+ after his dissatisfaction with his engineers' attempts to replace the CEI Multitrack Programmer with a logic gate-based programmer, citing an overly complex design that is nearly impossible to troubleshoot. The software was improved upon by other programmers through the years to add features and simplify operation, with major upgrades coming in 1983 following the release of the Apple IIe, utilizing its superior hardware capabilities. The current and final iteration (7.02) was completed around 1993.**

## Programmer

Several branches of Programmer are known to exist. The most familiar branch is designed for programming the classic Rock-afire, but branches also exist for programming the New Rock-afire, the Mijjin show, and the {{< wiki-link "Hard Luck Bears" >}} show at Knoebels. Because of a lack of need, the Mijjin and Knoebels branches were never upgraded to version 7.02 and are lacking some features that were introduced later on.

### Data storage

For most of the life of Programmer, programming data was stored on double sided, double density 8' floppy disks. Sometime in the mid-90s, hardware and software changes were finally performed to allow a transition to high density 3.5' floppy disks. The software routines and hardware designs permitting this change were taken directly from Aaron Fechter's Anti Gravity Freedom Machine which also used a high density 3.5' floppy drive. The support for 8' floppies was not removed in the main branch of Programmer with the upgrade to 3.5' floppies and both formats can be used simultaneously, permitting the transfer of data between both floppy formats and hassle-free loading of older shows. The New Rock-afire branch of Programmer did remove the ability to directly load from and save to 8' floppies both because reverse compatibility would not be required for a brand new stage type and because the menu space occupied by 8' floppy functions was needed for Mijjin-specific features. Because the use of 3.5' floppies was not common due to its late introduction, it is not being discussed in the following content.
Usually, a box of floppies would be emptied and repurposed to correspond to a specific show tape. Each song would be stored on its own floppy disk and kept in the box dedicated to the corresponding show tape. As a backup measure, two identical copies of the same data would be stored on two different floppy disks. One would be labeled 'master' and one as 'copy'. The data contained on these floppies is identical; the only difference is the designation listed on the label. Sometimes the master and copy floppies would be kept in the same box, but more often, they were stored in separate boxes to prevent a scenario where a lost box of floppies would result in both copies being lost. Each song or show tape had a corresponding tape with the stereo mix of the show and a block number track for time reference. The programming tape and floppy always had to be kept together and were regarded as having equal value since it would be impossible to remake a programming tape because of the necessity of consistent, identical block number placement in sync with the show audio. Master and backup copies of the programming tape were usually kept as well.
TODO: Basic information, user input, cassette control, show data raw format, lesser known features

## Block Number Reader

The Block Number Reader program decodes a proprietary time code signal, known as Block Numbers, which was originally dubbed onto the third or fourth track of a four-track audio cassette or reel-to-reel tape that also contained the audio for the show on the first two tracks. More recently, the audio and block numbers are contained in audio file played from a Windows PC.
Basic Block Number decoding takes place in hardware on a custom Apple II interface card, with final processing taking place within the software. Prior to transmission to the programmer computer, software algorithms detect and correct errors in the decoded Block Number, usually caused by physical deformities of the cassette tape, to prevent dropouts during programming. Once decoded and corrected where necessary, Block Numbers are transmitted to the main programmer computer through the use of two custom interface cards, one in each Apple IIe. Two computers were used because speed limitations of computers of the early 1980's prevented one computer from being able to decode Block Numbers and handle all other programming functions simultaneously.
Included on the same floppy disk is a 'Block Number Generator' program which is used when creating a programming audio cassette. Early versions of the Block Number Reader operated like normal Apple II programs, but later versions from the late 80's through the 90's were wrapped in the Apple II version of the Anti Gravity Freedom Machine operating system and require a CEI light pen with accompanying interface card to select menu options.
