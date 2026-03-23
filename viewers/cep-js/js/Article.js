import { initLinkPreviews } from './LinkPreview.js';
import { ProgressiveImage } from './ProgressiveImage.js';
import { buildCitations } from './Citations.js';
import { renderUsers } from './UserTag.js';
import { renderPhotoCard, renderVideoCard, renderReviewCard, renderArticleList } from '/viewers/cep-js/js/CardRenderer.js';
import { renderQuickTags } from '/viewers/cep-js/js/QuickTags.js';
import { renderSalesTab } from '/viewers/cep-js/js/Sales.js';
import { renderInventoriesTab } from '/viewers/cep-js/js/InventoriesTab.js';
import { renderArticleMeta } from '/viewers/cep-js/js/ArticleUtils.js';
// ── Caches ────────────────────────────────────────────────────────────────────
let LINKER=null, CONTRIBUTORS=null, RELATED=null;
const getLinker   = async () => LINKER       ||= await fetch('/viewers/cep-js/compiled-json/ArticleLinker.json').then(r=>r.ok?r.json():{}).catch(()=>({}));
const getContribs = async () => CONTRIBUTORS ||= await fetch('/viewers/cep-js/compiled-json/contributors.json').then(r=>r.json()).catch(()=>[]);
const getRelated  = async () => RELATED      ||= await fetch('/viewers/cep-js/compiled-json/related.json').then(r=>r.ok?r.json():{}).catch(()=>({}));

// ── Date utils ────────────────────────────────────────────────────────────────
const MNAMES=['','Jan. ','Feb. ','Mar. ','Apr. ','May ','Jun. ','Jul. ','Aug. ','Sep. ','Oct. ','Nov. ','Dec.'];
function fmtDate(d){
  if(!d||d==='0000-00-00'||!d.trim())return '???';
  const[y,m,day]=d.split('-'),yi=parseInt(y,10),mi=parseInt(m,10),di=parseInt(day,10);
  if(!yi)return '???';
  const mn=mi?MNAMES[mi]:'',dn=di?String(di):'',dp=mn+dn;
  return(dp?dp+(dp.endsWith(' ')?'':' '):'')+yi;
}
function fmtDateRange(s,e){
  const start=fmtDate(s);
  if(e===undefined||e===null||e==='')return start+' - Present';
  if(!e||e==='0000-00-00')return start+' - ???';
  return start+' - '+fmtDate(e);
}
const esc=s=>s?String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'):'';

// ── Tag extraction (mirrors build script extract_tags + extract_wiki_link_tags) ──
const DICT_TAG_FIELDS   = ['remodels','stages','animatronics','franchisees','attractions','credits'];
const STRING_TAG_FIELDS = ['tags','pages','page'];
function extractName(val){ return typeof val==='object'&&val!==null?String(val.n||'').trim():String(val).split('|')[0].trim(); }
function extractTags(fm){
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
function extractWikiLinkTags(md){
  const tags=[], seen=new Set();
  for(const m of md.matchAll(/\[([^\]]+)\]/g)){
    const val=m[1].trim();
    if(val&&!/^\d+$/.test(val)&&!seen.has(val.toLowerCase())){seen.add(val.toLowerCase());tags.push(val);}
  }
  return tags;
}
function buildArticleTags(fm, md){
  const seen=new Set(), tags=[];
  const push=v=>{ if(v&&!seen.has(v.toLowerCase())){seen.add(v.toLowerCase());tags.push(v);} };
  extractTags(fm).forEach(push);
  extractWikiLinkTags(md).forEach(push);
  return tags;
}


// ── Markdown ──────────────────────────────────────────────────────────────────
async function renderMarkdown(md){
  if(!md)return '';
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
      const t=block.trim();if(!t)return '';
      if(/^\x00TABLE/.test(t)||/^\x00LIST/.test(t)||/^<(h[1-6]|ul|ol|li|blockquote|hr|img|pre|code|sup|span|a)/.test(t))return t;
      return `<p>${t.replace(/\n/g,' ')}</p>`;
    }).join('\n');
  blocks.forEach((b,i)=>{html=html.replaceAll(`\x00TABLE${i}\x00`,b);});
  listBlocks.forEach((b,i)=>{html=html.replaceAll(`\x00LIST${i}\x00`,b);});
  return html;
}

// ── Infobox ───────────────────────────────────────────────────────────────────
function buildInfobox(meta, linker){
  if(!meta)return '';
  const parts=[];
  const row=(label,val)=>{ if(val) parts.push(`<div class="InfoboxRow"><span class="InfoboxLabel">${esc(label)}</span><span class="InfoboxValue">${val}</span></div>`); };
  const link=n=>{ const id=linker?linker[n]:null; return id?`<a href="/?v=cep-js&=${encodeURIComponent(id)}">${esc(n)}</a>`:`<span class="BadLink">${esc(n)}</span>`; };
  const box=(label,items,renderItem)=>{
    if(!items?.length)return;
    const bullets=items.map(renderItem).filter(Boolean).map(s=>`<li>${s}</li>`).join('');
    parts.push(`<div class="InfoboxBox"><div class="InfoboxBoxLabel">${esc(label)}</div><ul class="InfoboxBoxList">${bullets}</ul></div>`);
  };

  row('Operated', meta.endDate!==undefined?fmtDateRange(meta.startDate,meta.endDate):meta.startDate?fmtDate(meta.startDate):'');
  if(meta.storeNumber) row('Store #', esc(String(meta.storeNumber)));
  if(meta.sqft)        row('Floorspace', esc(meta.sqft)+' (sqft)');
  if(meta.latitudeLongitude?.length>=2) row('Lat/Long', esc(meta.latitudeLongitude[0])+', '+esc(meta.latitudeLongitude[1]));

  box('Downloads', meta.downloadLinks, d=>{
    if(!d?.url)return null;
    return `<a href="${esc(d.url)}" target="_blank" rel="noopener">${esc(d.label||d.url)}</a>`;
  });
  box('Remodels & Initiatives', meta.remodels, r=>{
    if(!r?.n)return null;
    const date=fmtDate(r.s||'');
    return link(r.n)+(date&&date!=='???'?` (${esc(date)})`:'');
  });
  box('Stages', meta.stages, s=>{
    if(!s?.n)return null;
    const start=fmtDate(s.s||''), end=fmtDate(s.e||'');
    const hasStart=start&&start!=='???', hasEnd=s.e&&s.e!=='0000-00-00'&&end&&end!=='???';
    const range=hasStart?(hasEnd?`${start}–${end}`:`${start}–?`):(hasEnd?`?–${end}`:'');
    return link(s.n)+(range?` (${esc(range)})`:'')+(s.desc?` (${esc(s.desc)})`:'');
  });
  box('Franchisees', meta.franchisees, f=>{
    if(!f?.n)return null;
    const range=fmtDateRange(f.s||'',f.e||'');
    return link(f.n)+(range&&range!=='???'?` (${esc(range)})`:'');
  });
  box('Credits', meta.credits, c=>{
    if(!c)return null;
    const name=typeof c==='string'?c:(c.n||'');
    const role=c.role||'';
    return (role?`<span class="InfoboxCreditRole">${esc(role)}</span> `:'') + esc(name);
  });

  return parts.length?`<div class="InfoboxContent">${parts.join('')}</div>`:'';
}

function parseLists(text, blocks) {
  const lines = text.split('\n');
  const out = [];
  const stack = [];

  const flushDeeper = (depth) => {
    while (stack.length && stack[stack.length-1].indent > depth) {
      const top = stack.pop();
      const tag = top.ordered ? 'ol' : 'ul';
      const html = `<${tag}>${top.items.join('')}</${tag}>`;
      if (stack.length) {
        const parent = stack[stack.length-1];
        const last = parent.items.length ? parent.items.pop() : '<li>';
        parent.items.push(last.replace(/<\/li>$/, '') + html + '</li>');
      } else {
        const ph = `\x00LIST${blocks.length}\x00`;
        blocks.push(html);
        out.push(ph);
      }
    }
  };
  const flushAll = () => {
    while (stack.length) {
      const top = stack.pop();
      const tag = top.ordered ? 'ol' : 'ul';
      const html = `<${tag}>${top.items.join('')}</${tag}>`;
      if (stack.length) {
        const parent = stack[stack.length-1];
        const last = parent.items.length ? parent.items.pop() : '<li>';
        parent.items.push(last.replace(/<\/li>$/, '') + html + '</li>');
      } else {
        const ph = `\x00LIST${blocks.length}\x00`;
        blocks.push(html);
        out.push(ph);
      }
    }
  };

  for (const line of lines) {
    const ul = line.match(/^(\s*)[\*\-]\s+(.+)$/);
    const ol = line.match(/^(\s*)\d+\.\s{1,3}(.+)$/);

    if (!ul && !ol) { flushAll(); out.push(line); continue; }

    const raw = ul ? ul[1] : ol[1];
    const indent = Math.floor(raw.length / 2);
    const ordered = !!ol;
    const content = ul ? ul[2] : ol[2];
    const top = stack[stack.length-1];

    if (top && top.indent === indent && top.ordered === ordered) {
      top.items.push(`<li>${content}</li>`);
    } else if (!top || indent > top.indent) {
      stack.push({ indent, ordered, items: [`<li>${content}</li>`] });
    } else {
      flushDeeper(indent);
      const newTop = stack[stack.length-1];
      if (newTop && newTop.indent === indent && newTop.ordered === ordered) {
        newTop.items.push(`<li>${content}</li>`);
      } else {
        flushAll();
        stack.push({ indent, ordered, items: [`<li>${content}</li>`] });
      }
    }
  }

  flushAll();
  return out.join('\n');
}

// ── Inventory section ─────────────────────────────────────────────────────────
function renderInventorySection(meta, linker){
  const wrap=document.createElement('div');
  wrap.className='InventoryWrap';
  const link=n=>{ const id=linker?linker[n]:null; return id?`<a href="/?v=cep-js&=${encodeURIComponent(id)}">${esc(n)}</a>`:`<span class="BadLink">${esc(n)}</span>`; };

  const SECTIONS=[
    {key:'animatronics', label:'Animatronics', cols:['Name','Start','End','Serial','Notes']},
    {key:'attractions',  label:'Attractions',  cols:['Name','Start','End','Notes']},
    {key:'fixtures',     label:'Fixtures',     cols:['Name','Start','End','Notes']},
  ];

  SECTIONS.forEach(({key,label,cols})=>{
    const items=meta[key];if(!items?.length)return;
    const h=document.createElement('h3');h.className='InventoryHeading';h.textContent=label;
    wrap.appendChild(h);
    const table=document.createElement('table');table.className='InventoryTable';
    table.innerHTML=`<thead><tr>${cols.map(c=>`<th>${c}</th>`).join('')}</tr></thead>`;
    const tbody=document.createElement('tbody');
    items.forEach(item=>{
      const start=fmtDate(item.s||''), end=fmtDate(item.e||'');
      const tr=document.createElement('tr');
      if(key==='animatronics'){
        tr.innerHTML=`<td>${link(item.n)}</td><td>${esc(start)}</td><td>${esc(end)}</td><td>${esc(item.l||'')}</td><td>${esc(item.desc||item.st||'')}</td>`;
      } else {
        tr.innerHTML=`<td>${link(item.n)}</td><td>${esc(start)}</td><td>${esc(end)}</td><td>${esc(item.desc||'')}</td>`;
      }
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);wrap.appendChild(table);
  });
  return wrap;
}

// ── Section config ────────────────────────────────────────────────────────────
const SECTION_RENDERERS={
  photos:         doc=>renderPhotoCard(doc),
  videos:         doc=>renderVideoCard(doc),
  reviews:        doc=>renderReviewCard(doc),
  transcriptions: async doc=>{ const {renderTranscript}=await import('./TranscriptArticle.js'); return renderTranscript(doc); },
};
const SECTION_LABELS={photos:'Gallery',videos:'Videos',reviews:'Reviews',transcriptions:'Transcriptions'};

// ── Main ──────────────────────────────────────────────────────────────────────
export async function loadArticle(app, articleId, addTag){
  // Expose addTag globally so editor exit can restore the page
  window.__CEP_ADD_TAG = addTag;
  if(articleId) fetch(`/track?p=${encodeURIComponent(articleId)}`).catch(()=>{});
  const body   =app.querySelector('#ArticleBody');
  const infobox=app.querySelector('#Infobox');
  const titleEl=app.querySelector('#ArticleTitle');
  const btnBar =app.querySelector('#ArticleHeaderBtns');
  const header =app.querySelector('.ArticleHeader');
  if(!body)return;

  const showInbox=show=>{ if(infobox)infobox.style.display=show?'':'none'; };
  body.innerHTML='<p class="ArticleLoading">Loading...</p>';

  let metaRes,mdRes;
  try{ [metaRes,mdRes]=await Promise.all([fetch(`/content/${articleId}/meta.json`),fetch(`/content/${articleId}/content.md`)]); }
  catch{ body.innerHTML='<p class="ArticleError">Failed to load article.</p>';return; }

  const meta=metaRes.ok?await metaRes.json():{};
  const md=mdRes?.ok?await mdRes.text():'';

  // Dispatch to type-specific renderer if applicable
  const typeKey=(meta.type||'').toLowerCase();
  if(typeKey==='photos'||typeKey==='videos'){
    const {loadPhotoVideoArticle}=await import('./PhotoVideoArticle.js');
    return loadPhotoVideoArticle(app,articleId,meta,md,addTag);
  }
  if(typeKey==='reviews'){
    const {loadReviewArticle}=await import('./ReviewArticle.js');
    return loadReviewArticle(app,articleId,meta,md,addTag);
  }
  if(typeKey==='transcriptions'){
    const {loadTranscriptArticle}=await import('./TranscriptArticle.js');
    return loadTranscriptArticle(app,articleId,meta,md,addTag);
  }
  if(typeKey==='user'){
    const {loadUserArticle}=await import('./UserArticle.js');
    return loadUserArticle(app,articleId,meta,md,addTag);
  }

  if(meta.title)document.title=meta.title;
  if(titleEl)titleEl.textContent=meta.title||'';
  renderArticleMeta(app, articleId);

  // Related tags
  const relatedTagsEl=app.querySelector('.RelatedTags');
  if(relatedTagsEl){
    relatedTagsEl.innerHTML='';
    const articleTags=buildArticleTags(meta,md);
    if(articleTags.length){
      renderQuickTags(relatedTagsEl, articleTags, tag=>{
        if(addTag) addTag(tag);
        const searchEl=document.querySelector('.Search');
        if(searchEl) searchEl.scrollIntoView({behavior:'smooth',block:'start'});
      });
    }
  }

  // Infobox
  const linker=await getLinker();
  const isPhoto=(meta.type||'').toLowerCase()==='photos';
  const thumbFolder=isPhoto?articleId:(meta.pageThumbnailFile?linker[meta.pageThumbnailFile]:null);
  infobox.innerHTML='';
  if(thumbFolder){
    const imgWrap=document.createElement('div');imgWrap.className='InfoboxThumb';
    imgWrap.appendChild(ProgressiveImage(thumbFolder,meta.title||''));
    infobox.appendChild(imgWrap);
  }
  infobox.insertAdjacentHTML('beforeend',buildInfobox(meta,linker));

  // Article body renderer
  async function showArticle(){
    showInbox(true);
    body.innerHTML='';
    body.insertAdjacentHTML('beforeend',await renderMarkdown(md)||'<p class="ArticleEmpty">No content.</p>');
    initLinkPreviews(body);
    await buildCitations(body,meta.citations||[]);
    const articleContribs=meta.contributors||[];
    if(articleContribs.length){
      const contribEl=app.querySelector('.ArticleContributors');
      if(contribEl){
        contribEl.innerHTML='';
        const allUsers=await getContribs();
        const filtered=allUsers.filter(u=>articleContribs.some(c=>
          c.toLowerCase()===(u.name||'').toLowerCase()||c.toLowerCase()===(u.fu||'').toLowerCase()
        ));
        if(filtered.length)renderUsers(contribEl,filtered);
      }
    }
  }

  // Section buttons
  const related=await getRelated();
  const sections=related[articleId]||{};
  const hasAnySections=Object.values(sections).some(v=>v?.length);
  const hasInventory=['animatronics','attractions','fixtures'].some(k=>meta[k]?.length);
  const hasSales=Array.isArray(meta.sales)&&meta.sales.length>0;

  if(btnBar){
    btnBar.innerHTML='';
    let activeBtn=null;
    const setActive=btn=>{ if(activeBtn)activeBtn.classList.remove('PinButtonActive');activeBtn=btn;btn.classList.add('PinButtonActive'); };
    const makeBtn=(label,onClick)=>{
      const btn=document.createElement('button');
      btn.className='PinButton';btn.textContent=label;
      btn.addEventListener('click',()=>{ setActive(btn);onClick(); });
      btnBar.appendChild(btn);return btn;
    };

    const needsArticleBtn=hasAnySections||hasInventory||hasSales;
    let articleBtn=null;
    if(needsArticleBtn)articleBtn=makeBtn('Article',showArticle);

    Object.entries(SECTION_LABELS).forEach(([type,label])=>{
      const items=sections[type];if(!items?.length)return;
      const renderer=SECTION_RENDERERS[type];
      makeBtn(`${label} (${items.length})`,()=>{
        showInbox(false);
        body.innerHTML='';
        const wrap=document.createElement('div');wrap.className='CardWrap';
        const sorted=[...items].sort((a,b)=>{
          const ad=a.d||'', bd=b.d||'';
          const aUnk=!ad||ad==='0000-00-00'||ad.startsWith('0000');
          const bUnk=!bd||bd==='0000-00-00'||bd.startsWith('0000');
          if(aUnk&&bUnk)return 0; if(aUnk)return 1; if(bUnk)return -1;
          return ad.localeCompare(bd);
        });
        body.appendChild(wrap);
        Promise.all(sorted.map(async item=>{
          const doc={t:item.t,p:item.p,d:item.d||'',de:'',e:item.e||'',tp:type.charAt(0).toUpperCase()+type.slice(1)};
          const el=await renderer(doc);
          wrap.appendChild(el);
        }));
      });
    });

    if(hasInventory){
      makeBtn('Inventory',()=>{
        showInbox(false);
        body.innerHTML='';
        body.appendChild(renderInventorySection(meta,linker));
      });
    }

    if(hasSales){
      makeBtn(`Sales (${meta.sales.length})`,()=>{
        showInbox(false);
        body.innerHTML='';
        body.appendChild(renderSalesTab(meta.sales));
      });
    }

    renderInventoriesTab(meta.title, linker, meta.type).then(el=>{
      if(!el) return;
      makeBtn('Inventories',()=>{
        showInbox(false);
        body.innerHTML='';
        body.appendChild(el);
      });
    });

    if(articleBtn)setActive(articleBtn);
  }

  // Pin button — remove existing first to avoid duplication on re-render
  if(header){
    header.querySelector('.PinButton[data-pin]')?.remove();
    const pinBtn=document.createElement('button');
    pinBtn.className='PinButton';pinBtn.textContent='📌';pinBtn.dataset.pin='1';
    const pins=()=>JSON.parse(localStorage.getItem('Pins')||'[]');
    const setPinned=pinned=>{ pinBtn.classList.toggle('PinButtonActive',pinned);pinBtn.title=pinned?'Unpin article':'Pin article'; };
    setPinned(pins().includes(articleId));
    pinBtn.addEventListener('click',()=>{
      let p=pins();const idx=p.indexOf(articleId);
      if(idx===-1)p.push(articleId);else p.splice(idx,1);
      localStorage.setItem('Pins',JSON.stringify(p));setPinned(idx===-1);
    });
    header.appendChild(pinBtn);
  }

  await showArticle();
}

// ── Editor infobox refresh ────────────────────────────────────────────────────
export async function refreshInfobox(app, meta, articleId){
  const infobox=app.querySelector('#Infobox');
  if(!infobox) return;
  const linker=await getLinker();
  const isPhoto=(meta.type||'').toLowerCase()==='photos';
  const thumbFolder=isPhoto?articleId:(meta.pageThumbnailFile?linker[meta.pageThumbnailFile]:null);
  infobox.innerHTML='';
  infobox.style.display='';
  if(thumbFolder){
    const imgWrap=document.createElement('div');
    imgWrap.className='InfoboxThumb';
    imgWrap.appendChild(ProgressiveImage(thumbFolder,meta.title||''));
    infobox.appendChild(imgWrap);
  }
  infobox.insertAdjacentHTML('beforeend',buildInfobox(meta,linker));
  if(!thumbFolder && !infobox.querySelector('.InfoboxContent')){
    infobox.style.display='none';
  }
}
