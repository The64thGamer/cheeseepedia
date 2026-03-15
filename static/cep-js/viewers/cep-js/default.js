import { loadNewsCards } from './js/DiscourseNews.js';
import { loadSplashText } from './js/SplashText.js';

export async function render(params, app) {
    const [baseRes, homeRes] = await Promise.all([
        fetch('/viewers/cep-js/Base.html'),
        fetch('/viewers/cep-js/Home.html'),
    ]);
    app.innerHTML = await baseRes.text();
    app.querySelector('.Body').innerHTML = await homeRes.text();

    loadNewsCards(app);
    loadSplashText(app);
}