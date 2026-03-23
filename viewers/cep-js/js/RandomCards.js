import { renderArticleCard } from '/viewers/cep-js/js/CardRenderer.js';

const EXCLUDE_TYPES = new Set(['photos','videos','reviews','user','meta','transcriptions']);

export async function loadRandomCards(app) {
  const container = app.querySelector('#RandomCards');
  if (!container) return;

  const docs = await fetch('/viewers/cep-js/compiled-json/search/docs.json')
    .then(r=>r.json()).catch(()=>[]);

  const pool = docs.filter(d =>
    d.e && d.e.trim() &&
    !EXCLUDE_TYPES.has((d.tp||'').toLowerCase())
  );

  if (!pool.length) return;

  const picked = [], used = new Set();
  while (picked.length < 10 && picked.length < pool.length) {
    const idx = Math.floor(Math.random() * pool.length);
    if (!used.has(idx)) { used.add(idx); picked.push(pool[idx]); }
  }

  picked.forEach(doc => container.appendChild(renderArticleCard(doc)));
}