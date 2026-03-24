/**
 * HomeNews.js
 * Replaces loadNewsCards with a tabbed news section:
 *   News | Recent Changes | Recent Photos | Recent Videos
 * Changes/Photos/Videos are grouped by relative time from ExtraStatistics.json.
 */
import {
  renderArticleCompact, renderPhotoCompact, renderVideoCompact, videoThumbSrc, permalink, esc, fmtDate
} from '/viewers/cep-js/js/CardRenderer.js';

const STATS_URL = '/viewers/cep-js/compiled-json/ExtraStatistics.json';
const DISCOURSE_URL = '/viewers/cep-js/compiled-json/DiscourseNews.json';
const CARD_URL = '/viewers/cep-js/Card.html';

// Same timeAgo logic — bucket label for grouping
function timeAgoLabel(isoString) {
  const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if(diff < 60)        return 'just now';
  if(diff < 3600)      { const m=Math.floor(diff/60);    return `${m} minute${m!==1?'s':''} ago`; }
  if(diff < 86400)     { const h=Math.floor(diff/3600);  return `${h} hour${h!==1?'s':''} ago`; }
  if(diff < 7*86400)   { const d=Math.floor(diff/86400); return `${d} day${d!==1?'s':''} ago`; }
  if(diff < 30*86400)  { const w=Math.floor(diff/604800);return `${w} week${w!==1?'s':''} ago`; }
  if(diff < 365*86400) { const mo=Math.floor(diff/2592000);return `${mo} month${mo!==1?'s':''} ago`; }
  return new Date(isoString).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
}

// Sort key so groups render in time order (smallest diff first)
function timeDiff(isoString) {
  return Date.now() - new Date(isoString).getTime();
}

/**
 * Render a list of {p, t, m} items grouped by relative time bucket.
 * renderFn(doc) → HTMLElement  (from CardRenderer)
 */
function renderGrouped(items, renderFn, wrapClass='NewsGroupList', docMap=null) {
  const wrap = document.createElement('div');
  wrap.className = 'NewsGroupedWrap';

  // Group by label
  const groups = new Map();
  items.forEach(item => {
    const label = timeAgoLabel(item.m);
    if(!groups.has(label)) groups.set(label, []);
    groups.get(label).push(item);
  });

  // Sort groups newest first
  const sorted = [...groups.entries()].sort((a, b) =>
    timeDiff(a[1][0].m) - timeDiff(b[1][0].m)
  );

  sorted.forEach(([label, groupItems]) => {
    const section = document.createElement('div');
    section.className = 'NewsGroup';

    const heading = document.createElement('div');
    heading.className = 'NewsGroupHeading';
    heading.textContent = label;
    section.appendChild(heading);

    const list = document.createElement('div');
    list.className = wrapClass;
    groupItems.forEach(item => {
      list.appendChild(renderFn(item));
    });
    section.appendChild(list);
    wrap.appendChild(section);
  });

  return wrap;
}

export async function loadNewsCards(app) {
  const container = app.querySelector('#NewsCards');
  if(!container) return;
  container.innerHTML = '';

  // Fetch all data in parallel
  const [statsRes, discourseRes, cardTemplateRes, docsRes] = await Promise.all([
    fetch(STATS_URL),
    fetch(DISCOURSE_URL),
    fetch(CARD_URL),
    fetch('/viewers/cep-js/compiled-json/search/docs.json'),
  ]);
  const stats    = statsRes.ok        ? await statsRes.json()        : {};
  const topics   = discourseRes.ok    ? await discourseRes.json()    : [];
  const cardHtml = cardTemplateRes.ok ? await cardTemplateRes.text() : '';
  const allDocs  = docsRes.ok         ? await docsRes.json()         : [];
  // Build lookup map by page id for fast enrichment
  const docMap = Object.fromEntries(allDocs.map(d => [d.p, d]));

  // Enrich a stats item {p,t,m} with full doc fields for card renderers
  const enrich = item => {
    const doc = docMap[item.p] || {};
    return { t: item.t, p: item.p, d: doc.d||'', de: doc.de||'', e: doc.e||'', tp: doc.tp||'', img: doc.img||'' };
  };

  const recentArticles = stats.recent_articles || [];
  const recentPhotos   = stats.recent_photos   || [];
  const recentVideos   = stats.recent_videos   || [];

  // ── Tab setup ──────────────────────────────────────────────────────────────
  const tabBar = document.createElement('div');
  tabBar.className = 'ArticleHeaderBtns NewsTabBar';
  container.appendChild(tabBar);

  const tabContent = document.createElement('div');
  tabContent.className = 'NewsTabContent';
  container.appendChild(tabContent);

  let activeBtn = null;
  const setActive = btn => {
    if(activeBtn) activeBtn.classList.remove('PinButtonActive');
    activeBtn = btn;
    btn.classList.add('PinButtonActive');
  };

  const makeTab = (label, renderContent) => {
    const btn = document.createElement('button');
    btn.className = 'PinButton';
    btn.textContent = label;
    btn.addEventListener('click', () => {
      setActive(btn);
      tabContent.innerHTML = '';
      tabContent.appendChild(renderContent());
    });
    tabBar.appendChild(btn);
    return btn;
  };

  // ── News tab (Discourse) ───────────────────────────────────────────────────
  const newsBtn = makeTab('News', () => {
    const wrap = document.createElement('div');
    wrap.className = 'Carousel';
    topics.forEach(t => {
      const date = new Date(t.created_at).toLocaleDateString('en-US',{
        month:'short', day:'numeric', year:'numeric'
      }).replace(',','.');
      const el = document.createElement('div');
      el.innerHTML = cardHtml;
      const card = el.firstElementChild;
      card.querySelector('.CardImage').innerHTML =
        `<a href="${t.url}"><img src="${t.image_url}" alt="${t.title}"></a>`;
      card.querySelector('.CardLink').innerHTML =
        `<a href="${t.url}"><span>${t.title}</span></a>`;
      card.querySelector('.CardText').innerHTML =
        `<strong>${date}</strong> · ${t.views} views`;
      wrap.appendChild(card);
    });
    return wrap;
  });

  // ── Recent Changes tab ─────────────────────────────────────────────────────
  makeTab(`Recent Changes`, () =>
    renderGrouped(recentArticles, item => renderArticleCompact(enrich(item)), 'NewsGroupList')
  );

  // ── Recent Photos tab ──────────────────────────────────────────────────────
  makeTab(`Recent Photos`, () =>
    renderGrouped(recentPhotos, item => renderPhotoCompact(enrich(item)), 'PhotoGrid')
  );

  // ── Recent Videos tab ──────────────────────────────────────────────────────
  makeTab(`Recent Videos`, () =>
    renderGrouped(recentVideos, item => renderVideoCompact(enrich(item)), 'NewsGroupList')
  );

  // Default to News tab
  setActive(newsBtn);
  newsBtn.click();
}