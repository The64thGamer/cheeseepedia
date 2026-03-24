import { loadNewsCards } from './js/HomeNews.js';
import { loadSplashText } from './js/SplashText.js';
import { initSearch } from './js/Search.js';
import { loadArticle } from './js/Article.js';
import { loadPinnedCards } from './js/PinnedArticles.js';
import { loadRandomCards } from './js/RandomCards.js';

const DEFAULT_PINS = ['2zcr9lyoaq2ifmmf', 'bds7nm5tkdgnikq4', 'w4vtcv03ctirl55h'];

export async function render(params, app) {
  // Apply saved theme + wide layout immediately to avoid flash — inlined so
  // Settings.js is not loaded on every page (it's only needed on ?page=settings)
  {
    const theme  = localStorage.getItem('cep-theme') || 'standard';
    const custom = JSON.parse(localStorage.getItem('cep-theme-custom') || 'null');
    const root   = document.documentElement;
    ['--background','--text','--primary','--secondary','--good-link','--bad-link','--distant','--dark']
      .forEach(k => root.style.removeProperty(k));
    root.style.removeProperty('--font-body');
    root.style.removeProperty('--font-display');
    if(theme === 'custom' && custom) {
      root.removeAttribute('data-theme');
      Object.entries(custom).forEach(([k,v]) => root.style.setProperty(k,v));
    } else {
      if(theme === 'standard') root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', theme);
    }
    root.toggleAttribute('data-wide', localStorage.getItem('cep-wide') === '1');
  }

  // Apply logo matching the current theme
  const LOGOS = {
    'standard':    'CEPLogo.avif',
    'dark':        'LogoDark.avif',
    'light':       'LogoLight.avif',
    'classic':     'LogoClassic.avif',
    'funnet':      'LogoFunNet.avif',
    'showbiz':     'LogoShowBiz.avif',
    'fnaf':        'LogoFNaF.avif',
    'pasqually':   'LogoPasqually.avif',
    'winter':      'LogoWinter.avif',
    'halloween':   'LogoHalloween.avif',
    'pride':       'LogoPride.avif',
    'anniversary': 'LogoAnniversary.avif',
  };
  const applyLogo = () => {
    const logoWrap = document.querySelector('.Logo');
    if(!logoWrap) return;
    const theme    = localStorage.getItem('cep-theme') || 'standard';
    const custom   = JSON.parse(localStorage.getItem('cep-theme-custom') || 'null');
    const logoFile = (theme === 'custom' && custom?.['--logo'])
      ? custom['--logo']
      : (LOGOS[theme] || 'CEPLogo.avif');
    let img = logoWrap.querySelector('img');
    if(!img) { img = document.createElement('img'); logoWrap.appendChild(img); }
    img.src = '/viewers/cep-js/assets/Logos/' + logoFile;
  };

  // Init pins
  if (!localStorage.getItem('Pins'))
    localStorage.setItem('Pins', JSON.stringify(DEFAULT_PINS));

  const articleId = params.get('') || params.get('=');
  const page      = params.get('page');

  // For articles, peek at meta.json to pick the right HTML template
  let articleType = null;
  if(articleId) {
    try {
      const m = await fetch(`/content/${articleId}/meta.json`);
      if(m.ok) { const j = await m.json(); articleType = (j.type||'').toLowerCase(); }
    } catch {}
  }

  // Determine which body HTML to load
  const isNewArticle = params.has('newarticle');
  let bodyUrl;
  if      (page === 'settings')    bodyUrl = '/viewers/cep-js/Settings.html';
  else if (page === 'stats')       bodyUrl = '/viewers/cep-js/Stats.html';
  else if (articleType === 'user') bodyUrl = '/viewers/cep-js/User.html';
  else if (articleId)              bodyUrl = '/viewers/cep-js/Article.html';
  else if (isNewArticle)           bodyUrl = '/viewers/cep-js/Article.html';
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
      if (el('StatBuildDate'))    el('StatBuildDate').textContent    = stats.generated.replace('T', ' ').replace('Z', ' UTC');
    })
    .catch(e => console.error('stats fetch failed:', e));

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
    // Body is handled entirely by the editor — set a minimal title
    const titleEl = app.querySelector('#ArticleTitle');
    if (titleEl) titleEl.textContent = 'New Article';
    document.title = 'New Article';
  } else {
    loadNewsCards(app);
    loadPinnedCards(app);
    // Map loads on home page — dynamic import so Leaflet isn't fetched on article pages
    const mapContainer = app.querySelector('#MapRoot');
    if(mapContainer) {
      const { initMap } = await import('./js/Map.js');
      initMap(mapContainer);
    }
  }

  loadRandomCards(app);
  loadSplashText(app);

  // Editor — lazy load, always available
  {
    const link = document.createElement('link');
    link.rel = 'stylesheet'; link.href = '/viewers/cep-js/editor.css';
    if (!document.querySelector('link[href="/viewers/cep-js/editor.css"]'))
      document.head.appendChild(link);

    const { initEditor } = await import('./js/Editor.js');

    // Fetch content.md for the editor if on an article page
    let articleContent = '';
    if (articleId) {
      try {
        const r = await fetch(`/content/${articleId}/content.md`);
        if (r.ok) articleContent = await r.text();
      } catch {}
    }

    const isNew = params.has('newarticle');
    const editorArticleId = articleId || (isNew ? null : null);

    initEditor(
      app,
      editorArticleId,
      articleType ? await fetch(`/content/${editorArticleId}/meta.json`).then(r=>r.ok?r.json():{}).catch(()=>({})) : {},
      articleContent,
      isNew
    );
  }
}