// Minimal markdown renderer — handles the common subset used in wiki content
function renderMarkdown(md) {
  if (!md) return '';
  let html = md
    // Escape HTML first
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    // Headers
    .replace(/^#{6}\s+(.+)$/gm,'<h6>$1</h6>')
    .replace(/^#{5}\s+(.+)$/gm,'<h5>$1</h5>')
    .replace(/^#{4}\s+(.+)$/gm,'<h4>$1</h4>')
    .replace(/^#{3}\s+(.+)$/gm,'<h3>$1</h3>')
    .replace(/^#{2}\s+(.+)$/gm,'<h2>$1</h2>')
    .replace(/^#{1}\s+(.+)$/gm,'<h1>$1</h1>')
    // Bold + italic
    .replace(/\*\*\*(.+?)\*\*\*/g,'<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,'<em>$1</em>')
    .replace(/___(.+?)___/g,'<strong><em>$1</em></strong>')
    .replace(/__(.+?)__/g,'<strong>$1</strong>')
    .replace(/_(.+?)_/g,'<em>$1</em>')
    // Inline code
    .replace(/`([^`]+)`/g,'<code>$1</code>')
    // Blockquote
    .replace(/^&gt;\s+(.+)$/gm,'<blockquote>$1</blockquote>')
    // Horizontal rule
    .replace(/^(-{3,}|\*{3,})$/gm,'<hr>')
    // Unordered lists
    .replace(/^[\*\-]\s+(.+)$/gm,'<li>$1</li>')
    // Ordered lists
    .replace(/^\d+\.\s+(.+)$/gm,'<li>$1</li>')
    // Wrap consecutive <li> in <ul>
    .replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`)
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g,'<img src="$2" alt="$1">')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2">$1</a>')
    // Paragraphs — wrap lines not already wrapped in a block element
    .split('\n\n')
    .map(block => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (/^<(h[1-6]|ul|ol|li|blockquote|hr|img|pre|code)/.test(trimmed)) return trimmed;
      return `<p>${trimmed.replace(/\n/g,' ')}</p>`;
    })
    .join('\n');
  return html;
}

const MNAMES = ['','Jan. ','Feb. ','Mar. ','Apr. ','May ','Jun. ','Jul. ','Aug. ','Sep. ','Oct. ','Nov. ','Dec.'];
function fmtDate(d) {
  if (!d || d === '0000-00-00' || !d.trim()) return '???';
  const [y,m,day] = d.split('-');
  const yi=parseInt(y,10), mi=parseInt(m,10), di=parseInt(day,10);
  if (!yi || yi===0) return '???';
  const mn=mi?MNAMES[mi]:'', dn=di?String(di):'', dp=mn+dn;
  return (dp?dp+(dp.endsWith(' ')?'':' '):'')+yi;
}

function fmtDateRange(start, end) {
  const s=fmtDate(start);
  if (end===undefined||end===null||end==='') return s+' - Present';
  if (!end||end==='0000-00-00') return s+' - ???';
  return s+' - '+fmtDate(end);
}

function esc(s) { return s?String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'):''; }

function buildInfobox(meta) {
  if (!meta) return '';
  const rows = [];

  const row = (label, val) => { if (val) rows.push(`<tr><th>${esc(label)}</th><td>${val}</td></tr>`); };
  const rowList = (label, arr) => {
    if (!arr||!arr.length) return;
    row(label, arr.map(v=>esc(String(v).split('|')[0].trim())).join('<br>'));
  };

  row('Type', esc(meta.type||''));
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

  if (!rows.length) return '';
  return `<table class="InfoboxTable"><tbody>${rows.join('')}</tbody></table>`;
}

export async function loadArticle(app, articleId) {
  const body = app.querySelector('#ArticleBody');
  const infobox = app.querySelector('#Infobox');
  if (!body||!infobox) return;

  body.innerHTML = '<p class="ArticleLoading">Loading…</p>';

  try {
    const [metaRes, mdRes] = await Promise.all([
      fetch(`/content/${articleId}/meta.json`),
      fetch(`/content/${articleId}/content.md`),
    ]);

    const meta = metaRes.ok ? await metaRes.json() : {};
    const md   = mdRes.ok   ? await mdRes.text()   : '';

    // Set page title
    if (meta.title) document.title = meta.title;

    // Render infobox
    infobox.innerHTML = meta.title
      ? `<div class="InfoboxTitle">${esc(meta.title)}</div>${buildInfobox(meta)}`
      : buildInfobox(meta);

    // Render body
    body.innerHTML = renderMarkdown(md) || '<p class="ArticleEmpty">No content.</p>';

  } catch (e) {
    body.innerHTML = '<p class="ArticleError">Failed to load article.</p>';
  }
}