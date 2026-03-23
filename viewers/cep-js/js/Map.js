
const PINS_URL    = '/viewers/cep-js/compiled-json/map_pins.json';
const ICON_BASE   = '/viewers/cep-js/assets/Map Markers/';
const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
const LEAFLET_JS  = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
const PIN_FILES = { ptt:'ptt.png', spp:'spp.png', cec:'cec.png', other:'other.png' };

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

// Pin type is date-driven:
//   ShowBiz Pizza Place → SPP before cuDate, CEC on/after
//   Pizza Time Theatre or Chuck E. Cheese's → PTT before Oct 1984, CEC on/after
//   anything else → other
const PTT_CEC_CUTOVER = new Date('1984-10-01').getTime();

function resolvePinType(loc, currentDate) {
  const tags = loc.tags || [];
  const ts   = currentDate.getTime();

  if(tags.includes("ShowBiz Pizza Place")) {
    return ts >= loc._cu ? 'cec' : 'spp';
  }
  if(tags.includes("Pizza Time Theatre") || tags.includes("Chuck E. Cheese's")) {
    return ts >= PTT_CEC_CUTOVER ? 'cec' : 'ptt';
  }
  return 'other';
}

function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date - start) / 86400000);
}

function isLeapYear(y) {
  return new Date(y, 1, 29).getDate() === 29;
}

export async function initMap(container) {
  await loadLeaflet();
  const L = window.L;

  // ── DOM ───────────────────────────────────────────────────────────────────
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
    <div class="MapPinLegend">
      <span><img src="${ICON_BASE}ptt.png" width="20"> Pizza Time Theatre</span>
      <span><img src="${ICON_BASE}spp.png" width="20"> ShowBiz Pizza Place</span>
      <span><img src="${ICON_BASE}cec.png" width="20"> Chuck E. Cheese's</span>
      <span><img src="${ICON_BASE}other.png" width="20"> Other</span>
    </div>
  `;
  container.appendChild(controlsEl);

  const yearSlider  = controlsEl.querySelector('#MapYearSlider');
  const daySlider   = controlsEl.querySelector('#MapDaySlider');
  const datePicker  = controlsEl.querySelector('#MapDatePicker');
  const dateDisplay = controlsEl.querySelector('#MapDateDisplay');

  // ── Leaflet ───────────────────────────────────────────────────────────────
  const map = L.map(mapEl).setView([38, -96], 4); // Default to continental US
  L.tileLayer(
    'https://services.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}',
    { minZoom: 1, maxZoom: 16, attribution: 'Tiles © Esri' }
  ).addTo(map);

  // Pre-build icon objects
  const icons = Object.fromEntries(
    Object.entries(PIN_FILES).map(([k, f]) => [k, L.icon({
      iconUrl: ICON_BASE + f,
      iconSize: [48, 48], iconAnchor: [24, 48], popupAnchor: [0, -48],
    })])
  );

  // ── Data ──────────────────────────────────────────────────────────────────
  let locations = [];
  try {
    const r = await fetch(PINS_URL);
    if(r.ok) locations = (await r.json()).locations || [];
  } catch(e) { console.error('MapView: failed to load map_pins.json', e); }

  // Pre-parse dates once so we're not parsing strings every render frame
  locations.forEach(loc => {
    loc._start = new Date(loc.startDate).getTime();
    loc._end   = new Date(loc.endDate).getTime();
    loc._cu    = new Date(loc.cuDate).getTime();
  });

  // ── Delta rendering ───────────────────────────────────────────────────────
  // Only add/remove markers that cross the visibility boundary each frame.
  // Markers are created once and reused; only icon swaps happen mid-life.
  const markerCache = new Array(locations.length).fill(null);
  const visible     = new Set(); // indices currently on the map
  const layerGroup  = L.layerGroup().addTo(map);

  function renderMarkers(currentDate) {
    const ts   = currentDate.getTime();
    const toAdd = [], toRemove = [];

    locations.forEach((loc, i) => {
      const shouldShow = ts >= loc._start && ts <= loc._end;
      const isShown    = visible.has(i);

      if(shouldShow) {
        // Ensure marker exists
        if(!markerCache[i]) {
          markerCache[i] = L.marker(loc.coords)
            .bindPopup(`<a href="/?v=cep-js&=${encodeURIComponent(loc.p)}">${loc.title}</a>`);
          markerCache[i]._pinType = null;
        }
        // Update icon only if pin type has changed
        const pinType = resolvePinType(loc, currentDate);
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

  // ── Date helpers ──────────────────────────────────────────────────────────
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

  // Throttle renders to one per animation frame
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

  // ── Events ────────────────────────────────────────────────────────────────
  yearSlider.addEventListener('input', () => { syncDaySliderMax(); scheduleRender(); });
  daySlider.addEventListener('input', scheduleRender);
  datePicker.addEventListener('change', () => {
    const date = new Date(datePicker.value + 'T00:00:00');
    yearSlider.value = date.getFullYear();
    syncDaySliderMax();
    daySlider.value = getDayOfYear(date);
    scheduleRender();
  });

  // ── Init to today ─────────────────────────────────────────────────────────
  const today = new Date();
  yearSlider.value = today.getFullYear();
  syncDaySliderMax();
  daySlider.value = getDayOfYear(today);
  setDisplay(today);
  renderMarkers(today);
}