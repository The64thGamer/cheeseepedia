import { loadNewsCards } from './js/HomeNews.js';
import { loadSplashText } from './js/SplashText.js';
import { initSearch } from './js/Search.js';
import { loadArticle } from './js/Article.js';
import { loadPinnedCards } from './js/PinnedArticles.js';
import { loadRandomCards } from './js/RandomCards.js';

const DEFAULT_PINS = ['2zcr9lyoaq2ifmmf', 'bds7nm5tkdgnikq4', 'w4vtcv03ctirl55h'];

const LOGOS = {
  standard:'CEPLogo.avif', dark:'LogoDark.avif', light:'LogoLight.avif',
  classic:'LogoClassic.avif', funnet:'LogoFunNet.avif', showbiz:'LogoShowBiz.avif',
  fnaf:'LogoFNaF.avif', pasqually:'LogoPasqually.avif', winter:'LogoWinter.avif',
  halloween:'LogoHalloween.avif', pride:'LogoPride.avif', anniversary:'LogoAnniversary.avif',
};

export async function render(params, app) {
  const theme  = localStorage.getItem('cep-theme') || 'standard';
  const custom = JSON.parse(localStorage.getItem('cep-theme-custom') || 'null');
  const root   = document.documentElement;
  ['--background','--text','--primary','--secondary','--good-link','--bad-link','--distant','--dark',
   '--font-body','--font-display'].forEach(k => root.style.removeProperty(k));
  if (theme === 'custom' && custom) {
    root.removeAttribute('data-theme');
    Object.entries(custom).forEach(([k,v]) => root.style.setProperty(k,v));
  } else {
    theme === 'standard' ? root.removeAttribute('data-theme') : root.setAttribute('data-theme', theme);
  }
  root.toggleAttribute('data-wide', localStorage.getItem('cep-wide') === '1');

  if (theme === 'missingno') import('./js/missingno.js');

  const applyLogo = () => {
    const wrap = document.querySelector('.Logo');
    if (!wrap) return;
    const t = localStorage.getItem('cep-theme') || 'standard';
    const c = JSON.parse(localStorage.getItem('cep-theme-custom') || 'null');
    const file = (t === 'custom' && c?.['--logo']) ? c['--logo'] : (LOGOS[t] || 'CEPLogo.avif');
    let img = wrap.querySelector('img');
    if (!img) { img = document.createElement('img'); wrap.appendChild(img); }
    img.src = '/viewers/cep-js/assets/Logos/' + file;
  };

  if (!localStorage.getItem('Pins')) localStorage.setItem('Pins', JSON.stringify(DEFAULT_PINS));

  const articleId    = params.get('') || params.get('=');
  const page         = params.get('page');
  const isNewArticle = params.has('newarticle');

  let articleType = null;
  if (articleId) {
    try {
      const m = await fetch(`/content/${articleId}/meta.json`);
      if (m.ok) articleType = ((await m.json()).type || '').toLowerCase();
    } catch {}
  }

  let bodyUrl;
  if      (page === 'settings')    bodyUrl = '/viewers/cep-js/Settings.html';
  else if (page === 'stats')       bodyUrl = '/viewers/cep-js/Stats.html';
  else if (articleType === 'user') bodyUrl = '/viewers/cep-js/User.html';
  else if (articleId || isNewArticle) bodyUrl = '/viewers/cep-js/Article.html';
  else                             bodyUrl = '/viewers/cep-js/Home.html';

  const [baseRes, bodyRes, searchRes] = await Promise.all([
    fetch('/viewers/cep-js/Base.html'),
    fetch(bodyUrl),
    fetch('/viewers/cep-js/Search.html'),
  ]);

  app.innerHTML = await baseRes.text();
  app.querySelector('.Body').innerHTML = await bodyRes.text();
  app.querySelector('.Search').innerHTML = await searchRes.text();
  applyLogo();

  fetch('/viewers/cep-js/compiled-json/ExtraStatistics.json')
    .then(r => r.json())
    .then(stats => {
      const el = id => document.getElementById(id);
      if (el('StatArticles'))     el('StatArticles').textContent     = stats.articles.toLocaleString();
      if (el('StatContributors')) el('StatContributors').textContent = stats.contributors.toLocaleString();
      if (el('StatBuildDate'))    el('StatBuildDate').textContent    = stats.generated.replace('T',' ').replace('Z',' UTC');
    }).catch(() => {});

  const addTag = await initSearch(app);

  if (page === 'settings') {
    const { initSettings } = await import('./js/Settings.js');
    initSettings(app);
  } else if (page === 'stats') {
    const { initStats } = await import('./js/Stats.js');
    initStats(app);
  } else if (articleId && !isNewArticle) {
    loadArticle(app, articleId, addTag);
  } else if (isNewArticle) {
    const titleEl = app.querySelector('#ArticleTitle');
    if (titleEl) titleEl.textContent = 'New Article';
    document.title = 'New Article';
  } else {
    loadNewsCards(app);
    loadPinnedCards(app);
    const mapContainer = app.querySelector('#MapRoot');
    if (mapContainer) {
      const { initMap } = await import('./js/Map.js');
      initMap(mapContainer);
    }
  }

  loadRandomCards(app);
  loadSplashText(app);
  window.dispatchEvent(new CustomEvent('cep-render-done', { detail: { app } }));

  const { initEditor } = await import('./js/Editor.js');
  let articleContent = '';
  if (articleId) {
    try { const r = await fetch(`/content/${articleId}/content.md`); if (r.ok) articleContent = await r.text(); } catch {}
  }
  initEditor(app, articleId || null,
    articleType ? await fetch(`/content/${articleId}/meta.json`).then(r=>r.ok?r.json():{}).catch(()=>({})) : {},
    articleContent, isNewArticle);
}