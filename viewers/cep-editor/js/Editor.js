const FILE_MAP = {
  'content.md':    { name: 'Content',  type: 'text'  },
  'old.md':        { name: 'Old',      type: 'text'  },
  'meta.json':     { name: 'Meta',     type: 'text'  },
  'photo.avif':    { name: 'Photo',    type: 'image' },
  'lowphoto.avif': { name: 'LowPhoto', type: 'image' },
};

const TOAST_CSS = 'https://uicdn.toast.com/editor/latest/toastui-editor.min.css';
const TOAST_JS  = 'https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js';

let scratch = {};
let currentFolder = null;
let toastEditor = null;
let firstValidFile = null;

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

  if (firstValidFile) {
    showRaw(firstValidFile, FILE_MAP[firstValidFile]);
  }
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
      const text = await (await fetch(url)).text();
      scratch[file] = text;
      document.getElementById(`File${cfg.name}`).addEventListener('input', e => {
        scratch[file] = e.target.value;
      });
    } else {
      const blob = await (await fetch(url)).blob();
      scratch[file] = blob;
    }
  }

  document.getElementById('ButtonEdit').onclick = showEdit;
  document.getElementById('ButtonEditRaw').onclick = showEditRaw;
  document.getElementById('ZipDownload').onclick = () => downloadAllAsZip();
  document.getElementById('ButtonAddPhoto').onclick = replacePhoto;
  document.getElementById('ButtonReplacePhoto').onclick = replacePhoto;

  refreshPhotoButtons();
  showEdit();
}

function showRaw(file, cfg) {
  const el = document.getElementById(`File${cfg.name}`);
  if (cfg.type === 'text') {
    el.value = scratch[file];
  } else {
    el.src = URL.createObjectURL(scratch[file]);
  }

  for (const c of Object.values(FILE_MAP)) {
    document.getElementById(`Raw${c.name}`).style.display = c.name === cfg.name ? '' : 'none';
  }
}

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
  for (const [file, content] of Object.entries(scratch)) {
    zip.file(file, content);
  }
  const blob = await zip.generateAsync({ type: 'blob' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${currentFolder}.zip`;
  a.click();
  URL.revokeObjectURL(a.href);
}