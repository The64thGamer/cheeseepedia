/**
 * ArticleUtils.js
 * Shared utilities used by all article-type renderers.
 * Import what you need rather than importing everything.
 */

import { renderQuickTags } from '/viewers/cep-js/js/QuickTags.js';
import { renderUsers }     from './UserTag.js';
import { buildCitations }  from './Citations.js';
import { initLinkPreviews } from './LinkPreview.js';

// ── Caches ────────────────────────────────────────────────────────────────────
let LINKER=null, CONTRIBUTORS=null, RELATED=null, SEARCH_DOCS=null, VIEWS=null;
export const getLinker    = async () => LINKER       ||= await fetch('/viewers/cep-js/compiled-json/ArticleLinker.json').then(r=>r.ok?r.json():{}).catch(()=>({}));
export const getContribs  = async () => CONTRIBUTORS ||= await fetch('/viewers/cep-js/compiled-json/contributors.json').then(r=>r.json()).catch(()=>[]);
export const getRelated   = async () => RELATED      ||= await fetch('/viewers/cep-js/compiled-json/related.json').then(r=>r.ok?r.json():{}).catch(()=>({}));
export const getSearchDocs= async () => SEARCH_DOCS  ||= await fetch('/viewers/cep-js/compiled-json/search/docs.json').then(r=>r.ok?r.json():[]).catch(()=>[]);
export const getViews     = async () => VIEWS        ||= await fetch('/viewers/cep-js/compiled-json/views.json').then(r=>r.ok?r.json():{}).catch(()=>({}));

// ── Date utils ────────────────────────────────────────────────────────────────
const MNAMES=['','Jan. ','Feb. ','Mar. ','Apr. ','May ','Jun. ','Jul. ','Aug. ','Sep. ','Oct. ','Nov. ','Dec.'];
export function fmtDate(d){
  if(!d||d==='0000-00-00'||!d.trim()) return '???';
  const [y,m,day]=d.split('-'), yi=parseInt(y,10), mi=parseInt(m,10), di=parseInt(day,10);
  if(!yi) return '???';
  const mn=mi?MNAMES[mi]:'', dn=di?String(di):'', dp=mn+dn;
  return (dp?dp+(dp.endsWith(' ')?'':' '):'')+yi;
}
export function fmtDateRange(s,e){
  const start=fmtDate(s);
  if(e===undefined||e===null||e==='') return start+' - Present';
  if(!e||e==='0000-00-00') return start+' - ???';
  return start+' - '+fmtDate(e);
}
export const esc=s=>s?String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'):'';

// ── Tag extraction ────────────────────────────────────────────────────────────
const DICT_TAG_FIELDS   = ['remodels','stages','animatronics','franchisees','attractions','credits'];
const STRING_TAG_FIELDS = ['tags','pages','page'];
export function extractName(val){ return typeof val==='object'&&val!==null?String(val.n||'').trim():String(val).split('|')[0].trim(); }
export function extractTags(fm){
  const tags=[], seen=new Set();
  const push=v=>{ v=String(v).trim(); if(v&&!seen.has(v.toLowerCase())){seen.add(v.toLowerCase());tags.push(v);} };
  DICT_TAG_FIELDS.forEach(f=>{ (fm[f]||[]).forEach(item=>push(extractName(item))); });
  STRING_TAG_FIELDS.forEach(f=>{ const val=fm[f]; if(!val)return; (Array.isArray(val)?val:[val]).forEach(item=>push(String(item).split('|')[0].trim())); });
  push(fm.type||'');
  (fm.credits||[]).forEach(c=>push(String(c).split('|')[0].trim()));
  push(fm.title||'');
  const year=(fm.startDate||'').split('-')[0];
  push((year&&year!=='0000')?year:'Unknown Year');
  return tags;
}
export function extractWikiLinkTags(md){
  const tags=[], seen=new Set();
  for(const m of md.matchAll(/\[([^\]]+)\]/g)){
    const val=m[1].trim();
    if(val&&!/^\d+$/.test(val)&&!seen.has(val.toLowerCase())){seen.add(val.toLowerCase());tags.push(val);}
  }
  return tags;
}
export function buildArticleTags(fm,md){
  const seen=new Set(), tags=[];
  const push=v=>{ if(v&&!seen.has(v.toLowerCase())){seen.add(v.toLowerCase());tags.push(v);} };
  extractTags(fm).forEach(push);
  extractWikiLinkTags(md).forEach(push);
  return tags;
}

// ── Article meta bar (last updated + views) ─────────────────────────────────
function timeAgo(unixSeconds){
  if(!unixSeconds) return '';
  const diff=Math.floor(Date.now()/1000-unixSeconds);
  if(diff<60)       return 'just now';
  if(diff<3600)     { const m=Math.floor(diff/60);   return `${m} minute${m!==1?'s':''} ago`; }
  if(diff<86400)    { const h=Math.floor(diff/3600);  return `${h} hour${h!==1?'s':''} ago`; }
  if(diff<7*86400)  { const d=Math.floor(diff/86400); return `${d} day${d!==1?'s':''} ago`; }
  if(diff<30*86400) { const w=Math.floor(diff/604800);return `${w} week${w!==1?'s':''} ago`; }
  if(diff<365*86400){ const mo=Math.floor(diff/2592000);return `${mo} month${mo!==1?'s':''} ago`; }
  return new Date(unixSeconds*1000).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
}

/**
 * Renders a small meta bar showing last updated time and view count below the article title.
 * Appends into .ArticleMetaBar if present, otherwise inserts after #ArticleTitle.
 */
export async function renderArticleMeta(app, articleId){
  const [docs, views] = await Promise.all([getSearchDocs(), getViews()]);
  const doc   = docs.find(d => d.p === articleId);
  const mt    = doc?.mt || 0;
  const count = views[articleId] ?? 0;

  // Remove any existing bar first to prevent duplicates on re-render
  app.querySelectorAll('.ArticleMetaBar').forEach(el => el.remove());

  const bar = document.createElement('div');
  bar.id = 'ArticleMetaBar';
  bar.className = 'ArticleMetaBar';

  if(mt){
    const updated = document.createElement('span');
    updated.className = 'ArticleMetaUpdated';
    updated.textContent = `Updated ${timeAgo(mt)}`;
    bar.appendChild(updated);
  }

  const viewEl = document.createElement('span');
  viewEl.className = 'ArticleMetaViews';
  viewEl.textContent = `${count.toLocaleString()} view${count!==1?'s':''}`;
  bar.appendChild(viewEl);

  const header = app.querySelector('.ArticleHeader');
  if(header) header.insertAdjacentElement('afterend', bar);
}

// ── Markdown renderer ─────────────────────────────────────────────────────────
export async function renderMarkdown(md){
  if(!md) return '';
  const idx=await getLinker(), blocks=[];
  let html=md
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/^#{6}\s+(.+)$/gm,'<h6>$1</h6>').replace(/^#{5}\s+(.+)$/gm,'<h5>$1</h5>')
    .replace(/^#{4}\s+(.+)$/gm,'<h4>$1</h4>').replace(/^#{3}\s+(.+)$/gm,'<h3>$1</h3>')
    .replace(/^#{2}\s+(.+)$/gm,'<h2>$1</h2>').replace(/^#{1}\s+(.+)$/gm,'<h1>$1</h1>')
    .replace(/\*\*\*(.+?)\*\*\*/g,'<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\*(.+?)\*/g,'<em>$1</em>')
    .replace(/___(.+?)___/g,'<strong><em>$1</em></strong>')
    .replace(/__(.+?)__/g,'<strong>$1</strong>').replace(/_(.+?)_/g,'<em>$1</em>')
    .replace(/`([^`]+)`/g,'<code>$1</code>')
    .replace(/^&gt;\s+(.+)$/gm,'<blockquote>$1</blockquote>')
    .replace(/^(-{3,}|\*{3,})$/gm,'<hr>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g,'<img src="$2" alt="$1">')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2">$1</a>')
    .replace(/\[(\d+)\]/g,(_,n)=>`<sup>(${n})</sup>`)
    .replace(/\[([^\]]+)\]/g,(_,title)=>{
      const id=idx[title];
      return id?`<a href="/?v=cep-js&=${encodeURIComponent(id)}">${title}</a>`:`<span class="BadLink">${title}</span>`;
    })
    .replace(/^(\|.+\|\n)([\|\- :]+\|\n)((?:\|.+\|\n?)*)/gm,(_,header,sep,body)=>{
      const parseRow=(row,tag)=>'<tr>'+row.trim().replace(/^\||\|$/g,'').split('|').map(c=>`<${tag}>${c.trim()}</${tag}>`).join('')+'</tr>';
      const ph=`\x00TABLE${blocks.length}\x00`;
      blocks.push(`<table><thead>${parseRow(header,'th')}</thead><tbody>${body.trim().split('\n').filter(Boolean).map(r=>parseRow(r,'td')).join('')}</tbody></table>`);
      return ph;
    });
  const listBlocks=[];
  html=parseLists(html,listBlocks);
  html=html.split('\n\n').map(block=>{
    const t=block.trim(); if(!t) return '';
    if(/^\x00TABLE/.test(t)||/^\x00LIST/.test(t)||/^<(h[1-6]|ul|ol|li|blockquote|hr|img|pre|code|sup|span|a)/.test(t)) return t;
    return `<p>${t.replace(/\n/g,' ')}</p>`;
  }).join('\n');
  blocks.forEach((b,i)=>{html=html.replaceAll(`\x00TABLE${i}\x00`,b);});
  listBlocks.forEach((b,i)=>{html=html.replaceAll(`\x00LIST${i}\x00`,b);});
  return html;
}

function parseLists(text,blocks){
  const lines=text.split('\n'), out=[], stack=[];
  const flushDeeper=depth=>{
    while(stack.length&&stack[stack.length-1].indent>depth){
      const top=stack.pop(), tag=top.ordered?'ol':'ul';
      const html=`<${tag}>${top.items.join('')}</${tag}>`;
      const parent=stack[stack.length-1];
      const last=parent.items.length?parent.items.pop():'<li>';
      parent.items.push(last.replace(/<\/li>$/,'')+html+'</li>');
    }
  };
  const flushAll=()=>{
    while(stack.length){
      const top=stack.pop(), tag=top.ordered?'ol':'ul';
      const html=`<${tag}>${top.items.join('')}</${tag}>`;
      if(stack.length){const parent=stack[stack.length-1];const last=parent.items.length?parent.items.pop():'<li>';parent.items.push(last.replace(/<\/li>$/,'')+html+'</li>');}
      else{const ph=`\x00LIST${blocks.length}\x00`;blocks.push(html);out.push(ph);}
    }
  };
  for(const line of lines){
    const ul=line.match(/^(\s*)[\*\-]\s+(.+)$/), ol=line.match(/^(\s*)\d+\.\s{1,3}(.+)$/);
    if(!ul&&!ol){flushAll();out.push(line);continue;}
    const raw=ul?ul[1]:ol[1], indent=Math.floor(raw.length/2), ordered=!!ol, content=ul?ul[2]:ol[2];
    const top=stack[stack.length-1];
    if(top&&top.indent===indent&&top.ordered===ordered){top.items.push(`<li>${content}</li>`);}
    else if(!top||indent>top.indent){stack.push({indent,ordered,items:[`<li>${content}</li>`]});}
    else{flushDeeper(indent);const newTop=stack[stack.length-1];if(newTop&&newTop.indent===indent&&newTop.ordered===ordered){newTop.items.push(`<li>${content}</li>`);}else{flushAll();stack.push({indent,ordered,items:[`<li>${content}</li>`]});}}
  }
  flushAll();
  return out.join('\n');
}

// ── Shared helpers ────────────────────────────────────────────────────────────

/** Render contributor tags into a container element */
export async function renderContributors(container, meta){
  const contribNames=meta.contributors||[];
  if(!contribNames.length) return;
  container.innerHTML='';
  const allUsers=await getContribs();
  const filtered=allUsers.filter(u=>contribNames.some(c=>
    c.toLowerCase()===(u.name||'').toLowerCase()||c.toLowerCase()===(u.fu||'').toLowerCase()
  ));
  if(filtered.length) renderUsers(container,filtered);
}

/** Render related tags into a container, wiring addTag callback */
export function renderRelatedTags(container, meta, md, addTag){
  if(!container) return;
  container.innerHTML='';
  const tags=buildArticleTags(meta,md);
  if(!tags.length) return;
  renderQuickTags(container, tags, tag=>{
    if(addTag) addTag(tag);
    const searchEl=document.querySelector('.Search');
    if(searchEl) searchEl.scrollIntoView({behavior:'smooth',block:'start'});
  });
}

/** Render markdown into a container, with citations and link previews */
export async function renderBody(container, md, citations){
  container.innerHTML='';
  container.insertAdjacentHTML('beforeend', await renderMarkdown(md)||'<p class="ArticleEmpty">No content.</p>');
  initLinkPreviews(container);
  await buildCitations(container, citations||[]);
}

/** Set the page title and the #ArticleTitle element */
export function setTitle(app, title){
  if(title) document.title=title;
  const el=app.querySelector('#ArticleTitle');
  if(el) el.textContent=title||'';
}
