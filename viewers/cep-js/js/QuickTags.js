const EMOJI_BASE = '/viewers/cep-js/assets/Emoji/';

export const TAG_COLORS = {
    "Pizza Time Theatre": "#b7471bff", "ShowBiz Pizza Place": "#b7471bff", "Chuck E. Cheese's": "#b7471bff",
    "Locations": "#c26827ff", "Showtapes": "#7b4fd6", "Animatronic Shows": "#4a7bd1",
    "Animatronics": "#4a7bd1", "Animatronic Parts": "#4a7bd1", "Animatronic Preservation": "#4a7bd1",
    "Stage Variations": "#4a7bd1", "Costumed Characters": "#4a7bd1", "Characters": "#2e8857ff",
    "Retrofits": "#4a7bd1", "Remodels and Initiatives": "#c26827ff", "History": "#c26827ff",
    "Cancelled Locations": "#c26827ff", "Arcades and Attractions": "#c26827ff", "Store Fixtures": "#c26827ff",
    "Companies/Brands": "#2e8857ff", "Events": "#2e8857ff", "Animatronic Control Systems": "#99852aff",
    "Other Systems": "#99852aff", "Simulators": "#99852aff", "Programming Systems": "#99852aff",
    "Commercials": "#d14a4a", "News Footage": "#d14a4a", "Company Media": "#d14a4a", "Movies": "#d14a4a",
    "Puppets": "#7b4fd6", "Live Shows": "#7b4fd6", "ShowBiz Pizza Programs": "#7b4fd6",
    "Showtape Formats": "#7b4fd6", "Family Vision": "#7b4fd6", "Corporate Documents": "#607f77ff",
    "Documents": "#607f77ff", "Promotional Material": "#607f77ff", "Social Media and Websites": "#607f77ff",
    "Ad Vehicles": "#607f77ff", "In-Store Merchandise": "#0d9488", "Products": "#0d9488",
    "Menu Items": "#0d9488", "Tickets": "#0d9488", "Tokens": "#0d9488", "Employee Wear": "#0d9488",
    "Video Games": "#0d9488", "Sally Corporation": "#b7471bff", "Jim Henson's Creature Shop": "#b7471bff",
    "Walt Disney Imagineering": "#b7471bff", "Five Nights at Freddy's": "#b7471bff",
    "Transcriptions": "#5a5a5a", "Unknown Year": "#5a5a5a", "2026": "#5a5a5a", "1977": "#5a5a5a",
    "User": "#5a5a5a", "Meta": "#5a5a5a",
};

export const TAG_ICONS = {
    "Animatronics": "spiky_speech_bubble.svg",
    "Animatronic Shows": "bang.svg",
    "Animatronic Parts": "factory.svg",
    "Animatronic Preservation": "wrench.svg",
    "Stage Variations": "speaker.svg",
    "Costumed Characters": "back_of_hand_hoof_d1.svg",
    "Characters": "thumbs_up_paw.svg",
    "Locations": "world_map.svg",
    "Cancelled Locations": "bomb.svg",
    "Showtapes": "music_notes.svg",
    "Showtape Formats": "vhs.svg",
    "ShowBiz Pizza Programs": "cassette.svg",
    "Family Vision": "projector.svg",
    "Live Shows": "music_note.svg",
    "Puppets": "back_of_hand_paw_k2.svg",
    "Commercials": "movie_camera.svg",
    "News Footage": "tv.svg",
    "Company Media": "dvd.svg",
    "Movies": "cinema.svg",
    "Transcriptions": "pencil.svg",
    "Video Games": "gamepad.svg",
    "Menu Items": "pizza.svg",
    "Tickets": "cross.svg",
    "Tokens": "cross.svg",
    "Documents": "page.svg",
    "Corporate Documents": "page_with_pencil.svg",
    "Promotional Material": "curled_page.svg",
    "Events": "tada.svg",
    "Remodels and Initiatives": "construction_sign.svg",
    "Retrofits": "pirate_flag.svg",
    "2026": "calendar.svg",
    "1977": "calendar.svg",
    "Unknown Year": "calendar.svg",
    "Pizza Time Theatre": "pizza.svg",
    "ShowBiz Pizza Place": "bang.svg",
    "Chuck E. Cheese's": "birthday_cake.svg",
    "History": "spider_web.svg",
    "Arcades and Attractions": "arcade_stick.svg",
    "Companies/Brands": "bomb.svg",
    "Animatronic Control Systems": "level_slider.svg",
    "Other Systems": "fax_machine.svg",
    "Programming Systems": "keyboard.svg",
    "Simulators": "purple_sunset.svg",
    "Social Media and Websites": "globe.svg",
    "Ad Vehicles": "bus.svg",
    "In-Store Merchandise": "lp.svg",
    "Products": "dollar.svg",
    "Employee Wear": "free.svg",
    "Sally Corporation": "briefcase.svg",
    "Jim Henson's Creature Shop": "cinema.svg",
    "Walt Disney Imagineering": "decreasing_graph.svg",
    "Five Nights at Freddy's": "crt_noise.svg",
    "User": "furry_pride.svg",
    "Meta": "red_question_mark.svg",
    "Store Fixtures": "package.svg",

};


export function buildTagBtn(tag, onClick, count) {
    const btn = document.createElement('button');
    btn.className = 's-qtag-btn';
    btn.dataset.tag = tag;
    btn.onclick = () => onClick(tag);

    const color = TAG_COLORS[tag];
    if (color) btn.style.setProperty('--tag-color', color);

    const icon = TAG_ICONS[tag];
    if (icon) {
        const img = document.createElement('img');
        img.src = EMOJI_BASE + icon;
        img.className = 's-qtag-icon';
        img.alt = '';
        img.setAttribute('aria-hidden', 'true');
        btn.appendChild(img);
    }

    const label = document.createElement('span');
    label.textContent = tag;
    btn.appendChild(label);

    if (count != null) {
        const countEl = document.createElement('span');
        countEl.className = 's-qtag-count';
        countEl.textContent = `(${count})`;
        btn.appendChild(countEl);
    }

    return btn;
}

export function renderQuickTags(container, tags, onClick, counts = {}) {
    const list = Array.isArray(tags) ? tags : [tags];
    list.forEach(tag => {
        container.appendChild(buildTagBtn(tag, onClick, counts[tag] ?? null));
    });
}