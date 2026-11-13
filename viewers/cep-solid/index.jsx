import { render as solidRender } from 'solid-js/web';
import { fetchMeta } from './src/GlobalFunctions';
import App from './src/App';

const VALID_ID = /^[a-z0-9]{8,32}$/;

function trackView(key) {
  fetch(`/track?p=${encodeURIComponent(key)}`).catch(() => {});
}

export async function render(params, el) {
  if (params.get('page') === 'search') {
    solidRender(() => App({ type: 'search' }), el);
    trackView('_search');
    return;
  }

  const user = params.get('user');
  if (user) {
    solidRender(() => App({ type: 'userpage', user }), el);
    return;
  }

  if (params.get('page') === 'stats') {
    solidRender(() => App({ type: 'stats' }), el);
    return;
  }

  const path = (params.get('') || '').replace(/^\/+|\/+$/g, '');
  const meta = await fetchMeta(path);
  solidRender(() => App(meta), el);

  const key = path === '' ? '_home' : path;
  if (key === '_home' || VALID_ID.test(key)) trackView(key);
}
