import { buildCitations } from './Citations.js';

export async function initStats(app) {
  const body = app.querySelector('.Body');
  if(!body) return;

  body.innerHTML = '<p class="ArticleLoading">Loading stats...</p>';

  let links;
  try {
    const r = await fetch('/viewers/cep-js/compiled-json/citation_links.json');
    links = r.ok ? await r.json() : [];
  } catch {
    links = [];
  }

  body.innerHTML = '';

  const header = document.createElement('div');
  header.className = 'StatsHeader';
  header.innerHTML = `<p class="StatsSummary">${links.length.toLocaleString()} cited sources</p>`;
  body.appendChild(header);

  const citationsWrap = document.createElement('div');
  body.appendChild(citationsWrap);
  buildCitations(citationsWrap, links);
}