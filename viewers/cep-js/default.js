import { loadNewsCards } from './js/DiscourseNews.js';
import { loadSplashText } from './js/SplashText.js';
import { initSearch } from './js/Search.js';
import { loadArticle } from './js/Article.js';
export async function render(params, app) {
  const articleId = params.get('') || params.get('=');
  const [baseRes, bodyRes, searchRes] = await Promise.all([
    fetch('/viewers/cep-js/Base.html'),
    fetch(articleId ? '/viewers/cep-js/Article.html' : '/viewers/cep-js/Home.html'),
    fetch('/viewers/cep-js/Search.html'),
  ]);
  app.innerHTML = await baseRes.text();
  app.querySelector('.Body').innerHTML = await bodyRes.text();
  app.querySelector('.Search').innerHTML = await searchRes.text();

  fetch('/viewers/cep-js/compiled-json/ExtraStatistics.json')
    .then(r => r.json())
    .then(stats => {
      const el = id => document.getElementById(id);
      if (el('StatArticles')) el('StatArticles').textContent = stats.articles.toLocaleString();
      if (el('StatContributors')) el('StatContributors').textContent = stats.contributors.toLocaleString();
      if (el('StatBuildDate')) el('StatBuildDate').textContent = stats.generated.replace('T', ' ').replace('Z', ' UTC');
    })
    .catch(e => console.error('stats fetch failed:', e));

  if (articleId) {
    loadArticle(app, articleId);
  } else {
    loadNewsCards(app);
    loadSplashText(app);
  }
  initSearch(app);
}