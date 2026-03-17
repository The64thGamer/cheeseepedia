import { ProgressiveImage } from './ProgressiveImage.js';

const PREVIEW_CACHE = {};
const MNAMES = ['','Jan. ','Feb. ','Mar. ','Apr. ','May ','Jun. ','Jul. ','Aug. ','Sep. ','Oct. ','Nov. ','Dec.'];

let ARTICLE_LINKER = null;
async function getLinker() {
  if (!ARTICLE_LINKER) ARTICLE_LINKER = await fetch('/viewers/cep-js/compiled-json/ArticleLinker.json')
    .then(r=>r.ok?r.json():{}).catch(()=>({}));
  return ARTICLE_LINKER;
}

function fmtDate(d) {
  if (!d||d==='0000-00-00'||!d.trim()) return '';
  const [y,m,day]=d.split('-'), yi=parseInt(y,10), mi=parseInt(m,10), di=parseInt(day,10);
  if (!yi||yi===0) return '';
  const mn=mi?MNAMES[mi]:'', dn=di?String(di):'', dp=mn+dn;
  return (dp?dp+(dp.endsWith(' ')?'':' '):'')+yi;
}

function fmtRange(start, end) {
  const s=fmtDate(start); if (!s) return '';
  if (end===undefined||end===null||end==='') return s+' - Present';
  if (!end||end==='0000-00-00') return s+' - ???';
  const e=fmtDate(end); return e?s+' - '+e:s;
}

function excerptText(md, len=150) {
  if (!md) return '';
  const clean=md.replace(/\{\{[^}]+\}\}/g,'').replace(/[*_`#>\[\]!]/g,' ').replace(/\s+/g,' ').trim();
  return clean.length>len?clean.slice(0,len).trimEnd()+'…':clean;
}

let previewEl=null, hideTimer=null, currentId=null;

function getPreview() {
  if (!previewEl) {
    previewEl=document.createElement('div');
    previewEl.className='LinkPreview';
    previewEl.innerHTML=`
      <div class="LinkPreviewImage"></div>
      <div class="LinkPreviewBody">
        <div class="LinkPreviewDate"></div>
        <div class="LinkPreviewExcerpt"></div>
      </div>`;
    document.body.appendChild(previewEl);
    previewEl.addEventListener('mouseenter',()=>clearTimeout(hideTimer));
    previewEl.addEventListener('mouseleave',hidePreview);
  }
  return previewEl;
}

function positionPreview(p, anchor) {
  const rect=anchor.getBoundingClientRect(), pw=240, gap=8;
  let top=rect.bottom+window.scrollY+gap, left=rect.left+window.scrollX;
  if (left+pw>window.innerWidth+window.scrollX) left=window.innerWidth+window.scrollX-pw-gap;
  if (left<window.scrollX+gap) left=window.scrollX+gap;
  p.style.top=top+'px'; p.style.left=left+'px';
}

async function showPreview(articleId, anchorEl) {
  clearTimeout(hideTimer);
  if (!articleId) return;
  currentId=articleId;

  const p=getPreview();
  p.style.display='block';
  positionPreview(p, anchorEl);

  const imgDiv=p.querySelector('.LinkPreviewImage');
  const dateEl=p.querySelector('.LinkPreviewDate');
  const excerEl=p.querySelector('.LinkPreviewExcerpt');
  imgDiv.innerHTML=''; imgDiv.style.display='block';
  dateEl.innerHTML=''; excerEl.textContent='Loading…';

  if (!PREVIEW_CACHE[articleId]) {
    PREVIEW_CACHE[articleId]=Promise.all([
      fetch(`/content/${articleId}/meta.json`).then(r=>r.ok?r.json():{}).catch(()=>({})),
      fetch(`/content/${articleId}/content.md`).then(r=>r.ok?r.text():'').catch(()=>''),
    ]);
  }

  const linker=await getLinker();
  const [meta,md]=await PREVIEW_CACHE[articleId];
  if (currentId!==articleId) return;

  const thumbTitle=meta.pageThumbnailFile||'';
  const isPhoto=(meta.type||'').toLowerCase()==='photos';
  const thumbFolder=isPhoto?articleId:(thumbTitle?linker[thumbTitle]:null);

  if (thumbFolder) {
    imgDiv.innerHTML='';
    imgDiv.appendChild(ProgressiveImage(thumbFolder, meta.title||''));
  } else {
    imgDiv.style.display='none';
  }

  const dateStr=fmtRange(meta.startDate,meta.endDate);
  dateEl.innerHTML=dateStr?`<strong>${dateStr}</strong>`:'';
  excerEl.textContent=excerptText(md);
}

function hidePreview() {
  hideTimer=setTimeout(()=>{if(previewEl)previewEl.style.display='none';currentId=null;},120);
}

function extractArticleId(href) {
  if (!href) return null;
  const m=href.match(/[?&]=([\w]+)/);
  return m?m[1]:null;
}

export function initLinkPreviews(container) {
  container.querySelectorAll('a[href]').forEach(a=>{
    const id=extractArticleId(a.getAttribute('href'));
    if (!id) return;
    a.addEventListener('mouseenter',()=>showPreview(id,a));
    a.addEventListener('mouseleave',hidePreview);
  });
}