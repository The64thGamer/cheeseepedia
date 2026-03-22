/**
 * ReviewArticle.js
 * Renderer for pages with type "Reviews".
 * Renders as a single review card using CardRenderer.
 * No infobox, no tabs, no contributors, no related tags.
 */
import { renderReviewCard } from '/viewers/cep-js/js/CardRenderer.js';
import { setTitle } from './ArticleUtils.js';

export async function loadReviewArticle(app, articleId, meta, md, addTag){
  const body=app.querySelector('#ArticleBody');
  const infobox=app.querySelector('#Infobox');
  if(infobox) infobox.style.display='none';

  setTitle(app, meta.title);

  if(body){
    body.innerHTML='';
    const doc={
      t: meta.title||'',
      p: articleId,
      d: meta.startDate||'',
      de: meta.endDate||'',
      e: '',
      tp: 'Reviews',
    };
    body.appendChild(renderReviewCard(doc));
  }
}
