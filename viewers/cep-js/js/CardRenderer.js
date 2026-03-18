import { ProgressiveImage } from '/viewers/cep-js/js/ProgressiveImage.js';

// ── Utils ─────────────────────────────────────────────────────────────────────
export const esc  = s => s ? String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;') : '';
export const norm = s => s ? String(s).toLowerCase().replace(/[^\w\s]/g,' ').replace(/\s+/g,' ').trim() : '';
export const permalink = p => p ? '/?v=cep-js&='+encodeURIComponent(p) : '#';

// ── Date utils ────────────────────────────────────────────────────────────────
const MNAMES = ['','Jan. ','Feb. ','Mar. ','Apr. ','May ','Jun. ','Jul. ','Aug. ','Sep. ','Oct. ','Nov. ','Dec.'];
function parseDateParts(d) {
  if (!d||!d.trim()) return null;
  const [y,m,day]=d.split('-'), yi=parseInt(y,10), mi=parseInt(m,10), di=parseInt(day,10);
  return {y:(yi&&yi!==0)?String(yi):null, m:(mi&&mi!==0)?mi:null, d:(di&&di!==0)?di:null, unknown:(!yi||yi===0)};
}
function fmtParts(p) {
  if (!p||p.unknown) return '???';
  const mn=p.m?MNAMES[p.m]:'', dn=p.d?String(p.d):'', dp=mn+dn;
  return (dp?dp+(dp.endsWith(' ')?'':' '):'')+(p.y||'???');
}
export function fmtDate(d) { return fmtParts(parseDateParts(d)); }
export function fmtDateRange(start, end) {
  const sp=parseDateParts(start), su=!start||!start.trim()||(sp&&sp.unknown);
  const ss=su?'???':fmtParts(sp), em=(end===undefined||end===null||end==='');
  const ep=em?null:parseDateParts(end), eu=!em&&ep&&ep.unknown;
  if (su&&(em||eu)) return '???';
  if (em) return ss+' - Present';
  if (eu) return ss+' - ???';
  return (su?'???':ss)+' - '+fmtParts(ep);
}
export function getYear(d) { const p=parseDateParts(d); return (p&&p.y)?p.y:'Unknown'; }

// ── Shared helpers ────────────────────────────────────────────────────────────
export function thumbSrc(doc) {
  if (doc.img) return '/content/'+esc(doc.img)+'/photo.avif';
  if ((doc.tp||'').toLowerCase()==='photos') return '/content/'+esc(doc.p)+'/photo.avif';
  return '';
}

export function injectEmptySvg(el) {
  fetch(`/viewers/cep-js/assets/Empty/${Math.floor(Math.random()*12)}.svg`)
    .then(r=>r.text()).then(svg=>{const i=el.querySelector('.CardEmptyIcon');if(i)i.outerHTML=svg;});
}

export function cardImageHTML(doc, href) {
  const src=thumbSrc(doc);
  if (src) return `<a href="${esc(href)}"><img src="${src}" alt="${esc(doc.t)}" loading="lazy" onerror="this.style.display='none'"></a>`;
  if (doc.e&&doc.e.trim()) return `<a href="${esc(href)}" class="CardImageExcerpt">${esc(doc.e)}</a>`;
  return `<a href="${esc(href)}" class="CardImageEmpty"><span class="CardEmptyIcon"></span><p>Empty Page</p></a>`;
}

export function videoThumbSrc(url) {
  if (!url) return '';
  const yt=url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (yt) return `https://img.youtube.com/vi/${yt[1]}/mqdefault.jpg`;
  const ar=url.match(/archive\.org\/(?:details|embed)\/([^/?#\s]+)/);
  if (ar) return `https://archive.org/services/img/${ar[1]}`;
  return '';
}

// ── Article renderers ─────────────────────────────────────────────────────────
export function renderArticleCard(doc) {
  const el=document.createElement('div'); el.className='Card';
  const href=permalink(doc.p), isEmpty=!thumbSrc(doc)&&!(doc.e&&doc.e.trim());
  el.innerHTML=`<div class="CardImage">${cardImageHTML(doc,href)}</div>
    <div class="CardTextArea">
      <div class="CardLink"><span><a href="${esc(href)}">${esc(doc.t||doc.p)}</a></span></div>
      <div class="CardText"><strong>${esc(fmtDateRange(doc.d,doc.de))}</strong></div>
    </div>`;
  if (isEmpty) injectEmptySvg(el);
  injectViewCount(el, doc.p);
  return el;
}

export function renderArticleCompact(doc) {
  const el=document.createElement('div'); el.className='CompactCard';
  const href=permalink(doc.p), src=thumbSrc(doc);
  const imgHTML=src
    ?`<a href="${esc(href)}"><img src="${src}" alt="${esc(doc.t)}" loading="lazy" onerror="this.style.display='none'"></a>`
    :`<a href="${esc(href)}" class="CardImageEmpty"><span class="CardEmptyIcon"></span></a>`;
  el.innerHTML=`<div class="CardImage">${imgHTML}</div>
    <div class="CardTextArea">
      <div class="CardLink"><a href="${esc(href)}">${esc(doc.t||doc.p)}</a></div>
      <div class="CardText"><strong>${esc(fmtDateRange(doc.d,doc.de))}</strong></div>
    </div>`;
  if (!src) injectEmptySvg(el);
  injectViewCount(el, doc.p);
  return el;
}

export function renderArticleList(doc) {
  const el=document.createElement('div'); el.className='s-item';
  const href=permalink(doc.p);
  el.innerHTML=`<div class="s-item-body">
    <div class="s-item-title"><a href="${esc(href)}">${esc(doc.t||doc.p)}</a></div>
    ${doc.d?`<div class="s-item-meta">${esc(fmtDateRange(doc.d,doc.de))}</div>`:''}
  </div>`;
  injectViewCount(el, doc.p, '.s-item-meta');
  return el;
}

// ── Photo renderers ───────────────────────────────────────────────────────────
export function renderPhotoCard(doc) {
  const el=document.createElement('div'); el.className='PhotoCard';
  const a=document.createElement('a'); a.href=permalink(doc.p); a.className='PhotoCardImage';
  a.appendChild(ProgressiveImage(doc.p,doc.t)); el.appendChild(a);
  el.insertAdjacentHTML('beforeend',`<div class="PhotoCardBody">
    <div class="PhotoCardExcerpt">${esc(doc.e||'')}</div>
    <div class="PhotoCardDate">${esc(fmtDate(doc.d))}</div>
  </div>`);
  injectViewCount(el, doc.p, '.PhotoCardDate');
  return el;
}

export function renderPhotoCompact(doc) {
  const el=document.createElement('div'); el.className='PhotoCompact';
  const a=document.createElement('a'); a.href=permalink(doc.p); a.className='PhotoCompactImage';
  a.appendChild(ProgressiveImage(doc.p,doc.t)); el.appendChild(a);
  el.insertAdjacentHTML('beforeend',`<div class="PhotoCompactDate">${esc(fmtDate(doc.d))}</div>`);
  injectViewCount(el, doc.p, '.PhotoCompactDate');
  return el;
}

export function renderPhotoList(doc) {
  const el=document.createElement('div'); el.className='PhotoListItem';
  const a=document.createElement('a'); a.href=permalink(doc.p);
  a.appendChild(ProgressiveImage(doc.p,doc.t,'PhotoListImg'));
  el.appendChild(a); return el;
}

// ── Video renderers ───────────────────────────────────────────────────────────
export function renderVideoCard(doc) {
  const el=document.createElement('div'); el.className='Card';
  const href=permalink(doc.p), thumb=videoThumbSrc(doc.t);
  const imgHTML=thumb
    ?`<a href="${esc(href)}"><img src="${esc(thumb)}" alt="Video" loading="lazy" onerror="this.style.display='none'"></a>`
    :`<a href="${esc(href)}" class="CardImageEmpty"><span class="CardEmptyIcon"></span><p>Empty Page</p></a>`;
  el.innerHTML=`<div class="CardImage">${imgHTML}</div>
    <div class="CardTextArea">
      <div class="CardLink"><span><a href="${esc(href)}">${esc(doc.e||doc.t)}</a></span></div>
      <div class="CardText"><strong>${esc(fmtDate(doc.d))}</strong></div>
    </div>`;
  if (!thumb) injectEmptySvg(el);
  injectViewCount(el, doc.p);
  return el;
}

export function renderVideoCompact(doc) {
  const el=document.createElement('div'); el.className='CompactCard';
  const href=permalink(doc.p), thumb=videoThumbSrc(doc.t);
  const imgHTML=thumb
    ?`<a href="${esc(href)}"><img src="${esc(thumb)}" alt="Video" loading="lazy" onerror="this.style.display='none'"></a>`
    :`<a href="${esc(href)}" class="CardImageEmpty"><span class="CardEmptyIcon"></span></a>`;
  el.innerHTML=`<div class="CardImage">${imgHTML}</div>
    <div class="CardTextArea">
      <div class="CardLink"><a href="${esc(href)}">${esc(doc.e||doc.t)}</a></div>
      <div class="CardText"><strong>${esc(fmtDate(doc.d))}</strong></div>
    </div>`;
  if (!thumb) injectEmptySvg(el);
  injectViewCount(el, doc.p);
  return el;
}

export function renderVideoList(doc) {
  const el=document.createElement('div'); el.className='s-item';
  const href=permalink(doc.p);
  el.innerHTML=`<div class="s-item-body">
    <div class="s-item-title"><a href="${esc(href)}">${esc(doc.e||doc.t)}</a></div>
    ${doc.d?`<div class="s-item-meta">${esc(fmtDate(doc.d))}</div>`:''}
  </div>`;
  injectViewCount(el, doc.p, '.s-item-meta');
  return el;
}

// ── View count helpers ────────────────────────────────────────────────────────
let _views = null;
async function getViews() {
  if (!_views) _views = await fetch('/viewers/cep-js/compiled-json/view.json').then(r=>r.ok?r.json():{}).catch(()=>({}));
  return _views;
}
export function fmtViews(n) { return ' '+(n??0)+' view'+((n??0)===1?'':'s'); }

/** Appends a view-count span to the .CardText or .s-item-meta element inside `el`. */
export function injectViewCount(el, path, selector='.CardText') {
  getViews().then(views=>{
    const n = views[path]??0;
    const target = el.querySelector(selector);
    if (target) target.appendChild(document.createTextNode(fmtViews(n)));
  });
}

// ── Review renderers ──────────────────────────────────────────────────────────
let _linker = null;
async function getLinker() {
  if (!_linker) _linker = await fetch('/viewers/cep-js/compiled-json/ArticleLinker.json').then(r=>r.ok?r.json():{}).catch(()=>({}));
  return _linker;
}

function fetchReviewData(doc, showFull) {
  return Promise.all([
    fetch(`/content/${doc.p}/meta.json`).then(r=>r.json()).catch(()=>({})),
    showFull?fetch(`/content/${doc.p}/content.md`).then(r=>r.text()).catch(()=>''):Promise.resolve(null),
  ]);
}

async function buildReviewHTML(doc, meta, body, showFull) {
  const [linker, views] = await Promise.all([getLinker(), getViews()]);
  const recommend=meta.recommend??meta.recommended??true;
  const page=meta.page||'';
  const pageId=page?linker[page]:null;
  const pageLink=page?`<a href="/?v=cep-js&=${encodeURIComponent(pageId||norm(page))}" class="ReviewPage">${esc(page)}</a>`:'';
  const viewSpan=fmtViews(views[doc.p]??0).trim();
  const metaLine=[esc(fmtDate(meta.startDate||doc.d)),(meta.contributors||[]).map(c=>esc(c)).join(', '),pageLink,viewSpan].filter(Boolean).join(' · ');
  const bodyHTML=showFull?`<div class="ReviewBody">${esc(body||'')}</div>`:`<div class="ReviewExcerpt">${esc(doc.e||'')}</div>`;
  return `<div class="ReviewTitle"><span class="ReviewEmoji">${recommend?'👍':'👎'}</span><a href="/?v=cep-js&=${encodeURIComponent(doc.p)}">${esc(meta.title||doc.t||'')}</a></div>
    <div class="ReviewMeta">${metaLine}</div>${bodyHTML}`;
}

export function renderReviewCard(doc) {
  const el=document.createElement('div'); el.className='ReviewCard';
  el.innerHTML='<div class="ReviewLoading">Loading…</div>';
  fetchReviewData(doc,true).then(([meta,body])=>buildReviewHTML(doc,meta,body,true).then(h=>el.innerHTML=h));
  return el;
}

export function renderReviewCompact(doc) {
  const el=document.createElement('div'); el.className='ReviewCard';
  el.innerHTML='<div class="ReviewLoading">Loading…</div>';
  fetchReviewData(doc,false).then(([meta])=>buildReviewHTML(doc,meta,null,false).then(h=>el.innerHTML=h));
  return el;
}

export function renderReviewList(doc) {
  const el=document.createElement('div'); el.className='ReviewListItem';
  const href=permalink(doc.p);
  el.innerHTML=`<div class="s-item-body">
    <div class="s-item-title"><a href="${esc(href)}">${esc(doc.t||doc.p)}</a></div>
    ${doc.d?`<div class="s-item-meta">${esc(fmtDate(doc.d))}</div>`:''}
  </div>`;
  Promise.all([fetch(`/content/${doc.p}/meta.json`).then(r=>r.json()).catch(()=>({})), getLinker(), getViews()]).then(([meta,linker,views])=>{
    const emoji=(meta.recommend??meta.recommended??true)?'👍':'👎';
    const titleEl=el.querySelector('.s-item-title a');
    if (titleEl) titleEl.textContent=emoji+' '+(meta.title||doc.t||'');
    const page=meta.page;
    if (page) {
      const pid=linker[page]||null;
      const metaEl=el.querySelector('.s-item-meta');
      if (metaEl) metaEl.insertAdjacentHTML('beforeend',` · <a href="/?v=cep-js&=${encodeURIComponent(pid||norm(page))}">${esc(page)}</a>`);
    }
    const metaEl=el.querySelector('.s-item-meta');
    if (metaEl) metaEl.appendChild(document.createTextNode(fmtViews(views[doc.p]??0)));
  });
  return el;
}