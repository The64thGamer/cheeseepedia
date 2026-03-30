import {
  esc, norm, permalink, fmtDate, fmtDateRange, getYear,
  renderArticleCard, renderArticleCompact, renderArticleList,
} from '/viewers/cep-js/js/CardRenderer.js';
import { renderQuickTags } from '/viewers/cep-js/js/QuickTags.js';
import { timeAgo } from '/viewers/cep-js/js/TimeRecency.js';

export function initTheorySearch(app) {
return (async () => {

const BASE = '/viewers/theoryweb/compiled-json/search';

// ── Graph constants ───────────────────────────────────────────────────────
const CARD_W          = 220;
const CARD_H          = 130;
const EDGE_MIN_SHARED = 2;
const BOUNDS_PAD      = 600;
const SIM_STEPS       = 180;
const REPULSE_DIST    = 340;
const REPULSE_STR     = 28000;
const ATTRACT_LEN     = 260;
const ATTRACT_STR     = 0.018;
const DAMPING         = 0.82;

// ── Quick tags (FNaF-specific) ────────────────────────────────────────────
const QUICK_TAGS_LIST = [
  "Five Nights at Freddy's","Freddy Fazbear's Pizza","Animatronics",
  "Characters","Locations","Lore","Books","Games","Movies",
  "Real World","Theories","Unknown Year",
];

let DOCS=[], TAGS={}, ALL_TAG_KEYS=[], VIEWS={};
const TRI_CACHE={};
let chips=[], suggestIdx=-1, searchTimer=null;

let TAG_LOOKUP         = new Map();
let DOCS_BY_NORM_TITLE = new Map();
let TAG_YEAR_RANGE     = new Map();

// ── DOM refs (same ids as Search.html) ───────────────────────────────────
const sInput      = app.querySelector('#sInput');
const sChips      = app.querySelector('#sChips');
const sInputRow   = app.querySelector('#sInputRow');
const sSuggest    = app.querySelector('#sSuggest');
const sQtags      = app.querySelector('#sQtags');
const sQtagsList  = app.querySelector('#sQtagsList');
const sResultsWrap= app.querySelector('#sResultsWrap');
const sPerPage    = app.querySelector('#sPerPage');
const sSort       = app.querySelector('#sSort');
const sKeepTags   = app.querySelector('#sKeepTags');
const twViewport  = app.querySelector('#twViewport');
const twCanvas    = app.querySelector('#twCanvas');

sKeepTags.checked = localStorage.getItem('sKeepTags')==='1';

// ── Initial state ─────────────────────────────────────────────────────────
sQtags.style.display       = 'none';
sResultsWrap.style.display = 'none';

// ── Layout ────────────────────────────────────────────────────────────────
function updateLayout() {
  const hasQuery = chips.length > 0;
  sResultsWrap.style.display = hasQuery ? 'block' : 'none';
  sQtags.style.display = (!hasQuery || sKeepTags.checked) ? 'block' : 'none';
}

// ── Quick tags ────────────────────────────────────────────────────────────
renderQuickTags(sQtagsList, QUICK_TAGS_LIST, tag => addChip('tag', tag, false));

sInput.addEventListener('focus', () => {
  if(!chips.length) sQtags.style.display = 'block';
}, { once: true });

// ── Search utils ──────────────────────────────────────────────────────────
function tris(s) {
  s = '  '+norm(s)+'  ';
  const out = new Set();
  for(let i=0; i+3<=s.length; i++) { const t=s.slice(i,i+3); if(t.trim()) out.add(t); }
  return out;
}
function jaccard(a, b) {
  if(!a.size||!b.size) return 0;
  let n=0; for(const x of a) if(b.has(x)) n++;
  return n/(a.size+b.size-n);
}

// ── Data loading ──────────────────────────────────────────────────────────
async function loadData() {
  const [dr, tr] = await Promise.all([
    fetch(`${BASE}/docs.json`),
    fetch(`${BASE}/tags.json`),
  ]);
  DOCS         = await dr.json();
  TAGS         = await tr.json();
  ALL_TAG_KEYS = Object.keys(TAGS).sort((a,b) => a.localeCompare(b, undefined, {sensitivity:'base'}));

  TAG_LOOKUP = new Map(ALL_TAG_KEYS.map(k => [k.toLowerCase(), k]));

  DOCS_BY_NORM_TITLE = new Map();
  for(const doc of DOCS) {
    if(doc) {
      const key = norm(doc.t || '');
      if(key && !DOCS_BY_NORM_TITLE.has(key)) DOCS_BY_NORM_TITLE.set(key, doc);
    }
  }

  TAG_YEAR_RANGE = new Map();
  for(const tag of ALL_TAG_KEYS) {
    const matchDoc = DOCS_BY_NORM_TITLE.get(norm(tag));
    if(!matchDoc) continue;
    const startYear = matchDoc.d && !matchDoc.d.startsWith('0000') ? matchDoc.d.slice(0,4) : null;
    let maxYear = null;
    for(const id of (TAGS[tag] || [])) {
      const doc = DOCS[id];
      if(!doc || !doc.d || doc.d.startsWith('0000')) continue;
      const y = doc.d.slice(0,4);
      if(!maxYear || y > maxYear) maxYear = y;
    }
    let yearRange = '';
    if(startYear && maxYear && maxYear !== startYear) yearRange = `${startYear}–${maxYear}`;
    else if(startYear) yearRange = startYear;
    else if(maxYear)   yearRange = maxYear;
    if(yearRange) TAG_YEAR_RANGE.set(tag, yearRange);
  }

  sQtagsList.querySelectorAll('.s-qtag-btn').forEach(btn => {
    const count = (TAGS[btn.dataset.tag]||[]).length;
    if(count) {
      let el = btn.querySelector('.s-qtag-count');
      if(!el) { el=document.createElement('span'); el.className='s-qtag-count'; btn.appendChild(el); }
      el.textContent = `(${count})`;
    }
  });
}

async function loadTriShard(ch) {
  if(TRI_CACHE[ch] !== undefined) return TRI_CACHE[ch];
  try { const r=await fetch(`${BASE}/tri_${ch}.json`); TRI_CACHE[ch]=r.ok?await r.json():{}; }
  catch { TRI_CACHE[ch]={}; }
  return TRI_CACHE[ch];
}

// ── Chips ─────────────────────────────────────────────────────────────────
function addChip(type, value, neg=false) {
  if(!value) return;
  if(type==='tag') value = TAG_LOOKUP.get(value.toLowerCase()) || value;
  const vl = value.toLowerCase();
  const dup = chips.findIndex(c => c.type===type && c.value.toLowerCase()===vl && c.neg===neg);
  if(dup !== -1) return;
  const opp = chips.findIndex(c => c.type===type && c.value.toLowerCase()===vl && c.neg!==neg);
  if(opp !== -1) chips.splice(opp, 1);
  chips.push({type, value, neg});
  sInput.value = '';
  hideSuggestions();
  renderChips();
}

function renderChips() {
  sChips.innerHTML = '';
  chips.forEach((c, i) => {
    const el = document.createElement('span');
    el.className = 's-chip ' + (c.type==='fuzzy' ? 's-chip-fuzzy' : c.neg ? 's-chip-neg' : 's-chip-tag');
    const xBtn = document.createElement('button');
    xBtn.className = 's-chip-x';
    xBtn.innerHTML = '&#x2715;';
    xBtn.addEventListener('click', e => {
      e.stopPropagation();
      chips.splice(i, 1);
      renderChips();
    });
    el.appendChild(xBtn);
    el.appendChild(document.createTextNode((c.neg?'-':'') + (c.type==='fuzzy' ? '"'+c.value+'"' : c.value)));
    sChips.appendChild(el);
  });
  updateLayout();
  scheduleSearch();
}

sInputRow.addEventListener('click', e => {
  if(!e.target.closest('.s-chip-x')) sInput.focus();
});

// ── Suggestions ───────────────────────────────────────────────────────────
function showSuggestions(q) {
  if(!q) { hideSuggestions(); return; }
  const neg=q.startsWith('-'), qn=norm(neg ? q.slice(1) : q);
  if(!qn) { hideSuggestions(); return; }
  const matches = ALL_TAG_KEYS
    .filter(t => norm(t).includes(qn))
    .map(t => ({t, count:(TAGS[t]||[]).length, neg}))
    .sort((a,b) => b.count-a.count).slice(0,12);
  if(!matches.length) { hideSuggestions(); return; }
  sSuggest.innerHTML = '';
  matches.forEach((m, i) => {
    const el = document.createElement('div');
    el.className = 's-suggest-item'; el.dataset.i = i;
    const yearRange = TAG_YEAR_RANGE.get(m.t) || '';
    el.innerHTML = `<span>${esc((m.neg?'-':'')+m.t)}</span><span class="s-suggest-count">${yearRange ? `<span class="s-suggest-years">${yearRange}</span>` : ''}${m.count}</span>`;
    el.onmousedown = ev => { ev.preventDefault(); addChip('tag', m.t, m.neg); };
    el.onmouseover = () => { suggestIdx=i; highlightSuggest(); };
    sSuggest.appendChild(el);
  });
  sSuggest.style.display = 'block'; suggestIdx = -1;
}
function hideSuggestions() { sSuggest.style.display='none'; sSuggest.innerHTML=''; suggestIdx=-1; }
function highlightSuggest() { Array.from(sSuggest.children).forEach((el,i) => el.classList.toggle('active', i===suggestIdx)); }

// ── Input events ──────────────────────────────────────────────────────────
sInput.addEventListener('input', () => showSuggestions(sInput.value));
sInput.addEventListener('keydown', e => {
  const items = Array.from(sSuggest.children);
  if(e.key==='Enter' || e.key==='Tab') {
    e.preventDefault();
    const active = items[suggestIdx];
    if(active) {
      const txt=active.querySelector('span').textContent, neg=txt.startsWith('-');
      addChip('tag', neg?txt.slice(1):txt, neg);
    } else {
      const v=sInput.value.trim();
      if(v) {
        const neg=v.startsWith('-'), term=neg?v.slice(1):v;
        const matched = TAG_LOOKUP.get(term.toLowerCase());
        addChip(matched?'tag':'fuzzy', matched||term, neg);
      }
    }
  } else if(e.key==='ArrowDown' && items.length) {
    e.preventDefault(); suggestIdx=Math.min(suggestIdx+1, items.length-1);
    highlightSuggest(); items[suggestIdx].scrollIntoView({block:'nearest'});
  } else if(e.key==='ArrowUp' && items.length) {
    e.preventDefault(); suggestIdx=Math.max(suggestIdx-1, 0);
    highlightSuggest(); items[suggestIdx].scrollIntoView({block:'nearest'});
  } else if(e.key==='Escape') {
    hideSuggestions();
  } else if(e.key==='Backspace' && !sInput.value && chips.length) {
    chips.pop(); renderChips();
  }
});
document.addEventListener('click', e => {
  if(!sSuggest.contains(e.target) && e.target!==sInput) hideSuggestions();
});

// ── Settings ──────────────────────────────────────────────────────────────
sKeepTags.addEventListener('change', () => {
  localStorage.setItem('sKeepTags', sKeepTags.checked?'1':'0');
  updateLayout();
});
sPerPage.addEventListener('change', () => { if(chips.length) executeSearch(); });
sSort.addEventListener('change',    () => { if(chips.length) executeSearch(); });

// ── Search execution ──────────────────────────────────────────────────────
function scheduleSearch() { clearTimeout(searchTimer); searchTimer=setTimeout(executeSearch, 150); }

async function executeSearch() {
  if(!DOCS.length) return;

  const tagChips  = chips.filter(c => c.type==='tag');
  const fuzzyChips= chips.filter(c => c.type==='fuzzy');
  const fuzzyQ    = fuzzyChips.map(c => c.value).join(' ');

  if(!tagChips.length && !fuzzyQ) {
    clearWeb();
    updateLayout();
    return;
  }

  let results;
  if(!fuzzyQ) {
    let ids=null;
    for(const c of tagChips) {
      const tagIds = new Set((TAGS[c.value] || []).map(Number));
      if(c.neg) {
        if(!ids) ids=new Set(DOCS.map((_,i)=>i));
        for(const id of tagIds) ids.delete(id);
      } else {
        if(!ids) {
          ids = new Set(tagIds);
        } else {
          const [small, large] = ids.size < tagIds.size ? [ids, tagIds] : [tagIds, ids];
          const next = new Set();
          for(const id of small) if(large.has(id)) next.add(id);
          ids = next;
        }
      }
    }
    results=[...(ids||[])].map(id=>({score:0,doc:DOCS[id]})).filter(r=>r.doc);
    const pt=tagChips.find(c=>!c.neg);
    if(pt) {
      const qt=tris(pt.value);
      results.forEach(r => r.score=jaccard(tris(r.doc.t||''), qt));
      results.sort((a,b) => b.score-a.score);
    }
  } else {
    const qTris=tris(fuzzyQ);
    const normFuzzyQ=norm(fuzzyQ);
    const shardKeys=new Set([...qTris].map(t=>t[0].match(/[a-z]/)?t[0]:'_'));
    const shards=await Promise.all([...shardKeys].map(loadTriShard));
    const merged=Object.assign({},...shards), hits={};
    for(const tri of qTris) for(const id of(merged[tri]||[])) hits[id]=(hits[id]||0)+1;
    const tf=tagChips.map(c=>({neg:c.neg, ids:new Set(TAGS[c.value]||[])}));
    results=Object.entries(hits).map(([id,h]) => {
      const doc=DOCS[+id]; if(!doc) return null;
      for(const f of tf) { if(f.neg&&f.ids.has(+id)) return null; if(!f.neg&&!f.ids.has(+id)) return null; }
      return {score:h/qTris.size+(norm(doc.t||'').includes(normFuzzyQ)?0.3:0), doc};
    }).filter(Boolean).sort((a,b)=>b.score-a.score);
  }

  const sort   = sSort.value;
  if(sort !== 'relevancy') {
    results.sort((a,b) => {
      if(sort==='newest-updated'||sort==='oldest-updated') {
        const am=a.doc.mt||0, bm=b.doc.mt||0;
        return sort==='newest-updated' ? bm-am : am-bm;
      }
      const ad=a.doc.d||'', bd=b.doc.d||'';
      const aUnk=!ad||ad==='0000-00-00'||ad.startsWith('0000');
      const bUnk=!bd||bd==='0000-00-00'||bd.startsWith('0000');
      if(aUnk&&bUnk) return 0; if(aUnk) return 1; if(bUnk) return -1;
      return sort==='oldest' ? ad.localeCompare(bd) : bd.localeCompare(ad);
    });
  }

  const limit = sPerPage.value==='all' ? Infinity : parseInt(sPerPage.value)||20;
  buildWeb(results.slice(0, limit === Infinity ? undefined : limit));
  updateLayout();
}

// ── Graph: tag sets per doc ───────────────────────────────────────────────
function buildDocTagSets(results) {
  const map = new Map();
  for(const [tag, ids] of Object.entries(TAGS)) {
    for(const id of ids) {
      const doc = DOCS[id];
      if(!doc) continue;
      if(!map.has(doc)) map.set(doc, new Set());
      map.get(doc).add(tag);
    }
  }
  return results.map(r => map.get(r.doc) || new Set());
}

function sharedTagCount(a, b) {
  let n=0;
  const [small, large] = a.size<b.size ? [a,b] : [b,a];
  for(const t of small) if(large.has(t)) n++;
  return n;
}

// ── Force layout ──────────────────────────────────────────────────────────
function forceLayout(nodes, edges) {
  const N = nodes.length;
  for(let i=0;i<N;i++){
    const a=(i/N)*Math.PI*2;
    nodes[i].x=Math.cos(a)*(REPULSE_DIST*1.2);
    nodes[i].y=Math.sin(a)*(REPULSE_DIST*1.2);
    nodes[i].vx=0; nodes[i].vy=0;
  }
  for(let step=0;step<SIM_STEPS;step++){
    const cooling=1-step/SIM_STEPS;
    for(let i=0;i<N;i++){
      for(let j=i+1;j<N;j++){
        const dx=nodes[j].x-nodes[i].x, dy=nodes[j].y-nodes[i].y;
        const d2=dx*dx+dy*dy, d=Math.sqrt(d2)||1;
        if(d>REPULSE_DIST*2) continue;
        const f=REPULSE_STR/(d2+1);
        const fx=f*dx/d, fy=f*dy/d;
        nodes[i].vx-=fx; nodes[i].vy-=fy;
        nodes[j].vx+=fx; nodes[j].vy+=fy;
      }
    }
    for(const [a,b,w] of edges){
      const ni=nodes[a], nj=nodes[b];
      const dx=nj.x-ni.x, dy=nj.y-ni.y;
      const d=Math.sqrt(dx*dx+dy*dy)||1;
      const restLen=ATTRACT_LEN/(1+Math.log1p(w));
      const f=(d-restLen)*ATTRACT_STR*(1+w*0.4);
      ni.vx+=f*dx/d; ni.vy+=f*dy/d;
      nj.vx-=f*dx/d; nj.vy-=f*dy/d;
    }
    for(const n of nodes){
      n.vx*=DAMPING; n.vy*=DAMPING;
      n.x+=n.vx*cooling; n.y+=n.vy*cooling;
    }
  }
}

// ── Pan state ─────────────────────────────────────────────────────────────
let panX=0, panY=0, isPanning=false, dragStartX=0, dragStartY=0, panStartX=0, panStartY=0;

function applyPan() {
  twCanvas.style.marginLeft = panX+'px';
  twCanvas.style.marginTop  = panY+'px';
}

function clampPan() {
  const vw=twViewport.clientWidth, vh=twViewport.clientHeight;
  const cw=parseInt(twCanvas.style.width)||0, ch=parseInt(twCanvas.style.height)||0;
  panX=Math.max(Math.min(0,vw-cw), Math.min(0, panX));
  panY=Math.max(Math.min(0,vh-ch), Math.min(0, panY));
}

twViewport.addEventListener('mousedown', e => {
  if(e.target.closest('.tw-card')) return;
  isPanning=true; dragStartX=e.clientX; dragStartY=e.clientY;
  panStartX=panX; panStartY=panY;
  twViewport.style.cursor='grabbing';
});
document.addEventListener('mousemove', e => {
  if(!isPanning) return;
  panX=panStartX+(e.clientX-dragStartX);
  panY=panStartY+(e.clientY-dragStartY);
  clampPan(); applyPan();
});
document.addEventListener('mouseup', () => { isPanning=false; twViewport.style.cursor=''; });

let touchStartX=0, touchStartY=0, touchPanX=0, touchPanY=0;
twViewport.addEventListener('touchstart', e => {
  if(e.touches.length!==1||e.target.closest('.tw-card')) return;
  touchStartX=e.touches[0].clientX; touchStartY=e.touches[0].clientY;
  touchPanX=panX; touchPanY=panY;
},{passive:true});
twViewport.addEventListener('touchmove', e => {
  if(e.touches.length!==1) return;
  panX=touchPanX+(e.touches[0].clientX-touchStartX);
  panY=touchPanY+(e.touches[0].clientY-touchStartY);
  clampPan(); applyPan();
},{passive:true});

// ── Clear ─────────────────────────────────────────────────────────────────
function clearWeb() {
  twCanvas.innerHTML='';
  twCanvas.style.width='';
  twCanvas.style.height='';
}

// ── Build web ─────────────────────────────────────────────────────────────
function buildWeb(results) {
  clearWeb();
  if(!results.length) return;

  const tagSets = buildDocTagSets(results);
  const edges = [];
  for(let i=0;i<results.length;i++){
    for(let j=i+1;j<results.length;j++){
      const shared=sharedTagCount(tagSets[i],tagSets[j]);
      if(shared>=EDGE_MIN_SHARED) edges.push([i,j,shared]);
    }
  }

  const nodes = results.map(r=>({doc:r.doc,score:r.score,x:0,y:0,vx:0,vy:0}));
  forceLayout(nodes, edges);

  let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
  for(const n of nodes){
    if(n.x<minX) minX=n.x; if(n.y<minY) minY=n.y;
    if(n.x>maxX) maxX=n.x; if(n.y>maxY) maxY=n.y;
  }
  const webW=maxX-minX+CARD_W+BOUNDS_PAD*2;
  const webH=maxY-minY+CARD_H+BOUNDS_PAD*2;
  const offX=-minX+BOUNDS_PAD, offY=-minY+BOUNDS_PAD;

  twCanvas.style.width  = webW+'px';
  twCanvas.style.height = webH+'px';

  // SVG edges
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('class','tw-edges');
  svg.setAttribute('width',webW); svg.setAttribute('height',webH);
  svg.style.cssText='position:absolute;top:0;left:0;pointer-events:none;';
  for(const [a,b,w] of edges){
    const na=nodes[a],nb=nodes[b];
    const x1=na.x+offX+CARD_W/2, y1=na.y+offY+CARD_H/2;
    const x2=nb.x+offX+CARD_W/2, y2=nb.y+offY+CARD_H/2;
    const line=document.createElementNS('http://www.w3.org/2000/svg','line');
    line.setAttribute('x1',x1); line.setAttribute('y1',y1);
    line.setAttribute('x2',x2); line.setAttribute('y2',y2);
    line.setAttribute('stroke','var(--tw-edge,var(--primary,#888))');
    line.setAttribute('stroke-opacity', Math.min(0.12+(w-EDGE_MIN_SHARED)*0.06,0.55));
    line.setAttribute('stroke-width',   Math.min(1+(w-EDGE_MIN_SHARED)*0.4,3.5));
    svg.appendChild(line);
  }
  twCanvas.appendChild(svg);

  // Cards
  for(const n of nodes){
    const el = renderArticleCard(n.doc);
    el.classList.add('tw-card');
    if((n.doc.tp||'').toLowerCase()==='theory') el.classList.add('tw-card-theory');
    el.style.position  = 'absolute';
    el.style.width     = CARD_W+'px';
    el.style.transform = `translate(${n.x+offX}px,${n.y+offY}px)`;
    twCanvas.appendChild(el);
  }

  // Centre view
  const vw=twViewport.clientWidth, vh=twViewport.clientHeight;
  panX=(vw-webW)/2; panY=(vh-webH)/2;
  applyPan();
}

await loadData();

return (tag) => addChip('tag', tag, false);

})();
}
