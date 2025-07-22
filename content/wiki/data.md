+++
title = "Data"
draft = false
tags = ["Animatronic Preservation"]
categories = [""]
startDate = ""
endDate = ""
contributors = ["The 64th Gamer"]
citations = []
+++
***Data* (also known as ***Signals* or ***Movements*) is a collection of information stored on a {{< wiki-link "Showtape" >}} that dictates the animation of animatronic characters and lights.
Data is usually stored as a map of *Boolean* values that correspond to each individual pneumatic movement, light, or special effect on a given animatronic show. This is usually stored in two fashions, a *frame buffer*, where one entire frame of data is sent out and all movements are updated at once, or as a *command-based* system, where commands are sent only when a change in state has affected a single movement.
Command-based signals can accrue noticeable misinputs when its storage medium is on any tape media. This is due to the tape wearing out over time, causing any missed commands to keep a movement on until the next off command is sent, which can leave some movements on for the duration of the entire tape. Command signals also cause this same affect when skipping around the tape to a specific point, as there is no reference for the true current state of that frame.******
