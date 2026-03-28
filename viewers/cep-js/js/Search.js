import {
  esc, norm, permalink, fmtDate, fmtDateRange, getYear,
  renderArticleCard, renderArticleCompact, renderArticleList,
  renderPhotoCard, renderPhotoCompact, renderPhotoList,
  renderVideoCard, renderVideoCompact, renderVideoList,
  renderReviewCard, renderReviewCompact, renderReviewList,
} from '/viewers/cep-js/js/CardRenderer.js';
import { renderQuickTags } from '/viewers/cep-js/js/QuickTags.js';
import { timeAgo } from '/viewers/cep-js/js/TimeRecency.js';

export function initSearch(app) {
return (async () => {

const BASE = '/viewers/cep-js/compiled-json/search';

const TABS = [
  { id:'articles', label:'Articles', types:null },
  { id:'photos',   label:'Photos',   types:['Photos'] },
  { id:'videos',   label:'Videos',   types:['Videos'] },
  { id:'reviews',  label:'Reviews',  types:['Reviews'] },
];

const QUICK_TAGS_LIST = [
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

let DOCS=[], TAGS={}, ALL_TAG_KEYS=[], VIEWS={};
const TRI_CACHE={};
let chips=[], suggestIdx=-1, searchTimer=null;

// ── Precomputed lookup structures (populated after loadData) ───────────────────
let TAG_LOOKUP        = new Map(); // lowercase tag → canonical tag key
let DOCS_BY_NORM_TITLE= new Map(); // norm(title) → doc
let TAG_YEAR_RANGE    = new Map(); // canonical tag → year range string e.g. "1992–2020"
let TYPE_TO_TAB       = new Map(); // lowercase doc type → tab id

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

// ── Initial state ─────────────────────────────────────────────────────────────
sQtags.style.display       = 'none';
sResultsWrap.style.display = 'none';

// ── Layout ────────────────────────────────────────────────────────────────────
function updateLayout() {
  const hasQuery = chips.length > 0;
  sResultsWrap.style.display = hasQuery ? 'block' : 'none';
  sQtags.style.display = (!hasQuery || sKeepTags.checked) ? 'block' : 'none';
}

// ── Tabs ──────────────────────────────────────────────────────────────────────
// Cache per-tab DOM references to avoid repeated querySelector calls in hot paths
const TAB_ELS = {}; // tabId → { list, more, btn }

TABS.forEach(t => {
  const btn = document.createElement('button');
  btn.className = 's-tab-btn' + (t.id==='articles' ? ' active' : '');
  btn.dataset.tab = t.id;
  btn.textContent = t.label;
  btn.onclick = () => activateTab(t.id);
  sTabBtns.appendChild(btn);

  const panel = document.createElement('div');
  panel.className = 's-tab-panel' + (t.id==='articles' ? ' active' : '');
  panel.id = 'panel-' + t.id;
  panel.innerHTML = `<div class="s-results" id="list-${t.id}"></div><div class="s-show-more" id="more-${t.id}"><a href="#">Show more</a></div>`;
  sTabPanels.appendChild(panel);
  panel.querySelector('.s-show-more a').onclick = e => {
    e.preventDefault();
    const tiers = ['20','50','100','all'];
    sPerPage.value = tiers[Math.min(tiers.indexOf(sPerPage.value)+1, tiers.length-1)];
    executeSearch();
  };

  // Cache references now that the panel is in the DOM
  TAB_ELS[t.id] = {
    list: panel.querySelector('#list-' + t.id),
    more: panel.querySelector('#more-' + t.id),
    btn,
  };
});

function activateTab(id) {
  sTabBtns.querySelectorAll('.s-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab===id));
  sTabPanels.querySelectorAll('.s-tab-panel').forEach(p => p.classList.toggle('active', p.id==='panel-'+id));
}

// ── Quick tags ────────────────────────────────────────────────────────────────
renderQuickTags(sQtagsList, QUICK_TAGS_LIST, tag => addChip('tag', tag, false));

// Show quick tags on first focus of the search input
sInput.addEventListener('focus', () => {
  if(!chips.length) sQtags.style.display = 'block';
}, { once: true });

// ── Search utils ──────────────────────────────────────────────────────────────
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

// ── Data loading ──────────────────────────────────────────────────────────────
async function loadData() {
  const [dr,tr,vr] = await Promise.all([
    fetch(`${BASE}/docs.json`),
    fetch(`${BASE}/tags.json`),
    fetch('/viewers/cep-js/compiled-json/views.json'),
  ]);
  DOCS  = await dr.json();
  TAGS  = await tr.json();
  VIEWS = vr.ok ? await vr.json() : {};
  ALL_TAG_KEYS = Object.keys(TAGS).sort((a,b) => a.localeCompare(b, undefined, {sensitivity:'base'}));

  // ── Build lookup structures ──────────────────────────────────────────────────

  // O(1) canonical tag resolution — replaces linear .find() in addChip & keydown
  TAG_LOOKUP = new Map(ALL_TAG_KEYS.map(k => [k.toLowerCase(), k]));

  // O(1) doc lookup by normalised title — replaces linear DOCS.find() in showSuggestions
  DOCS_BY_NORM_TITLE = new Map();
  for(const doc of DOCS) {
    if(doc) {
      const key = norm(doc.t || '');
      if(key && !DOCS_BY_NORM_TITLE.has(key)) DOCS_BY_NORM_TITLE.set(key, doc);
    }
  }

  // Precompute year ranges per tag — eliminates per-keystroke doc scanning in showSuggestions
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

  // O(1) doc-type → tab routing — replaces per-result TABS.find()+.map() in executeSearch
  TYPE_TO_TAB = new Map();
  for(const t of TABS) {
    if(t.types) for(const tp of t.types) TYPE_TO_TAB.set(tp.toLowerCase(), t.id);
  }

  // Update quick-tag counts
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

// ── Chips ─────────────────────────────────────────────────────────────────────
function addChip(type, value, neg=false) {
  if(!value) return;
  // O(1) canonical tag lookup instead of linear .find()
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

// ── Suggestions ───────────────────────────────────────────────────────────────
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
    // Precomputed — no per-keystroke doc scanning
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

// ── Input events ──────────────────────────────────────────────────────────────
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
        // O(1) lookup instead of linear .find()
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
  }
});
document.addEventListener('click', e => {
  if(!sSuggest.contains(e.target) && e.target!==sInput) hideSuggestions();
});

// ── Settings ──────────────────────────────────────────────────────────────────
sKeepTags.addEventListener('change', () => {
  localStorage.setItem('sKeepTags', sKeepTags.checked?'1':'0');
  updateLayout();
});
sDisplay.addEventListener('change', () => {
  localStorage.setItem('sDisplay', sDisplay.value);
  if(chips.length) executeSearch();
});
sPerPage.addEventListener('change', () => { if(chips.length) executeSearch(); });
sSort.addEventListener('change',    () => { if(chips.length) executeSearch(); });

// ── Search execution ──────────────────────────────────────────────────────────
function scheduleSearch() { clearTimeout(searchTimer); searchTimer=setTimeout(executeSearch, 150); }

async function executeSearch() {
  if(!DOCS.length) return;

  const tagChips  = chips.filter(c => c.type==='tag');
  const fuzzyChips= chips.filter(c => c.type==='fuzzy');
  const fuzzyQ    = fuzzyChips.map(c => c.value).join(' ');

  if(!tagChips.length && !fuzzyQ) {
    TABS.forEach(t => {
      const { list, more } = TAB_ELS[t.id];
      list.innerHTML=''; more.style.display='none';
    });
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
          // Iterate the smaller set to minimise intersection work
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
    const normFuzzyQ=norm(fuzzyQ); // hoist: computed once instead of per-doc
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

  const sort=sSort.value;
  if(sort !== 'relevancy') {
    results.sort((a,b) => {
      if(sort==='most-views'||sort==='least-views') {
        const av=VIEWS[a.doc.p]||0, bv=VIEWS[b.doc.p]||0;
        return sort==='most-views' ? bv-av : av-bv;
      }
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

  // O(1) bucketing via precomputed type map — no per-result TABS.find()+.map()
  const buckets={}; TABS.forEach(t=>buckets[t.id]=[]);
  for(const r of results) {
    const tabId = TYPE_TO_TAB.get((r.doc.tp||'').toLowerCase()) || 'articles';
    buckets[tabId].push(r);
  }

  const limit  =sPerPage.value==='all'?Infinity:parseInt(sPerPage.value)||10;
  const display=sDisplay.value;
  const byYear =sort==='oldest'||sort==='newest';

  TABS.forEach(t => {
    const { list, more, btn } = TAB_ELS[t.id]; // cached — no querySelector
    const arr=buckets[t.id];
    if(btn) btn.textContent=`${t.label} (${arr.length})`;
    list.innerHTML='';
    if(!arr.length) { list.innerHTML='<div class="s-no-results">No results</div>'; more.style.display='none'; return; }
    let shown;
    if(limit===Infinity){
      shown=arr;
    } else if(byYear){
      // Always complete the last year group so it isn't cut off mid-group
      const base=arr.slice(0,limit);
      if(base.length<arr.length){
        const lastYear=getYear(base[base.length-1].doc.d);
        let end=limit;
        while(end<arr.length&&getYear(arr[end].doc.d)===lastYear) end++;
        shown=arr.slice(0,end);
      } else {
        shown=base;
      }
    } else {
      shown=arr.slice(0,limit);
    }
    renderTabResults(list, t.id, shown, display, byYear, sort);
    more.style.display=(limit!==Infinity&&arr.length>shown.length)?'block':'none';
  });

  updateLayout();
}

function renderTabResults(list, tabId, shown, display, byYear, sort='') {
  const R={
    articles:{card:renderArticleCard, compact:renderArticleCompact, list:renderArticleList},
    photos:  {card:renderPhotoCard,   compact:renderPhotoCompact,   list:renderPhotoList  },
    videos:  {card:renderVideoCard,   compact:renderVideoCompact,   list:renderVideoList  },
    reviews: {card:renderReviewCard,  compact:renderReviewCompact,  list:renderReviewList },
  };
  const fn=(R[tabId]||R.articles)[display]||R.articles.card;
  const isUpdateSort=sort==='newest-updated'||sort==='oldest-updated';
  const isPhotos=tabId==='photos', isReviews=tabId==='reviews';
  // When sorting by update time, replace view-count text with timeAgo in .s-item-meta / .CardText
  const render=(doc)=>{
    const el=fn(doc);
    if(isUpdateSort&&doc.mt){
      const target=el.querySelector('.s-item-meta')||el.querySelector('.CardText');
      if(target){
        // Replace last text node (the view count injected by injectViewCount) with timeAgo
        const nodes=[...target.childNodes];
        const lastText=nodes.filter(n=>n.nodeType===Node.TEXT_NODE).pop();
        const timeStr='Updated '+timeAgo(doc.mt)+' - ';
        if(lastText) lastText.textContent=timeStr;
        else target.appendChild(document.createTextNode(timeStr));
      }
    }
    return el;
  };
  const wrapItems=(items,cls)=>{
    const w=document.createElement('div'); w.className=cls;
    items.forEach(r=>w.appendChild(render(r.doc)));
    return w;
  };
  if(byYear) {
    const groups={}, order=[];
    shown.forEach(r=>{ const y=getYear(r.doc.d); if(!groups[y]){groups[y]=[];order.push(y);} groups[y].push(r); });
    order.forEach(year=>{
      const group=document.createElement('div'); group.className='s-year-group';
      const hdr=document.createElement('div'); hdr.className='s-year-header'; hdr.textContent=year;
      group.appendChild(hdr);
      if(display==='card'&&isPhotos)       group.appendChild(wrapItems(groups[year],'PhotoGrid'));
      else if(display==='card'&&!isReviews) group.appendChild(wrapItems(groups[year],'Carousel'));
      else groups[year].forEach(r=>group.appendChild(render(r.doc)));
      list.appendChild(group);
    });
  } else {
    if(display==='card'&&isPhotos)        list.appendChild(wrapItems(shown,'PhotoGrid'));
    else if(display==='card'&&!isReviews) list.appendChild(wrapItems(shown,'CardWrap'));
    else shown.forEach(r=>list.appendChild(render(r.doc)));
  }
}

await loadData();

return (tag) => addChip('tag', tag, false);

})();
}