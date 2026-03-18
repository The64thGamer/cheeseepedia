import { initLinkPreviews } from './LinkPreview.js';
import { ProgressiveImage } from './ProgressiveImage.js';
import { buildCitations } from './Citations.js';

let TITLE_INDEX = null;
async function getTitleIndex() {
  if (!TITLE_INDEX) {
    TITLE_INDEX = await fetch('/viewers/cep-js/compiled-json/ArticleLinker.json')
      .then(r => r.ok ? r.json() : {}).catch(() => ({}));
  }
  return TITLE_INDEX;
}

async function renderMarkdown(md) {
  if (!md) return '';
  const idx = await getTitleIndex();

  const blocks = [];

  let html = md
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/^#{6}\s+(.+)$/gm, '<h6>$1</h6>')
    .replace(/^#{5}\s+(.+)$/gm, '<h5>$1</h5>')
    .replace(/^#{4}\s+(.+)$/gm, '<h4>$1</h4>')
    .replace(/^#{3}\s+(.+)$/gm, '<h3>$1</h3>')
    .replace(/^#{2}\s+(.+)$/gm, '<h2>$1</h2>')
    .replace(/^#{1}\s+(.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/___(.+?)___/g, '<strong><em>$1</em></strong>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^&gt;\s+(.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^(-{3,}|\*{3,})$/gm, '<hr>')
    .replace(/^[\*\-]\s+(.+)$/gm, '<li>$1</li>')
    .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\[(\d+)\]/g, (_, n) => `<sup>(${n})</sup>`)
    .replace(/\[([^\]]+)\]/g, (_, title) => {
      const id = idx[title];
      return id
        ? `<a href="/?=${encodeURIComponent(id)}">${title}</a>`
        : `<span class="BadLink">${title}</span>`;
    })
    // Tables — processed after all inline rules so cell content already has links/citations
    .replace(/^(\|.+\|\n)([\|\- :]+\|\n)((?:\|.+\|\n?)*)/gm, (_, header, sep, body) => {
      const parseRow = (row, tag) =>
        '<tr>' + row.trim().replace(/^\||\|$/g,'').split('|')
          .map(c => `<${tag}>${c.trim()}</${tag}>`).join('') + '</tr>';
      const heads = parseRow(header, 'th');
      const rows  = body.trim().split('\n').filter(Boolean).map(r => parseRow(r, 'td')).join('');
      const ph = `\x00TABLE${blocks.length}\x00`;
      blocks.push(`<table><thead>${heads}</thead><tbody>${rows}</tbody></table>`);
      return ph;
    })
    .split('\n\n')
    .map(block => {
      const t = block.trim();
      if (!t) return '';
      if (/^\x00TABLE/.test(t)) return t;
      if (/^<(h[1-6]|ul|ol|li|blockquote|hr|img|pre|code|sup|span|a)/.test(t)) return t;
      return `<p>${t.replace(/\n/g, ' ')}</p>`;
    })
    .join('\n');

  blocks.forEach((b, i) => { html = html.replaceAll(`\x00TABLE${i}\x00`, b); });
  return html;
}

const MNAMES = ['', 'Jan. ', 'Feb. ', 'Mar. ', 'Apr. ', 'May ', 'Jun. ', 'Jul. ', 'Aug. ', 'Sep. ', 'Oct. ', 'Nov. ', 'Dec.'];

function fmtDate(d) {
  if (!d || d === '0000-00-00' || !d.trim()) return '???';
  const [y, m, day] = d.split('-'), yi = parseInt(y, 10), mi = parseInt(m, 10), di = parseInt(day, 10);
  if (!yi || yi === 0) return '???';
  const mn = mi ? MNAMES[mi] : '', dn = di ? String(di) : '', dp = mn + dn;
  return (dp ? dp + (dp.endsWith(' ') ? '' : ' ') : '') + yi;
}

function fmtDateRange(start, end) {
  const s = fmtDate(start);
  if (end === undefined || end === null || end === '') return s + ' - Present';
  if (!end || end === '0000-00-00') return s + ' - ???';
  return s + ' - ' + fmtDate(end);
}

function esc(s) { return s ? String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') : ''; }

function buildInfobox(meta) {
  if (!meta) return '';
  const rows = [];
  const row = (label, val) => { if (val) rows.push(`<tr><th>${esc(label)}</th><td>${val}</td></tr>`); };
  const rowList = (label, arr) => { if (arr && arr.length) row(label, arr.map(v => esc(String(v).split('|')[0].trim())).join('<br>')); };

  row('Type', esc(meta.type || ''));
  row('Date', meta.endDate !== undefined
    ? fmtDateRange(meta.startDate, meta.endDate)
    : meta.startDate ? fmtDate(meta.startDate) : '');
  rowList('Tags', meta.tags);
  rowList('Contributors', meta.contributors);
  rowList('Stages', meta.stages);
  rowList('Remodels', meta.remodels);
  rowList('Animatronics', meta.animatronics);
  rowList('Franchisees', meta.franchisees);
  rowList('Attractions', meta.attractions);
  rowList('Credits', meta.credits);

  return rows.length ? `<table class="InfoboxTable"><tbody>${rows.join('')}</tbody></table>` : '';
}

export async function loadArticle(app, articleId) {
  const body = app.querySelector('#ArticleBody');
  const infobox = app.querySelector('#Infobox');
  if (!body || !infobox) return;

  body.innerHTML = '<p class="ArticleLoading">Loading…</p>';

  let metaRes, mdRes;
  try {
    [metaRes, mdRes] = await Promise.all([
      fetch(`/content/${articleId}/meta.json`),
      fetch(`/content/${articleId}/content.md`),
    ]);
  } catch (e) {
    body.innerHTML = '<p class="ArticleError">Failed to load article.</p>';
    return;
  }

  const meta = metaRes.ok ? await metaRes.json() : {};
  const md = mdRes && mdRes.ok ? await mdRes.text() : '';

  if (meta.title) document.title = meta.title;

  // Resolve thumbnail folder via ArticleLinker
  const linker = await fetch('/viewers/cep-js/compiled-json/ArticleLinker.json')
    .then(r => r.ok ? r.json() : {}).catch(() => ({}));
  const thumbTitle = meta.pageThumbnailFile || '';
  const isPhoto = (meta.type || '').toLowerCase() === 'photos';
  const thumbFolder = isPhoto ? articleId : (thumbTitle ? linker[thumbTitle] : null);

  // Build infobox
  infobox.innerHTML = '';
  if (thumbFolder) {
    const imgWrap = document.createElement('div');
    imgWrap.className = 'InfoboxThumb';
    imgWrap.appendChild(ProgressiveImage(thumbFolder, meta.title || ''));
    infobox.appendChild(imgWrap);
  }
  infobox.insertAdjacentHTML('beforeend', buildInfobox(meta));

  // Article body with title header
  const bodyHTML = await renderMarkdown(md) || '<p class="ArticleEmpty">No content.</p>';
  body.innerHTML = '';
  const titleEl = app.querySelector('#ArticleTitle');
  if (titleEl) titleEl.textContent = meta.title || '';
  body.insertAdjacentHTML('beforeend', bodyHTML);
  initLinkPreviews(body);
  await buildCitations(body, meta.citations || []);
}