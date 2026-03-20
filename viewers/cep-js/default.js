import { loadNewsCards } from './js/DiscourseNews.js';
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

  // Determine which body HTML to load
  let bodyUrl;
  if      (page === 'settings') bodyUrl = '/viewers/cep-js/Settings.html';
  else if (page === 'stats')    bodyUrl = '/viewers/cep-js/Stats.html';
  else if (articleId)           bodyUrl = '/viewers/cep-js/Article.html';
  else                          bodyUrl = '/viewers/cep-js/Home.html';

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
  } else if (articleId) {
    loadArticle(app, articleId, addTag);
  } else {
    loadNewsCards(app);
    loadPinnedCards(app);
  }

  loadRandomCards(app);
  loadSplashText(app);
}