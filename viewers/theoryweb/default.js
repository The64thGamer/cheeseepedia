import { initTheorySearch } from './js/search.js';

export async function render(params, app) {
  const [baseRes, homeRes, searchRes] = await Promise.all([
    fetch('/viewers/theoryweb/Base.html'),
    fetch('/viewers/theoryweb/Home.html'),
    fetch('/viewers/theoryweb/Search.html'),
  ]);

  app.innerHTML = await baseRes.text();
  app.querySelector('.Body').innerHTML    = await homeRes.text();
  app.querySelector('.Search').innerHTML  = await searchRes.text();

  await initTheorySearch(app);
}