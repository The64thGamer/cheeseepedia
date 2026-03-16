export function initSearch(app) {
(async () => {

// ── Config ───────────────────────────────────────────────────────────────────
const BASE = '/viewers/cep-js/compiled-json/search';

const TABS = [
  { id: 'articles', label: 'Articles', types: null },
  { id: 'photos',   label: 'Photos',   types: ['Photos'] },
  { id: 'videos',   label: 'Videos',   types: ['Videos'] },
  { id: 'reviews',  label: 'Reviews',  types: ['Reviews'] },
];

const QUICK_TAGS = [
  "Pizza Time Theatre","ShowBiz Pizza Place","Chuck E. Cheese's",
  "2026","1977","Locations","Showtapes","Animatronic Shows","Stage Variations",
  "Animatronics","Animatronic Parts","Animatronic Preservation","Costumed Characters",
  "Retrofits","History","Cancelled Locations","Remodels and Initiatives",
  "Arcades and Attractions","Store Fixtures","Companies/Brands","Characters",
  "Events","Animatronic Control Systems","Other Systems","Simulators",
  "Programming Systems","Commercials","News Footage","Company Media","Movies",
  "Puppets","Live Shows","ShowBiz Pizza Programs","Showtape Formats","Family Vision",
  "Corporate Documents","Documents","Promotional Material","Social Media and Websites",
  "Ad Vehicles","In-Store Merchandise","Products","Menu Items","Tickets","Tokens",
  "Employee Wear","Video Games","Sally Corporation","Jim Henson's Creature Shop",
  "Walt Disney Imagineering","Five Nights at Freddy's","Transcriptions",
  "Unknown Year","User","Meta"
];

// ── State ────────────────────────────────────────────────────────────────────
let DOCS = [], TAGS = {}, ALL_TAG_KEYS = [];
const TRI_CACHE = {};
let chips = [], suggestIdx = -1, searchTimer = null;

// ── DOM ───────────────────────────────────────────────────────────────────────
const sInput       = app.querySelector('#sInput');
const sChips       = app.querySelector('#sChips');
const sInputRow    = app.querySelector('#sInputRow');
const sSuggest     = app.querySelector('#sSuggest');
const sQtags       = app.querySelector('#sQtags');
const sQtagsList   = app.querySelector('#sQtagsList');
const sResultsWrap = app.querySelector('#sResultsWrap');
const sTabBtns     = app.querySelector('#sTabBtns');
const sTabPanels   = app.querySelector('#sTabPanels');
const sPerPage     = app.querySelector('#sPerPage');
const sSort        = app.querySelector('#sSort');
const sDisplay     = app.querySelector('#sDisplay');
const sKeepTags    = app.querySelector('#sKeepTags');

sKeepTags.checked = localStorage.getItem('sKeepTags') === '1';
sDisplay.value    = localStorage.getItem('sDisplay') || 'card';

sKeepTags.addEventListener('change', () => { localStorage.setItem('sKeepTags', sKeepTags.checked ? '1' : '0'); updateLayout(); });
sDisplay.addEventListener('change', () => { localStorage.setItem('sDisplay', sDisplay.value); executeSearch(); });

// ── Tabs ─────────────────────────────────────────────────────────────────────
TABS.forEach(t => {
  const btn = document.createElement('button');
  btn.className = 's-tab-btn' + (t.id === 'articles' ? ' active' : '');
  btn.dataset.tab = t.id;
  btn.textContent = t.label;
  btn.onclick = () => activateTab(t.id);
  sTabBtns.appendChild(btn);
  const panel = document.createElement('div');
  panel.className = 's-tab-panel' + (t.id === 'articles' ? ' active' : '');
  panel.id = 'panel-' + t.id;
  panel.innerHTML = `<div class="s-results" id="list-${t.id}"></div><div class="s-show-more" id="more-${t.id}"><a href="#">Show more</a></div>`;
  sTabPanels.appendChild(panel);
  panel.querySelector('.s-show-more a').onclick = e => {
    e.preventDefault();
    const tiers = ['10','50','100','all'];
    sPerPage.value = tiers[Math.min(tiers.indexOf(sPerPage.value)+1, tiers.length-1)];
    executeSearch();
  };
});

function activateTab(id) {
  sTabBtns.querySelectorAll('.s-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === id));
  sTabPanels.querySelectorAll('.s-tab-panel').forEach(p => p.classList.toggle('active', p.id === 'panel-'+id));
}

// ── Quick tags ────────────────────────────────────────────────────────────────
QUICK_TAGS.forEach(tag => {
  const btn = document.createElement('button');
  btn.className = 's-qtag-btn'; btn.dataset.tag = tag;
  btn.onclick = () => addChip('tag', tag, false);
  btn.textContent = tag;
  sQtagsList.appendChild(btn);
});

// ── Utils ─────────────────────────────────────────────────────────────────────
const reNW = /[^\w\s]/g, reS = /\s+/g;
const norm = s => s ? String(s).toLowerCase().replace(reNW,' ').replace(reS,' ').trim() : '';
const esc  = s => s ? String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;') : '';

function tris(s) {
  s = '  ' + norm(s) + '  ';
  const out = new Set();
  for (let i = 0; i+3 <= s.length; i++) { const t = s.slice(i,i+3); if (t.trim()) out.add(t); }
  return out;
}
function jaccard(a,b) {
  if (!a.size||!b.size) return 0;
  let n=0; for (const x of a) if (b.has(x)) n++;
  return n/(a.size+b.size-n);
}

// ── Date utils ────────────────────────────────────────────────────────────────
const MNAMES = ['','Jan. ','Feb. ','Mar. ','Apr. ','May ','Jun. ','Jul. ','Aug. ','Sep. ','Oct. ','Nov. ','Dec.'];

function parseDateParts(d) {
  if (!d||!d.trim()) return null;
  const [y,m,day]=d.split('-'), yi=parseInt(y,10), mi=parseInt(m,10), di=parseInt(day,10);
  return { y:(yi&&yi!==0)?String(yi):null, m:(mi&&mi!==0)?mi:null, d:(di&&di!==0)?di:null, unknown:(!yi||yi===0) };
}
function fmtParts(p) {
  if (!p||p.unknown) return '???';
  const mn=p.m?MNAMES[p.m]:'', dn=p.d?String(p.d):'', dp=mn+dn;
  return (dp?dp+(dp.endsWith(' ')?'':' '):'')+(p.y||'???');
}
function fmtDate(d) { return fmtParts(parseDateParts(d)); }
function fmtDateRange(start, end) {
  const sp=parseDateParts(start), su=!start||!start.trim()||(sp&&sp.unknown);
  const ss=su?'???':fmtParts(sp), em=(end===undefined||end===null||end==='');
  const ep=em?null:parseDateParts(end), eu=!em&&ep&&ep.unknown;
  if (su&&(em||eu)) return '???';
  if (em) return ss+' - Present';
  if (eu) return ss+' - ???';
  return (su?'???':ss)+' - '+fmtParts(ep);
}
function getYear(d) { const p=parseDateParts(d); return (p&&p.y)?p.y:'Unknown'; }

// ── Load data ─────────────────────────────────────────────────────────────────
async function loadData() {
  const [dr,tr] = await Promise.all([fetch(`${BASE}/docs.json`),fetch(`${BASE}/tags.json`)]);
  DOCS = await dr.json(); TAGS = await tr.json();
  ALL_TAG_KEYS = Object.keys(TAGS).sort((a,b)=>a.localeCompare(b,undefined,{sensitivity:'base'}));
  sQtagsList.querySelectorAll('.s-qtag-btn').forEach(btn => {
    const count=(TAGS[btn.dataset.tag]||[]).length;
    if (count) btn.innerHTML=esc(btn.dataset.tag)+` <span class="s-qtag-count">(${count})</span>`;
  });
}

async function loadTriShard(ch) {
  if (TRI_CACHE[ch]!==undefined) return TRI_CACHE[ch];
  try { const r=await fetch(`${BASE}/tri_${ch}.json`); TRI_CACHE[ch]=r.ok?await r.json():{}; }
  catch { TRI_CACHE[ch]={}; }
  return TRI_CACHE[ch];
}

// ── Chips ─────────────────────────────────────────────────────────────────────
function addChip(type, value, neg=false) {
  if (!value) return;
  if (type==='tag') { const f=ALL_TAG_KEYS.find(t=>t.toLowerCase()===value.toLowerCase()); value=f||value; }
  const dup=chips.findIndex(c=>c.type===type&&c.value.toLowerCase()===value.toLowerCase()&&c.neg===neg);
  if (dup!==-1) return;
  const opp=chips.findIndex(c=>c.type===type&&c.value.toLowerCase()===value.toLowerCase()&&c.neg!==neg);
  if (opp!==-1) chips.splice(opp,1);
  chips.push({type,value,neg}); renderChips();
}

function renderChips() {
  sChips.innerHTML='';
  chips.forEach((c,i) => {
    const el=document.createElement('span');
    el.className='s-chip '+(c.type==='fuzzy'?'s-chip-fuzzy':c.neg?'s-chip-neg':'s-chip-tag');
    el.innerHTML=`<button class="s-chip-x" data-i="${i}">&#x2715;</button>${esc((c.neg?'-':'')+(c.type==='fuzzy'?'"'+c.value+'"':c.value))}`;
    sChips.appendChild(el);
  });
  sInput.value=''; sInput.focus(); scheduleSearch(); updateLayout();
}

sChips.addEventListener('click', e => { const b=e.target.closest('.s-chip-x'); if(!b)return; chips.splice(Number(b.dataset.i),1); renderChips(); });
sInputRow.addEventListener('click', ()=>sInput.focus());

// ── Suggestions ───────────────────────────────────────────────────────────────
function showSuggestions(q) {
  if (!q) { hideSuggestions(); return; }
  const neg=q.startsWith('-'), qn=norm(neg?q.slice(1):q);
  if (!qn) { hideSuggestions(); return; }
  const matches=ALL_TAG_KEYS.filter(t=>norm(t).includes(qn)).map(t=>({t,count:(TAGS[t]||[]).length,neg})).sort((a,b)=>b.count-a.count).slice(0,12);
  if (!matches.length) { hideSuggestions(); return; }
  sSuggest.innerHTML='';
  matches.forEach((m,i) => {
    const el=document.createElement('div'); el.className='s-suggest-item'; el.dataset.i=i;
    el.innerHTML=`<span>${esc((m.neg?'-':'')+m.t)}</span><span class="s-suggest-count">${m.count}</span>`;
    el.onmousedown=ev=>{ev.preventDefault();addChip('tag',m.t,m.neg);hideSuggestions();};
    el.onmouseover=()=>{suggestIdx=i;highlightSuggest();};
    sSuggest.appendChild(el);
  });
  sSuggest.style.display='block'; suggestIdx=-1;
}
function hideSuggestions() { sSuggest.style.display='none'; sSuggest.innerHTML=''; suggestIdx=-1; }
function highlightSuggest() { Array.from(sSuggest.children).forEach((el,i)=>el.classList.toggle('active',i===suggestIdx)); }

sInput.addEventListener('input',()=>showSuggestions(sInput.value));
sInput.addEventListener('keydown', e => {
  const items=Array.from(sSuggest.children);
  if (e.key==='Enter'||e.key==='Tab') {
    e.preventDefault();
    const active=items[suggestIdx];
    if (active) { const txt=active.querySelector('span').textContent,neg=txt.startsWith('-'); addChip('tag',neg?txt.slice(1):txt,neg); hideSuggestions(); }
    else { const v=sInput.value.trim(); if(v){const neg=v.startsWith('-'),term=neg?v.slice(1):v,matched=ALL_TAG_KEYS.find(t=>t.toLowerCase()===term.toLowerCase());addChip(matched?'tag':'fuzzy',matched||term,neg);hideSuggestions();} }
  } else if (e.key==='ArrowDown'&&items.length) { e.preventDefault();suggestIdx=Math.min(suggestIdx+1,items.length-1);highlightSuggest();items[suggestIdx].scrollIntoView({block:'nearest'}); }
    else if (e.key==='ArrowUp'&&items.length) { e.preventDefault();suggestIdx=Math.max(suggestIdx-1,0);highlightSuggest();items[suggestIdx].scrollIntoView({block:'nearest'}); }
    else if (e.key==='Escape') hideSuggestions();
});
document.addEventListener('click', e=>{ if(!sSuggest.contains(e.target)&&e.target!==sInput) hideSuggestions(); });

// ── Layout ────────────────────────────────────────────────────────────────────
function updateLayout() {
  const has=chips.length>0||sInput.value.trim();
  sResultsWrap.style.display=has?'block':'none';
  sQtags.style.display=(!has||sKeepTags.checked)?'block':'none';
}
function scheduleSearch() { clearTimeout(searchTimer); searchTimer=setTimeout(executeSearch,150); }

// ── Search ────────────────────────────────────────────────────────────────────
async function executeSearch() {
  if (!DOCS.length) return;
  updateLayout();
  const tagChips=chips.filter(c=>c.type==='tag'), fuzzyChips=chips.filter(c=>c.type==='fuzzy');
  const fuzzyQ=fuzzyChips.map(c=>c.value).join(' ');

  if (!tagChips.length&&!fuzzyQ) {
    TABS.forEach(t=>{const l=app.querySelector('#list-'+t.id),m=app.querySelector('#more-'+t.id);if(l)l.innerHTML='';if(m)m.style.display='none';});
    return;
  }

  let results;
  if (!fuzzyQ) {
    let ids=null;
    for (const c of tagChips) {
      const tagIds=new Set(TAGS[c.value]||[]);
      if (c.neg){if(!ids)ids=new Set(DOCS.map((_,i)=>i));for(const id of tagIds)ids.delete(id);}
      else ids=ids?new Set([...ids].filter(x=>tagIds.has(x))):new Set(tagIds);
    }
    results=[...(ids||[])].map(id=>({score:0,doc:DOCS[id]})).filter(r=>r.doc);
    const pt=tagChips.find(c=>!c.neg);
    if (pt){const qt=tris(pt.value);results.forEach(r=>r.score=jaccard(tris(r.doc.t||''),qt));results.sort((a,b)=>b.score-a.score);}
  } else {
    const qTris=tris(fuzzyQ), shardKeys=new Set([...qTris].map(t=>t[0].match(/[a-z]/)?t[0]:'_'));
    const shards=await Promise.all([...shardKeys].map(loadTriShard));
    const merged=Object.assign({},...shards), hits={};
    for (const tri of qTris) for (const id of (merged[tri]||[])) hits[id]=(hits[id]||0)+1;
    const tf=tagChips.map(c=>({neg:c.neg,ids:new Set(TAGS[c.value]||[])}));
    results=Object.entries(hits).map(([id,h])=>{
      const doc=DOCS[+id]; if(!doc)return null;
      for(const f of tf){if(f.neg&&f.ids.has(+id))return null;if(!f.neg&&!f.ids.has(+id))return null;}
      return {score:h/qTris.size+(norm(doc.t||'').includes(norm(fuzzyQ))?0.3:0),doc};
    }).filter(Boolean).sort((a,b)=>b.score-a.score);
  }

  const sort=sSort.value;
  if (sort!=='relevancy') {
    results.sort((a,b)=>{const ad=a.doc.d||'',bd=b.doc.d||'';if(!ad&&!bd)return 0;if(!ad)return 1;if(!bd)return -1;return sort==='oldest'?ad.localeCompare(bd):bd.localeCompare(ad);});
  }

  const buckets={};
  TABS.forEach(t=>buckets[t.id]=[]);
  for (const r of results) {
    const tp=(r.doc.tp||'').toLowerCase();
    const tab=TABS.find(t=>t.types&&t.types.map(x=>x.toLowerCase()).includes(tp));
    (tab?buckets[tab.id]:buckets['articles']).push(r);
  }

  const limit=sPerPage.value==='all'?Infinity:parseInt(sPerPage.value)||10;
  const display=sDisplay.value, byYear=sort!=='relevancy';

  TABS.forEach(t => {
    const list=app.querySelector('#list-'+t.id), more=app.querySelector('#more-'+t.id);
    const arr=buckets[t.id];
    const btn=sTabBtns.querySelector(`[data-tab="${t.id}"]`);
    if (btn) btn.textContent=`${t.label} (${arr.length})`;
    list.innerHTML='';
    if (!arr.length){list.innerHTML='<div class="s-no-results">No results</div>';more.style.display='none';return;}
    const shown=limit===Infinity?arr:arr.slice(0,limit);
    renderTabResults(list, t.id, shown, display, byYear);
    more.style.display=(limit!==Infinity&&arr.length>shown.length)?'block':'none';
  });
}

// ── Render dispatcher ─────────────────────────────────────────────────────────
function renderTabResults(list, tabId, shown, display, byYear) {
  const R = {
    articles: { card:renderArticleCard,  compact:renderArticleCompact,  list:renderArticleList  },
    photos:   { card:renderPhotoCard,    compact:renderPhotoCompact,    list:renderPhotoList    },
    videos:   { card:renderVideoCard,    compact:renderVideoCompact,    list:renderVideoList    },
    reviews:  { card:renderReviewCard,   compact:renderReviewCompact,   list:renderReviewList   },
  };
  const fn = (R[tabId]||R.articles)[display] || R.articles.card;
  const isPhotos = tabId==='photos';
  const isReviews = tabId==='reviews';

  const wrapItems = (items, wrapClass) => {
    const w=document.createElement('div'); w.className=wrapClass;
    items.forEach(r=>w.appendChild(fn(r.doc))); return w;
  };

  if (byYear) {
    const groups={}, order=[];
    shown.forEach(r=>{const y=getYear(r.doc.d);if(!groups[y]){groups[y]=[];order.push(y);}groups[y].push(r);});
    order.forEach(year=>{
      const group=document.createElement('div'); group.className='s-year-group';
      const hdr=document.createElement('div'); hdr.className='s-year-header'; hdr.textContent=year;
      group.appendChild(hdr);
      if (display==='card'&&isPhotos) group.appendChild(wrapItems(groups[year],'PhotoGrid'));
      else if (display==='card'&&!isReviews) group.appendChild(wrapItems(groups[year],'Carousel'));
      else groups[year].forEach(r=>group.appendChild(fn(r.doc)));
      list.appendChild(group);
    });
  } else {
    if (display==='card'&&isPhotos) list.appendChild(wrapItems(shown,'PhotoGrid'));
    else if (display==='card'&&!isReviews) list.appendChild(wrapItems(shown,'CardWrap'));
    else shown.forEach(r=>list.appendChild(fn(r.doc)));
  }
}

// ── Shared helpers ────────────────────────────────────────────────────────────
function permalink(p) { return p?'/?='+encodeURIComponent(p):'#'; }

function thumbSrc(doc) {
  if (doc.img) return '/content/'+esc(doc.img)+'/photo.avif';
  if ((doc.tp||'').toLowerCase()==='photos') return '/content/'+esc(doc.p)+'/photo.avif';
  return '';
}

function injectEmptySvg(el) {
  fetch(`/viewers/cep-js/assets/Empty/${Math.floor(Math.random()*12)}.svg`)
    .then(r=>r.text()).then(svg=>{const i=el.querySelector('.CardEmptyIcon');if(i)i.outerHTML=svg;});
}

function cardImageHTML(doc, href) {
  const src=thumbSrc(doc);
  if (src) return `<a href="${esc(href)}"><img src="${src}" alt="${esc(doc.t)}" loading="lazy" onerror="this.style.display='none'"></a>`;
  if (doc.e&&doc.e.trim()) return `<a href="${esc(href)}" class="CardImageExcerpt">${esc(doc.e)}</a>`;
  return `<a href="${esc(href)}" class="CardImageEmpty"><span class="CardEmptyIcon"></span><p>Empty Page</p></a>`;
}

// Progressive photo load: show lowphoto.avif first, swap to photo.avif when ready
function progressiveImg(doc, cls='') {
  const low=`/content/${esc(doc.p)}/lowphoto.avif`, full=`/content/${esc(doc.p)}/photo.avif`;
  const img=document.createElement('img');
  img.alt=doc.t||''; img.loading='lazy';
  if (cls) img.className=cls;
  img.src=low;
  img.onerror=()=>{img.onerror=null;img.src=full;}; // fallback if no lowphoto
  const hi=new Image(); hi.onload=()=>{img.src=full;}; hi.src=full;
  return img;
}

function videoThumbSrc(url) {
  if (!url) return '';
  const yt=url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (yt) return `https://img.youtube.com/vi/${yt[1]}/mqdefault.jpg`;
  const ar=url.match(/archive\.org\/(?:details|embed)\/([^/?#\s]+)/);
  if (ar) return `https://archive.org/services/img/${ar[1]}`;
  return '';
}

// ── Article renderers ─────────────────────────────────────────────────────────
function renderArticleCard(doc) {
  const el=document.createElement('div'); el.className='Card';
  const href=permalink(doc.p), isEmpty=!thumbSrc(doc)&&!(doc.e&&doc.e.trim());
  el.innerHTML=`<div class="CardImage">${cardImageHTML(doc,href)}</div>
    <div class="CardTextArea">
      <div class="CardLink"><span><a href="${esc(href)}">${esc(doc.t||doc.p)}</a></span></div>
      <div class="CardText"><strong>${esc(fmtDateRange(doc.d,doc.de))}</strong></div>
    </div>`;
  if (isEmpty) injectEmptySvg(el);
  return el;
}

function renderArticleCompact(doc) {
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
  return el;
}

function renderArticleList(doc) {
  const el=document.createElement('div'); el.className='s-item';
  const href=permalink(doc.p);
  el.innerHTML=`<div class="s-item-body">
    <div class="s-item-title"><a href="${esc(href)}">${esc(doc.t||doc.p)}</a></div>
    ${doc.d?`<div class="s-item-meta">${esc(fmtDateRange(doc.d,doc.de))}</div>`:''}
  </div>`;
  return el;
}

// ── Photo renderers ───────────────────────────────────────────────────────────
function renderPhotoCard(doc) {
  const el=document.createElement('div'); el.className='PhotoCard';
  const href=permalink(doc.p);
  const a=document.createElement('a'); a.href=href; a.className='PhotoCardImage';
  a.appendChild(progressiveImg(doc));
  el.appendChild(a);
  el.insertAdjacentHTML('beforeend',`<div class="PhotoCardBody">
    <div class="PhotoCardExcerpt">${esc(doc.e||'')}</div>
    <div class="PhotoCardDate">${esc(fmtDate(doc.d))}</div>
  </div>`);
  return el;
}

function renderPhotoCompact(doc) {
  const el=document.createElement('div'); el.className='PhotoCompact';
  const href=permalink(doc.p);
  const a=document.createElement('a'); a.href=href; a.className='PhotoCompactImage';
  a.appendChild(progressiveImg(doc));
  el.appendChild(a);
  el.insertAdjacentHTML('beforeend',`<div class="PhotoCompactDate">${esc(fmtDate(doc.d))}</div>`);
  return el;
}

function renderPhotoList(doc) {
  const el=document.createElement('div'); el.className='PhotoListItem';
  const a=document.createElement('a'); a.href=permalink(doc.p);
  a.appendChild(progressiveImg(doc,'PhotoListImg'));
  el.appendChild(a);
  return el;
}

// ── Video renderers ───────────────────────────────────────────────────────────
function renderVideoCard(doc) {
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
  return el;
}

function renderVideoCompact(doc) {
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
  return el;
}

function renderVideoList(doc) {
  const el=document.createElement('div'); el.className='s-item';
  const href=permalink(doc.p);
  el.innerHTML=`<div class="s-item-body">
    <div class="s-item-title"><a href="${esc(href)}">${esc(doc.e||doc.t)}</a></div>
    ${doc.d?`<div class="s-item-meta">${esc(fmtDate(doc.d))}</div>`:''}
  </div>`;
  return el;
}

// ── Review renderers ──────────────────────────────────────────────────────────
function fetchReviewData(doc, showFull) {
  return Promise.all([
    fetch(`/content/${doc.p}/meta.json`).then(r=>r.json()).catch(()=>({})),
    showFull ? fetch(`/content/${doc.p}/content.md`).then(r=>r.text()).catch(()=>'') : Promise.resolve(null),
  ]);
}

function buildReviewHTML(doc, meta, body, showFull) {
  const recommend=meta.recommend??meta.recommended??true;
  const emoji=recommend?'👍':'👎';
  const title=esc(meta.title||doc.t||'');
  const page=meta.page||'';
  const pageLink=page?`<a href="/?=${encodeURIComponent(norm(page))}" class="ReviewPage">${esc(page)}</a>`:'';
  const contribs=(meta.contributors||[]).map(c=>esc(c)).join(', ');
  const date=esc(fmtDate(meta.startDate||doc.d));
  const metaLine=[date,contribs,pageLink].filter(Boolean).join(' · ');
  const bodyHTML=showFull
    ?`<div class="ReviewBody">${esc(body||'')}</div>`
    :`<div class="ReviewExcerpt">${esc(doc.e||'')}</div>`;
  return `<div class="ReviewTitle"><span class="ReviewEmoji">${emoji}</span> <a href="/?=${encodeURIComponent(doc.p)}">${title}</a></div>
    <div class="ReviewMeta">${metaLine}</div>
    ${bodyHTML}`;
}

function renderReviewCard(doc) {
  const el=document.createElement('div'); el.className='ReviewCard';
  el.innerHTML='<div class="ReviewLoading">Loading…</div>';
  fetchReviewData(doc, true).then(([meta,body])=>{ el.innerHTML=buildReviewHTML(doc,meta,body,true); });
  return el;
}

function renderReviewCompact(doc) {
  const el=document.createElement('div'); el.className='ReviewCard';
  el.innerHTML='<div class="ReviewLoading">Loading…</div>';
  fetchReviewData(doc, false).then(([meta])=>{ el.innerHTML=buildReviewHTML(doc,meta,null,false); });
  return el;
}

function renderReviewList(doc) {
  const el=document.createElement('div'); el.className='ReviewListItem';
  const href=permalink(doc.p);
  el.innerHTML=`<div class="s-item-body">
    <div class="s-item-title"><a href="${esc(href)}">${esc(doc.t||doc.p)}</a></div>
    ${doc.d?`<div class="s-item-meta">${esc(fmtDate(doc.d))}</div>`:''}
  </div>`;
  fetch(`/content/${doc.p}/meta.json`).then(r=>r.json()).catch(()=>({})).then(meta=>{
    const emoji=(meta.recommend??meta.recommended??true)?'👍':'👎';
    const titleEl=el.querySelector('.s-item-title a');
    if (titleEl) titleEl.textContent=emoji+' '+(meta.title||doc.t||'');
    const page=meta.page;
    if (page) {
      const metaEl=el.querySelector('.s-item-meta');
      if (metaEl) metaEl.insertAdjacentHTML('beforeend',` · <a href="/?=${encodeURIComponent(norm(page))}">${esc(page)}</a>`);
    }
  });
  return el;
}

// ── Init ─────────────────────────────────────────────────────────────────────
await loadData();
sPerPage.addEventListener('change', executeSearch);
sSort.addEventListener('change', executeSearch);

})();
}