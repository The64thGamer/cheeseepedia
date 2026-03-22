
import { setTitle, renderBody, renderContributors, renderRelatedTags, getLinker } from './ArticleUtils.js';
import { renderArticleMeta } from '/viewers/cep-js/js/ArticleUtils.js';

export async function loadTranscriptArticle(app, articleId, meta, md, addTag){
  const body=app.querySelector('#ArticleBody');
  const infobox=app.querySelector('#Infobox');
  if(infobox) infobox.style.display='none';

  setTitle(app, meta.title);
    renderArticleMeta(app, articleId);


  if(body){
    body.innerHTML='';

    const wrap=document.createElement('div');
    wrap.className='TranscriptBody';
    body.appendChild(wrap);

    await renderBody(wrap, md, meta.citations);

    const contribEl=app.querySelector('.ArticleContributors');
    if(contribEl) await renderContributors(contribEl, meta);

    renderRelatedTags(app.querySelector('.RelatedTags'), meta, md, addTag);
  }
}

export async function renderTranscript(item){
  const wrap=document.createElement('div');
  wrap.className='TranscriptBody';

  const header=document.createElement('div');
  header.className='TranscriptEntryHeader';

  const linker=await getLinker();
  const pid=item.p;
  const href=`/?v=cep-js&=${encodeURIComponent(pid)}`;
  header.innerHTML=`<a href="${href}">${item.t||pid}</a>`;
  wrap.appendChild(header);

  const body=document.createElement('div');
  body.className='TranscriptBody';
  body.textContent='Loading…';
  wrap.appendChild(body);

  // Fetch and render content async
  fetch(`/content/${pid}/content.md`)
    .then(r=>r.ok?r.text():'')
    .then(async md=>{
      body.innerHTML='';
      const {renderBody:rb}=await import('./ArticleUtils.js');
      await rb(body, md, []);
    })
    .catch(()=>{ body.textContent=''; });

  return wrap;
}
