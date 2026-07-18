const FILE_MAP = {
  'content.md':    { name: 'Content',  type: 'text'  },
  'old.md':        { name: 'Old',      type: 'text'  },
  'meta.json':     { name: 'Meta',     type: 'text'  },
  'photo.avif':    { name: 'Photo',    type: 'image' },
  'lowphoto.avif': { name: 'LowPhoto', type: 'image' },
};

const TOAST_CSS = 'https://uicdn.toast.com/editor/latest/toastui-editor.min.css';
const TOAST_JS  = 'https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js';
const JSZIP_JS  = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
const SUGGESTIONS_URL = '/viewers/cep-js/compiled-json/Suggestions.json';

const META_MAP = {
  title:              { type: 'line',     el: 'MetaTitle' },
  type:               { type: 'dropdown', el: 'MetaType' },
  pageThumbnailFile:  { type: 'line',     el: 'MetaThumbnail' },
  downloadLinks:      { type: 'list',     el: 'MetaDownloads' },
  citations:          { type: 'list',     el: 'MetaCitations' },
  tags:               { type: 'list',     el: 'MetaTags' },
  startDate:          { type: 'date',     el: 'MetaStartDate' },
  endDate:            { type: 'date',     el: 'MetaEndDate' },
  credits: {
    type: 'objectList', el: 'MetaCredits',
    fields: [
      { key: 'role', label: 'Role', type: 'line' },
      { key: 'n',    label: 'Name', type: 'line', suggestions: 'credits' },
    ],
  },
  stages: {
    type: 'objectList', el: 'MetaStages',
    fields: [
      { key: 'n',    label: 'Name',        type: 'line', suggestions: 'stages' },
      { key: 'desc', label: 'Notes', type: 'line' },
      { key: 's',    label: 'Start',       type: 'date', break: true },
      { key: 'e',    label: 'End',         type: 'date' },
    ],
  },
  remodels: {
    type: 'objectList', el: 'MetaRemodels',
    fields: [
      { key: 'n', label: 'Name',  type: 'line', suggestions: 'remodels' },
      { key: 's', label: 'Start', type: 'date' },
    ],
  },
  franchisees: {
    type: 'objectList', el: 'MetaFranchisees',
    fields: [
      { key: 'n', label: 'Name',  type: 'line', suggestions: 'franchisees' },
      { key: 's', label: 'Start', type: 'date', break: true },
      { key: 'e', label: 'End',   type: 'date' },
    ],
  },
  animatronics: {
    type: 'objectList', el: 'MetaAnimatronics',
    fields: [
      { key: 'n',    label: 'Name',        type: 'line', suggestions: 'animatronics' },
      { key: 'desc', label: 'Notes', type: 'line' },
      { key: 'l',    label: 'Serial Number',    type: 'line' },
      { key: 's',    label: 'Start',       type: 'date', break: true },
      { key: 'e',    label: 'End',         type: 'date' },
    ],
  },
  attractions: {
    type: 'objectList', el: 'MetaAttractions',
    fields: [
      { key: 'n',    label: 'Name',        type: 'line', suggestions: 'attractions' },
      { key: 'desc', label: 'Notes', type: 'line' },
      { key: 's',    label: 'Start',       type: 'date', break: true },
      { key: 'e',    label: 'End',         type: 'date' },
    ],
  },
  showtapeFormats: { type: 'list', el: 'MetaShowtapeFormats', suggestions: 'showtapeFormats' },
};

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

let scratch = {};
let currentFolder = null;
let toastEditor = null;
let firstValidFile = null;
let metaData = {};
let SUGGESTIONS = {};
let suggestionsLoaded = false;

async function loadSuggestions() {
  if (suggestionsLoaded) return;
  try {
    const res = await fetch(SUGGESTIONS_URL);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    SUGGESTIONS = await res.json();
    suggestionsLoaded = true;
  } catch (err) {
    console.warn('Failed to load suggestions:', err);
  }
}

const sugg = key => SUGGESTIONS[key] || [];

async function loadToast() {
  if (window.toastui?.Editor) return window.toastui.Editor;
  if (!document.querySelector(`link[href="${TOAST_CSS}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = TOAST_CSS;
    document.head.appendChild(link);
  }
  await new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = TOAST_JS;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
  return window.toastui.Editor;
}

async function loadJSZip() {
  if (window.JSZip) return;
  await new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = JSZIP_JS;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function showEdit() {
  document.getElementById('EditBlock').style.display = '';
  document.getElementById('EditRawBlock').style.display = 'none';

  initMetaFields();

  if (!toastEditor) {
    const Editor = await loadToast();
    toastEditor = new Editor({
      el: document.getElementById('ToastUI'),
      initialEditType: 'wysiwyg',
      previewStyle: 'tab',
      height: '50em',
      initialValue: scratch['content.md'] || '',
      events: { change: () => { scratch['content.md'] = toastEditor.getMarkdown(); } },
    });
  } else {
    toastEditor.setMarkdown(scratch['content.md'] || '');
  }
}

function showEditRaw() {
  document.getElementById('EditBlock').style.display = 'none';
  document.getElementById('EditRawBlock').style.display = '';
  if (firstValidFile) showRaw(firstValidFile, FILE_MAP[firstValidFile]);
}

export async function loadFolder(folder) {
  currentFolder = folder;
  scratch = {};
  firstValidFile = null;

  await loadSuggestions();

  for (const [file, cfg] of Object.entries(FILE_MAP)) {
    const btn = document.getElementById(`Button${cfg.name}`);
    document.getElementById(`Raw${cfg.name}`).style.display = 'none';
    btn.onclick = () => showRaw(file, cfg);

    const url = `/content/${folder}/${file}`;
    const head = await fetch(url, { method: 'HEAD' });

    if (!head.ok) {
      btn.style.display = 'none';
      continue;
    }

    btn.style.display = '';
    if (!firstValidFile) firstValidFile = file;

    if (cfg.type === 'text') {
      scratch[file] = await (await fetch(url)).text();
      document.getElementById(`File${cfg.name}`).addEventListener('input', e => {
        scratch[file] = e.target.value;
      });
    } else {
      scratch[file] = await (await fetch(url)).blob();
    }
  }

  document.getElementById('ButtonEdit').onclick = showEdit;
  document.getElementById('ButtonEditRaw').onclick = showEditRaw;
  document.getElementById('ZipDownload').onclick = downloadAllAsZip;
  document.getElementById('ButtonAddPhoto').onclick = replacePhoto;
  document.getElementById('ButtonReplacePhoto').onclick = replacePhoto;
  document.getElementById('ZipReupload').onclick = reuploadZip;

  refreshPhotoButtons();
  showEdit();
}

function showRaw(file, cfg) {
  const el = document.getElementById(`File${cfg.name}`);
  if (cfg.type === 'text') el.value = scratch[file];
  else el.src = URL.createObjectURL(scratch[file]);

  for (const c of Object.values(FILE_MAP)) {
    document.getElementById(`Raw${c.name}`).style.display = c.name === cfg.name ? '' : 'none';
  }
}

function loadMetaData() {
  try {
    metaData = JSON.parse(scratch['meta.json'] || '{}');
  } catch {
    metaData = {};
  }
}

function saveMetaData() {
  scratch['meta.json'] = JSON.stringify(metaData, null, 2);
}

function applyBreak(el) {
  if (!el || el.nextElementSibling?.classList.contains('MetaLineBreak')) return;
  const brk = document.createElement('div');
  brk.className = 'MetaLineBreak';
  el.insertAdjacentElement('afterend', brk);
}

function initMetaFields() {
  loadMetaData();
  for (const [key, cfg] of Object.entries(META_MAP)) {
    RENDERERS[cfg.type](key, cfg);
    if (cfg.break) applyBreak(document.getElementById(cfg.el));
  }
}

function attachSuggestions(input, list) {
  if (!list?.length || input.dataset.suggestBound) return;
  input.dataset.suggestBound = '1';

  const wrap = document.createElement('div');
  wrap.className = 'MetaSuggestWrap';
  input.replaceWith(wrap);
  wrap.appendChild(input);

  const box = document.createElement('div');
  box.className = 'MetaSuggestBox';
  wrap.appendChild(box);

  let matches = [];
  let active = -1;

  const close = () => { box.style.display = 'none'; box.innerHTML = ''; matches = []; active = -1; };

  const highlight = idx => {
    active = idx;
    [...box.children].forEach((el, i) => el.classList.toggle('active', i === idx));
  };

  const pick = idx => {
    if (idx < 0 || idx >= matches.length) return;
    input.value = matches[idx];
    input.dispatchEvent(new Event('input'));
    close();
  };

  const render = () => {
    const q = input.value.trim().toLowerCase();
    matches = q ? list.filter(s => s.toLowerCase().includes(q)).slice(0, 8) : [];
    box.innerHTML = '';
    if (!matches.length) { box.style.display = 'none'; return; }
    matches.forEach((s, i) => {
      const opt = document.createElement('div');
      opt.className = 'MetaSuggestItem';
      opt.textContent = s;
      opt.onmousedown = e => { e.preventDefault(); pick(i); };
      box.appendChild(opt);
    });
    box.style.display = 'block';
    highlight(0);
  };

  input.addEventListener('input', render);
  input.addEventListener('focus', render);
  input.addEventListener('blur', () => setTimeout(close, 100));
  input.addEventListener('keydown', e => {
    if (!matches.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); highlight((active + 1) % matches.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); highlight((active - 1 + matches.length) % matches.length); }
    else if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); pick(active); }
    else if (e.key === 'Escape') close();
  });
}

function bindLine(el, value, onChange, suggestions) {
  el.value = value || '';
  el.oninput = () => onChange(el.value);
  attachSuggestions(el, suggestions);
}

function bindDropdown(el, value, onChange, options) {
  el.innerHTML = '';
  for (const opt of options) {
    const o = document.createElement('option');
    o.value = opt;
    o.textContent = opt;
    el.appendChild(o);
  }
  el.value = value || options[0];
  el.onchange = () => onChange(el.value);
}

function bindExistingDropdown(el, value, onChange) {
  if (value) {
    const match = Array.from(el.options).find(o => o.value === value);
    if (match) el.value = match.value;
  }
  el.onchange = () => onChange(el.value);
}

function makeSelect(items, value) {
  const el = document.createElement('select');
  for (const [v, label] of items) {
    const o = document.createElement('option');
    o.value = v;
    o.textContent = label;
    el.appendChild(o);
  }
  el.value = value;
  return el;
}

function buildDateField(container, value, onChange) {
  container.innerHTML = '';
  const isPresent = value === '';
  const [y, m, d] = (isPresent ? '0000-00-00' : (value || '0000-00-00')).split('-');
  const currentYear = new Date().getFullYear();

  const years = [['PRESENT', 'Present'], ['0000', 'Unknown']];
  for (let yr = 1900; yr <= currentYear + 1; yr++) years.push([String(yr), yr]);

  const months = [['00', 'Unknown']];
  MONTHS.forEach((name, i) => months.push([String(i + 1).padStart(2, '0'), name]));

  const days = [['00', 'Unknown']];
  for (let dd = 1; dd <= 31; dd++) days.push([String(dd).padStart(2, '0'), dd]);

  const yearSel = makeSelect(years, isPresent ? 'PRESENT' : y);
  const monthSel = makeSelect(months, m);
  const daySel = makeSelect(days, d);

  const sync = () => {
    const present = yearSel.value === 'PRESENT';
    if (yearSel.value === '0000') monthSel.value = '00';
    const monthUnknown = monthSel.value === '00';
    if (monthUnknown) daySel.value = '00';
    monthSel.disabled = present;
    daySel.disabled = present || monthUnknown;
  };

  const emit = () => {
    sync();
    onChange(yearSel.value === 'PRESENT' ? '' : `${yearSel.value}-${monthSel.value}-${daySel.value}`);
  };

  yearSel.onchange = monthSel.onchange = daySel.onchange = emit;
  sync();

  container.append(yearSel, monthSel, daySel);
}

function makeSimpleRenderer(bindFn) {
  return (key, cfg) => {
    const el = document.getElementById(cfg.el);
    if (!el) return;
    bindFn(el, metaData[key], v => { metaData[key] = v; saveMetaData(); });
  };
}

function renderListField(key, cfg) {
  const container = document.getElementById(cfg.el);
  if (!container) return;

  const items = metaData[key] || [];
  container.innerHTML = '';

  items.forEach((val, i) => {
    const row = document.createElement('div');
    row.className = 'MetaListRow';

    const label = document.createElement('span');
    label.textContent = `${i + 1}.`;

    const input = document.createElement('input');
    input.type = 'text';
    row.append(label, input);
    bindLine(input, val, v => {
      items[i] = v;
      metaData[key] = items;
      saveMetaData();
    }, sugg(cfg.suggestions));

    const removeBtn = document.createElement('button');
    removeBtn.textContent = '−';
    removeBtn.onclick = () => {
      items.splice(i, 1);
      metaData[key] = items;
      saveMetaData();
      renderListField(key, cfg);
    };

    row.appendChild(removeBtn);
    container.appendChild(row);
  });

  const addBtn = document.createElement('button');
  addBtn.textContent = 'Add';
  addBtn.onclick = () => {
    items.push('');
    metaData[key] = items;
    saveMetaData();
    renderListField(key, cfg);
  };
  container.appendChild(addBtn);
}

function renderObjectListField(key, cfg) {
  const container = document.getElementById(cfg.el);
  if (!container) return;

  const items = metaData[key] || [];
  container.innerHTML = '';

  const lines = [];
  for (const f of cfg.fields) {
    if (f.break || !lines.length) lines.push([]);
    lines[lines.length - 1].push(f);
  }

  items.forEach((item, i) => {
    const row = document.createElement('div');
    row.className = 'MetaObjectRow';

    let lastLine = null;
    for (const line of lines) {
      const lineEl = document.createElement('div');
      lineEl.className = 'MetaFieldLine';

      for (const f of line) {
        const field = document.createElement('div');
        field.className = 'MetaField';

        const flabel = document.createElement('label');
        flabel.textContent = f.label;
        field.appendChild(flabel);

        const onChange = v => {
          item[f.key] = v;
          metaData[key] = items;
          saveMetaData();
        };

        if (f.type === 'line') {
          const input = document.createElement('input');
          input.type = 'text';
          field.appendChild(input);
          bindLine(input, item[f.key], onChange, sugg(f.suggestions));
        } else if (f.type === 'dropdown') {
          const select = document.createElement('select');
          bindDropdown(select, item[f.key], onChange, f.options);
          field.appendChild(select);
        } else if (f.type === 'date') {
          const dateWrap = document.createElement('div');
          dateWrap.className = 'MetaDateGroup';
          buildDateField(dateWrap, item[f.key], onChange);
          field.appendChild(dateWrap);
        }

        lineEl.appendChild(field);
      }

      row.appendChild(lineEl);
      lastLine = lineEl;
    }

    const removeBtn = document.createElement('button');
    removeBtn.textContent = '−';
    removeBtn.onclick = () => {
      items.splice(i, 1);
      metaData[key] = items;
      saveMetaData();
      renderObjectListField(key, cfg);
    };
    (lastLine || row).appendChild(removeBtn);

    container.appendChild(row);
  });

  const addBtn = document.createElement('button');
  addBtn.textContent = 'Add';
  addBtn.onclick = () => {
    const blank = {};
    for (const f of cfg.fields) blank[f.key] = f.type === 'date' ? '0000-00-00' : '';
    items.push(blank);
    metaData[key] = items;
    saveMetaData();
    renderObjectListField(key, cfg);
  };
  container.appendChild(addBtn);
}

const RENDERERS = {
  line: (key, cfg) => {
    const el = document.getElementById(cfg.el);
    if (!el) return;
    bindLine(el, metaData[key], v => { metaData[key] = v; saveMetaData(); }, sugg(cfg.suggestions));
  },
  dropdown: makeSimpleRenderer(bindExistingDropdown),
  date: makeSimpleRenderer(buildDateField),
  list: renderListField,
  objectList: renderObjectListField,
};

function refreshPhotoButtons() {
  const hasPhoto = 'photo.avif' in scratch;
  document.getElementById('ButtonAddPhoto').style.display = hasPhoto ? 'none' : '';
  document.getElementById('ButtonReplacePhoto').style.display = hasPhoto ? '' : 'none';
}

function replacePhoto() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.avif';

  input.onchange = () => {
    const file = input.files[0];
    if (!file || !/\.avif$/i.test(file.name)) return;

    scratch['photo.avif'] = file;
    if (!firstValidFile) firstValidFile = 'photo.avif';
    document.getElementById('ButtonPhoto').style.display = '';

    refreshPhotoButtons();
    if (document.getElementById('RawPhoto').style.display !== 'none') {
      showRaw('photo.avif', FILE_MAP['photo.avif']);
    }
  };

  input.click();
}

async function downloadAllAsZip() {
  await loadJSZip();

  const zip = new JSZip();
  for (const [file, content] of Object.entries(scratch)) zip.file(file, content);

  const blob = await zip.generateAsync({ type: 'blob' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${currentFolder}.zip`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function reuploadZip() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.zip';

  input.onchange = async () => {
    const file = input.files[0];
    if (!file) return;

    await loadJSZip();
    const zip = await JSZip.loadAsync(file);

    for (const [name, cfg] of Object.entries(FILE_MAP)) {
      const entry = zip.file(name);
      if (!entry) continue;

      scratch[name] = cfg.type === 'text' ? await entry.async('text') : await entry.async('blob');
      if (!firstValidFile) firstValidFile = name;
      document.getElementById(`Button${cfg.name}`).style.display = '';
    }

    refreshPhotoButtons();
    initMetaFields();
    if (toastEditor) toastEditor.setMarkdown(scratch['content.md'] || '');
  };

  input.click();
}