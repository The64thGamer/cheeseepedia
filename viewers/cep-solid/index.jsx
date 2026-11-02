import { render as solidRender } from 'solid-js/web';
import { fetchMeta } from './src/GlobalFunctions';
import App from './src/App';

export async function render(params, el) {
  if (params.get('page') === 'search') {
    solidRender(() => App({ type: 'search' }), el);
    return;
  }

  const path = (params.get('') || '').replace(/^\/+|\/+$/g, '');
  const meta = await fetchMeta(path);
  solidRender(() => App(meta), el);
}
