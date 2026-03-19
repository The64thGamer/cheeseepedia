import { initLinkPreviews } from './LinkPreview.js';
import { ProgressiveImage } from './ProgressiveImage.js';
import { buildCitations } from './Citations.js';
import { renderUsers } from './UserTag.js';
import { renderPhotoCard, renderVideoCard, renderReviewCard, renderArticleList } from '/viewers/cep-js/js/CardRenderer.js';

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
    .replace(/^[\*\-]\s+(.+)$/gm,'<li>$1</li>').replace(/^\d+\.\s+(.+)$/gm,'<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g,m=>`<ul>${m}</ul>`)
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
    })
    .split('\n\n').map(block=>{
      const t=block.trim();if(!t)return '';
      if(/^\x00TABLE/.test(t)||/^<(h[1-6]|ul|ol|li|blockquote|hr|img|pre|code|sup|span|a)/.test(t))return t;
      return `<p>${t.replace(/\n/g,' ')}</p>`;
    }).join('\n');
  blocks.forEach((b,i)=>{html=html.replaceAll(`\x00TABLE${i}\x00`,b);});
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
  transcriptions: doc=>renderArticleList(doc),
};
const SECTION_LABELS={photos:'Photos',videos:'Videos',reviews:'Reviews',transcriptions:'Transcriptions'};

// ── Main ──────────────────────────────────────────────────────────────────────
export async function loadArticle(app, articleId){
  const body   =app.querySelector('#ArticleBody');
  const infobox=app.querySelector('#Infobox');
  const titleEl=app.querySelector('#ArticleTitle');
  const btnBar =app.querySelector('#ArticleHeaderBtns');
  const header =app.querySelector('.ArticleHeader');
  if(!body||!infobox)return;

  const showInbox=show=>{ infobox.style.display=show?'':'none'; };
  body.innerHTML='<p class="ArticleLoading">Loading...</p>';

  let metaRes,mdRes;
  try{ [metaRes,mdRes]=await Promise.all([fetch(`/content/${articleId}/meta.json`),fetch(`/content/${articleId}/content.md`)]); }
  catch{ body.innerHTML='<p class="ArticleError">Failed to load article.</p>';return; }

  const meta=metaRes.ok?await metaRes.json():{};
  const md=mdRes?.ok?await mdRes.text():'';

  if(meta.title)document.title=meta.title;
  if(titleEl)titleEl.textContent=meta.title||'';

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

    const needsArticleBtn=hasAnySections||hasInventory;
    let articleBtn=null;
    if(needsArticleBtn)articleBtn=makeBtn('Article',showArticle);

    Object.entries(SECTION_LABELS).forEach(([type,label])=>{
      const items=sections[type];if(!items?.length)return;
      const renderer=SECTION_RENDERERS[type];
      makeBtn(`${label} (${items.length})`,()=>{
        showInbox(false);
        body.innerHTML='';
        const wrap=document.createElement('div');wrap.className='CardWrap';
        items.forEach(item=>{
          const doc={t:item.t,p:item.p,d:item.d||'',de:'',e:item.e||'',tp:type.charAt(0).toUpperCase()+type.slice(1)};
          wrap.appendChild(renderer(doc));
        });
        body.appendChild(wrap);
      });
    });

    if(hasInventory){
      makeBtn('Inventory',()=>{
        showInbox(false);
        body.innerHTML='';
        body.appendChild(renderInventorySection(meta,linker));
      });
    }

    if(articleBtn)setActive(articleBtn);
  }

  // Pin button
  if(header){
    const pinBtn=document.createElement('button');
    pinBtn.className='PinButton';pinBtn.textContent='📌';
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