+++
title = "Biphase Cyberstar Data Format"
draft = false
tags = []
date = 2022-06-03T00:53:44Z

[Article]
contributors = ["The 64th Gamer","BattleXGamer","Ls2018-1"]
gallery = []
+++
##Format##
Control data for the show is stored as a biphase mark code signal on one channel of the show DVD. The BMC signal is an encoded form of 4800 baud 8-N-1 serial data. The data is command-based and includes control data for the show's air valves, in addition to show metadata and commands to stop and start show segments, control the A/V switcher, etc. All data in the serial stream fits within the printable ASCII range.