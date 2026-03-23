/**
 * EditorParams.js
 * Renders editable fields for meta.json parameters.
 * Each field type knows how to render and read its value.
 */

// ── Date dropdown helper ──────────────────────────────────────────────────────
function makeDateDropdown(value, onChange) {
  // value format: "YYYY-MM-DD" with 0000/00 for unknown
  const parts = (value || '').split('-');
  let [y, m, d] = [parts[0] || '0000', parts[1] || '00', parts[2] || '00'];

  const wrap = document.createElement('div');
  wrap.className = 'EditorDateWrap';

  const yearSel = document.createElement('select');
  yearSel.className = 'EditorSelect';
  const monthSel = document.createElement('select');
  monthSel.className = 'EditorSelect';
  const daySel = document.createElement('select');
  daySel.className = 'EditorSelect';

  // Year
  const optPresent = document.createElement('option');
  optPresent.value = 'present'; optPresent.textContent = 'Present';
  yearSel.appendChild(optPresent);
  const optYUnk = document.createElement('option');
  optYUnk.value = '0000'; optYUnk.textContent = 'Unknown';
  yearSel.appendChild(optYUnk);
  for (let yr = new Date().getFullYear(); yr >= 1950; yr--) {
    const o = document.createElement('option');
    o.value = String(yr); o.textContent = String(yr);
    yearSel.appendChild(o);
  }
  yearSel.value = y === '' ? 'present' : y;

  // Month
  const MONTHS = ['Unknown','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  MONTHS.forEach((mn, i) => {
    const o = document.createElement('option');
    o.value = String(i).padStart(2,'0');
    o.textContent = mn;
    monthSel.appendChild(o);
  });
  monthSel.value = m;

  // Day
  const optDUnk = document.createElement('option');
  optDUnk.value = '00'; optDUnk.textContent = 'Unknown';
  daySel.appendChild(optDUnk);
  for (let day = 1; day <= 31; day++) {
    const o = document.createElement('option');
    o.value = String(day).padStart(2,'0'); o.textContent = String(day);
    daySel.appendChild(o);
  }
  daySel.value = d;

  const updateDisabled = () => {
    const isPresent = yearSel.value === 'present';
    monthSel.disabled = isPresent;
    daySel.disabled   = isPresent;
    monthSel.style.opacity = isPresent ? '0.4' : '';
    daySel.style.opacity   = isPresent ? '0.4' : '';
  };
  updateDisabled();

  const getVal = () => {
    if (yearSel.value === 'present') return '';
    return `${yearSel.value}-${monthSel.value}-${daySel.value}`;
  };

  yearSel.addEventListener('change',  () => { updateDisabled(); onChange(getVal()); });
  monthSel.addEventListener('change', () => onChange(getVal()));
  daySel.addEventListener('change',   () => onChange(getVal()));

  wrap.appendChild(yearSel);
  wrap.appendChild(monthSel);
  wrap.appendChild(daySel);
  return wrap;
}

// ── String array editor ───────────────────────────────────────────────────────
function makeStringArray(values, onChange, searchSuggestions = false) {
  const wrap = document.createElement('div');
  wrap.className = 'EditorArrayWrap';

  const items = [...(values || [])];

  const render = () => {
    wrap.innerHTML = '';
    items.forEach((val, i) => {
      const row = document.createElement('div');
      row.className = 'EditorArrayRow';
      const input = document.createElement('input');
      input.type = 'text';
      input.value = val;
      input.className = 'EditorInput';
      input.addEventListener('input', () => { items[i] = input.value; onChange([...items]); });
      if (searchSuggestions) wireSearchSuggestions(input, v => { items[i] = v; onChange([...items]); render(); });
      const del = document.createElement('button');
      del.className = 'EditorBtnSmall EditorBtnDanger';
      del.textContent = '✕';
      del.addEventListener('click', () => { items.splice(i, 1); onChange([...items]); render(); });
      row.appendChild(input); row.appendChild(del);
      wrap.appendChild(row);
    });
    const addBtn = document.createElement('button');
    addBtn.className = 'EditorBtnSmall';
    addBtn.textContent = '+ Add';
    addBtn.addEventListener('click', () => { items.push(''); onChange([...items]); render(); });
    wrap.appendChild(addBtn);
  };
  render();
  return wrap;
}

// ── Dict array editor (e.g. remodels, stages, animatronics) ──────────────────
function makeDictArray(values, fields, onChange) {
  // fields: [{key, label, type}] where type is 'string'|'date'|'search'
  const wrap = document.createElement('div');
  wrap.className = 'EditorDictArrayWrap';
  const items = (values || []).map(v => ({ ...v }));

  const render = () => {
    wrap.innerHTML = '';
    items.forEach((item, i) => {
      const card = document.createElement('div');
      card.className = 'EditorDictCard';
      fields.forEach(({ key, label, type }) => {
        const row = document.createElement('div');
        row.className = 'EditorFieldRow';
        const lbl = document.createElement('label');
        lbl.className = 'EditorLabel'; lbl.textContent = label;
        row.appendChild(lbl);
        if (type === 'date') {
          row.appendChild(makeDateDropdown(item[key] || '', v => { item[key] = v; onChange([...items]); }));
        } else {
          const inp = document.createElement('input');
          inp.type = 'text'; inp.value = item[key] || '';
          inp.className = 'EditorInput';
          if (type === 'search') wireSearchSuggestions(inp, v => { item[key] = v; onChange([...items]); });
          inp.addEventListener('input', () => { item[key] = inp.value; onChange([...items]); });
          row.appendChild(inp);
        }
        card.appendChild(row);
      });
      const del = document.createElement('button');
      del.className = 'EditorBtnSmall EditorBtnDanger';
      del.textContent = 'Remove';
      del.addEventListener('click', () => { items.splice(i, 1); onChange([...items]); render(); });
      card.appendChild(del);
      wrap.appendChild(card);
    });
    const addBtn = document.createElement('button');
    addBtn.className = 'EditorBtnSmall';
    addBtn.textContent = '+ Add Entry';
    addBtn.addEventListener('click', () => {
      const blank = {}; fields.forEach(f => blank[f.key] = '');
      items.push(blank); onChange([...items]); render();
    });
    wrap.appendChild(addBtn);
  };
  render();
  return wrap;
}

// ── Search suggestions (using tags.json — same source as Search.js) ──────────
let _tagKeysCache = null;
async function getTagKeys() {
  if (_tagKeysCache) return _tagKeysCache;
  try {
    const r = await fetch('/viewers/cep-js/compiled-json/search/tags.json');
    const tags = r.ok ? await r.json() : {};
    _tagKeysCache = Object.keys(tags).sort((a,b) => a.localeCompare(b, undefined, {sensitivity:'base'}));
  } catch { _tagKeysCache = []; }
  return _tagKeysCache;
}

function norm(s) { return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''); }
const esc2 = s => s ? String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') : '';

function wireSearchSuggestions(input, onSelect) {
  // Create suggestion dropdown using same classes as Search.js
  const suggestBox = document.createElement('div');
  suggestBox.className = 'EditorSuggestBox';
  suggestBox.style.display = 'none';
  // Insert after the input's parent row
  input.insertAdjacentElement('afterend', suggestBox);

  let allKeys = [];
  getTagKeys().then(keys => { allKeys = keys; });

  let suggestIdx = -1;

  const showSuggestions = (q) => {
    if (!q) { hideSuggestions(); return; }
    const qn = norm(q);
    if (!qn) { hideSuggestions(); return; }
    const matches = allKeys.filter(t => norm(t).includes(qn)).slice(0, 12);
    if (!matches.length) { hideSuggestions(); return; }
    suggestBox.innerHTML = '';
    matches.forEach((t, i) => {
      const el = document.createElement('div');
      el.className = 's-suggest-item';
      el.dataset.i = i;
      el.innerHTML = `<span>${esc2(t)}</span>`;
      el.onmousedown = ev => { ev.preventDefault(); input.value = t; onSelect(t); hideSuggestions(); };
      el.onmouseover = () => { suggestIdx = i; highlight(); };
      suggestBox.appendChild(el);
    });
    suggestBox.style.display = 'block';
    suggestIdx = -1;
  };

  const hideSuggestions = () => { suggestBox.style.display = 'none'; suggestBox.innerHTML = ''; suggestIdx = -1; };
  const highlight = () => Array.from(suggestBox.children).forEach((el,i) => el.classList.toggle('active', i===suggestIdx));

  input.addEventListener('input', () => showSuggestions(input.value));
  input.addEventListener('blur', () => setTimeout(hideSuggestions, 150));
  input.addEventListener('keydown', e => {
    const items = Array.from(suggestBox.children);
    if (e.key === 'ArrowDown') { e.preventDefault(); suggestIdx = Math.min(suggestIdx+1, items.length-1); highlight(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); suggestIdx = Math.max(suggestIdx-1, 0); highlight(); }
    else if (e.key === 'Enter' && suggestIdx >= 0) { e.preventDefault(); const t = items[suggestIdx].querySelector('span').textContent; input.value = t; onSelect(t); hideSuggestions(); }
    else if (e.key === 'Escape') hideSuggestions();
  });
  input.addEventListener('change', () => onSelect(input.value));
}

// ── Download links editor ─────────────────────────────────────────────────────
function makeDownloadLinks(values, onChange) {
  const wrap = document.createElement('div');
  wrap.className = 'EditorArrayWrap';
  const items = (values || []).map(v => ({ ...v }));

  const render = () => {
    wrap.innerHTML = '';
    items.forEach((item, i) => {
      const card = document.createElement('div');
      card.className = 'EditorDictCard';
      ['url','label'].forEach(key => {
        const row = document.createElement('div');
        row.className = 'EditorFieldRow';
        const lbl = document.createElement('label');
        lbl.className = 'EditorLabel';
        lbl.textContent = key === 'url' ? 'URL' : 'Label';
        const inp = document.createElement('input');
        inp.type = 'text'; inp.value = item[key] || '';
        inp.className = 'EditorInput';
        inp.addEventListener('input', () => { item[key] = inp.value; onChange([...items]); });
        row.appendChild(lbl); row.appendChild(inp);
        card.appendChild(row);
      });
      const del = document.createElement('button');
      del.className = 'EditorBtnSmall EditorBtnDanger';
      del.textContent = 'Remove';
      del.addEventListener('click', () => { items.splice(i, 1); onChange([...items]); render(); });
      card.appendChild(del);
      wrap.appendChild(card);
    });
    const addBtn = document.createElement('button');
    addBtn.className = 'EditorBtnSmall';
    addBtn.textContent = '+ Add Link';
    addBtn.addEventListener('click', () => { items.push({url:'',label:''}); onChange([...items]); render(); });
    wrap.appendChild(addBtn);
  };
  render();
  return wrap;
}

// ── Credits editor ───────────────────────────────────────────────────────────
function makeCredits(values, onChange) {
  const wrap = document.createElement('div');
  wrap.className = 'EditorArrayWrap';
  const items = (values || []).map(v => typeof v === 'string' ? {n:v, role:''} : {...v});

  const render = () => {
    wrap.innerHTML = '';
    items.forEach((item, i) => {
      const card = document.createElement('div');
      card.className = 'EditorDictCard';
      [{key:'n',label:'Name'},{key:'role',label:'Role'}].forEach(({key,label}) => {
        const row = document.createElement('div');
        row.className = 'EditorFieldRow';
        const lbl = document.createElement('label');
        lbl.className = 'EditorLabel'; lbl.textContent = label;
        const inp = document.createElement('input');
        inp.type = 'text'; inp.value = item[key] || '';
        inp.className = 'EditorInput';
        if (key === 'n') {
          // Wire search suggestions for name field
          wireSearchSuggestions(inp, v => { item[key] = v; onChange([...items]); });
        }
        inp.addEventListener('input', () => { item[key] = inp.value; onChange([...items]); });
        row.appendChild(lbl); row.appendChild(inp);
        card.appendChild(row);
      });
      const del = document.createElement('button');
      del.className = 'EditorBtnSmall EditorBtnDanger'; del.textContent = 'Remove';
      del.addEventListener('click', () => { items.splice(i, 1); onChange([...items]); render(); });
      card.appendChild(del);
      wrap.appendChild(card);
    });
    const addBtn = document.createElement('button');
    addBtn.className = 'EditorBtnSmall'; addBtn.textContent = '+ Add Credit';
    addBtn.addEventListener('click', () => { items.push({n:'',role:''}); onChange([...items]); render(); });
    wrap.appendChild(addBtn);
  };
  render();
  return wrap;
}

// ── Lat/lon editor ────────────────────────────────────────────────────────────
function makeLatLon(value, onChange) {
  const wrap = document.createElement('div');
  wrap.className = 'EditorArrayRow';
  const [lat, lon] = value || ['',''];
  ['Latitude','Longitude'].forEach((label, i) => {
    const lbl = document.createElement('label');
    lbl.className = 'EditorLabel'; lbl.textContent = label;
    const inp = document.createElement('input');
    inp.type = 'text'; inp.className = 'EditorInput';
    inp.value = i === 0 ? lat : lon;
    inp.addEventListener('input', () => {
      const vals = wrap.querySelectorAll('input');
      onChange([vals[0].value, vals[1].value]);
    });
    wrap.appendChild(lbl); wrap.appendChild(inp);
  });
  return wrap;
}

// ── Main parameter schema ─────────────────────────────────────────────────────
// Defines every editable param: which types it appears on, how to render it.
// types: whitelist — only show on these types (null = all standard types)
// excludeTypes: blacklist — never show on these types
const STANDARD = null; // shown on all non-special types unless excluded
const PHOTO_VIDEO_REVIEW_TRANS = ['Photos','Videos','Reviews','Transcriptions'];

const PARAM_SCHEMA = [
  { key:'type',              label:'Type',              types:null,                                                  render:'type-select'  },
  { key:'tags',              label:'Tags',              types:null,                                                  render:'search-array' },
  { key:'startDate',         label:'Start Date',        types:null,       excludeTypes:['Transcriptions'],           render:'date'         },
  { key:'endDate',           label:'End Date',          types:null,       excludeTypes:[...PHOTO_VIDEO_REVIEW_TRANS],render:'date'         },
  { key:'storeNumber',       label:'Store Number',      types:['Locations'],                                         render:'string'       },
  { key:'sqft',              label:'Sq Ft',             types:['Locations'],                                         render:'string'       },
  { key:'latitudeLongitude', label:'Coordinates',       types:['Locations'],                                         render:'latlon'       },
  { key:'pageThumbnailFile', label:'Thumbnail Page',    types:null,       excludeTypes:PHOTO_VIDEO_REVIEW_TRANS,      render:'search'       },
  { key:'citations',         label:'Citations',         types:null,                                                  render:'string-array' },
  { key:'mirroredLinks',     label:'Mirrored Links',    types:['Videos'],                                            render:'string-array' },
  { key:'recommend',         label:'Recommend',         types:['Reviews'],                                           render:'bool'         },
  { key:'quotes',            label:'Quotes',            types:['User'],                                              render:'string-array' },
  { key:'remodels',          label:'Remodels',          types:['Locations'],                                         render:'dict-remodels'},
  { key:'stages',            label:'Stages',            types:['Locations'],                                         render:'dict-stages'  },
  { key:'animatronics',      label:'Animatronics',      types:['Locations'],                                         render:'dict-animatronics'},
  { key:'attractions',       label:'Attractions',       types:['Locations'],                                         render:'dict-attractions'},
  { key:'franchisees',       label:'Franchisees',       types:['Locations'],                                         render:'dict-franchisees'},
  { key:'credits',           label:'Credits',           types:null,       excludeTypes:PHOTO_VIDEO_REVIEW_TRANS,      render:'credits'      },
  { key:'downloadLinks',     label:'Download Links',    types:null,       excludeTypes:PHOTO_VIDEO_REVIEW_TRANS,      render:'download-links'},
];

const TYPE_OPTIONS = [
  'Animatronics','Animatronic Shows','Animatronic Parts','Animatronic Preservation',
  'Stage Variations','Costumed Characters','Characters','Locations','Cancelled Locations',
  'Showtapes','Showtape Formats','ShowBiz Pizza Programs','Family Vision','Live Shows',
  'Puppets','Commercials','News Footage','Company Media','Movies','Transcriptions',
  'Video Games','Menu Items','Tickets','Tokens','Documents','Corporate Documents',
  'Promotional Material','Events','Remodels and Initiatives','Retrofits','History',
  'Arcades and Attractions','Companies/Brands','Animatronic Control Systems',
  'Other Systems','Programming Systems','Simulators','Social Media and Websites',
  'Ad Vehicles','In-Store Merchandise','Products','Employee Wear','Meta','Store Fixtures',
  'Photos','Videos','Reviews','User',
];

const DICT_FIELDS = {
  'dict-remodels':      [{key:'n',label:'Name',type:'search'},{key:'s',label:'Start',type:'date'},{key:'e',label:'End',type:'date'}],
  'dict-stages':        [{key:'n',label:'Name',type:'search'},{key:'s',label:'Start',type:'date'},{key:'e',label:'End',type:'date'}],
  'dict-animatronics':  [{key:'n',label:'Name',type:'search'},{key:'s',label:'Start',type:'date'},{key:'e',label:'End',type:'date'},{key:'l',label:'Serial #',type:'string'}],
  'dict-attractions':   [{key:'n',label:'Name',type:'search'},{key:'s',label:'Start',type:'date'},{key:'e',label:'End',type:'date'}],
  'dict-franchisees':   [{key:'n',label:'Name',type:'search'},{key:'s',label:'Start',type:'date'},{key:'e',label:'End',type:'date'}],
};

/**
 * Render all editable parameters for a given meta object.
 * onChange(key, value) is called whenever a field changes.
 * onTypeChange(newType) is called when the type field changes — caller should reload.
 */
export function renderParams(container, meta, onChange, onTypeChange, onAdd, _explicitKeys) {
  container.innerHTML = '';
  const articleType = meta.type || '';

  PARAM_SCHEMA.forEach(({ key, label, types, excludeTypes, render }) => {
    // Skip if not applicable to this article type
    if (types && !types.includes(articleType)) return;
    // Skip if explicitly excluded for this type
    if (excludeTypes && excludeTypes.includes(articleType)) return;
    const val = meta[key];
    const alwaysShow = ['type','tags','startDate','endDate'].includes(key);
    const explicitlyAdded = _explicitKeys && _explicitKeys.has(key);
    // Skip if empty and not always-shown and not explicitly added by the user
    if (!alwaysShow && !explicitlyAdded && (val === undefined || val === null || val === '' || (Array.isArray(val) && !val.length))) return;

    const fieldWrap = document.createElement('div');
    fieldWrap.className = 'EditorFieldGroup';
    const lbl = document.createElement('label');
    lbl.className = 'EditorLabel EditorLabelBig';
    lbl.textContent = label;
    fieldWrap.appendChild(lbl);

    let widget;
    switch (render) {
      case 'type-select': {
        const sel = document.createElement('select');
        sel.className = 'EditorSelect';
        TYPE_OPTIONS.forEach(t => {
          const o = document.createElement('option');
          o.value = t; o.textContent = t;
          sel.appendChild(o);
        });
        sel.value = val || '';
        sel.addEventListener('change', () => {
          onChange(key, sel.value);
          onTypeChange(sel.value);
        });
        widget = sel; break;
      }
      case 'string': {
        const inp = document.createElement('input');
        inp.type = 'text'; inp.className = 'EditorInput'; inp.value = val || '';
        inp.addEventListener('input', () => onChange(key, inp.value));
        widget = inp; break;
      }
      case 'search': {
        const inp = document.createElement('input');
        inp.type = 'text'; inp.className = 'EditorInput'; inp.value = val || '';
        wireSearchSuggestions(inp, v => onChange(key, v));
        inp.addEventListener('input', () => onChange(key, inp.value));
        widget = inp; break;
      }
      case 'bool': {
        const sel = document.createElement('select');
        sel.className = 'EditorSelect';
        [{v:'',t:'—'},{v:'true',t:'Yes'},{v:'false',t:'No'}].forEach(({v,t}) => {
          const o = document.createElement('option'); o.value = v; o.textContent = t; sel.appendChild(o);
        });
        sel.value = val === true ? 'true' : val === false ? 'false' : '';
        sel.addEventListener('change', () => onChange(key, sel.value === 'true' ? true : sel.value === 'false' ? false : null));
        widget = sel; break;
      }
      case 'date': {
        widget = makeDateDropdown(val || '', v => onChange(key, v)); break;
      }
      case 'string-array': {
        widget = makeStringArray(val, v => onChange(key, v), false); break;
      }
      case 'search-array': {
        widget = makeStringArray(val, v => onChange(key, v), true); break;
      }
      case 'latlon': {
        widget = makeLatLon(val, v => onChange(key, v)); break;
      }
      case 'download-links': {
        widget = makeDownloadLinks(val, v => onChange(key, v)); break;
      }
      case 'credits': {
        widget = makeCredits(val, v => onChange(key, v)); break;
      }
      default: {
        if (render.startsWith('dict-')) {
          widget = makeDictArray(val, DICT_FIELDS[render] || [], v => onChange(key, v));
        } else {
          widget = document.createElement('span');
          widget.textContent = JSON.stringify(val);
        }
      }
    }

    fieldWrap.appendChild(widget);
    container.appendChild(fieldWrap);
  });

  // Add parameter button for fields not currently present
  const addBtn = document.createElement('button');
  addBtn.className = 'EditorBtnSmall';
  addBtn.textContent = '+ Add Parameter';
  addBtn.addEventListener('click', () => {
    const existing = new Set(PARAM_SCHEMA.filter(p => meta[p.key] !== undefined).map(p => p.key));
    const available = PARAM_SCHEMA.filter(p => !existing.has(p.key) && (!p.types || p.types.includes(articleType)));
    if (!available.length) { addBtn.textContent = 'No more parameters available'; return; }
    const sel = document.createElement('select');
    sel.className = 'EditorSelect';
    available.forEach(p => {
      const o = document.createElement('option'); o.value = p.key; o.textContent = p.label; sel.appendChild(o);
    });
    const confirm = document.createElement('button');
    confirm.className = 'EditorBtnSmall';
    confirm.textContent = 'Add';
    confirm.addEventListener('click', () => {
      const schema = PARAM_SCHEMA.find(p => p.key === sel.value);
      const defaults = { 'string-array':[], 'search-array':[], date:'0000-00-00', bool:false, string:'', 'latlon':['',''], 'download-links':[] };
      const defVal = defaults[schema?.render] ?? '';
      if (onAdd) {
        onAdd(sel.value, defVal); // caller handles re-render with updated explicitKeys
      } else {
        onChange(sel.value, defVal);
        const newExplicit = new Set(_explicitKeys || []);
        newExplicit.add(sel.value);
        renderParams(container, { ...meta, [sel.value]: defVal }, onChange, onTypeChange, null, newExplicit);
      }
    });
    addBtn.replaceWith(sel, confirm);
  });
  container.appendChild(addBtn);
}
