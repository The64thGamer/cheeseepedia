{0:01} N64,

{0:01} a console that is not necessarily my

{0:04} go-to. It still managed to pump out some

{0:06} of the best platformers of all time. And

{0:08} no, I'm not talking about this one. I'm

{0:11} talking about this one. Banjo-Kazooie,

{0:14} created by the legendary British company

{0:17} Rare.

{0:18} Now sure, Banjo might not be quite as

{0:20} big as Mario.

{0:23} But there's one thing from the late 90s

{0:24} that left a lasting impression. It's the

{0:26} completely unhinged commercials for

{0:28} video games. And yeah, Banjo-Kazooie was

{0:31} no different.

{0:34} Let's take a look.

{0:41} You don't understand. It's after us.

{0:41} It's big. It's got huge teeth.

{0:45} A big beak. Bulgy eyes. Bet there's fur

{0:49} everywhere. Yeah, ain't pigs can fly.

{0:52} No, bears can fly. Bad guys beware. Here

{0:55} comes Banjo-Kazooie. Hold on. Did I just

{0:58} blink and miss that? All right, rewind.

{1:01} That's a puppet for like half a second.

{1:04} Banjo-Kazooie, only for Nintendo. After

{1:07} that, all you really see is a silhouette

{1:09} total ET moon moment. But here's the

{1:11} twist.

{1:13} That puppet,

{1:14} it's real. And it's right here in this

{1:17} studio. After its big TV debut, this

{1:20} puppet eventually found its way into a

{1:23} movie prop auction house. And get this,

{1:26} it sold for just $2,100 back in December

{1:29} 2014. Now I know prop collecting is

{1:32} niche, but as a prop maker, that's

{1:34} shockingly low. Especially considering

{1:37} the craftsmanship, the rarity, and the

{1:39} nostalgic value attached to it. Even

{1:41} worse, the auction house estimated it

{1:44} only $300,

{1:47} which honestly is more terrifying than

{1:49} this photo of Banjo looking like he

{1:51} hasn't slept since 1999.

{1:54} Thankfully, it's passed through a few

{1:55} collectors' hands, and now it's here in

{1:58} the studio.

{2:00} Let's take a look at the puppet itself.

{2:03} The provenance tells us that this was

{2:05} constructed by Animated Effects, a

{2:08} renowned Los Angeles-based company

{2:10} specializing in animatronics and special

{2:12} effects. Now while this puppet held up

{2:15} pretty well over time, it's seen better

{2:17} days. So, let's talk repairs. The main

{2:21} issue,

{2:22} power and control have been cut.

{2:25} Literally. Kazooie's beak is supposed to

{2:28} move, but right now there's no

{2:29} connection, no response, nothing. So

{2:33} here's the goal. We're going to restore

{2:35} electrical power to the beak servo,

{2:37} identify the control cable, bring the

{2:40} puppet back to life without damaging its

{2:43} delicate internal structure. Now here's

{2:45} the catch. There's no access panel. We

{2:48} can't just pop it open and start

{2:49} soldering.

{2:51} And believe me, this is not the kind of

{2:54} subject I want to perform surgery on.

{2:57} Let me introduce you to the endoscope.

{2:59} It's a tiny LED-equipped camera with a

{3:02} semi-rigid cable that connects to your

{3:04} phone. Perfect for internal recon. But

{3:07} since the servo is most likely near the

{3:09} beak, there's really only one way

{3:13} Sorry, Kazooie.

{3:25} And there it is. It's a Futaba S3801

{3:25} servo.

{3:26} And when we pull up specs, we know it's

{3:28} rated at 6 V. Now that we know the

{3:31} voltage, we need to figure out this

{3:32} mystery cable situation. Adam steps in

{3:35} with a multimeter to measure resistance

{3:37} and map out which wires are power and

{3:39} which are signal. The power lines are

{3:41} confirmed, but that control line, still

{3:44} MIA. Time for the endoscope round two,

{3:47} this time with the hook attachment. And

{3:50} we found it right there. A cut white

{3:53} control cable coiled up [music] inside

{3:55} just out of reach.

{3:57} Carefully, we hook and guide it through

{4:00} a small neck opening.

{4:02} >> [music]

{4:03} >> With power, control, proper specs

{4:06} identified, it's time to test. We set up

{4:09} a 30 V adjustable power supply, [music]

{4:11} dial it to exactly 6 V to match the

{4:14} servo specs. Then, using an Arduino IDE

{4:18} and a bit of C++, we write a custom

{4:20} control code. The knob ranges from 0 to

{4:23} 60° max because any more than that and

{4:28} Yeah, we don't want that.

{4:31} We first test this on a similar voltage

{4:33} servo, and seeing it move, that's a

{4:36} great sign. We carefully strip and

{4:38} connect the wires temporarily.

{4:42} We then hook the control line into the

{4:44} microcontroller. Now for the moment of

{4:47} truth.

{5:01} Oh my god. We are back in business. Now

{5:01} that we've confirmed everything works,

{5:03} it's [music] time to refine. We're going

{5:04} to replace temporary wiring with proper

{5:07} secure connections. We're also going to

{5:09} add a rechargeable lithium-ion battery.

{5:12} And most importantly, we're going to go

{5:14} wireless. But I don't want to just use

{5:16} any generic controller. I've got

{5:18} something much more fitting in mind.

{5:21} You'll see where this is going soon. But

{5:23} let's not forget, this is a puppet

{5:25} first. So I've brought in two

{5:27} professional puppeteers [music] with

{5:29} decades of experience to weigh in on the

{5:31} movement, the mechanics, and to make

{5:34} sure we preserve that original charm.

{5:37} That's wild.

{5:39} Hi, my name is Spencer Merle.

{5:42} Hey, I'm Chris Hayes.

{5:49} I am a professional puppeteer and puppet

{5:49} builder, and I've been doing this almost

{5:51} my whole life, and I've worked on a

{5:54} number of uh film and TV productions and

{5:57} built stuff for theme park. I'm a

{5:59} professional puppeteer for theater,

{6:00} film, and television. Uh I work with

{6:03} Sesame Street and the Jim Henson Company

{6:05} and all type of stuff so on on stage and

{6:07} on screen. Been doing that for

{6:09} my god, 20 20 years, something like

{6:12} that. I cannot believe this thing is

{6:14} this big. Um [laughter]

{6:19} Wasn't in the commercials, I just

{6:19} assumed it was half the size. This takes

{6:23} me back to an amazing time in like video

{6:27} game and like television this era of

{6:30} video games where seeing these really um

{6:33} low polygon models and things are really

{6:36} simplified and pared down. And so there

{6:39} it created a space where it was you

{6:41} could still sort of speculate if we had

{6:44} an unlimited amount of detail, what what

{6:47} might this thing look like? Like the

{6:49} Crash Bandicoot thing is another good

{6:50} example. Really punched this design up

{6:53} and show what it would what it would

{6:55} look like if we had unlimited detail.

{6:56} Whereas now we have we kind of have as

{6:59} much as we want to play with so you can

{7:00} see these characters rendered in as

{7:04} precise a way as the developers would

{7:06} want to. So that space that space in

{7:08} between is kind of gone now. The space

{7:11} Spencer refers to is a fascinating one.

{7:13} In the days of limited graphics, game

{7:15} developers often relied on box art and

{7:17} manual illustrations to give characters

{7:19} a sense of realism and help the players

{7:22} fill in the gaps with their imagination.

{7:24} Today, with modern titles boasting near

{7:26} photorealistic visuals, the box art is

{7:29} usually just a rendered in-game image.

{7:31} And the promotional materials might

{7:32} include 3D printed models of the exact

{7:34} same design. As a result, that once

{7:37} vibrant artistic space for

{7:38} interpretation has largely disappeared,

{7:41} if not vanished entirely. During the

{7:44} commercial shoot, how many puppeteers do

{7:46} you estimate were needed to operate

{7:48} Kazooie? I'm going to say probably four.

{7:51} Yeah, there's I think four pick points

{7:53} on that.

{7:53} >> at least that we found. Yeah, you'd have

{7:56} to have a whole separate person watching

{7:59} a monitor, doing an RC control, and then

{8:02} at the very least probably [music]

{8:05} three. One doing the head and the the

{8:07} butt, and one person each for wing.

{8:11} >> [music]

{8:19} [music]

{8:19} >> Now that Kazooie's up and flying, it's

{8:21} time to get back to finishing the

{8:23} repairs. We'll start by snaking the

{8:25} clipped control line through with the

{8:27} endoscope so it exits the puppet at the

{8:29} same point as the power line. Next,

{8:31} we'll attach proper cable connectors to

{8:33} both the power and control [music]

{8:35} lines, then install a rechargeable

{8:36} battery and our custom microcontroller.

{8:39} From there, all that's left is to

{8:40} [music] upload our custom control code

{8:42} we wrote earlier onto the

{8:43} microcontroller. And what did we just

{8:45} do? Adam? All right, so the whole thing

{8:48} is powered by a rechargeable 12 V

{8:50} battery block. That 12 V is crunched

{8:52} down to 6 V to control the mouth motor.

{8:55} 5 V is controlling our little

{8:56} microcontroller box down here. And the

{8:58} microcontroller in there is what's

{9:00} sending the motor signal and receiving

{9:02} [music] the signal from the control box.

{9:04} And this here is your rechargeable power

{9:06} cable charge port. Main power [music]

{9:07} switch just right there.

{9:10} Turn him on, and he's good to go. The

{9:12} remote can sense [music] whether or not

{9:14} the bird is turned on. Speaking of

{9:16} remotes, I think it's time to reveal my

{9:18} idea for the remote. The Jiggy. And like

{9:21} most of [music] our builds, it all

{9:23} starts with a 3D model. This one I

{9:25} sculpted in ZBrush. The main housing

{9:27} will be resin printed [music] on one of

{9:29} our SLA machines, and the top plate will

{9:31} be laser cut from a suitable mirror gold

{9:33} acrylic.

{9:34} Now, before we assemble everything into

{9:36} the Jiggy housing, let's test out the

{9:38} guts of the control.

{9:39} >> We have the control knob, the main

{9:41} control unit.

{9:43} We've got the charge port [music]

{9:44} and a battery charger. Uh Here are the

{9:47} running. This is the main power switch.

{9:50} Turn the power switch on, you got your

{9:51} power indicator. [music] And then when

{9:53} it connects to the the bird,

{9:56} the green light comes on.

{10:02} Looks like everything's working

{10:02} perfectly. We'll make sure the charging

{10:04} port is placed along [music] the side,

{10:07} the battery and power button on the

{10:08} bottom,

{10:09} and indicator lights and [music] knob

{10:11} neatly positioned on top. Once

{10:13} everything's in place, we can close it

{10:15} all up.

{10:16} Finally, we'll add some rubber feet to

{10:17} the bottom, then peel off the protective

{10:20} film from the top.

{10:22} So shiny.

{10:28} Man, finally wrapped this thing up and

{10:28} dude, what an honor this was to

{10:32} get to piece this back together and just

{10:34} bring it back to life, [music] you know,

{10:35} I brought in

{10:36} my friend Adam, I brought in other

{10:37} puppeteers to kind of take a look at

{10:39} this and get like a really good feeling

{10:42} of like what this thing was when it was

{10:44} in the commercial for a brief amount of

{10:46} time, but

{10:47} we came up with this cool idea to just

{10:49} modernize it. We've got this nice

{10:51} full-size Jiggy that's kind of

{10:52} ironically almost the same size as a

{10:54} Nintendo 64 controller.

{10:57} But yeah, this is just this is just been

{10:59} awesome, man, to work to work with. And

{11:02} so, what do you think about that,

{11:03} Kazooie?

{11:04} I think it's great. You guys brought me

{11:07} back to life.

{11:09} Thank you so much.

{11:35} [crying]

{11:35} [music]