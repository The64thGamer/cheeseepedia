import { buildCitations } from './Citations.js';
import { renderUsers } from './UserTag.js';

export async function initStats(app) {
  const body = app.querySelector('.Body');
  if(!body) return;
  body.innerHTML += '<p class="ArticleLoading">Loading stats...</p>';

  const [citRes, dlRes, contribRes] = await Promise.all([
    fetch('/viewers/cep-js/compiled-json/citation_links.json'),
    fetch('/viewers/cep-js/compiled-json/download_links.json'),
    fetch('/viewers/cep-js/compiled-json/contributors.json'),
  ]);
  const links       = citRes.ok     ? await citRes.json()     : [];
  const downloads   = dlRes.ok      ? await dlRes.json()      : [];
  const contributors= contribRes.ok ? await contribRes.json() : [];
  const sortedContribs = [...contributors].sort((a,b) => (b.count||0) - (a.count||0));

  body.querySelector('.ArticleLoading')?.remove();

  // ── Tab bar ────────────────────────────────────────────────────────────────
  const tabBar = document.createElement('div');
  tabBar.className = 'ArticleHeaderBtns';
  tabBar.style.marginBottom = '1rem';
  body.appendChild(tabBar);

  const tabContent = document.createElement('div');
  body.appendChild(tabContent);

  let activeBtn = null;
  const setActive = btn => {
    if(activeBtn) activeBtn.classList.remove('PinButtonActive');
    activeBtn = btn; btn.classList.add('PinButtonActive');
  };
  const makeTab = (label, render) => {
    const btn = document.createElement('button');
    btn.className = 'PinButton';
    btn.textContent = label;
    btn.addEventListener('click', () => { setActive(btn); tabContent.innerHTML = ''; tabContent.appendChild(render()); });
    tabBar.appendChild(btn);
    return btn;
  };

  // ── Citations tab ──────────────────────────────────────────────────────────
  const citBtn = makeTab(`Citations (${links.length.toLocaleString()})`, () => {
    const wrap = document.createElement('div');
    buildCitations(wrap, links);
    return wrap;
  });

  // ── Downloads tab ──────────────────────────────────────────────────────────
  makeTab(`Downloads (${downloads.length.toLocaleString()})`, () => {
    const wrap = document.createElement('div');
    wrap.className = 'DownloadsList';
    downloads.forEach(dl => {
      const item = document.createElement('div');
      item.className = 'DownloadsItem';
      const a = document.createElement('a');
      a.href = dl.url; a.target = '_blank'; a.rel = 'noopener';
      a.textContent = dl.label || dl.url;
      item.appendChild(a);
      wrap.appendChild(item);
    });
    return wrap;
  });

  // ── Contributors tab ────────────────────────────────────────────────────────
  makeTab(`Contributors (${sortedContribs.length.toLocaleString()})`, () => {
    const wrap = document.createElement('div');
    wrap.className = 'ContributorsList';
    renderUsers(wrap, sortedContribs);
    return wrap;
  });

  setActive(citBtn);
  citBtn.click();
}