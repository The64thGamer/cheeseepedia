+++
title = "Pianocorder Data Format"
draft = false
tags = ["Showtape Formats"]
categories = []
startDate = ""
endDate = ""
contributors = ["BattleXGamer","Himitsu","The 64th Gamer"]
citations = []
+++
The **Pianocorder Data Format** defines the format of Pianocorder serial data frames. This subsequently defines the base frame format as used in the {{< wiki-link "Rock-afire Explosion Control System" >}}, as the data decoding in the control system is handled by original Pianocorder playback boards.
In contrast with the original Pianocorder which only used one channel of data, the Rock-afire Explosion Control System uses two channels, decoded entirely independently. The only difference between the channels is the assignment of data bit to controlled show element.

## Biphase data format

Pianocorder data is a 4500 bps stream of {{< wiki-link "Biphase Mark Code" >}} serial data. It is often said that biphase data is somehow 'encoded as audio', but this is a misconception -- it's simply serial data running at a rate that happens to align with the range of frequencies commonly reproducible by standard audio equipment.
{{< wiki-link "Biphase Mark Code" >}} is a self-clocking format, encoding a clock signal and the data payload in one signal. Essentially, the data is encoded in the zero-crossings, or transitions between a high and low state. Each bit transmitted has its own time slot. A transition marks the start of each time slot, and the presence or abscence of an additional transition within that timeslot (at the halfway point) determines whether the bit is a 0 or 1.
{{< wiki-link "Biphase Mark Code" >}} offers some advantages over other similar encoding techniques that make it uniquely suited to being stored on audio tape. It is not sensitive to polarity reversal, useful as it's not uncommon to find polarity reversals as an audio signal passes through equipment, which is otherwise of no consequence as human hearing cannot discern absolute phase. Furthermore, there is no consistent DC component to the signal. Audio equipment commonly has capacitor-coupled input and output stages which will slowly cause any DC component to drift to zero, as a consistent DC component is not audible, reduces available headroom, and can damage speakers. As {{< wiki-link "Biphase Mark Code" >}} guarantees a zero-crossing at the start of each bit's time slot, this effect is rendered irrelevant.

## Pianocorder frame format

Pianocorder frames are 128 bits in length and transmitted continuously at a nominal 35.15625 frames per second. Since the base biphase format has no concept of framing, the last byte of each 128-bit sequence is set to a fixed value, used to delimit each frame in the stream. Consequently, 120 bits per frame are available to the user.

## Encoding Pianocorders Data Format

### Prerequisites

Pianocorders Data Format as stated above is {{< wiki-link "Biphase Mark Code" >}} that just so happens to be on an audio stream. So how would we encode data that works for the Pianocorder. Well there is an application you are going to need to be able to encode this without the use of midi.
The application you are going to need is ffmpeg. You can download it on the internet if you search for it. Make sure you have the command working.
Now for the pianocorder data to properly encode you are going to have to make sure that you have at least 88 bits, if you want to go higher in the bit amount you can, just make sure that you do not go over 120 bits as you have a sync bit which is 8 bits long. The Pianocorder System has a maximum bit limit which is 128.
You are going to need several audio files. If you look at the {{< wiki-link "Biphase Mark Code" >}} page you can roughly see the audio files required. Make sure you make them at the sample rate of 45Khz as it makes it 10x easier to make each file. After you do so you now want to make the tones. Using Audacity you are going to want to make a tone of 2250hz for 20 samples. You need to make sure you invert the tone after so you can do both the high clock and low clock.
Next you are going to make a 2 tones that are both at 4500hz. You can see the rough shape that you need so you can export the correct tones at the {{< wiki-link "Biphase Mark Code" >}} page. They will both be 10 samples. I would recommend making 1 tone that is 20 samples long so you can take the correct tones from it.

## How The Pianocorder Data Format Encodes the Entire State

The Pianocorder Data Format isn't command based as its actually Snapshot-Based. The Pianocorder itself converts the data to a format that can be used by 8 bit latches. Usually the 74LS259 which is on all the driver boards.
After the data is converted to the 8 bit latches data. It then replaces the current state of the driver boards with the entire data frames output.
Once there isn't any data it clears the entire frame.

## TODO

- elaborate on the format's use for animatronics control. explain how each frame encodes the entire state, in contrast with other command-based systems. etc
- elaborate on how this can be read and processed in modern digital audio formats and code.
- elaborate on the Encoding Pianocorders Data Format with the creation of an audio file via FFMPEG
