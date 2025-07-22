+++
title = "Stripes/vector-test.css"
draft = false
tags = ["User"]
categories = []
startDate = "2024-08-24"
endDate = ""
contributors = ["Stripes"]
citations = []
+++
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@100..900&display=swap');
:root {
--black: #000000;
--redorange: #E85301;
--red: #D01801;
--darkblue: #1E2C4C;
--mediumblue: #384D80;
--lightblue: #96E1FF;
--white: #FFFFFF;
--orange: #FF9A01;
--darkestblue: #172441;
}
body {
background-color: var(--darkblue);
font-family: 'Archivo', sans-serif;
}
body a {
text-decoration: none;
}
body a:hover {
text-decoration: underline;
}
/* Header navigation */

1.  mw-page-base {

background-color: var(--darkblue);
background-image: none;
}
/* Side navigation */

1.  mw-panel {

color: var(--white);
}
#mw-panel a {
color: var(--lightblue);
}
#mw-panel .vector-menu-heading {
background: none;
}
#mw-panel .vector-menu-heading-label {
color: var(--orange);
font-weight: bold;
}
#mw-panel #p-logo a {
background-size: contain;
padding-top: 20px;
}
/* Content section */

1.  content {

background-color: var(--darkblue);
border: none;
color: var(--white);
}
#firstHeading, #mw-previewheader, .mw-headline{
color: var(--orange);
font-family: 'Archivo', sans-serif;
font-weight: 700;
}
#bodyContent {
color: var(--white);
}
.subpages a, .mw-parser-output a {
color: var(--lightblue);
}
