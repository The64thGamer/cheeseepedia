const FILE_MAP = {
  'content.md':    { name: 'Content',  type: 'text'  },
  'old.md':        { name: 'Old',      type: 'text'  },
  'meta.json':     { name: 'Meta',     type: 'text'  },
  'photo.avif':    { name: 'Photo',    type: 'image' },
  'lowphoto.avif': { name: 'LowPhoto', type: 'image' },
};

const TOAST_CSS = 'https://uicdn.toast.com/editor/latest/toastui-editor.min.css';
const TOAST_JS  = 'https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js';

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
      { key: 'n',    label: 'Name', type: 'line' },
    ],
  },
  stages: {
    type: 'objectList', el: 'MetaStages',
    fields: [
      { key: 'n',    label: 'Name',        type: 'line' },
      { key: 's',    label: 'Start',       type: 'date' },
      { key: 'e',    label: 'End',         type: 'date' },
      { key: 'desc', label: 'Description', type: 'line' },
    ],
  },
};

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

let scratch = {};
let currentFolder = null;
let toastEditor = null;
let firstValidFile = null;
let metaData = {};

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

function initMetaFields() {
  loadMetaData();
  for (const [key, cfg] of Object.entries(META_MAP)) RENDERERS[cfg.type](key, cfg);
}

function bindLine(el, value, onChange) {
  el.value = value || '';
  el.oninput = () => onChange(el.value);
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
  const [y, m, d] = (value || '0000-00-00').split('-');
  const currentYear = new Date().getFullYear();

  const years = [['0000', 'Unknown']];
  for (let yr = 1900; yr <= currentYear + 1; yr++) years.push([String(yr), yr]);

  const months = [['00', 'Unknown']];
  MONTHS.forEach((name, i) => months.push([String(i + 1).padStart(2, '0'), name]));

  const days = [['00', 'Unknown']];
  for (let dd = 1; dd <= 31; dd++) days.push([String(dd).padStart(2, '0'), dd]);

  const yearSel = makeSelect(years, y);
  const monthSel = makeSelect(months, m);
  const daySel = makeSelect(days, d);

  const emit = () => onChange(`${yearSel.value}-${monthSel.value}-${daySel.value}`);
  yearSel.onchange = monthSel.onchange = daySel.onchange = emit;

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
    bindLine(input, val, v => {
      items[i] = v;
      metaData[key] = items;
      saveMetaData();
    });

    const removeBtn = document.createElement('button');
    removeBtn.textContent = '−';
    removeBtn.onclick = () => {
      items.splice(i, 1);
      metaData[key] = items;
      saveMetaData();
      renderListField(key, cfg);
    };

    row.append(label, input, removeBtn);
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

  items.forEach((item, i) => {
    const row = document.createElement('div');
    row.className = 'MetaObjectRow';

    for (const f of cfg.fields) {
      const flabel = document.createElement('label');
      flabel.textContent = f.label;
      row.appendChild(flabel);

      const onChange = v => {
        item[f.key] = v;
        metaData[key] = items;
        saveMetaData();
      };

      if (f.type === 'line') {
        const input = document.createElement('input');
        input.type = 'text';
        bindLine(input, item[f.key], onChange);
        row.appendChild(input);
      } else if (f.type === 'dropdown') {
        const select = document.createElement('select');
        bindDropdown(select, item[f.key], onChange, f.options);
        row.appendChild(select);
      } else if (f.type === 'date') {
        const dateWrap = document.createElement('div');
        buildDateField(dateWrap, item[f.key], onChange);
        row.appendChild(dateWrap);
      }
    }

    const removeBtn = document.createElement('button');
    removeBtn.textContent = '−';
    removeBtn.onclick = () => {
      items.splice(i, 1);
      metaData[key] = items;
      saveMetaData();
      renderObjectListField(key, cfg);
    };
    row.appendChild(removeBtn);

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
  line: makeSimpleRenderer(bindLine),
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
  if (!window.JSZip) {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  const zip = new JSZip();
  for (const [file, content] of Object.entries(scratch)) zip.file(file, content);

  const blob = await zip.generateAsync({ type: 'blob' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${currentFolder}.zip`;
  a.click();
  URL.revokeObjectURL(a.href);
}