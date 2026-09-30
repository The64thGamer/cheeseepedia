import { render as solidRender } from 'solid-js/web';
import { fetchMeta } from './src/GlobalFunctions';
import App from './src/App';

export async function render(params, el) {
  const path = params.get('');
  const meta = await fetchMeta(path);
  solidRender(() => App(meta), el);
}