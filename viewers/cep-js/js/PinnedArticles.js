import { renderArticleCard } from '/viewers/cep-js/js/CardRenderer.js';

export async function loadPinnedCards(app) {
  const container = app.querySelector('#PinnedCards');
  if (!container) return;

  const pins = JSON.parse(localStorage.getItem('Pins') || '[]');
  if (!pins.length) return;

  const linker = await fetch('/viewers/cep-js/compiled-json/ArticleLinker.json')
    .then(r=>r.ok?r.json():{}).catch(()=>({}));

  await Promise.all(pins.map(async folderId => {
    const meta = await fetch(`/content/${folderId}/meta.json`)
      .then(r=>r.ok?r.json():{}).catch(()=>({}));
    container.appendChild(renderArticleCard({
      t:  meta.title || folderId,
      p:  folderId,
      e:  meta.excerpt || '',
      tp: meta.type || '',
      d:  meta.startDate || '',
      de: meta.endDate || '',
      img: (meta.type||'').toLowerCase()!=='photos' && meta.pageThumbnailFile
        ? linker[meta.pageThumbnailFile] : null,
    }));
  }));
}