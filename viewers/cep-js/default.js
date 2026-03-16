import { loadNewsCards } from './js/DiscourseNews.js';
import { loadSplashText } from './js/SplashText.js';
import { initSearch } from './js/Search.js';

export async function render(params, app) {
  const [baseRes, homeRes, searchRes] = await Promise.all([
    fetch('/viewers/cep-js/Base.html'),
    fetch('/viewers/cep-js/Home.html'),
    fetch('/viewers/cep-js/Search.html'),
  ]);
  app.innerHTML = await baseRes.text();
  app.querySelector('.Body').innerHTML = await homeRes.text();
  app.querySelector('.Search').innerHTML = await searchRes.text();

  loadNewsCards(app);
  loadSplashText(app);
  initSearch(app);
}