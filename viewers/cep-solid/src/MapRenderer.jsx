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
  style.textContent = '.MapPinIcon{transition:transform .15s ease;transform-origin:bottom center;}';
  document.head.appendChild(style);
}

function scaleIcon(marker, scaled) {
  const el = marker.getElement();
  if (!el) return;
  const base = el.style.transform.replace(/\s*scale\([^)]*\)\s*$/, '');
  el.style.transform = scaled ? `${base} scale(2.5)` : base;
}

function linkPopup(id) {
  const view = new URLSearchParams(location.search).get('v') || 'cep-js';
  const a = document.createElement('a');
  a.href = `/?v=${view}&=${encodeURIComponent(id)}`;
  a.textContent = 'Loading…';
  fetch(`/content/${id}/meta.json`)
    .then((r) => r.json())
    .then((meta) => { a.textContent = meta.title; })
    .catch(() => { a.textContent = 'Open article'; });
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
  mapEl.style.cssText = `flex:1;min-height:${single ? 16 : 30}rem;border-radius:1em;overflow:hidden;`;
  container.appendChild(mapEl);

  const map = L.map(mapEl).setView(single ? locations[0].c : [38, -96], single ? 10 : 4);
  L.tileLayer(
    'https://services.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}',
    { minZoom: 1, maxZoom: 16, attribution: 'Tiles © Esri' }
  ).addTo(map);

  if (fit && locations.length) {
    map.fitBounds(locations.map((loc) => loc.c), { padding: [40, 40], maxZoom: 12 });
  }

  const icons = Object.fromEntries(
    Object.entries(PIN_FILES).map(([key, file]) => [key, L.icon({
      iconUrl: ICON_BASE + file,
      iconSize: [48, 48],
      iconAnchor: [24, 48],
      popupAnchor: [0, -48],
      className: 'MapPinIcon',
    })])
  );

  const layer = L.layerGroup().addTo(map);

  const markers = locations.map((loc) => {
    const marker = L.marker(loc.c).bindPopup(single ? loc.c.join(', ') : () => linkPopup(loc.p));
    marker.on('mouseover', () => { marker.setZIndexOffset(1000); scaleIcon(marker, true); });
    marker.on('mouseout', () => { marker.setZIndexOffset(0); scaleIcon(marker, false); });
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
    return { destroy: () => map.remove() };
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

  return { destroy: () => map.remove() };
}
