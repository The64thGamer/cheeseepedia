+++
title = "Pianocorder Data Format"
draft = false
tags = []
date = 2022-09-15T05:47:14Z

[Article]
contributors = ["BattleXGamer","Himitsu","The 64th Gamer"]
gallery = []
+++
## Format ##
Pianocorder Data from Audio gets read at a speed of 4500bits per second which is then squared via op amps and op comparators, which will then go to a few different signals. The first signal is the Clock D Signal which will clock all the shift registers to move data over one. The Second is the Clock O Signal which will then make the shift registers output the data they currently have. The Third Signal is then Biphase IN (Data) Which is looks like pulses like the Clock but if a pulse is half the length of a clock its a 1. The Fourth one is the Edge Which is used to find the edge of the Biphase Bit (You will see what I mean in the image). [TODO: Figure out all the other signals in the Biphase Signal. How do the sync words work?]

After all this Data is read it will then output it to Mosfets and such to control anything requiring a voltage (originally solenoids).

