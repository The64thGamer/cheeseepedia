+++
title = "3-Stage Command Format"
draft = false
tags = [ ]

[Article]
contributors = ["The 64th Gamer","Ls2018-1"]
gallery = []
+++
## Post-93 Bit Shift## 
In May of 1993, starting with the [\2](\1) EPROM chips to read the shifted data. This would be done to invalidate all previous shows from being played.

The format for this shift was applying an XOR mask to the second byte of the movement controls, being XOR 0x1F. This is the same operation for converting pre-93 signals to post-93, and decoding post-93 signals back.
 Example:
 A movement command, 0x1@ is provided. XOR-ing the second byte, '@', with 0x1F will provide '_', making the new command 0x1_. XOR-ing '_' once again will return it to being '@'.