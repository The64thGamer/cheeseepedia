/**
 * EditorStore.js
 * Single source of truth for all pending edits.
 * Changes are stored in localStorage keyed by article ID.
 * Each entry: { meta: {...}, content: string, photo: base64string|null, isNew: bool }
 */

const STORE_KEY   = 'cep_editor_changes';
const SESSION_KEY = 'cep_github_token';
const USER_KEY    = 'cep_editor_user';

// ── Token (session only) ──────────────────────────────────────────────────────
export const getToken  = ()    => sessionStorage.getItem(SESSION_KEY) || '';
export const setToken  = (tok) => sessionStorage.setItem(SESSION_KEY, tok);

// ── Editor username (localStorage) ───────────────────────────────────────────
export const getEditorUser = ()     => JSON.parse(localStorage.getItem(USER_KEY) || 'null') || {};
export const setEditorUser = (data) => localStorage.setItem(USER_KEY, JSON.stringify(data));

// ── Change store ──────────────────────────────────────────────────────────────
function loadStore() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY) || '{}'); }
  catch { return {}; }
}
function saveStore(store) {
  localStorage.setItem(STORE_KEY, JSON.stringify(store));
}

export function getChange(articleId) {
  return loadStore()[articleId] || null;
}

export function setChange(articleId, data) {
  const store = loadStore();
  store[articleId] = { ...store[articleId], ...data, ts: Date.now() };
  saveStore(store);
  window.dispatchEvent(new CustomEvent('cep-changes-updated'));
}

export function removeChange(articleId) {
  const store = loadStore();
  delete store[articleId];
  saveStore(store);
  window.dispatchEvent(new CustomEvent('cep-changes-updated'));
}

export function getAllChanges() {
  return loadStore();
}

export function hasChanges() {
  return Object.keys(loadStore()).length > 0;
}

export function clearAllChanges() {
  localStorage.removeItem(STORE_KEY);
  window.dispatchEvent(new CustomEvent('cep-changes-updated'));
}

// ── Random ID generator ───────────────────────────────────────────────────────
export function randomId(len = 16) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

// ── Contributor helper ────────────────────────────────────────────────────────
export function addContributor(meta, name) {
  const n = (name || 'Anonymous').trim();
  const existing = meta.contributors || [];
  if (!existing.some(c => c.toLowerCase() === n.toLowerCase())) {
    return { ...meta, contributors: [...existing, n] };
  }
  return meta;
}
