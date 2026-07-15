const FILE_MAP = {
  'content.md':    { name: 'Content',  type: 'text'  },
  'old.md':        { name: 'Old',      type: 'text'  },
  'meta.json':     { name: 'Meta',     type: 'text'  },
  'photo.avif':    { name: 'Photo',    type: 'image' },
  'lowphoto.avif': { name: 'LowPhoto', type: 'image' },
};

let scratch = {};
let currentFolder = null;

export async function loadFolder(folder) {
  currentFolder = folder;
  scratch = {};

  for (const [file, cfg] of Object.entries(FILE_MAP)) {
    const btn = document.getElementById(`Button${cfg.name}`);
    document.getElementById(`Raw${cfg.name}`).style.display = 'none';

    const url = `/content/${folder}/${file}`;
    const head = await fetch(url, { method: 'HEAD' });

    if (!head.ok) {
      btn.style.display = 'none';
      continue;
    }

    btn.style.display = '';

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

    btn.onclick = () => showRaw(file, cfg);
  }

  document.getElementById('ZipDownload').onclick = () => downloadAllAsZip();
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