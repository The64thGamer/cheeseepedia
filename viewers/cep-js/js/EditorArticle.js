/**
 * EditorArticle.js
 * Injects the editor UI into an article page.
 */

import { getChange, setChange, randomId } from './EditorStore.js';
import { refreshInfobox } from './Article.js';
import { renderParams } from './EditorParams.js';

const TOAST_CSS = 'https://uicdn.toast.com/editor/latest/toastui-editor.min.css';
const TOAST_JS  = 'https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js';

async function loadToast() {
  if (window.toastui?.Editor) return window.toastui.Editor;
  if (!document.querySelector(`link[href="${TOAST_CSS}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet'; link.href = TOAST_CSS;
    document.head.appendChild(link);
  }
  await new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = TOAST_JS; s.onload = resolve; s.onerror = reject;
    document.head.appendChild(s);
  });
  return window.toastui.Editor;
}

// ── Toast editor helper for description fields ───────────────────────────────
async function buildToastField(container, getContent, onChange, height = '300px') {
  const Editor = await loadToast();
  const wrap = document.createElement('div');
  wrap.className = 'EditorToastWrap';
  container.appendChild(wrap);
  requestAnimationFrame(() => {
    const ed = new Editor({
      el: wrap,
      initialEditType: 'wysiwyg',
      previewStyle: 'tab',
      height,
      initialValue: getContent(),
      events: { change: () => onChange('content', ed.getMarkdown()) },
    });
  });
}

// ── Photo editor ──────────────────────────────────────────────────────────────
async function buildPhotoEditor(container, articleId, meta, getContent, onChange) {
  container.innerHTML = '';

  const uploadWrap = document.createElement('div');
  uploadWrap.className = 'EditorFieldGroup';
  const uploadLabel = document.createElement('label');
  uploadLabel.className = 'EditorLabel EditorLabelBig';
  uploadLabel.textContent = 'Photo (AVIF only)';
  const uploadInput = document.createElement('input');
  uploadInput.type = 'file'; uploadInput.accept = '.avif,image/avif';
  uploadInput.className = 'EditorFileInput';
  const preview = document.createElement('img');
  preview.className = 'EditorPhotoPreview';
  preview.style.display = 'none';
  uploadInput.addEventListener('change', () => {
    const file = uploadInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      preview.src = e.target.result;
      preview.style.display = '';
      onChange('photo', e.target.result);
    };
    reader.readAsDataURL(file);
  });
  uploadWrap.appendChild(uploadLabel);
  uploadWrap.appendChild(uploadInput);
  uploadWrap.appendChild(preview);
  container.appendChild(uploadWrap);

  const paramsWrap = document.createElement('div');
  paramsWrap.className = 'EditorParamsInline';
  renderParams(paramsWrap, meta, (key, val) => onChange('meta-key', key, val), () => {});
  container.appendChild(paramsWrap);

  const descLabel = document.createElement('label');
  descLabel.className = 'EditorLabel EditorLabelBig';
  descLabel.textContent = 'Description';
  container.appendChild(descLabel);
  await buildToastField(container, getContent, onChange);
}

// ── Video editor ──────────────────────────────────────────────────────────────
async function buildVideoEditor(container, articleId, meta, getContent, onChange) {
  container.innerHTML = '';

  const urlWrap = document.createElement('div');
  urlWrap.className = 'EditorFieldGroup';
  const urlLabel = document.createElement('label');
  urlLabel.className = 'EditorLabel EditorLabelBig';
  urlLabel.textContent = 'Video URL (becomes title)';
  const urlInput = document.createElement('input');
  urlInput.type = 'url'; urlInput.className = 'EditorInput';
  urlInput.value = meta.title || '';
  urlInput.placeholder = 'https://youtu.be/…';
  urlInput.addEventListener('input', () => onChange('meta-key', 'title', urlInput.value));
  urlWrap.appendChild(urlLabel); urlWrap.appendChild(urlInput);
  container.appendChild(urlWrap);

  const paramsWrap = document.createElement('div');
  paramsWrap.className = 'EditorParamsInline';
  renderParams(paramsWrap, meta, (key, val) => onChange('meta-key', key, val), () => {});
  container.appendChild(paramsWrap);

  const descLabel = document.createElement('label');
  descLabel.className = 'EditorLabel EditorLabelBig';
  descLabel.textContent = 'Description (content.md)';
  container.appendChild(descLabel);
  await buildToastField(container, getContent, onChange);
}

// ── Review editor ─────────────────────────────────────────────────────────────
async function buildReviewEditor(container, articleId, meta, getContent, onChange, isNew, fromPage) {
  container.innerHTML = '';

  const titleWrap = document.createElement('div');
  titleWrap.className = 'EditorFieldGroup';
  const titleLabel = document.createElement('label');
  titleLabel.className = 'EditorLabel EditorLabelBig'; titleLabel.textContent = 'Review Title';
  const titleInput = document.createElement('input');
  titleInput.type = 'text'; titleInput.className = 'EditorInput';
  titleInput.value = meta.title || '';
  titleInput.addEventListener('input', () => onChange('meta-key', 'title', titleInput.value));
  titleWrap.appendChild(titleLabel); titleWrap.appendChild(titleInput);
  container.appendChild(titleWrap);

  // Tags with search suggestions
  const tagsWrap = document.createElement('div');
  tagsWrap.className = 'EditorFieldGroup';
  const tagsLabel = document.createElement('label');
  tagsLabel.className = 'EditorLabel EditorLabelBig'; tagsLabel.textContent = 'Pages Reviewed (tags)';
  tagsWrap.appendChild(tagsLabel);
  tagsWrap.appendChild(makeSearchArray(meta.tags || (fromPage ? [fromPage] : []), v => onChange('meta-key', 'tags', v)));
  container.appendChild(tagsWrap);

  const recWrap = document.createElement('div');
  recWrap.className = 'EditorFieldGroup';
  const recLabel = document.createElement('label');
  recLabel.className = 'EditorLabel EditorLabelBig'; recLabel.textContent = 'Recommend?';
  const recSel = document.createElement('select');
  recSel.className = 'EditorSelect';
  [{v:'',t:'—'},{v:'true',t:'Yes'},{v:'false',t:'No'}].forEach(({v,t}) => {
    const o = document.createElement('option'); o.value = v; o.textContent = t; recSel.appendChild(o);
  });
  recSel.value = meta.recommend === true ? 'true' : meta.recommend === false ? 'false' : '';
  recSel.addEventListener('change', () => onChange('meta-key', 'recommend', recSel.value === 'true' ? true : recSel.value === 'false' ? false : null));
  recWrap.appendChild(recLabel); recWrap.appendChild(recSel);
  container.appendChild(recWrap);

  const bodyLabel = document.createElement('label');
  bodyLabel.className = 'EditorLabel EditorLabelBig'; bodyLabel.textContent = 'Review Text';
  container.appendChild(bodyLabel);
  await buildToastField(container, getContent, onChange);
}

// ── Transcript editor ─────────────────────────────────────────────────────────
async function buildTranscriptEditor(container, meta, getContent, onChange) {
  container.innerHTML = '';

  const paramsWrap = document.createElement('div');
  paramsWrap.className = 'EditorParamsInline';
  renderParams(paramsWrap, meta, (key, val) => onChange('meta-key', key, val), () => {});
  container.appendChild(paramsWrap);

  const bodyLabel = document.createElement('label');
  bodyLabel.className = 'EditorLabel EditorLabelBig'; bodyLabel.textContent = 'Transcript';
  container.appendChild(bodyLabel);
  await buildToastField(container, getContent, onChange, '400px');
}

// ── Search array helper ───────────────────────────────────────────────────────
function makeSearchArray(values, onChange) {
  const wrap = document.createElement('div');
  wrap.className = 'EditorArrayWrap';
  const items = [...(values || [])];
  const render = () => {
    wrap.innerHTML = '';
    items.forEach((val, i) => {
      const row = document.createElement('div'); row.className = 'EditorArrayRow';
      const input = document.createElement('input');
      input.type = 'text'; input.value = val; input.className = 'EditorInput';
      input.addEventListener('input', () => { items[i] = input.value; onChange([...items]); });
      fetch('/viewers/cep-js/compiled-json/ArticleLinker.json').then(r => r.json()).then(linker => {
        const dl = document.createElement('datalist');
        dl.id = 'sug' + Math.random().toString(36).slice(2);
        input.setAttribute('list', dl.id);
        Object.keys(linker).forEach(k => { const o = document.createElement('option'); o.value = k; dl.appendChild(o); });
        wrap.appendChild(dl);
      }).catch(() => {});
      const del = document.createElement('button');
      del.className = 'EditorBtnSmall EditorBtnDanger'; del.textContent = '✕';
      del.addEventListener('click', () => { items.splice(i, 1); onChange([...items]); render(); });
      row.appendChild(input); row.appendChild(del); wrap.appendChild(row);
    });
    const addBtn = document.createElement('button');
    addBtn.className = 'EditorBtnSmall'; addBtn.textContent = '+ Add';
    addBtn.addEventListener('click', () => { items.push(''); onChange([...items]); render(); });
    wrap.appendChild(addBtn);
  };
  render(); return wrap;
}

// ── Standard article editor ───────────────────────────────────────────────────
async function buildStandardEditor(tabBar, body, articleId, meta, getContent, commitLocal, onChange) {
  const Editor = await loadToast();
  tabBar.innerHTML = ''; body.innerHTML = '';

  // Toast editor instance — persists across tab switches so content is never lost
  let toastEditor = null;
  const editorWrap = document.createElement('div');
  editorWrap.className = 'EditorToastWrap';

  let activBtn = null;
  const setActive = btn => { if (activBtn) activBtn.classList.remove('PinButtonActive'); activBtn = btn; btn.classList.add('PinButtonActive'); };
  const makeBtn = (label, renderFn) => {
    const btn = document.createElement('button'); btn.className = 'PinButton'; btn.textContent = label;
    btn.addEventListener('click', () => {
      setActive(btn);
      body.innerHTML = '';
      body.appendChild(renderFn());
    });
    tabBar.appendChild(btn); return btn;
  };

  // Article tab — mounts/unmounts the same editorWrap, never recreates the editor
  const articleBtn = makeBtn('Article', () => {
    if (!toastEditor) {
      requestAnimationFrame(() => {
        toastEditor = new Editor({
          el: editorWrap,
          initialEditType: 'wysiwyg',
          previewStyle: 'tab',
          height: '500px',
          initialValue: getContent(),
          events: { change: () => onChange('content', toastEditor.getMarkdown()) },
        });
      });
    }
    return editorWrap;
  });

  // Parameters tab — always reads latest workingMeta, re-renders on change
  const explicitKeys = new Set(); // tracks user-added params so they show even when empty
  const renderParamsTab = () => {
    const wrap = document.createElement('div'); wrap.className = 'EditorParamsWrap';
    const onParamChange = (key, val) => {
      meta[key] = val;
      onChange('meta-key', key, val);
    };
    const onParamAdd = (key, val) => {
      meta[key] = val;
      explicitKeys.add(key);
      onChange('meta-key', key, val);
      // Re-render the params tab so the new field appears
      const current = body.querySelector('.EditorParamsWrap');
      if (current) current.replaceWith(renderParamsTab());
    };
    renderParams(wrap, meta, onParamChange, (newType) => onChange('type-change', newType), onParamAdd, explicitKeys);
    return wrap;
  };
  makeBtn('Parameters', renderParamsTab);

  // Write a Review
  makeBtn('Write a Review', () => {
    commitLocal();
    window.location.href = `/?v=cep-js&newarticle&reviewof=${encodeURIComponent(meta.title || articleId)}`;
    return document.createElement('div');
  });

  setActive(articleBtn); articleBtn.click();
}

// ── Exit edit mode: restore the original article view ────────────────────────
export async function exitArticleEditor(app, articleId, addTag) {
  const { loadArticle } = await import('./Article.js');
  // Clear any editor DOM injected into the tab bar
  const btnBar = app.querySelector('#ArticleHeaderBtns');
  if (btnBar) btnBar.innerHTML = '';
  const body = app.querySelector('#ArticleBody');
  if (body) body.innerHTML = '';
  await loadArticle(app, articleId, addTag);
}

// ── Main entry ────────────────────────────────────────────────────────────────
export async function initArticleEditor(app, articleId, meta, content, editorName, isNew, params) {
  const type = (meta.type || '').toLowerCase();
  const fromPage = params?.get?.('reviewof') || null;

  // Working copies — use refs so closures always see latest value
  let workingMeta    = { ...meta };
  let workingContent = content;
  let workingPhoto   = null;

  // Always read the latest content through a getter so Toast tab switch doesn't lose it
  const getContent = () => workingContent;

  // Load any previously saved local state first
  const saved = getChange(articleId);
  if (saved) {
    if (saved.meta)                  workingMeta    = { ...saved.meta };
    if (saved.content !== undefined) workingContent = saved.content;
    if (saved.photo)                 workingPhoto   = saved.photo;
  }

  const commitLocal = () => {
    const change = { meta: workingMeta, content: workingContent, isNew, editorName };
    if (workingPhoto) change.photo = workingPhoto;
    setChange(articleId, change);
  };

  const handleChange = (kind, ...args) => {
    if (kind === 'content') {
      workingContent = args[0];
    } else if (kind === 'meta-key') {
      workingMeta = { ...workingMeta, [args[0]]: args[1] };
      refreshInfobox(app, workingMeta, articleId);
    } else if (kind === 'photo') {
      workingPhoto = args[0];
    } else if (kind === 'type-change') {
      // Ensure new type is in workingMeta before saving
      workingMeta = { ...workingMeta, type: args[0] };
      commitLocal();
      window.location.reload();
      return;
    }
    commitLocal();
  };

  // Find or create tab bar and body
  let tabBar = app.querySelector('#ArticleHeaderBtns');
  let body   = app.querySelector('#ArticleBody');

  if (!tabBar) {
    tabBar = document.createElement('div');
    tabBar.id = 'ArticleHeaderBtns'; tabBar.className = 'ArticleHeaderBtns';
    const header = app.querySelector('.ArticleHeader') || app.querySelector('.Body');
    header?.appendChild(tabBar);
  }
  if (!body) {
    body = document.createElement('div');
    body.id = 'ArticleBody'; body.className = 'ArticleBody';
    app.querySelector('.Body')?.appendChild(body);
  }

  if (type === 'photos') {
    await buildPhotoEditor(body, articleId, workingMeta, getContent, handleChange);
  } else if (type === 'videos') {
    await buildVideoEditor(body, articleId, workingMeta, getContent, handleChange);
  } else if (type === 'reviews' || fromPage) {
    if (fromPage && !workingMeta.type) {
      workingMeta = { ...workingMeta, type: 'Reviews', startDate: new Date().toISOString().split('T')[0] };
    }
    await buildReviewEditor(body, articleId, workingMeta, getContent, handleChange, isNew, fromPage);
  } else if (type === 'transcriptions') {
    await buildTranscriptEditor(body, workingMeta, getContent, handleChange);
  } else {
    await buildStandardEditor(tabBar, body, articleId, workingMeta, getContent, commitLocal, handleChange);
  }
}
