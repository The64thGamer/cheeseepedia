{0:03} hello and welcome to the second devlog

{0:03} for realtorreel a Chuck E cheese

{0:05} animatronic simulator this week I'm

{0:08} going to be attempting to finish the

{0:10} Studio C late night Cosmetics along with

{0:12} making a bunch of progress on the

{0:14} lacking areas of the game

{0:15} right now the main area is pretty bare

{0:18} the map splits into six rooms which all

{0:20} host animatronic shows present in the

{0:23} game these are the original Winchester

{0:25} location and its Bots the second

{0:28} location Kuser with its own set of bots

{0:30} the Pizza Time theater cyberamics the

{0:34} three stage the awesome adventure

{0:36} machine and Studio C

{0:38} I want to note while a lot of people

{0:40} like to refer to Kuser and Winchester

{0:42} Bots as portrait Bots and the Shelf

{0:45} they're completely different sets of

{0:47} robots and potentially different unique

{0:49} Hardware running them

{0:50} people liked also erroneously call the

{0:52} first versions of Chuck and Krusty

{0:54} prototypes despite them being used in

{0:57} the store proper names for these would

{0:59} be the Winchester V1 Bots the Winchester

{1:02} V2 Bots the Kuser Bots and the portrait

{1:06} name should be left for the portrait

{1:08} stage built for cyberamics despite Kuser

{1:12} being upgraded to the cyberamics it was

{1:14} actually given a balcony stage

{1:16} anyways each section of the map is going

{1:19} to represent different areas of the

{1:21} stores with all the varied art packages

{1:23} and decorations to fill out the rooms

{1:25} today I've started on the three stage

{1:27} room with the original 88 remodel so far

{1:31} it's just the original desks chairs

{1:33} napkin dispensers and boots but I found

{1:36} out later that the booths should

{1:37} actually go in the studio C room instead

{1:40} the house lights have also changed to be

{1:42} more accurate with the actual stage

{1:44} there was a signal to control their

{1:46} dimming but it was only used in the late

{1:48} 90s to early 2000s

{1:50} next is the completion of the

{1:52} three-stage lighting effects up to this

{1:54} point I only had two or more to do which

{1:56} were the hardest to make the helicopter

{1:58} light and the star

{2:00} the helicopter was pretty simple I just

{2:02} had to make a signal spin an object

{2:04} holding the six colored lights that were

{2:06} used the star was much more complex

{2:09} every 10 seconds it switches between two

{2:11} modes burst and Flash with 10 lights per

{2:15} side that'd be 50 separate lights to

{2:17} control which wouldn't be fun to program

{2:19} and would be unnecessarily resource

{2:22} intensive I came up with a solution to

{2:24} pre-render the lights in blender and

{2:26} would animate it as a light texture for

{2:28} each side after a lot of work I found I

{2:31} could shrink the needed frames to just

{2:32} five one for the flash where all the

{2:35} lights are on and four for the burst

{2:37} with each of their positions at their

{2:39} maximum brightness I then used the sine

{2:41} wave to modulate between the brightness

{2:43} during each frame transition so it would

{2:46} be animated accurately last was to line

{2:48} up the render light with the actual

{2:50} bulbs on the model and it was done the

{2:53} three stage now has all of its effects

{2:55} done and all that's left to work on are

{2:57} finishing the characters

{2:58} I went ahead and also started work on

{3:00} the Proto stage where some of the props

{3:02} have small differences now it was

{3:04} finally time to work on the Studio C

{3:06} late night Cosmetics the spot had

{3:08} already been the longest I'd ever worked

{3:10} on a single animatronic model and it was

{3:12} going to be another two days of non-stop

{3:13} work just to get this outfit finished

{3:15} the hardest part is finding out the

{3:17} topology of the base mesh while getting

{3:20} the shapes right is important at the

{3:22} start there needs to be enough

{3:23} flexibility in the model to let me edit

{3:25} what I need later down the line my

{3:28} process in modeling organic objects is

{3:30} to slowly increase the poly count more

{3:32} and more as I work at finer details so

{3:34} getting the first and low poly one to

{3:36} have well-connected topology is very

{3:38} important I struggled for a while on the

{3:40} face when you first start you feel like

{3:42} you've never actually looked at the face

{3:44} close enough to understand how it shaped

{3:46} it's a Non-Stop process of grabbing and

{3:49} shifting things around over and over

{3:51} until one section feels right the mouth

{3:53} was the most challenging part in this

{3:55} first section not a lot of photos were

{3:57} helping me out with its General shape

{3:59} but thankfully I was given a great

{4:00} undershot of the nose that helped me

{4:02} finish it quicker making the head shape

{4:04} was easy as I had already done it by

{4:06} working on the mech shells ears took a

{4:09} bit to figure out their exact shape but

{4:11} they weren't too bad then I basically

{4:13} sat down and worked on the rest of the

{4:14} body just trying to get it finished

{4:16} quick enough so I could see the whole

{4:18} character and it looked terrible

{4:20} absolutely all the proportions were off

{4:23} I realized that I had gotten the inner

{4:25} mechan shells completely wrong mainly by

{4:28} making the eyes too close together and

{4:30} the cheeks too wide so then I went and

{4:32} completely changed the inner structure

{4:33} until it was more accurate which finally

{4:36} made the Cosmetics look normal enough

{4:38} all that was left to do were the hands

{4:40} and cuffs for the main section to be

{4:41} done despite now looking back knowing I

{4:44} was nowhere near done with working on

{4:45} the proportions I was ready to throw

{4:47} Chuck into substance painter and get to

{4:49} making the materials the materials were

{4:51} a nice break from the modeling process

{4:53} and it was great seeing the characters

{4:54} start to come to life outside of a crash

{4:57} Midway through disrupting my progress

{4:59} everything went very smoothly for this

{5:01} section

{5:02} his face was still very inaccurate after

{5:04} putting him into Realto Rail and trying

{5:06} out his movements so I went back into

{5:08} adjusting the head until it was right

{5:10} this would then go on for another three

{5:12} hours now with it being one in the

{5:15} morning I was finally happy with his

{5:17} look

{5:18} the next day I would clean up some of

{5:20} the stage fixing some of the Heights and

{5:22} adding the proper house lights as I did

{5:24} with the three stage I think I'm pretty

{5:26} happy with my progress to now finally

{5:28} show you Studio C late night Chucky in

{5:31} reel to reel enjoy

{5:34} through the words

{5:35} [Music]

{5:39} [Laughter]

{5:41} [Music]

{5:45} [Laughter]

{5:45} [Music]

{5:50} [Laughter]

{5:52} [Music]

{6:02} [Applause]

{6:02} [Music]

{6:06} [Applause]

{6:08} [Music]

{6:26} I like it

{6:26} [Music]

{6:32} and that is this week's Dev vlog hope

{6:34} you enjoyed the Showcase and look into

{6:36} my modeling process next week I'll

{6:39} probably be finishing up the three-stage

{6:41} prop characters and either start my work

{6:43} on Munch or Pasquale let me know in the

{6:46} comments what you think I should do and

{6:48} be sure to subscribe for more devlogs

{6:50} I'll see you next time

{6:55} [Music]

{6:55} [Laughter]

{6:57} [Music]

{7:02} uh-huh

{7:06} [Music]

{7:20} [Applause]

{7:22} [Music]

{7:31} that's the way

{7:34} [Music]

{7:35} [Laughter]

{7:36} [Music]

{7:40} that's great

{7:48} [Laughter]

{7:48} [Music]

{7:49} [Laughter]

{7:50} [Music]

{7:52} [Laughter]

{7:54} [Music]

{8:03} [Applause]

{8:05} [Music]

{8:09} uh-huh uh-huh

{8:12} [Music]

{8:17} [Applause]

{8:17} [Music]

{8:30} [Applause]

{8:31} [Music]

{8:34} [Applause]