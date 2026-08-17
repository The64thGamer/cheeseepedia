
import { renderReviewCard } from '/viewers/cep-js/js/CardRenderer.js';
import { setTitle } from './ArticleUtils.js';
import { renderArticleMeta } from '/viewers/cep-js/js/ArticleUtils.js';

export async function loadReviewArticle(app, articleId, meta, md, addTag){
  const body=app.querySelector('#ArticleBody');
  const infobox=app.querySelector('#Infobox');
  if(infobox) infobox.style.display='none';

  setTitle(app, meta.title);
  renderArticleMeta(app, articleId);

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

  const btnBar = app.querySelector('#ArticleHeaderBtns');

  const editBtn=document.createElement('button');
    editBtn.className='PinButton';editBtn.textContent='Edit Page (Beta)';
    editBtn.addEventListener('click',()=>{
      const url=new URL(window.location.href);
      url.searchParams.set('v','cep-editor');
      window.location.href=url.toString();
    });
    btnBar.appendChild(editBtn);
}
