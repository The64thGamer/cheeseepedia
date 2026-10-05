import { createSignal, createEffect, createResource, on, onMount, onCleanup, For, Show } from 'solid-js';
import { renderStandardCard, renderStandardCompact, renderStandardList } from './Renderers';
import { fetchMeta } from './GlobalFunctions';
const BASE = '/viewers/cep-js/compiled-json/search';

const TABS = [
  { id: 'articles', label: 'Articles', types: null },
  { id: 'photos',   label: 'Photos',   types: ['Photos'] },
  { id: 'videos',   label: 'Videos',   types: ['Videos'] },
  { id: 'reviews',  label: 'Reviews',  types: ['Reviews'] },
];

const QUICK_TAGS_LIST = [
  "Pizza Time Theatre", "ShowBiz Pizza Place", "Chuck E. Cheese's",
  "2026", "1977", "Locations", "Showtapes", "Animatronic Shows", "Stage Variations",
  "Animatronics", "Animatronic Parts", "Animatronic Preservation", "Costumed Characters",
  "Retrofits", "History", "Cancelled Locations", "Remodels and Initiatives",
  "Arcades and Attractions", "Store Fixtures", "Companies/Brands", "Characters",
  "Events", "Animatronic Control Systems", "Other Systems", "Simulators",
  "Programming Systems", "Commercials", "News Footage", "Company Media", "Movies",
  "Puppets", "Live Shows", "ShowBiz Pizza Programs", "Showtape Formats", "Family Vision",
  "Corporate Documents", "Documents", "Promotional Material", "Social Media and Websites",
  "Ad Vehicles", "In-Store Merchandise", "Products", "Menu Items", "Tickets", "Tokens",
  "Employee Wear", "Video Games", "Sally Corporation", "Jim Henson's Creature Shop",
  "Walt Disney Imagineering", "Five Nights at Freddy's", "Transcriptions",
  "Unknown Year", "User", "Meta",
];

const STANDARD = {
  card:    renderStandardCard,
  compact: renderStandardCompact,
  list:    renderStandardList,
};
const EMOJI_BASE = '/viewers/cep-js/assets/Emoji/';

export const TAG_COLORS = {
    "Pizza Time Theatre": "#b7471bff", "ShowBiz Pizza Place": "#b7471bff", "Chuck E. Cheese's": "#b7471bff",
    "Locations": "#c26827ff", "Showtapes": "#7b4fd6", "Animatronic Shows": "#4a7bd1",
    "Animatronics": "#4a7bd1", "Animatronic Parts": "#4a7bd1", "Animatronic Preservation": "#4a7bd1",
    "Stage Variations": "#4a7bd1", "Costumed Characters": "#4a7bd1", "Characters": "#2e8857ff",
    "Retrofits": "#4a7bd1", "Remodels and Initiatives": "#c26827ff", "History": "#c26827ff",
    "Cancelled Locations": "#c26827ff", "Arcades and Attractions": "#c26827ff", "Store Fixtures": "#c26827ff",
    "Companies/Brands": "#2e8857ff", "Events": "#2e8857ff", "Animatronic Control Systems": "#99852aff",
    "Other Systems": "#99852aff", "Simulators": "#99852aff", "Programming Systems": "#99852aff",
    "Commercials": "#d14a4a", "News Footage": "#d14a4a", "Company Media": "#d14a4a", "Movies": "#d14a4a",
    "Puppets": "#7b4fd6", "Live Shows": "#7b4fd6", "ShowBiz Pizza Programs": "#7b4fd6",
    "Showtape Formats": "#7b4fd6", "Family Vision": "#7b4fd6", "Corporate Documents": "#607f77ff",
    "Documents": "#607f77ff", "Promotional Material": "#607f77ff", "Social Media and Websites": "#607f77ff",
    "Ad Vehicles": "#607f77ff", "In-Store Merchandise": "#0d9488", "Products": "#0d9488",
    "Menu Items": "#0d9488", "Tickets": "#0d9488", "Tokens": "#0d9488", "Employee Wear": "#0d9488",
    "Video Games": "#0d9488", "Sally Corporation": "#b7471bff", "Jim Henson's Creature Shop": "#b7471bff",
    "Walt Disney Imagineering": "#b7471bff", "Five Nights at Freddy's": "#b7471bff",
    "Transcriptions": "#5a5a5a", "Unknown Year": "#5a5a5a", "2026": "#5a5a5a", "1977": "#5a5a5a",
    "User": "#5a5a5a", "Meta": "#5a5a5a",
};

export const TAG_ICONS = {
    "Animatronics": "spiky_speech_bubble.svg",
    "Animatronic Shows": "bang.svg",
    "Animatronic Parts": "factory.svg",
    "Animatronic Preservation": "wrench.svg",
    "Stage Variations": "speaker.svg",
    "Costumed Characters": "back_of_hand_hoof_d1.svg",
    "Characters": "thumbs_up_paw.svg",
    "Locations": "world_map.svg",
    "Cancelled Locations": "bomb.svg",
    "Showtapes": "music_notes.svg",
    "Showtape Formats": "vhs.svg",
    "ShowBiz Pizza Programs": "cassette.svg",
    "Family Vision": "projector.svg",
    "Live Shows": "music_note.svg",
    "Puppets": "back_of_hand_paw_k2.svg",
    "Commercials": "movie_camera.svg",
    "News Footage": "tv.svg",
    "Company Media": "dvd.svg",
    "Movies": "cinema.svg",
    "Transcriptions": "pencil.svg",
    "Video Games": "gamepad.svg",
    "Menu Items": "pizza.svg",
    "Tickets": "cross.svg",
    "Tokens": "cross.svg",
    "Documents": "page.svg",
    "Corporate Documents": "page_with_pencil.svg",
    "Promotional Material": "curled_page.svg",
    "Events": "tada.svg",
    "Remodels and Initiatives": "construction_sign.svg",
    "Retrofits": "pirate_flag.svg",
    "2026": "calendar.svg",
    "1977": "calendar.svg",
    "Unknown Year": "calendar.svg",
    "Pizza Time Theatre": "pizza.svg",
    "ShowBiz Pizza Place": "bang.svg",
    "Chuck E. Cheese's": "birthday_cake.svg",
    "History": "spider_web.svg",
    "Arcades and Attractions": "arcade_stick.svg",
    "Companies/Brands": "bomb.svg",
    "Animatronic Control Systems": "level_slider.svg",
    "Other Systems": "fax_machine.svg",
    "Programming Systems": "keyboard.svg",
    "Simulators": "purple_sunset.svg",
    "Social Media and Websites": "globe.svg",
    "Ad Vehicles": "bus.svg",
    "In-Store Merchandise": "lp.svg",
    "Products": "dollar.svg",
    "Employee Wear": "free.svg",
    "Sally Corporation": "briefcase.svg",
    "Jim Henson's Creature Shop": "cinema.svg",
    "Walt Disney Imagineering": "decreasing_graph.svg",
    "Five Nights at Freddy's": "crt_noise.svg",
    "User": "furry_pride.svg",
    "Meta": "red_question_mark.svg",
    "Store Fixtures": "package.svg",

};

let DOCS = [], TAGS = {}, ALL_TAG_KEYS = [], VIEWS = {};
let TAG_LOOKUP = new Map();
let DOCS_BY_NORM_TITLE = new Map();
let TAG_YEAR_RANGE = new Map();
let TYPE_TO_TAB = new Map();
const TRI_CACHE = {};
let dataPromise = null;

function tris(s) {
  s = '  ' + norm(s) + '  ';
  const out = new Set();
  for (let i = 0; i + 3 <= s.length; i++) {
    const t = s.slice(i, i + 3);
    if (t.trim()) out.add(t);
  }
  return out;
}

const norm = s => s ? String(s).toLowerCase().replace(/[^\w\s]/g,' ').replace(/\s+/g,' ').trim() : '';

function AsyncNode(props) {
  const [node] = createResource(async () => {
    try { return await props.build(); }
    catch (err) { console.error('[Search] failed to build result:', err); return null; }
  });
  return <Show when={node()}>{node()}</Show>;
}

export function timeAgo(unixSeconds) {
  if(!unixSeconds) return '';
  const now   = Date.now() / 1000;
  const diff  = Math.floor(now - unixSeconds);
  if(diff < 0)        return 'just now';
  if(diff < 60)       return 'just now';
  if(diff < 3600)     { const m=Math.floor(diff/60);   return `${m} minute${m!==1?'s':''} ago`; }
  if(diff < 86400)    { const h=Math.floor(diff/3600);  return `${h} hour${h!==1?'s':''} ago`; }
  if(diff < 7*86400)  { const d=Math.floor(diff/86400); return `${d} day${d!==1?'s':''} ago`; }
  if(diff < 30*86400) { const w=Math.floor(diff/604800);return `${w} week${w!==1?'s':''} ago`; }
  if(diff < 365*86400){ const mo=Math.floor(diff/2592000);return `${mo} month${mo!==1?'s':''} ago`; }
  const d = new Date(unixSeconds * 1000);
  return d.toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'});
}

function getYear(d) { const p=parseDateParts(d); return (p&&p.y)?p.y:'Unknown'; }

export function buildTagBtn(tag, onClick, count) {
    const btn = document.createElement('button');
    btn.className = 's-qtag-btn';
    btn.dataset.tag = tag;
    btn.onclick = () => onClick(tag);

    const color = TAG_COLORS[tag];
    if (color) btn.style.setProperty('--tag-color', color);

    const icon = TAG_ICONS[tag];
    if (icon) {
        const img = document.createElement('img');
        img.src = EMOJI_BASE + icon;
        img.className = 's-qtag-icon';
        img.alt = '';
        img.setAttribute('aria-hidden', 'true');
        btn.appendChild(img);
    }

    const label = document.createElement('span');
    label.textContent = tag;
    btn.appendChild(label);

    if (count != null) {
        const countEl = document.createElement('span');
        countEl.className = 's-qtag-count';
        countEl.textContent = `(${count})`;
        btn.appendChild(countEl);
    }

    return btn;
}

export function renderQuickTags(container, tags, onClick, counts = {}) {
    const list = Array.isArray(tags) ? tags : [tags];
    list.forEach(tag => {
        container.appendChild(buildTagBtn(tag, onClick, counts[tag] ?? null));
    });
}

function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let n = 0;
  for (const x of a) if (b.has(x)) n++;
  return n / (a.size + b.size - n);
}

function loadData() {
  return (dataPromise ??= (async () => {
    const [dr, tr, vr] = await Promise.all([
      fetch(`${BASE}/docs.json`),
      fetch(`${BASE}/tags.json`),
      fetch('/viewers/cep-js/compiled-json/views.json'),
    ]);
    DOCS  = await dr.json();
    TAGS  = await tr.json();
    VIEWS = vr.ok ? await vr.json() : {};
    ALL_TAG_KEYS = Object.keys(TAGS).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

    TAG_LOOKUP = new Map(ALL_TAG_KEYS.map(k => [k.toLowerCase(), k]));

    DOCS_BY_NORM_TITLE = new Map();
    for (const doc of DOCS) {
      if (doc) {
        const key = norm(doc.t || '');
        if (key && !DOCS_BY_NORM_TITLE.has(key)) DOCS_BY_NORM_TITLE.set(key, doc);
      }
    }

    TAG_YEAR_RANGE = new Map();
    for (const tag of ALL_TAG_KEYS) {
      const matchDoc = DOCS_BY_NORM_TITLE.get(norm(tag));
      let yearRange = '';
      if (matchDoc) {
        const startYear = matchDoc.d  && !matchDoc.d.startsWith('0000')  ? matchDoc.d.slice(0, 4)  : null;
        const endYear   = matchDoc.de && !matchDoc.de.startsWith('0000') ? matchDoc.de.slice(0, 4) : null;
        if (startYear && endYear && endYear !== startYear) yearRange = `${startYear}–${endYear}`;
        else if (startYear && !matchDoc.de) yearRange = matchDoc.d ? `${startYear}–Present` : '';
        else if (startYear) yearRange = startYear;
        else if (endYear)   yearRange = endYear;
      } else {
        let minYear = null, maxYear = null;
        for (const id of (TAGS[tag] || [])) {
          const doc = DOCS[id];
          if (!doc || !doc.d || doc.d.startsWith('0000')) continue;
          const y = doc.d.slice(0, 4);
          if (!minYear || y < minYear) minYear = y;
          if (!maxYear || y > maxYear) maxYear = y;
        }
        if (minYear && maxYear && maxYear !== minYear) yearRange = `${minYear}–${maxYear}`;
        else if (minYear) yearRange = minYear;
      }
      if (yearRange) TAG_YEAR_RANGE.set(tag, yearRange);
    }

    TYPE_TO_TAB = new Map();
    for (const t of TABS) {
      if (t.types) for (const tp of t.types) TYPE_TO_TAB.set(tp.toLowerCase(), t.id);
    }

    window.DOCS = DOCS;
    window.TAGS = TAGS;
  })());
}

async function loadTriShard(ch) {
  if (TRI_CACHE[ch] !== undefined) return TRI_CACHE[ch];
  try {
    const r = await fetch(`${BASE}/tri_${ch}.json`);
    TRI_CACHE[ch] = r.ok ? await r.json() : {};
  } catch {
    TRI_CACHE[ch] = {};
  }
  return TRI_CACHE[ch];
}

/* ------------------------------------------------------------------ */
/* Public hook so other scripts (e.g. Article) can add a tag chip      */
/* ------------------------------------------------------------------ */

let _addChip = null;
let _ready = Promise.resolve();

/** Equivalent of the function initSearch() used to return. */
export async function addSearchTag(tag) {
  await _ready;
  if (_addChip) _addChip('tag', tag, false);
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

const docToMeta = (doc) => ({
  title: doc.t,
  type: doc.tp,
  startDate: doc.d,
  endDate: doc.de,
});

function applyUpdated(el, doc, sortMode) {
  if ((sortMode !== 'newest-updated' && sortMode !== 'oldest-updated') || !doc.mt) return;
  const target = el.querySelector('.s-item-meta') || el.querySelector('.CardText');
  if (!target) return;
  const lastText = [...target.childNodes].filter(n => n.nodeType === Node.TEXT_NODE).pop();
  const timeStr = 'Updated ' + timeAgo(doc.mt) + ' - ';
  if (lastText) lastText.textContent = timeStr;
  else target.appendChild(document.createTextNode(timeStr));
}

async function buildCard(doc, sortMode) {
  const meta = (await fetchMeta(doc.p).catch(() => null)) || docToMeta(doc);
  const el = await renderStandardCard(meta);
  applyUpdated(el, doc, sortMode);
  return el;
}

function AsyncCard(props) {
  const [card] = createResource(() => buildCard(props.doc, props.sort));
  return <Show when={card()}>{card()}</Show>;
}

export function Search() {
  const [chips, setChips]             = createSignal([]);
  const [query, setQuery]             = createSignal('');
  const [suggestions, setSuggestions] = createSignal([]);
  const [suggestIdx, setSuggestIdx]   = createSignal(-1);
  const [activeTab, setActiveTab]     = createSignal('articles');
  const [results, setResults]         = createSignal(null);
  const [touched, setTouched]         = createSignal(false);

  const [perPage, setPerPage] = createSignal('20');
  const [sort, setSort]       = createSignal('relevancy');
  const [display, setDisplay] = createSignal(localStorage.getItem('sDisplay') || 'card');
  const [keepTags, setKeepTags] = createSignal(localStorage.getItem('sKeepTags') === '1');

  let inputRef, suggestRef, qtagsListRef;
  let searchTimer = null;
  let searchToken = 0;

  let resolveReady;
  _ready = new Promise(r => (resolveReady = r));

  const hasQuery = () => chips().length > 0;
  const showResults = () => hasQuery();
  const showQtags = () => touched() && (!hasQuery() || keepTags());

  /* ---------- chips ---------- */

  function hideSuggestions() {
    setSuggestions([]);
    setSuggestIdx(-1);
  }

  function addChip(type, value, neg = false) {
    if (!value) return;
    if (type === 'tag') value = TAG_LOOKUP.get(value.toLowerCase()) || value;
    const vl = value.toLowerCase();
    const current = chips();
    if (current.some(c => c.type === type && c.value.toLowerCase() === vl && c.neg === neg)) return;
    const next = current.filter(c => !(c.type === type && c.value.toLowerCase() === vl && c.neg !== neg));
    next.push({ type, value, neg });
    setChips(next);
    setTouched(true);
    setQuery('');
    hideSuggestions();
  }
  _addChip = addChip;

  function removeChip(i) {
    setChips(chips().filter((_, idx) => idx !== i));
    setTouched(true);
  }

  /* ---------- suggestions ---------- */

  function showSuggestions(q) {
    if (!q) { hideSuggestions(); return; }
    const neg = q.startsWith('-');
    const qn = norm(neg ? q.slice(1) : q);
    if (!qn) { hideSuggestions(); return; }
    const matches = ALL_TAG_KEYS
      .filter(t => norm(t).includes(qn))
      .map(t => ({ t, count: (TAGS[t] || []).length, neg }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12);
    if (!matches.length) { hideSuggestions(); return; }
    setSuggestions(matches);
    setSuggestIdx(-1);
  }

  function scrollToActive(i) {
    suggestRef?.children[i]?.scrollIntoView({ block: 'nearest' });
  }

  function onKeyDown(e) {
    const items = suggestions();
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      const active = items[suggestIdx()];
      if (active) {
        addChip('tag', active.t, active.neg);
      } else {
        const v = query().trim();
        if (v) {
          const neg = v.startsWith('-');
          const term = neg ? v.slice(1) : v;
          const matched = TAG_LOOKUP.get(term.toLowerCase());
          addChip(matched ? 'tag' : 'fuzzy', matched || term, neg);
        }
      }
    } else if (e.key === 'ArrowDown' && items.length) {
      e.preventDefault();
      const i = Math.min(suggestIdx() + 1, items.length - 1);
      setSuggestIdx(i);
      scrollToActive(i);
    } else if (e.key === 'ArrowUp' && items.length) {
      e.preventDefault();
      const i = Math.max(suggestIdx() - 1, 0);
      setSuggestIdx(i);
      scrollToActive(i);
    } else if (e.key === 'Escape') {
      hideSuggestions();
    }
  }

  /* ---------- search ---------- */

  async function executeSearch() {
    if (!DOCS.length) return;
    const token = ++searchToken;

    const tagChips   = chips().filter(c => c.type === 'tag');
    const fuzzyChips = chips().filter(c => c.type === 'fuzzy');
    const fuzzyQ     = fuzzyChips.map(c => c.value).join(' ');

    if (!tagChips.length && !fuzzyQ) {
      setResults(null);
      return;
    }

    let found;
    if (!fuzzyQ) {
      let ids = null;
      for (const c of tagChips) {
        const tagIds = new Set((TAGS[c.value] || []).map(Number));
        if (c.neg) {
          if (!ids) ids = new Set(DOCS.map((_, i) => i));
          for (const id of tagIds) ids.delete(id);
        } else if (!ids) {
          ids = new Set(tagIds);
        } else {
          const [small, large] = ids.size < tagIds.size ? [ids, tagIds] : [tagIds, ids];
          const next = new Set();
          for (const id of small) if (large.has(id)) next.add(id);
          ids = next;
        }
      }
      found = [...(ids || [])].map(id => ({ score: 0, doc: DOCS[id] })).filter(r => r.doc);
      const pt = tagChips.find(c => !c.neg);
      if (pt) {
        const qt = tris(pt.value);
        found.forEach(r => (r.score = jaccard(tris(r.doc.t || ''), qt)));
        found.sort((a, b) => b.score - a.score);
      }
    } else {
      const qTris = tris(fuzzyQ);
      const normFuzzyQ = norm(fuzzyQ);
      const shardKeys = new Set([...qTris].map(t => (t[0].match(/[a-z]/) ? t[0] : '_')));
      const shards = await Promise.all([...shardKeys].map(loadTriShard));
      if (token !== searchToken) return; // a newer search started while shards loaded
      const merged = Object.assign({}, ...shards), hits = {};
      for (const tri of qTris) {
        const bucket = merged[tri];
        if (!bucket) continue;
        for (const id in bucket) hits[id] = (hits[id] || 0) + bucket[id];
      }
      const tf = tagChips.map(c => ({ neg: c.neg, ids: new Set(TAGS[c.value] || []) }));
      found = Object.entries(hits).map(([id, h]) => {
        const doc = DOCS[+id]; if (!doc) return null;
        for (const f of tf) {
          if (f.neg && f.ids.has(+id)) return null;
          if (!f.neg && !f.ids.has(+id)) return null;
        }
        return { score: h / qTris.size + (norm(doc.t || '').includes(normFuzzyQ) ? 0.3 : 0), doc };
      }).filter(Boolean).sort((a, b) => b.score - a.score);
    }

    const sortMode = sort();
    if (sortMode !== 'relevancy') {
      found.sort((a, b) => {
        if (sortMode === 'most-views' || sortMode === 'least-views') {
          const av = VIEWS[a.doc.p] || 0, bv = VIEWS[b.doc.p] || 0;
          return sortMode === 'most-views' ? bv - av : av - bv;
        }
        if (sortMode === 'newest-updated' || sortMode === 'oldest-updated') {
          const am = a.doc.mt || 0, bm = b.doc.mt || 0;
          return sortMode === 'newest-updated' ? bm - am : am - bm;
        }
        const ad = a.doc.d || '', bd = b.doc.d || '';
        const aUnk = !ad || ad === '0000-00-00' || ad.startsWith('0000');
        const bUnk = !bd || bd === '0000-00-00' || bd.startsWith('0000');
        if (aUnk && bUnk) return 0;
        if (aUnk) return 1;
        if (bUnk) return -1;
        return sortMode === 'oldest' ? ad.localeCompare(bd) : bd.localeCompare(ad);
      });
    }

    const buckets = {};
    TABS.forEach(t => (buckets[t.id] = []));
    for (const r of found) {
      const tabId = TYPE_TO_TAB.get((r.doc.tp || '').toLowerCase()) || 'articles';
      buckets[tabId].push(r);
    }

    const limit  = perPage() === 'all' ? Infinity : parseInt(perPage()) || 10;
    const byYear = sortMode === 'oldest' || sortMode === 'newest';

    const tabs = {};
    for (const t of TABS) {
      const arr = buckets[t.id];
      let shown;
      if (limit === Infinity) {
        shown = arr;
      } else if (byYear) {
        // Always complete the last year group so it isn't cut off mid-group
        const base = arr.slice(0, limit);
        if (base.length < arr.length) {
          const lastYear = getYear(base[base.length - 1].doc.d);
          let end = limit;
          while (end < arr.length && getYear(arr[end].doc.d) === lastYear) end++;
          shown = arr.slice(0, end);
        } else {
          shown = base;
        }
      } else {
        shown = arr.slice(0, limit);
      }
      tabs[t.id] = {
        total: arr.length,
        shown,
        more: limit !== Infinity && arr.length > shown.length,
      };
    }

    if (token !== searchToken) return;
    setResults({ tabs, byYear, sort: sortMode, display: display() });
  }

  function scheduleSearch() {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(executeSearch, 150);
  }

function renderItem(doc, tabId, disp, sortMode) {
  const fn = STANDARD[disp] || STANDARD.card;
  return (
    <AsyncNode build={async () => {
      const meta = (await fetchMeta(doc.p).catch(() => null)) || docToMeta(doc);
      const el = await fn(meta);
      applyUpdated(el, doc, sortMode);
      return el;
    }} />
  );
}

  function tabView(tabId) {
    const s = results();
    if (!s) return null;
    const { total, shown } = s.tabs[tabId];
    if (!total) return <div class="s-no-results">No results</div>;

    const isPhotos = tabId === 'photos', isReviews = tabId === 'reviews';
    const isCard = s.display === 'card';
    const items = (list) => list.map(r => renderItem(r.doc, tabId, s.display, s.sort));

    if (s.byYear) {
      const groups = {}, order = [];
      shown.forEach(r => {
        const y = getYear(r.doc.d);
        if (!groups[y]) { groups[y] = []; order.push(y); }
        groups[y].push(r);
      });
      return order.map(year => (
        <div class="s-year-group">
          <div class="s-year-header">{year}</div>
          {isCard && isPhotos
            ? <div class="PhotoGrid">{items(groups[year])}</div>
            : isCard && !isReviews
              ? <div class="Carousel">{items(groups[year])}</div>
              : items(groups[year])}
        </div>
      ));
    }

    if (isCard && isPhotos)   return <div class="PhotoGrid">{items(shown)}</div>;
    if (isCard && !isReviews) return <div class="CardWrap">{items(shown)}</div>;
    return items(shown);
  }

  function showMore(e) {
    e.preventDefault();
    const tiers = ['20', '50', '100', 'all'];
    setPerPage(tiers[Math.min(tiers.indexOf(perPage()) + 1, tiers.length - 1)]);
  }

  /* ---------- effects ---------- */

  // Chip changes are debounced; control changes re-run immediately.
  createEffect(on(chips, () => scheduleSearch(), { defer: true }));
  createEffect(on([sort, perPage, display], () => { if (chips().length) executeSearch(); }, { defer: true }));

  onMount(async () => {
    renderQuickTags(qtagsListRef, QUICK_TAGS_LIST, tag => addChip('tag', tag, false));

    await loadData();

    qtagsListRef.querySelectorAll('.s-qtag-btn').forEach(btn => {
      const count = (TAGS[btn.dataset.tag] || []).length;
      if (count) {
        let el = btn.querySelector('.s-qtag-count');
        if (!el) { el = document.createElement('span'); el.className = 's-qtag-count'; btn.appendChild(el); }
        el.textContent = `(${count})`;
      }
    });

    resolveReady();
    if (chips().length) executeSearch();
  });

  const onDocClick = (e) => {
    if (!suggestRef?.contains(e.target) && e.target !== inputRef) hideSuggestions();
  };
  document.addEventListener('click', onDocClick);
  onCleanup(() => {
    document.removeEventListener('click', onDocClick);
    clearTimeout(searchTimer);
    if (_addChip === addChip) _addChip = null;
  });

  /* ---------- markup (same classes/ids as Search.html) ---------- */

  return (
    <div class="s-wrap">

      {/* Search input */}
      <div class="s-suggest-wrap">
        <div
          class="s-input-row"
          id="sInputRow"
          onClick={(e) => { if (!e.target.closest('.s-chip-x')) inputRef.focus(); }}
        >
          <span class="s-chips" id="sChips">
            <For each={chips()}>
              {(c, i) => (
                <span class={'s-chip ' + (c.type === 'fuzzy' ? 's-chip-fuzzy' : c.neg ? 's-chip-neg' : 's-chip-tag')}>
                  <button
                    class="s-chip-x"
                    onClick={(e) => { e.stopPropagation(); removeChip(i()); }}
                  >&#x2715;</button>
                  {(c.neg ? '-' : '') + (c.type === 'fuzzy' ? '"' + c.value + '"' : c.value)}
                </span>
              )}
            </For>
          </span>
          <input
            ref={inputRef}
            class="s-input"
            id="sInput"
            placeholder="Search..."
            autocomplete="off"
            value={query()}
            onInput={(e) => { setQuery(e.currentTarget.value); showSuggestions(e.currentTarget.value); }}
            onKeyDown={onKeyDown}
            onFocus={() => setTouched(true)}
          />
        </div>
        <div
          ref={suggestRef}
          class="s-suggest"
          id="sSuggest"
          style={{ display: suggestions().length ? 'block' : 'none' }}
        >
          <For each={suggestions()}>
            {(m, i) => (
              <div
                class="s-suggest-item"
                classList={{ active: suggestIdx() === i() }}
                onMouseDown={(ev) => { ev.preventDefault(); addChip('tag', m.t, m.neg); }}
                onMouseOver={() => setSuggestIdx(i())}
              >
                <span>{(m.neg ? '-' : '') + m.t}</span>
                <span class="s-suggest-count">
                  <Show when={TAG_YEAR_RANGE.get(m.t)}>
                    <span class="s-suggest-years">{TAG_YEAR_RANGE.get(m.t)}</span>
                  </Show>
                  {m.count}
                </span>
              </div>
            )}
          </For>
        </div>
      </div>

      {/* Quick tags */}
      <div class="s-qtags" id="sQtags" style={{ display: showQtags() ? 'block' : 'none' }}>
        <h4>Quick Tags</h4>
        <div class="s-qtags-scroll" id="sQtagsList" ref={qtagsListRef}></div>
      </div>

      {/* Controls + tabs (hidden until search) */}
      <div id="sResultsWrap" style={{ display: showResults() ? 'block' : 'none' }}>
        <div class="s-controls">
          <label>Show:{' '}
            <select id="sPerPage" value={perPage()} onChange={(e) => setPerPage(e.currentTarget.value)}>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="500">500</option>
              <option value="all">All</option>
            </select>
          </label>
          <label>Sort:{' '}
            <select id="sSort" value={sort()} onChange={(e) => setSort(e.currentTarget.value)}>
              <option value="relevancy">Relevancy</option>
              <option value="oldest">Oldest → Newest</option>
              <option value="newest">Newest → Oldest</option>
              <option value="newest-updated">Recently Updated</option>
              <option value="oldest-updated">Least Recently Updated</option>
              <option value="most-views">Most Views</option>
              <option value="least-views">Least Views</option>
            </select>
          </label>
          <label>Display:{' '}
            <select
              id="sDisplay"
              value={display()}
              onChange={(e) => { setDisplay(e.currentTarget.value); localStorage.setItem('sDisplay', e.currentTarget.value); }}
            >
              <option value="card">Card</option>
              <option value="compact">Compact</option>
              <option value="list">List</option>
            </select>
          </label>
          <label class="s-toggle">
            <input
              type="checkbox"
              id="sKeepTags"
              checked={keepTags()}
              onChange={(e) => {
                setKeepTags(e.currentTarget.checked);
                localStorage.setItem('sKeepTags', e.currentTarget.checked ? '1' : '0');
                setTouched(true);
              }}
            /> Quick Tags
          </label>
        </div>

        <div class="s-tab-btns" id="sTabBtns">
          <For each={TABS}>
            {(t) => (
              <button
                class="s-tab-btn"
                classList={{ active: activeTab() === t.id }}
                data-tab={t.id}
                onClick={() => setActiveTab(t.id)}
              >
                {results() ? `${t.label} (${results().tabs[t.id].total})` : t.label}
              </button>
            )}
          </For>
        </div>

        <div id="sTabPanels">
          <For each={TABS}>
            {(t) => (
              <div class="s-tab-panel" classList={{ active: activeTab() === t.id }} id={'panel-' + t.id}>
                <div class="s-results" id={'list-' + t.id}>{tabView(t.id)}</div>
                <div
                  class="s-show-more"
                  id={'more-' + t.id}
                  style={{ display: results()?.tabs[t.id].more ? 'block' : 'none' }}
                >
                  <a href="#" onClick={showMore}>Show more</a>
                </div>
              </div>
            )}
          </For>
        </div>
      </div>

    </div>
  );
}

export default Search;
