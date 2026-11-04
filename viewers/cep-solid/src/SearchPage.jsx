import { createResource, createSignal, createEffect, createMemo, untrack, onCleanup, Show, For } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { fetchMeta, fetchContent, fetchOld, fetchFolderIDFromTitle, getFolderPath, getCurrentView, convertStartDate, convertEndDate, loadKey, saveKey, highlightText } from './GlobalFunctions';
import { loadTypeToIDList, loadViewsMap, loadFolderIDToTitleMap, loadTitleToFolderIDMap, loadSortKeys, loadFolderIDToTags } from './GlobalJsonCache';
import { renderStandardCard, renderStandardCompact, renderStandardList } from './Renderers';

const SEARCH_DB_URL = '/viewers/cep-solid/compiled-json/search.sqlite';
const SEARCH_WORKER_URL = '/viewers/cep-solid/compiled-json/sqlite.worker.js';
const SEARCH_WASM_URL = '/viewers/cep-solid/compiled-json/sql-wasm.wasm';
const SEARCH_DB_CHUNK = 1024;
const MAX_TEXT_HITS = 3000;
const SNIPPET_WORDS = 24;
const MAX_SUGGESTIONS = 8;
const MAX_CARD_TAGS = 5;
const EXCERPT_LENGTH = 200;
const TITLE_FUZZY_MIN = 0.5;
export const PAGE_SIZE = 50;
const SORTS = [
  ['relevancy', 'Relevancy'],
  ['oldest', 'Oldest → Newest'],
  ['newest', 'Newest → Oldest'],
  ['newest-updated', 'Recently Updated'],
  ['oldest-updated', 'Least Recently Updated'],
  ['most-views', 'Most Views'],
  ['least-views', 'Least Views'],
];
const SORT_KEYS = SORTS.map(([key]) => key);
const DEFAULT_TYPE_COLOR = 'var(--primary)';
const COLOR_GROUPS = {
  '#4a7bd1': [
    'animatronic shows',
    'stage variations',
    'animatronics',
    'animatronic parts',
    'animatronic preservation',
    'retrofits',
  ],
  '#6354c7': [
    'showtapes',
    'live shows',
    'showbiz pizza programs',
    'showtape formats',
    'family vision',
  ],
  '#d25931': [
    'locations',
    'cancelled locations',
    'remodels and initiatives',
    'arcades and attractions',
    'store fixtures',
    'menu items',
    'tickets',
    'tokens',
    'walkarounds',
    'employee wear',
  ],
  '#0d9488': [
    'in-store merchandise',
    'movies',
    'video games',
    'products',
    'simulators',
  ],
  '#db7e2d': [
    'animatronic control systems',
    'programming systems',
    'other systems',
    'company media',
    'puppets',
    'documents',
  ],
  '#607f77ff': [
    'social media and websites',
    'ad vehicles',
    'events',
    'commercials',
  ],
  '#2e8857ff': [
    'companies/brands',
    'history',
    'characters',
    'news footage',
  ],
};

const TYPE_COLORS = Object.fromEntries(
  Object.entries(COLOR_GROUPS).flatMap(([color, types]) => types.map((t) => [t, color]))
);
const typeColor = (type) => TYPE_COLORS[(type || '').toLowerCase()] || DEFAULT_TYPE_COLOR;
const DATELESS = new Set(['photos', 'videos', 'reviews', 'user', 'steam comments', 'theories', 'meta', 'transcriptions']);

let TagMap = null;
let searchDataPromise = null;
let dbPromise = null;
const metaCache = new Map();

async function loadTags() {
  if (!TagMap) {
    const res = await fetch('/viewers/cep-solid/compiled-json/tags.json');
    TagMap = await res.json();
  }
  return TagMap;
}

const normalize = (s) => (s || '').toLowerCase().replace(/[‘’]/g, "'");
const titleCase = (s) => s.replace(/\b\w/g, (c) => c.toUpperCase());
const sqlString = (s) => `'${s.replace(/'/g, "''")}'`;

const DEBUG_SEARCH = true;
const debugLog = (...args) => DEBUG_SEARCH && console.log('[search-debug]', ...args);

async function debugSearchUrls(dbUrl, workerUrl, wasmUrl) {
  if (!DEBUG_SEARCH) return;
  debugLog('db url', dbUrl);
  debugLog('worker url', workerUrl.slice(0, 80));
  debugLog('wasm url', wasmUrl.slice(0, 80));
  try {
    const res = await fetch(dbUrl, { headers: { Range: 'bytes=0-99' } });
    debugLog('range request', {
      status: res.status,
      acceptRanges: res.headers.get('accept-ranges'),
      contentRange: res.headers.get('content-range'),
      contentEncoding: res.headers.get('content-encoding'),
      contentLength: res.headers.get('content-length'),
      contentType: res.headers.get('content-type'),
    });
  } catch (e) {
    debugLog('range request FAILED', e?.message || e);
  }
}

async function debugSearchDb(worker, match) {
  if (!DEBUG_SEARCH) return;
  const m = sqlString(match);
  const probes = [
    ['sqlite version', 'SELECT sqlite_version() AS v'],
    ['chunk row count', 'SELECT count(*) AS n FROM chunks'],
    ['match only', `SELECT folder FROM chunks WHERE chunks MATCH ${m} LIMIT 3`],
    ['match + rank', `SELECT folder, rank FROM chunks WHERE chunks MATCH ${m} ORDER BY rank LIMIT 3`],
    ['match + snippet', `SELECT folder, snippet(chunks, 0, char(1), char(2), '…', ${SNIPPET_WORDS}) AS found FROM chunks WHERE chunks MATCH ${m} LIMIT 3`],
  ];
  debugLog('fts match string:', match);
  for (const [name, sql] of probes) {
    try {
      debugLog(name, await worker.db.query(sql));
    } catch (e) {
      debugLog(name, 'FAILED', e?.message || e);
    }
  }
}

function queryWords(text) {
  return [...(text || '').matchAll(/"([^"]*)"|(\S+)/g)]
    .map((m) => normalize(m[1] ?? m[2]).trim())
    .filter(Boolean);
}

function ftsQuery(text, mode = 'phrase') {
  const clean = (s) => normalize(s).replace(/"/g, '').replace(/\s+/g, ' ').trim();
  if (mode === 'phrase') {
    if ((text || '').includes('"')) {
      return queryWords(text).map(clean).filter(Boolean).map((p) => `"${p}" *`).join(' ');
    }
    const phrase = clean(text);
    return phrase ? `"${phrase}" *` : '';
  }
  const words = queryWords(text).flatMap((w) => w.split(/\s+/)).map(clean).filter(Boolean);
  return words.map((w) => `"${w}" *`).join(mode === 'or' ? ' OR ' : ' ');
}

function trigramSet(s) {
  const padded = `  ${s}  `;
  const out = new Set();
  for (let i = 0; i < padded.length - 2; i++) out.add(padded.slice(i, i + 3));
  return out;
}

function dice(a, b) {
  const [small, big] = a.size <= b.size ? [a, b] : [b, a];
  let shared = 0;
  for (const t of small) if (big.has(t)) shared++;
  return (2 * shared) / (a.size + b.size);
}

function splitMarked(text) {
  return (text || '')
    .split(/(\u0001[^\u0002]*\u0002)/)
    .map((part) => (part.startsWith('\u0001') ? { text: part.slice(1, -1), hit: true } : { text: part, hit: false }))
    .filter((p) => p.text);
}

export function searchPath(tags = [], q = '') {
  const params = new URLSearchParams({ v: getCurrentView(), page: 'search' });
  if (tags.length) params.set('tags', tags.join('|'));
  if (q) params.set('q', q);
  return `/?${params.toString()}`;
}

function readSearchURL() {
  const params = new URLSearchParams(location.search);
  return {
    tags: (params.get('tags') || '').split('|').map((t) => t.trim()).filter(Boolean),
    q: (params.get('q') || '').trim(),
  };
}

export function loadSearchData() {
  if (!searchDataPromise) {
    searchDataPromise = Promise.all([
      loadTags(),
      loadFolderIDToTags(),
      loadTypeToIDList(),
      loadViewsMap(),
      loadFolderIDToTitleMap(),
      loadSortKeys(),
      loadTitleToFolderIDMap(),
    ]).then(([tagMap, idTags, typeMap, views, idTitle, sortKeys, titleToId]) => {
      const idType = {};
      for (const [type, ids] of Object.entries(typeMap)) for (const id of ids) idType[id] = type;
      const tagNames = Object.keys(tagMap);
      return {
        tagMap,
        idTags,
        typeMap,
        views,
        idTitle,
        sortKeys,
        idType,
        allIds: Object.keys(idType),
        types: Object.keys(typeMap).sort(),
        tagPairs: tagNames.map((t) => [t.toLowerCase(), t]),
        tagLookup: Object.fromEntries(tagNames.map((t) => [t.toLowerCase(), t])),
        titleLookup: Object.fromEntries(Object.entries(titleToId).map(([t, id]) => [t.toLowerCase(), id])),
        titleIndex: null,
      };
    });
  }
  return searchDataPromise;
}

function loadDb() {
  if (!dbPromise) {
    const dbUrl = new URL(SEARCH_DB_URL, location.origin).href;
    const workerUrl = new URL(SEARCH_WORKER_URL, location.origin).href;
    const wasmUrl = new URL(SEARCH_WASM_URL, location.origin).href;
    debugSearchUrls(dbUrl, workerUrl, wasmUrl);
    dbPromise = import('sql.js-httpvfs')
      .then(({ createDbWorker }) =>
        createDbWorker(
          [{ from: 'inline', config: { serverMode: 'full', requestChunkSize: SEARCH_DB_CHUNK, url: dbUrl } }],
          workerUrl,
          wasmUrl
        )
      )
      .then((worker) => {
        debugLog('search.sqlite worker', worker ? 'opened' : 'missing');
        return worker;
      })
      .catch((e) => {
        console.error('Search: failed to open search.sqlite', e);
        debugLog('open failed', e?.name, e?.message, e?.stack);
        dbPromise = null;
        return null;
      });
  }
  return dbPromise;
}

async function queryChunks(worker, match) {
  try {
    const rows = await worker.db.query(
      `SELECT folder, ts, snippet(chunks, 0, char(1), char(2), '…', ${SNIPPET_WORDS}) AS found FROM chunks WHERE chunks MATCH ${sqlString(match)} ORDER BY rank LIMIT ${MAX_TEXT_HITS}`
    );
    const seen = new Set();
    const hits = [];
    for (const row of rows) {
      if (seen.has(row.folder)) continue;
      seen.add(row.folder);
      hits.push({ id: row.folder, ts: row.ts, found: row.found });
    }
    debugLog('query returned', rows.length, 'rows,', hits.length, 'unique articles for', match);
    return hits;
  } catch (e) {
    console.error('Search: text query failed', e);
    return [];
  }
}

async function textSearch(text) {
  const words = queryWords(text);
  if (!words.length) return [];
  const worker = await loadDb();
  if (!worker) return [];
  await debugSearchDb(worker, ftsQuery(text));
  const phraseHits = await queryChunks(worker, ftsQuery(text));
  if (phraseHits.length || words.length < 2) return phraseHits;
  const andHits = await queryChunks(worker, ftsQuery(text, 'and'));
  if (andHits.length) return andHits;
  return queryChunks(worker, ftsQuery(text, 'or'));
}

function titleSearch(text, d) {
  const words = queryWords(text);
  if (!words.length) return [];
  if (!d.titleIndex) {
    d.titleIndex = Object.entries(d.idTitle).map(([id, title]) => {
      const norm = normalize(title);
      return [id, norm, trigramSet(norm)];
    });
  }
  const whole = words.join(' ');
  const wholeTrigrams = trigramSet(whole);
  const out = [];
  for (const [id, title, trigrams] of d.titleIndex) {
    let score = 0;
    if (words.every((w) => title.includes(w))) {
      score = 2 + (title === whole ? 1 : 0) + (title.startsWith(whole) ? 0.5 : 0);
    } else {
      const sim = dice(wholeTrigrams, trigrams);
      if (sim >= TITLE_FUZZY_MIN) score = sim;
    }
    if (score) out.push({ id, score });
  }
  return out;
}

async function runSearch({ tags, q }, d) {
  let ids = null;
  if (tags.length) {
    const union = new Set(tags.flatMap((t) => d.tagMap[d.tagLookup[t.toLowerCase()]] || []));
    ids = [...union];
  }

  const text = q.trim();
  if (!text) {
    return (ids ?? d.allIds)
      .map((id) => ({ id, score: d.views[id] || 0, found: null }))
      .sort((a, b) => b.score - a.score);
  }

  const [hits, titleHits] = await Promise.all([textSearch(text), titleSearch(text, d)]);
  debugLog('text hits', hits.length, 'title hits', titleHits.length);
  const allowed = ids ? new Set(ids) : null;
  const merged = new Map();

  hits.forEach((hit, i) => {
    if (allowed && !allowed.has(hit.id)) return;
    merged.set(hit.id, { id: hit.id, score: 1 - i / hits.length, found: { text: hit.found, ts: hit.ts } });
  });
  for (const { id, score } of titleHits) {
    if (allowed && !allowed.has(id)) continue;
    const current = merged.get(id);
    if (current) current.score += score;
    else merged.set(id, { id, score, found: null });
  }
  return [...merged.values()].sort((a, b) => b.score - a.score);
}

function getMeta(id) {
  if (!metaCache.has(id)) metaCache.set(id, fetchMeta(id).catch(() => ({ type: 'notfound', folderID: id })));
  return metaCache.get(id);
}

async function getExcerpt(id) {
  const [md, old] = await Promise.all([fetchContent(id).catch(() => ''), fetchOld(id).catch(() => '')]);
  const plain = (md || old || '')
    .replace(/\{\d+:\d\d(?::\d\d)?\}/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[\[\]#*_`>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!plain) return '';
  if (plain.length <= EXCERPT_LENGTH) return plain;
  return `${plain.slice(0, plain.slice(0, EXCERPT_LENGTH).lastIndexOf(' '))}…`;
}

function comparator(sort, d, pinned) {
  const rank = (e) => {
    const i = pinned.indexOf(e.id);
    return i < 0 ? pinned.length : i;
  };
  const views = (e) => d.views[e.id] || 0;
  const start = (e) => d.sortKeys[e.id]?.[0] || 0;
  const updated = (e) => d.sortKeys[e.id]?.[1] || 0;
  const byDate = (dir) => (a, b) => {
    const x = start(a);
    const y = start(b);
    if (x === y) return 0;
    if (!x) return 1;
    if (!y) return -1;
    return dir * (x - y);
  };
  switch (sort) {
    case 'oldest': return byDate(1);
    case 'newest': return byDate(-1);
    case 'newest-updated': return (a, b) => updated(b) - updated(a);
    case 'oldest-updated': return (a, b) => updated(a) - updated(b);
    case 'most-views': return (a, b) => views(b) - views(a);
    case 'least-views': return (a, b) => views(a) - views(b);
    default: return (a, b) => rank(a) - rank(b);
  }
}

function Highlight(props) {
  return (
    <>{highlightText(props.text, props.words)}</>
  );
}

function MarkedText(props) {
  return (
    <For each={splitMarked(props.text)}>
      {(part) => (part.hit ? <mark>{part.text}</mark> : part.text)}
    </For>
  );
}

function Thumb(props) {
  return (
    <img
      ref={(img) => {
        const low = `/content/${props.id}/lowphoto.avif`;
        const full = `/content/${props.id}/photo.avif`;
        img.onload = () => {
          const hi = new Image();
          hi.onload = () => (img.src = full);
          hi.src = full;
        };
        img.onerror = () => {
          img.onerror = () => (img.style.visibility = 'hidden');
          img.src = full;
        };
        img.src = low;
      }}
      alt=""
      loading="lazy"
    />
  );
}

export function TagList(props) {
  const [showAll, setShowAll] = createSignal(false);
  const shown = () => (showAll() ? props.tags : props.tags.slice(0, MAX_CARD_TAGS));
  const active = () => new Set((props.active || []).map((t) => t.toLowerCase()));

  return (
    <Show when={props.tags?.length}>
      <div class="ResultTags">
        <For each={shown()}>
          {(tag) => (
            <a
              class="ResultTag"
              classList={{ active: active().has(tag.toLowerCase()) }}
              href={searchPath([tag])}
            >
              {tag}
            </a>
          )}
        </For>
        <Show when={!showAll() && props.tags.length > MAX_CARD_TAGS}>
          <button type="button" class="ResultTag ResultTagMore" onClick={() => setShowAll(true)}>
            . . .
          </button>
        </Show>
      </div>
    </Show>
  );
}

export function ResultList(props) {
  const id = props.entry.id;
  const [meta] = createResource(() => getMeta(id));
  const [thumbID] = createResource(
    () => meta(),
    async (m) => (m.pageThumbnailFile ? await fetchFolderIDFromTitle(m.pageThumbnailFile) : id)
  );
  const type = () => (meta()?.type || props.data.idType[id] || '').toLowerCase();
  const isPhoto = () => type() === 'photos';
  const [excerpt] = createResource(() => (props.entry.found || isPhoto() ? false : id), getExcerpt);
  const [caption] = createResource(() => (isPhoto() ? id : false), (i) => fetchContent(i).catch(() => ''));

  const title = () => (isPhoto() && caption()?.trim()) || meta()?.title || props.data.idTitle[id] || id;
  const tags = () => props.data.idTags[id] || [];

  return (
    <div class="Result ResultList fade-in">
      <div class="ResultThumb">
        <a href={getFolderPath(id)}>
          <Show when={thumbID()}>
            <Thumb id={thumbID()} />
          </Show>
        </a>
      </div>
      <div class="ResultBody">
        <div class="ResultTitle">
          <a href={getFolderPath(id)}>
            <Highlight text={title()} words={props.words} />
          </a>
        </div>
        <div class="ResultDates">
          <Show when={meta()}>
            <strong>
              {DATELESS.has(type())
                ? convertStartDate(meta().startDate)
                : <>{convertStartDate(meta().startDate)} – {convertEndDate(meta().endDate)}</>}
            </strong>
            {" "}👁{props.data.views[id] || 0}
          </Show>
        </div>
        <TagList tags={tags()} active={props.tags} />
        <Show when={!isPhoto()}>
          <div class="ResultSummary">
            <Show
              when={props.entry.found}
              fallback={<Show when={!excerpt.loading}>{excerpt()}</Show>}
            >
              <Show when={props.entry.found.ts}>
                <span class="ResultTime">{props.entry.found.ts}</span>{" "}
              </Show>
              <MarkedText text={props.entry.found.text} />
            </Show>
          </div>
        </Show>
      </div>
    </div>
    
  );
}

function renderedItem(render) {
  return (props) => {
    const [meta] = createResource(() => getMeta(props.entry.id));
    const [out] = createResource(
      () => (meta()?.title ? meta() : false),
      (m) => render(m, props.words)
    );
    return <Show when={out()}>{out()}</Show>;
  };
}

const RESULT_VIEWS = {
  'Detailed List': { item: ResultList, wrapper: '' },
  Cards: { item: renderedItem(renderStandardCard), wrapper: 'ResultCards' },
  Compact: { item: renderedItem(renderStandardCompact), wrapper: 'ResultCompact' },
  List: { item: renderedItem(renderStandardList), wrapper: 'ResultPlain' },
};
const RESULT_VIEW_KEYS = Object.keys(RESULT_VIEWS);

function ResultItems(props) {
  const view = () => RESULT_VIEWS[props.shared.view];
  return (
    <div class={view().wrapper}>
      <For each={props.items}>
        {(entry) => (
          <Dynamic
            component={view().item}
            entry={entry}
            data={props.shared.data}
            words={props.shared.words}
            tags={props.shared.tags}
          />
        )}
      </For>
    </div>
  );
}

export function Pager(props) {
  const shown = () => {
    const out = [];
    let prev = -1;
    for (let i = 0; i < props.pages; i++) {
      if (i === 0 || i === props.pages - 1 || Math.abs(i - props.page) <= 2) {
        if (prev >= 0 && i - prev > 1) out.push(-1);
        out.push(i);
        prev = i;
      }
    }
    return out;
  };

  return (
    <Show when={props.pages > 1}>
      <div class="SearchPager">
        <Show when={props.page > 0}>
          <button type="button" class="PinButton" onClick={() => props.onPage(props.page - 1)}>
            Prev
          </button>
        </Show>
        <For each={shown()}>
          {(i) =>
            i < 0 ? (
              <span>…</span>
            ) : (
              <button
                type="button"
                class="PinButton"
                classList={{ active: i === props.page }}
                aria-pressed={i === props.page}
                onClick={() => props.onPage(i)}
              >
                {i + 1}
              </button>
            )
          }
        </For>
        <Show when={props.page < props.pages - 1}>
          <button type="button" class="PinButton" onClick={() => props.onPage(props.page + 1)}>
            Next
          </button>
        </Show>
      </div>
    </Show>
  );
}

function SearchBar(props) {
  const [chips, setChips] = createSignal(props.value.tags);
  const [text, setText] = createSignal(props.value.q);
  const [hi, setHi] = createSignal(-1);
  const [focused, setFocused] = createSignal(false);
  let input;

  createEffect(() => {
    const value = props.value;
    setChips(value.tags);
    setText(value.q);
  });

  const suggestions = createMemo(() => {
    const q = text().trim().toLowerCase();
    if (!q) return [];
    const taken = new Set(chips().map((t) => t.toLowerCase()));
    const scored = [];
    for (const [lower, name] of props.data.tagPairs) {
      if (!lower.includes(q) || taken.has(lower)) continue;
      scored.push({ name, rank: lower.startsWith(q) ? 0 : 1, count: props.data.tagMap[name].length });
    }
    scored.sort((a, b) => a.rank - b.rank || b.count - a.count || a.name.length - b.name.length);
    return scored.slice(0, MAX_SUGGESTIONS);
  });

  function addTag(name) {
    if (!chips().some((t) => t.toLowerCase() === name.toLowerCase())) setChips([...chips(), name]);
    setText('');
    setHi(-1);
    input?.focus();
  }

  function removeTag(name) {
    setChips(chips().filter((t) => t !== name));
    input?.focus();
  }

  function submit() {
    setHi(-1);
    props.onSubmit({ tags: chips(), q: text().trim() });
  }

  function onKeyDown(e) {
    const list = suggestions();
    if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey && list.length)) {
      if (!list.length) return;
      e.preventDefault();
      setHi((hi() + 1) % list.length);
    } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey && list.length)) {
      if (!list.length) return;
      e.preventDefault();
      setHi(hi() <= 0 ? list.length - 1 : hi() - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (hi() >= 0 && list[hi()]) addTag(list[hi()].name);
      else submit();
    } else if (e.key === 'Escape') {
      setHi(-1);
      setFocused(false);
    } else if (e.key === 'Backspace' && !text() && chips().length) {
      setChips(chips().slice(0, -1));
    }
  }

  return (
    <div class="SearchBar">
      <div class="SearchBarField" onClick={() => input?.focus()}>
        <For each={chips()}>
          {(tag) => (
            <span class="SearchChip">
              {tag}
              <button type="button" class="SearchChipRemove" aria-label={`Remove ${tag}`} onClick={() => removeTag(tag)}>
                ×
              </button>
            </span>
          )}
        </For>
        <input
          ref={input}
          class="SearchInput"
          type="text"
          autocomplete="off"
          placeholder={chips().length ? 'Add tags or search text…' : 'Search articles, or type to find a tag…'}
          value={text()}
          onInput={(e) => {
            setText(e.target.value);
            setHi(-1);
          }}
          onKeyDown={onKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <Show when={focused() && suggestions().length}>
          <ul class="SearchSuggestions">
            <For each={suggestions()}>
              {(s, i) => (
                <li
                  class="SearchSuggestion"
                  classList={{ active: hi() === i() }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    addTag(s.name);
                  }}
                >
                  {s.name} <span class="SearchCount">{s.count}</span>
                </li>
              )}
            </For>
          </ul>
        </Show>
      </div>
      <button type="button" class="SearchButton" onClick={submit}>
        Search
      </button>
    </div>
  );
}

export function renderSearchPage() {
  const [committed, setCommitted] = createSignal(readSearchURL());
  const [sort, setSort] = createSignal(loadKey('sSort', 'relevancy', (v) => SORT_KEYS.includes(v)));
  const [view, setView] = createSignal(loadKey('sResultView', RESULT_VIEW_KEYS[0], (v) => RESULT_VIEW_KEYS.includes(v)));
  const [activeType, setActiveType] = createSignal('');
  const [quietType, setQuietType] = createSignal(null);
  const [page, setPage] = createSignal(0);

  const [data] = createResource(loadSearchData);

  const [base] = createResource(
    () => (data() ? committed() : false),
    (c) => runSearch(c, data())
  );

  const pinned = createMemo(() =>
    data() ? committed().tags.map((t) => data().titleLookup[t.toLowerCase()]).filter(Boolean) : []
  );

  const cmp = createMemo(() => (data() ? comparator(sort(), data(), pinned()) : () => 0));

  const typeGroups = createMemo(() => {
    const byType = new Map();
    if (!data() || base.loading) return byType;
    for (const e of base() || []) {
      const t = data().idType[e.id] || 'other';
      if (!byType.has(t)) byType.set(t, []);
      byType.get(t).push(e);
    }
    return new Map([...byType].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0])));
  });

const allList = createMemo(() => [...typeGroups()].flatMap(([, list]) => list));

  const filters = createMemo(() => [
    { key: '', label: 'All', list: allList() },
    ...[...typeGroups()].map(([type, list]) => ({ key: type, label: titleCase(type), list })),
  ]);

  const currentType = () => (activeType() === '' || typeGroups().has(activeType()) ? activeType() : '');

  const sorted = createMemo(() => {
    const list = currentType() === '' ? allList() : typeGroups().get(currentType()) || [];
    return [...list].sort(cmp());
  });

  const previewTitles = (list) =>
    [...list].sort(cmp()).slice(0, 3).map((e) => data().idTitle[e.id] || e.id);

  const shared = createMemo(() => ({
    data: data(),
    words: queryWords(committed().q),
    tags: committed().tags,
    view: view(),
  }));

  createEffect(() => saveKey('sSort', sort()));
  createEffect(() => saveKey('sResultView', view()));

  const onPop = () => setCommitted(readSearchURL());
  window.addEventListener('popstate', onPop);
  onCleanup(() => window.removeEventListener('popstate', onPop));

  const total = () => sorted().length;
  const pages = () => Math.max(1, Math.ceil(total() / PAGE_SIZE));
  const pageItems = () => sorted().slice(page() * PAGE_SIZE, (page() + 1) * PAGE_SIZE);

  createEffect(() => {
    sorted();
    untrack(() => setPage(0));
  });

  function goToPage(i) {
    setPage(i);
    window.scrollTo({ top: 0 });
  }

  function commit(next) {
    history.pushState(null, '', searchPath(next.tags, next.q));
    setCommitted(next);
  }

  return (
    <div class="SearchPage">
      <Show when={data()} fallback={<div class="SearchStatus">Loading search…</div>}>
        <SearchBar data={data()} value={committed()} onSubmit={commit} />
        <div class="SearchLayout">
          <aside class="SearchSidebar">
            <div class="SearchFilterGroup">
              <label>
                Sort:{' '}
                <select id="sSort" onChange={(e) => setSort(e.target.value)}>
                  <For each={SORTS}>
                    {([key, label]) => (
                      <option value={key} selected={sort() === key}>
                        {label}
                      </option>
                    )}
                  </For>
                </select>
              </label>
              <label>
                Display:{' '}
                <select id="sResultView" onChange={(e) => setView(e.target.value)}>
                  <For each={RESULT_VIEW_KEYS}>
                    {(key) => (
                      <option value={key} selected={view() === key}>
                        {key}
                      </option>
                    )}
                  </For>
                </select>
              </label>
            </div>

            <div class="SearchFilterGroup SearchTypeGroup">
              <For each={filters()}>
                {(f) => (
                  <div
                    class="SearchTypeFilter"
                    classList={{ quiet: quietType() === f.key }}
                    onMouseLeave={() => setQuietType(null)}
                  >
                    <button
                      type="button"
                      class="SearchTypeButton"
                      classList={{ active: currentType() === f.key }}
                      style={{ '--chip': typeColor(f.key) }}
                      aria-pressed={currentType() === f.key}
                      onClick={() => {
                        setActiveType(f.key);
                        setQuietType(f.key);
                        document.activeElement?.blur();
                      }}
                    >
                      {f.label} ({f.list.length})
                    </button>
                    <Show when={f.key !== '' && f.list.length}>
                      <ul class="SearchTypePreview">
                        <For each={previewTitles(f.list)}>{(t) => <li>{t}</li>}</For>
                        <Show when={f.list.length > 3}>
                          <li>…</li>
                        </Show>
                      </ul>
                    </Show>
                  </div>
                )}
              </For>
            </div>
          </aside>

          <main class="SearchResults">
            <div class="SearchStatus">
              <Show when={!base.loading} fallback="Searching…">
                {`${total()} result${total() === 1 ? '' : 's'}`}
              </Show>
            </div>
            <Show when={!base.loading}>
              <Show when={page() > 0}>
                <Pager page={page()} pages={pages()} onPage={goToPage} />
              </Show>
              <ResultItems items={pageItems()} shared={shared()} />
              <Pager page={page()} pages={pages()} onPage={goToPage} />
              <Show when={total() === 0}>
                <div class="NoContent fade-in">Nothing found.</div>
              </Show>
            </Show>
          </main>
        </div>
      </Show>
    </div>
  );
}
