const PINS_URL = '/viewers/cep-solid/compiled-json/map_pins.json';
const ICON_BASE = '/viewers/cep-js/assets/Map Markers/';
const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
const LEAFLET_JS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';

const PIN_FILES = {
  '0': 'ptt.png',
  '1': 'Montfort.avif',
  '2': 'IngramDrive.avif',
  '3': 'IDrive.avif',
  '4': 'Spokane.avif',
  '5': 'DiscoveryZone.avif',
  '6': 'PeterPiperPizza.avif',
  '7': 'other.png',
  '8': 'ptt.png',
  '9': 'other.png',
  'a': 'ptt.png',
  'b': 'other.png',
  'c': 'other.png',
  'd': 'Justiss.avif',
  'e': 'ShowbizIdkStore.avif',
};

const parseDay = (s) => new Date(s + 'T00:00:00').getTime();
const pad = (n) => String(n).padStart(2, '0');
const toInputValue = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const isLeapYear = (y) => new Date(y, 1, 29).getDate() === 29;
const dayOfYear = (d) => Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);

function pinAt(loc, ts) {
  let pin = 'c';
  for (const era of loc._eras) {
    if (era.ts > ts) break;
    pin = era.pin;
  }
  return pin;
}

function loadLeaflet() {
  return new Promise((resolve, reject) => {
    if (window.L) return resolve();
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = LEAFLET_CSS;
    document.head.appendChild(link);
    const script = document.createElement('script');
    script.src = LEAFLET_JS;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function injectPinStyles() {
  if (document.querySelector('#MapPinIconStyle')) return;
  const style = document.createElement('style');
  style.id = 'MapPinIconStyle';
  // Leaflet positions the outer marker element via an inline transform, so we
  // never touch it. Hover scaling happens on an inner <img> instead.
  style.textContent = `
    .MapPinIcon .MapPinImg{display:block;width:100%;height:100%;max-width:none;transition:transform .15s ease;transform-origin:bottom center;}
    .MapPinIcon:hover .MapPinImg{transform:scale(2.5);}
  `;
  document.head.appendChild(style);
}

const titleCache = new Map();

function fetchTitle(id) {
  if (!titleCache.has(id)) {
    titleCache.set(
      id,
      fetch(`/content/${id}/meta.json`)
        .then((r) => r.json())
        .then((meta) => meta.title)
        .catch(() => 'Open article')
    );
  }
  return titleCache.get(id);
}

// Resolved titles, so a popup can open at its final size on repeat clicks.
const resolvedTitles = new Map();

function linkPopup(id, marker) {
  const view = new URLSearchParams(location.search).get('v') || 'cep-js';
  const a = document.createElement('a');
  a.href = `/?v=${view}&=${encodeURIComponent(id)}`;
  if (resolvedTitles.has(id)) {
    a.textContent = resolvedTitles.get(id);
    return a;
  }
  a.textContent = 'Loading…';
  fetchTitle(id).then((title) => {
    resolvedTitles.set(id, title);
    a.textContent = title;
    // Leaflet measures popups at open time; re-measure and re-pan now that the size changed.
    const popup = marker.getPopup();
    if (popup && popup.isOpen()) popup.update();
  });
  return a;
}

let pinsPromise = null;

export function loadPins() {
  if (!pinsPromise) {
    pinsPromise = fetch(PINS_URL)
      .then((r) => r.json())
      .then((data) => {
        const locations = data.locations.filter(
          (loc) => Array.isArray(loc.c) && loc.c.length === 2 && loc.c.every(Number.isFinite) && loc.s && loc.e
        );
        locations.forEach((loc) => {
          loc._s = parseDay(loc.s);
          loc._e = parseDay(loc.e);
          loc._eras = (loc.r || []).map(([date, pin]) => ({ pin, ts: parseDay(date) }));
        });
        return locations;
      })
      .catch((e) => {
        console.error('Map: failed to load map_pins.json', e);
        pinsPromise = null;
        return [];
      });
  }
  return pinsPromise;
}

export async function createMap(container, locations, { single = false, fit = false } = {}) {
  await loadLeaflet();
  injectPinStyles();
  const L = window.L;

  container.innerHTML = '';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';

  const mapEl = document.createElement('div');
  mapEl.style.cssText = `flex:1;min-height:${single ? 16 : 30}rem;border-radius:1em;overflow:clip;`;
  container.appendChild(mapEl);

  // Safety net: an overflow-hidden box can still be scrolled by the browser
  // (e.g. focusing a hover-scaled marker). Pin the container to 0,0 so the
  // map never shifts; Leaflet pans via transforms, not scroll.
  mapEl.addEventListener('scroll', () => {
    mapEl.scrollLeft = 0;
    mapEl.scrollTop = 0;
  });

  const map = L.map(mapEl).setView(single ? locations[0].c : [38, -96], single ? 10 : 4);

  // Leaflet caches its container size and only re-measures on window resize.
  // Layout changes after init (controls appended, flex sizing, fonts) leave that
  // cache stale, which skews popup autoPan. Re-measure whenever the box changes.
  const ro = new ResizeObserver(() => map.invalidateSize());
  ro.observe(mapEl);
  L.tileLayer(
    'https://services.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}',
    { minZoom: 1, maxZoom: 16, attribution: 'Tiles © Esri' }
  ).addTo(map);

  if (fit && locations.length) {
    map.fitBounds(locations.map((loc) => loc.c), { padding: [40, 40], maxZoom: 12 });
  }

  const icons = Object.fromEntries(
    Object.entries(PIN_FILES).map(([key, file]) => [key, L.divIcon({
      html: `<img class="MapPinImg" src="${ICON_BASE + file}" alt="" draggable="false">`,
      iconSize: [48, 48],
      iconAnchor: [24, 48],
      popupAnchor: [0, -48],
      className: 'MapPinIcon',
    })])
  );

  const layer = L.layerGroup().addTo(map);

  const markers = locations.map((loc) => {
    // keyboard:false drops the marker's tabindex so clicking it doesn't focus it
    // (focus is what triggers the browser's scroll-into-view).
    const marker = L.marker(loc.c, { keyboard: false });
    marker.bindPopup(single ? loc.c.join(', ') : () => linkPopup(loc.p, marker));
    marker.on('mouseover', () => {
      marker.setZIndexOffset(1000);
      // Warm the title cache so the popup opens at its final size on click.
      if (!single && !resolvedTitles.has(loc.p)) {
        fetchTitle(loc.p).then((title) => resolvedTitles.set(loc.p, title));
      }
    });
    marker.on('mouseout', () => marker.setZIndexOffset(0));
    return marker;
  });

  function render(date) {
    const now = date.getTime();
    locations.forEach((loc, i) => {
      const ts = single ? Math.min(Math.max(now, loc._s), loc._e) : now;
      const marker = markers[i];
      if (ts < loc._s || ts > loc._e) {
        layer.removeLayer(marker);
        return;
      }
      const pin = pinAt(loc, ts);
      if (marker._pin !== pin) {
        marker.setIcon(icons[pin] || icons.c);
        marker._pin = pin;
      }
      layer.addLayer(marker);
    });
  }

  const today = new Date();

  if (single) {
    render(today);
    return { destroy: () => { ro.disconnect(); map.remove(); } };
  }

  const controls = document.createElement('div');
  controls.className = 'MapControls';
  controls.innerHTML = `
    <output class="MapDateDisplay"></output>
    <div class="MapSliderRow">
      <label class="MapSliderLabel">Year</label>
      <input type="range" class="MapYearSlider" min="1970" max="${today.getFullYear()}" style="flex:1">
    </div>
    <div class="MapSliderRow">
      <label class="MapSliderLabel">Date</label>
      <input type="range" class="MapDaySlider" min="1" max="365" style="flex:1">
      <input type="date" class="MapDatePicker" style="flex-shrink:0;margin-left:0.75em">
    </div>
  `;
  container.appendChild(controls);

  const yearSlider = controls.querySelector('.MapYearSlider');
  const daySlider = controls.querySelector('.MapDaySlider');
  const datePicker = controls.querySelector('.MapDatePicker');
  const display = controls.querySelector('.MapDateDisplay');

  function syncDayMax() {
    const max = isLeapYear(+yearSlider.value) ? 366 : 365;
    daySlider.max = max;
    if (+daySlider.value > max) daySlider.value = max;
  }

  function update() {
    const date = new Date(+yearSlider.value, 0);
    date.setDate(+daySlider.value);
    display.textContent = `${pad(date.getMonth() + 1)}/${pad(date.getDate())}/${date.getFullYear()}`;
    datePicker.value = toInputValue(date);
    render(date);
  }

  let frame = null;
  function scheduleUpdate() {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = null;
      update();
    });
  }

  yearSlider.addEventListener('input', () => { syncDayMax(); scheduleUpdate(); });
  daySlider.addEventListener('input', scheduleUpdate);
  datePicker.addEventListener('change', () => {
    if (!datePicker.value) return;
    const date = new Date(datePicker.value + 'T00:00:00');
    yearSlider.value = date.getFullYear();
    syncDayMax();
    daySlider.value = dayOfYear(date);
    scheduleUpdate();
  });

  yearSlider.value = today.getFullYear();
  syncDayMax();
  daySlider.value = dayOfYear(today);
  update();

  return { destroy: () => { ro.disconnect(); map.remove(); } };
}
