const PINS_URL    = '/viewers/cep-js/compiled-json/map_pins.json';
const ICON_BASE   = '/viewers/cep-js/assets/Map Markers/';
const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
const LEAFLET_JS  = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';

const PIN_FILES = {
  ptt:               'other.png',
  spp:               'other.png',
  cec:               'other.png',
  cec2:              'IngramDrive.avif',
  cec2000s:          'IDrive.avif',
  spt80s_ptt:        'other.png',
  spt80s_spp:        'other.png',
  spt90s:            'Spokane.avif',
  ppp2:              'PeterPiperPizza.avif',
  funspotarcade:     'other.png',
  dz:                'DiscoveryZone.avif',
  charliecheese:     'other.png',
  cecadventureworld: 'other.png',
  chuckemouse:       'other.png',
  chucksarcade2025:  'other.png',
  other:             'other.png',
};

function loadLeaflet() {
  return new Promise((resolve, reject) => {
    if(window.L) { resolve(); return; }
    if(!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet'; link.href = LEAFLET_CSS;
      document.head.appendChild(link);
    }
    const script = document.createElement('script');
    script.src = LEAFLET_JS;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function injectPinStyles() {
  if(document.querySelector('#MapPinIconStyle')) return;
  const style = document.createElement('style');
  style.id = 'MapPinIconStyle';
  style.textContent = `
    .MapPinIcon {
      transition: transform 0.15s ease;
      transform-origin: bottom center;
    }
  `;
  document.head.appendChild(style);
}

function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date - start) / 86400000);
}

function isLeapYear(y) {
  return new Date(y, 1, 29).getDate() === 29;
}

function resolvePinType(loc, ts) {
  const eras = loc._eras;
  if(!eras || !eras.length) return 'other';
  let active = null;
  for(let i = 0; i < eras.length; i++) {
    if(eras[i]._ts <= ts) active = eras[i];
    else break;
  }
  return active ? active.pin : 'other';
}

function setIconHoverScale(marker, scaling) {
  const el = marker.getElement && marker.getElement();
  if(!el) return;
  const current = el.style.transform || '';
  const base = current.replace(/\s*scale\([^)]*\)\s*$/, '').trim();
  el.style.transform = scaling ? `${base} scale(2.5)`.trim() : base;
}

export async function initMap(container) {
  await loadLeaflet();
  injectPinStyles();
  const L = window.L;

  container.innerHTML = '';
  container.style.cssText = 'display:flex;flex-direction:column;height:100%;';

  const mapEl = document.createElement('div');
  mapEl.style.cssText = 'flex:1;min-height:30rem;border-radius:1em;overflow:hidden;';
  container.appendChild(mapEl);

  const controlsEl = document.createElement('div');
  controlsEl.className = 'MapControls';
  controlsEl.innerHTML = `
    <output class="MapDateDisplay" id="MapDateDisplay">—</output>
    <div class="MapSliderRow">
      <label class="MapSliderLabel">Year</label>
      <input type="range" id="MapYearSlider" min="1970" max="${new Date().getFullYear()}" style="flex:1">
    </div>
    <div class="MapSliderRow">
      <label class="MapSliderLabel">Date</label>
      <input type="range" id="MapDaySlider" min="1" max="365" style="flex:1">
      <input type="date" id="MapDatePicker" style="flex-shrink:0;margin-left:0.75em">
    </div>
  `;
  container.appendChild(controlsEl);

  const yearSlider  = controlsEl.querySelector('#MapYearSlider');
  const daySlider   = controlsEl.querySelector('#MapDaySlider');
  const datePicker  = controlsEl.querySelector('#MapDatePicker');
  const dateDisplay = controlsEl.querySelector('#MapDateDisplay');

  const map = L.map(mapEl).setView([38, -96], 4);
  L.tileLayer(
    'https://services.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}',
    { minZoom: 1, maxZoom: 16, attribution: 'Tiles © Esri' }
  ).addTo(map);

  const icons = Object.fromEntries(
    Object.entries(PIN_FILES).map(([k, f]) => [k, L.icon({
      iconUrl: ICON_BASE + f,
      iconSize: [48, 48], iconAnchor: [24, 48], popupAnchor: [0, -48],
      className: 'MapPinIcon',
    })])
  );

  let locations = [];
  try {
    const r = await fetch(PINS_URL);
    if(r.ok) locations = (await r.json()).locations || [];
  } catch(e) { console.error('MapView: failed to load map_pins.json', e); }

  locations.forEach(loc => {
    loc._start = new Date(loc.startDate).getTime();
    loc._end   = new Date(loc.endDate).getTime();
    loc._eras  = (loc.eras || []).map(e => ({ pin: e.pin, _ts: new Date(e.s).getTime() }));
  });

  const markerCache = new Array(locations.length).fill(null);
  const visible     = new Set();
  const layerGroup  = L.layerGroup().addTo(map);

  function renderMarkers(currentDate) {
    const ts   = currentDate.getTime();
    const toAdd = [], toRemove = [];

    locations.forEach((loc, i) => {
      const shouldShow = ts >= loc._start && ts <= loc._end;
      const isShown    = visible.has(i);

      if(shouldShow) {
        if(!markerCache[i]) {
          markerCache[i] = L.marker(loc.coords)
            .bindPopup(`<a href="/?v=cep-js&=${encodeURIComponent(loc.p)}">${loc.title}</a>`);
          markerCache[i]._pinType = null;
          markerCache[i].on('mouseover', () => {
            markerCache[i].setZIndexOffset(1000);
            setIconHoverScale(markerCache[i], true);
          });
          markerCache[i].on('mouseout', () => {
            markerCache[i].setZIndexOffset(0);
            setIconHoverScale(markerCache[i], false);
          });
        }
        const pinType = resolvePinType(loc, ts);
        if(markerCache[i]._pinType !== pinType) {
          markerCache[i].setIcon(icons[pinType]);
          markerCache[i]._pinType = pinType;
        }
        if(!isShown) toAdd.push(i);
      } else {
        if(isShown) toRemove.push(i);
      }
    });

    toRemove.forEach(i => { layerGroup.removeLayer(markerCache[i]); visible.delete(i); });
    toAdd.forEach(i    => { layerGroup.addLayer(markerCache[i]);    visible.add(i);    });
  }

  function sliderToDate() {
    const y = parseInt(yearSlider.value);
    const d = parseInt(daySlider.value);
    const date = new Date(y, 0);
    date.setDate(d);
    return date;
  }

  function setDisplay(date) {
    dateDisplay.textContent =
      String(date.getMonth()+1).padStart(2,'0') + '/' +
      String(date.getDate()).padStart(2,'0') + '/' +
      date.getFullYear();
    datePicker.value = date.toISOString().split('T')[0];
  }

  function syncDaySliderMax() {
    const max = isLeapYear(parseInt(yearSlider.value)) ? 366 : 365;
    daySlider.max = max;
    if(parseInt(daySlider.value) > max) daySlider.value = max;
  }

  let rafId = null;
  function scheduleRender() {
    if(rafId) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      const date = sliderToDate();
      setDisplay(date);
      renderMarkers(date);
    });
  }

  yearSlider.addEventListener('input', () => { syncDaySliderMax(); scheduleRender(); });
  daySlider.addEventListener('input', scheduleRender);
  datePicker.addEventListener('change', () => {
    const date = new Date(datePicker.value + 'T00:00:00');
    yearSlider.value = date.getFullYear();
    syncDaySliderMax();
    daySlider.value = getDayOfYear(date);
    scheduleRender();
  });

  const today = new Date();
  yearSlider.value = today.getFullYear();
  syncDaySliderMax();
  daySlider.value = getDayOfYear(today);
  setDisplay(today);
  renderMarkers(today);
}