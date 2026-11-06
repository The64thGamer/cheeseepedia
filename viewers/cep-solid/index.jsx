import { render as solidRender } from 'solid-js/web';
import { fetchMeta } from './src/GlobalFunctions';
import App from './src/App';

const VALID_ID = /^[a-z0-9]{8,32}$/;

function trackView(id) {
  if (!VALID_ID.test(id)) return;
  fetch(`/track?p=${encodeURIComponent(id)}`).catch(() => {});
}

export async function render(params, el) {
  if (params.get('page') === 'search') {
    solidRender(() => App({ type: 'search' }), el);
    return;
  }

  const path = (params.get('') || '').replace(/^\/+|\/+$/g, '');
  const meta = await fetchMeta(path);
  solidRender(() => App(meta), el);
  trackView(path);
}
