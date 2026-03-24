/**
 * Editor.js
 * Main editor orchestrator.
 * - Edit mode toggle button (bottom right)
 * - Settings + Save Changes buttons
 * - Changed articles drawer
 * - Loads EditorArticle.js lazily when entering edit mode
 */

import { hasChanges, getAllChanges, getEditorUser, getChange, removeChange } from './EditorStore.js';
import { pushAllChanges } from './EditorGitHub.js';
import { openSettingsModal } from './EditorSettings.js';

const EDITOR_DATA_ATTR = 'data-editor';

// ── Bottom bar ────────────────────────────────────────────────────────────────
function buildBottomBar() {
  const bar = document.createElement('div');
  bar.id = 'EditorBar';
  bar.className = 'EditorBar';

  // Changed articles drawer toggle
  const drawerBtn = document.createElement('button');
  drawerBtn.id = 'EditorDrawerBtn';
  drawerBtn.className = 'EditorBarBtn EditorDrawerBtn';
  drawerBtn.title = 'Changed articles';
  drawerBtn.innerHTML = '📝 <span id="EditorChangeCount">0</span>';
  drawerBtn.addEventListener('click', toggleDrawer);
  bar.appendChild(drawerBtn);

  // Settings button (only in edit mode)
  const settingsBtn = document.createElement('button');
  settingsBtn.id = 'EditorSettingsBtn';
  settingsBtn.className = 'EditorBarBtn';
  settingsBtn.title = 'Editor settings';
  settingsBtn.innerHTML = '⚙';
  settingsBtn.style.display = 'none';
  settingsBtn.addEventListener('click', openSettingsModal);
  bar.appendChild(settingsBtn);

  // Save changes button (only in edit mode, disabled when no changes)
  const saveBtn = document.createElement('button');
  saveBtn.id = 'EditorSaveBtn';
  saveBtn.className = 'EditorBarBtn EditorSaveBtn';
  saveBtn.textContent = 'Save Changes';
  saveBtn.style.display = 'none';
  saveBtn.addEventListener('click', () => handleSave(saveBtn));
  bar.appendChild(saveBtn);

  // Edit mode toggle
  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'EditorToggleBtn';
  toggleBtn.className = 'EditorBarBtn EditorToggleBtn';
  toggleBtn.title = 'Toggle edit mode';
  toggleBtn.innerHTML = '✏️';
  toggleBtn.addEventListener('click', toggleEditMode);
  bar.appendChild(toggleBtn);

  document.body.appendChild(bar);
  updateBar();
  return bar;
}

// ── Drawer ────────────────────────────────────────────────────────────────────
let drawerOpen = false;

function buildDrawer() {
  const drawer = document.createElement('div');
  drawer.id = 'EditorDrawer';
  drawer.className = 'EditorDrawer';
  drawer.style.display = 'none';
  document.body.appendChild(drawer);
  return drawer;
}

function toggleDrawer() {
  drawerOpen = !drawerOpen;
  const drawer = document.getElementById('EditorDrawer');
  if (!drawer) return;
  drawer.style.display = drawerOpen ? '' : 'none';
  if (drawerOpen) renderDrawer(drawer);
}

function renderDrawer(drawer) {
  drawer.innerHTML = '<h3 class="EditorDrawerTitle">Changed Articles</h3>';
  const changes = getAllChanges();
  const entries = Object.entries(changes);
  if (!entries.length) {
    drawer.innerHTML += '<p class="EditorDrawerEmpty">No pending changes.</p>';
    return;
  }
  const list = document.createElement('div');
  list.className = 'EditorDrawerList';
  entries
    .sort(([,a],[,b]) => (b.ts||0) - (a.ts||0))
    .forEach(([id, change]) => {
      const item = document.createElement('div');
      item.className = 'EditorDrawerItem';
      const a = document.createElement('a');
      a.href = `/?v=cep-js&=${encodeURIComponent(id)}`;
      a.textContent = change.meta?.title || id;
      a.className = 'EditorDrawerLink';
      const badge = document.createElement('span');
      badge.className = 'EditorDrawerBadge';
      badge.textContent = change.isNew ? 'NEW' : 'EDITED';
      const trash = document.createElement('button');
      trash.className = 'EditorDrawerTrash';
      trash.title = 'Discard change';
      trash.textContent = '🗑';
      trash.addEventListener('click', () => {
        if (confirm(`Discard changes to "${change.meta?.title || id}"?`)) {
          removeChange(id);
          renderDrawer(drawer);
        }
      });
      item.appendChild(badge); item.appendChild(a); item.appendChild(trash);
      list.appendChild(item);
    });
  drawer.appendChild(list);
}

// ── Edit mode ─────────────────────────────────────────────────────────────────
function isEditMode() {
  return document.documentElement.hasAttribute(EDITOR_DATA_ATTR);
}

async function toggleEditMode() {
  if (isEditMode()) {
    exitEditMode();
  } else {
    await enterEditMode();
  }
}

async function exitEditMode() {
  document.documentElement.removeAttribute(EDITOR_DATA_ATTR);
  document.getElementById('EditorSettingsBtn').style.display = 'none';
  document.getElementById('EditorSaveBtn').style.display    = 'none';
  document.getElementById('EditorToggleBtn').innerHTML = '✏️';
  document.getElementById('EditorToggleBtn').title = 'Enter edit mode';

  // Restore the normal article view if we're on an article page
  const articleId = window.__CEP_ARTICLE_ID;
  if (articleId) {
    const { exitArticleEditor } = await import('./EditorArticle.js');
    const app = document.querySelector('#app') || document.body;
    exitArticleEditor(app, articleId, window.__CEP_ADD_TAG || null);
  }
}

async function enterEditMode() {
  // On user pages, just open settings
  const body = document.querySelector('#ArticleBody');
  const metaType = (window.__CEP_ARTICLE_META?.type || '').toLowerCase();
  if (metaType === 'user') {
    openSettingsModal();
    return;
  }

  document.documentElement.setAttribute(EDITOR_DATA_ATTR, '');
  document.getElementById('EditorSettingsBtn').style.display = '';
  document.getElementById('EditorSaveBtn').style.display     = '';
  document.getElementById('EditorToggleBtn').innerHTML = '📖';
  document.getElementById('EditorToggleBtn').title = 'Exit edit mode';
  updateBar();

  // Lazy load editor
  const { initArticleEditor } = await import('./EditorArticle.js');
  const articleId = window.__CEP_ARTICLE_ID;
  const meta      = window.__CEP_ARTICLE_META || {};
  const content   = window.__CEP_ARTICLE_CONTENT || '';
  const isNew     = window.__CEP_IS_NEW || false;
  const params    = new URLSearchParams(window.location.search);
  const user      = getEditorUser();

  if (!articleId) {
    // New article page
    initNewArticle(initArticleEditor, user.name || 'Anonymous', params);
    return;
  }

  await initArticleEditor(
    document.querySelector('#app') || document.body,
    articleId, meta, content,
    user.name || 'Anonymous',
    isNew, params
  );
}

async function initNewArticle(initArticleEditor, editorName, params) {
  const app  = document.querySelector('#app') || document.body;
  const body = document.querySelector('.Body') || app;

  // Clear body and show basic new article UI immediately
  body.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.className = 'EditorNewArticleWrap';

  const hint = document.createElement('p');
  hint.className = 'EditorHint';
  hint.textContent = 'You\'re creating a new article. Set the type to unlock additional fields.';
  wrap.appendChild(hint);

  body.appendChild(wrap);

  const articleId = window.__CEP_ARTICLE_ID || (window.__CEP_ARTICLE_ID = randomId());
  const saved = getChange(articleId);
  const meta  = saved?.meta || { type: 'Locations' };
  const content = saved?.content || '';

  await initArticleEditor(app, articleId, meta, content, editorName, true, params);
}

// ── Save / commit ─────────────────────────────────────────────────────────────
async function handleSave(saveBtn) {
  if (!hasChanges()) return;

  const progressBar = document.getElementById('EditorSaveProgress');
  const errorEl     = document.getElementById('EditorSaveError');
  progressBar.style.display = ''; errorEl.style.display = 'none';
  saveBtn.disabled = true;

  try {
    await pushAllChanges((pct, msg) => {
      progressBar.style.width = pct + '%';
      progressBar.title = msg;
    });
    progressBar.style.display = 'none';
    saveBtn.textContent = '✓ Submitted!';
    saveBtn.disabled = true; // no changes left
    setTimeout(() => { saveBtn.textContent = 'Save Changes'; updateBar(); }, 3000);
  } catch (e) {
    progressBar.style.display = 'none';
    errorEl.textContent = '✗ ' + e.message;
    errorEl.style.display = '';
    saveBtn.disabled = false;
  }
}

// ── Update bar state ──────────────────────────────────────────────────────────
function updateBar() {
  const count = Object.keys(getAllChanges()).length;
  const countEl = document.getElementById('EditorChangeCount');
  if (countEl) countEl.textContent = count;
  const drawerBtn = document.getElementById('EditorDrawerBtn');
  if (drawerBtn) drawerBtn.style.opacity = count > 0 ? '1' : '0.5';
  const saveBtn = document.getElementById('EditorSaveBtn');
  if (saveBtn && isEditMode()) saveBtn.disabled = count === 0;
  if (drawerOpen) renderDrawer(document.getElementById('EditorDrawer'));
}

// ── Init ──────────────────────────────────────────────────────────────────────
export function initEditor(app, articleId, meta, content, isNew) {
  // Expose article state globally so enterEditMode() can read it
  window.__CEP_ARTICLE_ID      = articleId || null;
  window.__CEP_ARTICLE_META    = meta || {};
  window.__CEP_ARTICLE_CONTENT = content || '';
  window.__CEP_IS_NEW          = isNew || false;

  const bar = buildBottomBar();

  // Build progress bar inside save button
  const saveBtn = document.getElementById('EditorSaveBtn');
  const progressWrap = document.createElement('div');
  progressWrap.className = 'EditorSaveProgressWrap';
  const progressBar = document.createElement('div');
  progressBar.id = 'EditorSaveProgress';
  progressBar.className = 'EditorSaveProgressBar';
  progressBar.style.display = 'none'; progressBar.style.width = '0%';
  const errorEl = document.createElement('div');
  errorEl.id = 'EditorSaveError';
  errorEl.className = 'EditorSaveError';
  errorEl.style.display = 'none';
  progressWrap.appendChild(progressBar);
  bar.appendChild(progressWrap);
  bar.appendChild(errorEl);

  buildDrawer();

  // Listen for change events to update the bar
  window.addEventListener('cep-changes-updated', updateBar);

  // Handle ?newarticle route
  const params = new URLSearchParams(window.location.search);
  if (params.has('newarticle')) {
    // Auto-enter edit mode for new article pages
    enterEditMode();
  }
}

function randomId(len = 16) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}
