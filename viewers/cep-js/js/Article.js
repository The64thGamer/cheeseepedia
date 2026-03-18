import { initLinkPreviews } from './LinkPreview.js';
import { ProgressiveImage } from './ProgressiveImage.js';
import { buildCitations } from './Citations.js';
import { renderUsers } from './UserTag.js';

// ── Shared caches ─────────────────────────────────────────────────────────────
let LINKER = null, CONTRIBUTORS = null;
const getLinker = async () => LINKER ||= await fetch('/viewers/cep-js/compiled-json/ArticleLinker.json').then(r => r.ok ? r.json() : {}).catch(() => ({}));
const getContribs = async () => CONTRIBUTORS ||= await fetch('/viewers/cep-js/compiled-json/contributors.json').then(r => r.json()).catch(() => []);

// ── Date utils ────────────────────────────────────────────────────────────────
const MNAMES = ['', 'Jan. ', 'Feb. ', 'Mar. ', 'Apr. ', 'May ', 'Jun. ', 'Jul. ', 'Aug. ', 'Sep. ', 'Oct. ', 'Nov. ', 'Dec.'];
function fmtDate(d) {
  if (!d || d === '0000-00-00' || !d.trim()) return '???';
  const [y, m, day] = d.split('-'), yi = parseInt(y, 10), mi = parseInt(m, 10), di = parseInt(day, 10);
  if (!yi) return '???';
  const mn = mi ? MNAMES[mi] : '', dn = di ? String(di) : '', dp = mn + dn;
  return (dp ? dp + (dp.endsWith(' ') ? '' : ' ') : '') + yi;
}
function fmtDateRange(s, e) {
  const start = fmtDate(s);
  if (e === undefined || e === null || e === '') return start + ' - Present';
  if (!e || e === '0000-00-00') return start + ' - ???';
  return start + ' - ' + fmtDate(e);
}
const esc = s => s ? String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') : '';

// ── Markdown ──────────────────────────────────────────────────────────────────
async function renderMarkdown(md) {
  if (!md) return '';
  const idx = await getLinker();
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
      return id ? `<a href="/?v=cep-js&=${encodeURIComponent(id)}">${title}</a>` : `<span class="BadLink">${title}</span>`;
    })
    .replace(/^(\|.+\|\n)([\|\- :]+\|\n)((?:\|.+\|\n?)*)/gm, (_, header, sep, body) => {
      const parseRow = (row, tag) => '<tr>' + row.trim().replace(/^\||\|$/g, '').split('|').map(c => `<${tag}>${c.trim()}</${tag}>`).join('') + '</tr>';
      const ph = `\x00TABLE${blocks.length}\x00`;
      blocks.push(`<table><thead>${parseRow(header, 'th')}</thead><tbody>${body.trim().split('\n').filter(Boolean).map(r => parseRow(r, 'td')).join('')}</tbody></table>`);
      return ph;
    })
    .split('\n\n').map(block => {
      const t = block.trim();
      if (!t) return '';
      if (/^\x00TABLE/.test(t) || /^<(h[1-6]|ul|ol|li|blockquote|hr|img|pre|code|sup|span|a)/.test(t)) return t;
      return `<p>${t.replace(/\n/g, ' ')}</p>`;
    }).join('\n');

  blocks.forEach((b, i) => { html = html.replaceAll(`\x00TABLE${i}\x00`, b); });
  return html;
}

// ── Infobox ───────────────────────────────────────────────────────────────────
function buildInfobox(meta) {
  if (!meta) return '';
  const rows = [];
  const row = (label, val) => { if (val) rows.push(`<tr><th>${esc(label)}</th><td>${val}</td></tr>`); };
  const rowList = (label, arr) => { if (arr?.length) row(label, arr.map(v => esc(String(v.n || v).split('|')[0].trim())).join('<br>')); };

  row('Type', esc(meta.type || ''));
  row('Date', meta.endDate !== undefined ? fmtDateRange(meta.startDate, meta.endDate) : meta.startDate ? fmtDate(meta.startDate) : '');
  rowList('Tags', meta.tags);
  rowList('Stages', meta.stages);
  rowList('Remodels', meta.remodels);
  rowList('Animatronics', meta.animatronics);
  rowList('Franchisees', meta.franchisees);
  rowList('Attractions', meta.attractions);
  rowList('Credits', meta.credits);

  return rows.length ? `<table class="InfoboxTable"><tbody>${rows.join('')}</tbody></table>` : '';
}

// ── Main ──────────────────────────────────────────────────────────────────────
export async function loadArticle(app, articleId) {
  const body = app.querySelector('#ArticleBody');
  const infobox = app.querySelector('#Infobox');
  const titleEl = app.querySelector('#ArticleTitle');
  if (!body || !infobox) return;

  body.innerHTML = '<p class="ArticleLoading">Loading…</p>';

  let metaRes, mdRes;
  try {
    [metaRes, mdRes] = await Promise.all([
      fetch(`/content/${articleId}/meta.json`),
      fetch(`/content/${articleId}/content.md`),
    ]);
  } catch {
    body.innerHTML = '<p class="ArticleError">Failed to load article.</p>';
    return;
  }

  const meta = metaRes.ok ? await metaRes.json() : {};
  const md = mdRes?.ok ? await mdRes.text() : '';

  if (meta.title) document.title = meta.title;
  if (titleEl) titleEl.textContent = meta.title || '';

  // Infobox
  const linker = await getLinker();
  const isPhoto = (meta.type || '').toLowerCase() === 'photos';
  const thumbFolder = isPhoto ? articleId : (meta.pageThumbnailFile ? linker[meta.pageThumbnailFile] : null);
  infobox.innerHTML = '';
  if (thumbFolder) {
    const imgWrap = document.createElement('div');
    imgWrap.className = 'InfoboxThumb';
    imgWrap.appendChild(ProgressiveImage(thumbFolder, meta.title || ''));
    infobox.appendChild(imgWrap);
  }
  infobox.insertAdjacentHTML('beforeend', buildInfobox(meta));

  // Body
  body.innerHTML = '';
  body.insertAdjacentHTML('beforeend', await renderMarkdown(md) || '<p class="ArticleEmpty">No content.</p>');
  initLinkPreviews(body);
  await buildCitations(body, meta.citations || []);

  // Contributors — only those listed in this article
  const articleContribs = meta.contributors || [];
  if (articleContribs.length) {
    const contribEl = app.querySelector('.ArticleContributors');
    if (contribEl) {
      const allUsers = await getContribs();
      const filtered = allUsers.filter(u =>
        articleContribs.some(c =>
          c.toLowerCase() === (u.name || '').toLowerCase() ||
          c.toLowerCase() === (u.fu || '').toLowerCase()
        )
      );
      if (filtered.length) renderUsers(contribEl, filtered);
    }
  }
}