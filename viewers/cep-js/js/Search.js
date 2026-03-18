import {
  esc, norm, permalink, fmtDate, fmtDateRange, getYear,
  renderArticleCard, renderArticleCompact, renderArticleList,
  renderPhotoCard, renderPhotoCompact, renderPhotoList,
  renderVideoCard, renderVideoCompact, renderVideoList,
  renderReviewCard, renderReviewCompact, renderReviewList,
} from '/viewers/cep-js/js/CardRenderer.js';

export function initSearch(app) {
(async () => {

const BASE = '/viewers/cep-js/compiled-json/search';

const TABS = [
  { id:'articles', label:'Articles', types:null },
  { id:'photos',   label:'Photos',   types:['Photos'] },
  { id:'videos',   label:'Videos',   types:['Videos'] },
  { id:'reviews',  label:'Reviews',  types:['Reviews'] },
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

const TAG_COLORS = {
  "Pizza Time Theatre":"#b7471bff","ShowBiz Pizza Place":"#b7471bff","Chuck E. Cheese's":"#b7471bff",
  "Locations":"#c26827ff","Showtapes":"#7b4fd6","Animatronic Shows":"#4a7bd1",
  "Animatronics":"#4a7bd1","Animatronic Parts":"#4a7bd1","Animatronic Preservation":"#4a7bd1",
  "Stage Variations":"#4a7bd1","Costumed Characters":"#4a7bd1","Characters":"#2e8857ff",
  "Retrofits":"#4a7bd1","Remodels and Initiatives":"#c26827ff","History":"#c26827ff",
  "Cancelled Locations":"#c26827ff","Arcades and Attractions":"#c26827ff","Store Fixtures":"#c26827ff",
  "Companies/Brands":"#2e8857ff","Events":"#2e8857ff","Animatronic Control Systems":"#99852aff",
  "Other Systems":"#99852aff","Simulators":"#99852aff","Programming Systems":"#99852aff",
  "Commercials":"#d14a4a","News Footage":"#d14a4a","Company Media":"#d14a4a","Movies":"#d14a4a",
  "Puppets":"#7b4fd6","Live Shows":"#7b4fd6","ShowBiz Pizza Programs":"#7b4fd6",
  "Showtape Formats":"#7b4fd6","Family Vision":"#7b4fd6","Corporate Documents":"#607f77ff",
  "Documents":"#607f77ff","Promotional Material":"#607f77ff","Social Media and Websites":"#607f77ff",
  "Ad Vehicles":"#607f77ff","In-Store Merchandise":"#0d9488","Products":"#0d9488",
  "Menu Items":"#0d9488","Tickets":"#0d9488","Tokens":"#0d9488","Employee Wear":"#0d9488",
  "Video Games":"#0d9488","Sally Corporation":"#b7471bff","Jim Henson's Creature Shop":"#b7471bff",
  "Walt Disney Imagineering":"#b7471bff","Five Nights at Freddy's":"#b7471bff",
  "Transcriptions":"#5a5a5a","Unknown Year":"#5a5a5a","2026":"#5a5a5a","1977":"#5a5a5a",
  "User":"#5a5a5a","Meta":"#5a5a5a",
};

let DOCS=[], TAGS={}, ALL_TAG_KEYS=[], ARTICLE_LINKER={};
const TRI_CACHE={};
let chips=[], suggestIdx=-1, searchTimer=null, sQtagsOpen=false;

const sInput      = app.querySelector('#sInput');
const sChips      = app.querySelector('#sChips');
const sInputRow   = app.querySelector('#sInputRow');
const sSuggest    = app.querySelector('#sSuggest');
const sQtags      = app.querySelector('#sQtags');
const sQtagsList  = app.querySelector('#sQtagsList');
const sResultsWrap= app.querySelector('#sResultsWrap');
const sTabBtns    = app.querySelector('#sTabBtns');
const sTabPanels  = app.querySelector('#sTabPanels');
const sPerPage    = app.querySelector('#sPerPage');
const sSort       = app.querySelector('#sSort');
const sDisplay    = app.querySelector('#sDisplay');
const sKeepTags   = app.querySelector('#sKeepTags');

sKeepTags.checked = localStorage.getItem('sKeepTags')==='1';
sDisplay.value    = localStorage.getItem('sDisplay')||'card';
sQtags.style.display = 'none';

sKeepTags.addEventListener('change',()=>{ localStorage.setItem('sKeepTags',sKeepTags.checked?'1':'0'); updateLayout(); });
sDisplay.addEventListener('change',()=>{ localStorage.setItem('sDisplay',sDisplay.value); executeSearch(); });

TABS.forEach(t => {
  const btn=document.createElement('button');
  btn.className='s-tab-btn'+(t.id==='articles'?' active':'');
  btn.dataset.tab=t.id; btn.textContent=t.label;
  btn.onclick=()=>activateTab(t.id);
  sTabBtns.appendChild(btn);
  const panel=document.createElement('div');
  panel.className='s-tab-panel'+(t.id==='articles'?' active':'');
  panel.id='panel-'+t.id;
  panel.innerHTML=`<div class="s-results" id="list-${t.id}"></div><div class="s-show-more" id="more-${t.id}"><a href="#">Show more</a></div>`;
  sTabPanels.appendChild(panel);
  panel.querySelector('.s-show-more a').onclick=e=>{
    e.preventDefault();
    const tiers=['10','50','100','all'];
    sPerPage.value=tiers[Math.min(tiers.indexOf(sPerPage.value)+1,tiers.length-1)];
    executeSearch();
  };
});

function activateTab(id) {
  sTabBtns.querySelectorAll('.s-tab-btn').forEach(b=>b.classList.toggle('active',b.dataset.tab===id));
  sTabPanels.querySelectorAll('.s-tab-panel').forEach(p=>p.classList.toggle('active',p.id==='panel-'+id));
}

QUICK_TAGS.forEach(tag => {
  const btn=document.createElement('button');
  btn.className='s-qtag-btn'; btn.dataset.tag=tag;
  btn.onclick=()=>addChip('tag',tag,false);
  btn.textContent=tag;
  const color=TAG_COLORS[tag];
  if (color) btn.style.setProperty('--tag-color',color);
  sQtagsList.appendChild(btn);
});

const reNW=/[^\w\s]/g, reS=/\s+/g;
function tris(s) {
  s='  '+norm(s)+'  '; const out=new Set();
  for(let i=0;i+3<=s.length;i++){const t=s.slice(i,i+3);if(t.trim())out.add(t);}
  return out;
}
function jaccard(a,b) {
  if(!a.size||!b.size)return 0;
  let n=0;for(const x of a)if(b.has(x))n++;
  return n/(a.size+b.size-n);
}

async function loadData() {
  const [dr,tr,lr]=await Promise.all([
    fetch(`${BASE}/docs.json`),fetch(`${BASE}/tags.json`),
    fetch('/viewers/cep-js/compiled-json/ArticleLinker.json'),
  ]);
  DOCS=await dr.json(); TAGS=await tr.json();
  ARTICLE_LINKER=lr.ok?await lr.json():{};
  ALL_TAG_KEYS=Object.keys(TAGS).sort((a,b)=>a.localeCompare(b,undefined,{sensitivity:'base'}));
  sQtagsList.querySelectorAll('.s-qtag-btn').forEach(btn=>{
    const count=(TAGS[btn.dataset.tag]||[]).length;
    if(count) btn.innerHTML=esc(btn.dataset.tag)+` <span class="s-qtag-count">(${count})</span>`;
  });
}

async function loadTriShard(ch) {
  if(TRI_CACHE[ch]!==undefined)return TRI_CACHE[ch];
  try{const r=await fetch(`${BASE}/tri_${ch}.json`);TRI_CACHE[ch]=r.ok?await r.json():{};}
  catch{TRI_CACHE[ch]={};}
  return TRI_CACHE[ch];
}

function addChip(type,value,neg=false) {
  if(!value)return;
  if(type==='tag'){const f=ALL_TAG_KEYS.find(t=>t.toLowerCase()===value.toLowerCase());value=f||value;}
  const dup=chips.findIndex(c=>c.type===type&&c.value.toLowerCase()===value.toLowerCase()&&c.neg===neg);
  if(dup!==-1)return;
  const opp=chips.findIndex(c=>c.type===type&&c.value.toLowerCase()===value.toLowerCase()&&c.neg!==neg);
  if(opp!==-1)chips.splice(opp,1);
  chips.push({type,value,neg});renderChips();
}

function renderChips() {
  sChips.innerHTML='';
  chips.forEach((c,i)=>{
    const el=document.createElement('span');
    el.className='s-chip '+(c.type==='fuzzy'?'s-chip-fuzzy':c.neg?'s-chip-neg':'s-chip-tag');
    el.innerHTML=`<button class="s-chip-x" data-i="${i}">&#x2715;</button>${esc((c.neg?'-':'')+(c.type==='fuzzy'?'"'+c.value+'"':c.value))}`;
    sChips.appendChild(el);
  });
  sInput.value='';sInput.focus();scheduleSearch();updateLayout();
}

sChips.addEventListener('click',e=>{const b=e.target.closest('.s-chip-x');if(!b)return;chips.splice(Number(b.dataset.i),1);renderChips();});
sInputRow.addEventListener('click',()=>sInput.focus());

function showSuggestions(q) {
  if(!q){hideSuggestions();return;}
  const neg=q.startsWith('-'),qn=norm(neg?q.slice(1):q);
  if(!qn){hideSuggestions();return;}
  const matches=ALL_TAG_KEYS.filter(t=>norm(t).includes(qn)).map(t=>({t,count:(TAGS[t]||[]).length,neg})).sort((a,b)=>b.count-a.count).slice(0,12);
  if(!matches.length){hideSuggestions();return;}
  sSuggest.innerHTML='';
  matches.forEach((m,i)=>{
    const el=document.createElement('div');el.className='s-suggest-item';el.dataset.i=i;
    el.innerHTML=`<span>${esc((m.neg?'-':'')+m.t)}</span><span class="s-suggest-count">${m.count}</span>`;
    el.onmousedown=ev=>{ev.preventDefault();addChip('tag',m.t,m.neg);hideSuggestions();};
    el.onmouseover=()=>{suggestIdx=i;highlightSuggest();};
    sSuggest.appendChild(el);
  });
  sSuggest.style.display='block';suggestIdx=-1;
}
function hideSuggestions(){sSuggest.style.display='none';sSuggest.innerHTML='';suggestIdx=-1;}
function highlightSuggest(){Array.from(sSuggest.children).forEach((el,i)=>el.classList.toggle('active',i===suggestIdx));}

sInput.addEventListener('focus',()=>{sQtagsOpen=true;sQtags.style.display='block';});
sInput.addEventListener('blur',()=>{setTimeout(()=>{sQtagsOpen=false;updateLayout();},200);});
sInput.addEventListener('input',()=>showSuggestions(sInput.value));
sInput.addEventListener('keydown',e=>{
  const items=Array.from(sSuggest.children);
  if(e.key==='Enter'||e.key==='Tab'){
    e.preventDefault();
    const active=items[suggestIdx];
    if(active){const txt=active.querySelector('span').textContent,neg=txt.startsWith('-');addChip('tag',neg?txt.slice(1):txt,neg);hideSuggestions();}
    else{const v=sInput.value.trim();if(v){const neg=v.startsWith('-'),term=neg?v.slice(1):v,matched=ALL_TAG_KEYS.find(t=>t.toLowerCase()===term.toLowerCase());addChip(matched?'tag':'fuzzy',matched||term,neg);hideSuggestions();}}
  } else if(e.key==='ArrowDown'&&items.length){e.preventDefault();suggestIdx=Math.min(suggestIdx+1,items.length-1);highlightSuggest();items[suggestIdx].scrollIntoView({block:'nearest'});}
    else if(e.key==='ArrowUp'&&items.length){e.preventDefault();suggestIdx=Math.max(suggestIdx-1,0);highlightSuggest();items[suggestIdx].scrollIntoView({block:'nearest'});}
    else if(e.key==='Escape')hideSuggestions();
});
document.addEventListener('click',e=>{if(!sSuggest.contains(e.target)&&e.target!==sInput)hideSuggestions();});

function updateLayout() {
  const has=chips.length>0||sInput.value.trim();
  sResultsWrap.style.display=has?'block':'none';
  if(!sQtagsOpen&&!sKeepTags.checked)sQtags.style.display='none';
  else sQtags.style.display='block';
}
function scheduleSearch(){clearTimeout(searchTimer);searchTimer=setTimeout(executeSearch,150);}

async function executeSearch() {
  if(!DOCS.length)return;
  updateLayout();
  const tagChips=chips.filter(c=>c.type==='tag'),fuzzyChips=chips.filter(c=>c.type==='fuzzy');
  const fuzzyQ=fuzzyChips.map(c=>c.value).join(' ');

  if(!tagChips.length&&!fuzzyQ){
    TABS.forEach(t=>{const l=app.querySelector('#list-'+t.id),m=app.querySelector('#more-'+t.id);if(l)l.innerHTML='';if(m)m.style.display='none';});
    return;
  }

  let results;
  if(!fuzzyQ){
    let ids=null;
    for(const c of tagChips){
      const tagIds=new Set(TAGS[c.value]||[]);
      if(c.neg){if(!ids)ids=new Set(DOCS.map((_,i)=>i));for(const id of tagIds)ids.delete(id);}
      else ids=ids?new Set([...ids].filter(x=>tagIds.has(x))):new Set(tagIds);
    }
    results=[...(ids||[])].map(id=>({score:0,doc:DOCS[id]})).filter(r=>r.doc);
    const pt=tagChips.find(c=>!c.neg);
    if(pt){const qt=tris(pt.value);results.forEach(r=>r.score=jaccard(tris(r.doc.t||''),qt));results.sort((a,b)=>b.score-a.score);}
  } else {
    const qTris=tris(fuzzyQ),shardKeys=new Set([...qTris].map(t=>t[0].match(/[a-z]/)?t[0]:'_'));
    const shards=await Promise.all([...shardKeys].map(loadTriShard));
    const merged=Object.assign({},...shards),hits={};
    for(const tri of qTris)for(const id of(merged[tri]||[]))hits[id]=(hits[id]||0)+1;
    const tf=tagChips.map(c=>({neg:c.neg,ids:new Set(TAGS[c.value]||[])}));
    results=Object.entries(hits).map(([id,h])=>{
      const doc=DOCS[+id];if(!doc)return null;
      for(const f of tf){if(f.neg&&f.ids.has(+id))return null;if(!f.neg&&!f.ids.has(+id))return null;}
      return{score:h/qTris.size+(norm(doc.t||'').includes(norm(fuzzyQ))?0.3:0),doc};
    }).filter(Boolean).sort((a,b)=>b.score-a.score);
  }

  const sort=sSort.value;
  if(sort!=='relevancy'){
    results.sort((a,b)=>{const ad=a.doc.d||'',bd=b.doc.d||'';if(!ad&&!bd)return 0;if(!ad)return 1;if(!bd)return-1;return sort==='oldest'?ad.localeCompare(bd):bd.localeCompare(ad);});
  }

  const buckets={};TABS.forEach(t=>buckets[t.id]=[]);
  for(const r of results){
    const tp=(r.doc.tp||'').toLowerCase();
    const tab=TABS.find(t=>t.types&&t.types.map(x=>x.toLowerCase()).includes(tp));
    (tab?buckets[tab.id]:buckets['articles']).push(r);
  }

  const limit=sPerPage.value==='all'?Infinity:parseInt(sPerPage.value)||10;
  const display=sDisplay.value,byYear=sort!=='relevancy';

  TABS.forEach(t=>{
    const list=app.querySelector('#list-'+t.id),more=app.querySelector('#more-'+t.id);
    const arr=buckets[t.id];
    const btn=sTabBtns.querySelector(`[data-tab="${t.id}"]`);
    if(btn)btn.textContent=`${t.label} (${arr.length})`;
    list.innerHTML='';
    if(!arr.length){list.innerHTML='<div class="s-no-results">No results</div>';more.style.display='none';return;}
    const shown=limit===Infinity?arr:arr.slice(0,limit);
    renderTabResults(list,t.id,shown,display,byYear);
    more.style.display=(limit!==Infinity&&arr.length>shown.length)?'block':'none';
  });
}

function renderTabResults(list,tabId,shown,display,byYear) {
  const R={
    articles:{card:renderArticleCard,compact:renderArticleCompact,list:renderArticleList},
    photos:  {card:renderPhotoCard,  compact:renderPhotoCompact,  list:renderPhotoList  },
    videos:  {card:renderVideoCard,  compact:renderVideoCompact,  list:renderVideoList  },
    reviews: {card:renderReviewCard, compact:renderReviewCompact, list:renderReviewList },
  };
  const fn=(R[tabId]||R.articles)[display]||R.articles.card;
  const isPhotos=tabId==='photos',isReviews=tabId==='reviews';
  const wrapItems=(items,cls)=>{const w=document.createElement('div');w.className=cls;items.forEach(r=>w.appendChild(fn(r.doc)));return w;};

  if(byYear){
    const groups={},order=[];
    shown.forEach(r=>{const y=getYear(r.doc.d);if(!groups[y]){groups[y]=[];order.push(y);}groups[y].push(r);});
    order.forEach(year=>{
      const group=document.createElement('div');group.className='s-year-group';
      const hdr=document.createElement('div');hdr.className='s-year-header';hdr.textContent=year;
      group.appendChild(hdr);
      if(display==='card'&&isPhotos)group.appendChild(wrapItems(groups[year],'PhotoGrid'));
      else if(display==='card'&&!isReviews)group.appendChild(wrapItems(groups[year],'Carousel'));
      else groups[year].forEach(r=>group.appendChild(fn(r.doc)));
      list.appendChild(group);
    });
  } else {
    if(display==='card'&&isPhotos)list.appendChild(wrapItems(shown,'PhotoGrid'));
    else if(display==='card'&&!isReviews)list.appendChild(wrapItems(shown,'CardWrap'));
    else shown.forEach(r=>list.appendChild(fn(r.doc)));
  }
}

await loadData();
sPerPage.addEventListener('change',executeSearch);
sSort.addEventListener('change',executeSearch);

})();
}