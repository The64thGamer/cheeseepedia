/**
 * UserArticle.js
 * Renderer for pages with type "User".
 */
import { ProgressiveImage } from './ProgressiveImage.js';
import { renderArticleCompact, renderReviewCard } from '/viewers/cep-js/js/CardRenderer.js';
import { setTitle, renderBody, getLinker, getRelated, getContribs } from './ArticleUtils.js';

const SEARCH_DOCS_URL = '/viewers/cep-js/compiled-json/search/docs.json';
let SEARCH_DOCS = null;
const getSearchDocs = async () =>
  SEARCH_DOCS ||= await fetch(SEARCH_DOCS_URL).then(r => r.ok ? r.json() : []).catch(() => []);

const TIERS = [
  { min:0,    max:1,    start:'#464141', end:'#464141', rank:'Bankruptcy'         },
  { min:2,    max:4,    start:'#613583', end:'#613583', rank:'Toddler Zone'       },
  { min:5,    max:9,    start:'#3b538a', end:'#3b538a', rank:'Crusty & Greasy'    },
  { min:10,   max:24,   start:'#26a269', end:'#26a269', rank:'Jumpscare Fodder'   },
  { min:25,   max:49,   start:'#d3b31c', end:'#d3b31c', rank:'Store Tourist'      },
  { min:50,   max:74,   start:'#ff7800', end:'#ff7800', rank:'Wiki Wanderer'      },
  { min:75,   max:99,   start:'#e01b24', end:'#e01b24', rank:'Article Wizard'     },
  { min:100,  max:149,  start:'#ff8383', end:'#ff006d', rank:'Historian'          },
  { min:150,  max:299,  start:'#aaa8bc', end:'#241f31', rank:'Guest Star'         },
  { min:300,  max:499,  start:'#c97e3c', end:'#3c6f50', rank:'Super Chuck'        },
  { min:500,  max:749,  start:'#ff7800', end:'#703820', rank:'Phase IV'           },
  { min:750,  max:999,  start:'#e3e9e8', end:'#5b5f60', rank:'CEC Master'         },
  { min:1000, max:99999,start:'#d9d15a', end:'#ce6923', rank:'The Giant Rat That Makes All of the Rules' },
];

function getTier(count) {
  return TIERS.find(t => count >= t.min && count <= t.max) || TIERS[0];
}

function applyGradientText(el, tier) {
  if (tier.start === tier.end) {
    el.style.color = tier.start;
  } else {
    el.style.backgroundImage = `linear-gradient(0deg, ${tier.start}, ${tier.end})`;
    el.style.webkitBackgroundClip = 'text';
    el.style.backgroundClip = 'text';
    el.style.webkitTextFillColor = 'transparent';
    el.style.color = 'transparent';
  }
}

export async function loadUserArticle(app, articleId, meta, md, addTag) {
  const header = app.querySelector('#ArticleHeader');
  const btnBar = app.querySelector('#ArticleHeaderBtns');
  const body   = app.querySelector('#ArticleBody');

  setTitle(app, meta.title);
  if (body) body.innerHTML = '<p class="ArticleLoading">Loading…</p>';

  // Load contributors.json to find this user's forum profile and real count
  const userName  = meta.title || '';
  const allUsers  = await getContribs();
  const userEntry = allUsers.find(u =>
    (u.name || '').toLowerCase() === userName.toLowerCase() ||
    (u.fn   || '').toLowerCase() === userName.toLowerCase()
  );

  // Contribution count from docs
  const allDocs     = await getSearchDocs();
  const contributed = allDocs.filter(d =>
    (d.c || []).some(c => c.toLowerCase() === userName.toLowerCase())
  );
  const count = contributed.length;
  const tier  = getTier(count);

  // ── User header ─────────────────────────────────────────────────────────────
  if (header) {
    // Clear everything except the btns bar (which is already in the header HTML)
    Array.from(header.children).forEach(child => {
      if (child.id !== 'ArticleHeaderBtns') child.remove();
    });

    // Faded thumbnail background
    const linker  = await getLinker();
    const thumbId = meta.pageThumbnailFile ? linker[meta.pageThumbnailFile] : null;
    if (thumbId) {
      const bgWrap = document.createElement('div');
      bgWrap.className = 'UserHeaderBg';
      bgWrap.appendChild(ProgressiveImage(thumbId, ''));
      header.insertBefore(bgWrap, header.firstChild);
    }

    // Content row
    const content = document.createElement('div');
    content.className = 'UserHeaderContent';

    // Avatar — from contributors.json av field or fallback to articleId
    const avatarFile = userEntry?.av || null;
    const avatarWrap = document.createElement('div');
    avatarWrap.className = 'UserAvatarWrap';
    if (avatarFile) {
      const avatar = document.createElement('img');
      avatar.src = `/viewers/cep-js/compiled-json/avatars/${avatarFile}`;
      avatar.className = 'UserAvatarBig';
      avatar.alt = userName;
      avatar.onerror = () => { avatarWrap.style.display = 'none'; };
      avatarWrap.appendChild(avatar);
    } else {
      avatarWrap.style.display = 'none';
    }
    content.appendChild(avatarWrap);

    const info = document.createElement('div');
    info.className = 'UserInfo';

    // Name
    const nameEl = document.createElement('h1');
    nameEl.className = 'UserNameBig';
    nameEl.textContent = userName;
    info.appendChild(nameEl);

        // Rank + count on one line
    const rankLine = document.createElement('div');
    rankLine.className = 'UserRankLine';
 
    const rankEl = document.createElement('span');
    rankEl.className = 'UserRank';
    rankEl.textContent = tier.rank;
    applyGradientText(rankEl, tier);
    rankLine.appendChild(rankEl);
 
    const countEl = document.createElement('span');
    countEl.className = 'UserRankCount';
    const tierIndex = TIERS.indexOf(tier);
    const isLastTier = tierIndex === TIERS.length - 1;
    countEl.textContent = isLastTier
      ? ` (${count.toLocaleString()})`
      : ` (${count.toLocaleString()} / ${(tier.max + 1).toLocaleString()})`;
    rankLine.appendChild(countEl);
 
    info.appendChild(rankLine);

    // Forum link from contributors.json url field
    const forumUrl = userEntry?.url || meta.forum || meta.forumUrl || null;
    if (forumUrl) {
      const forumLink = document.createElement('a');
      forumLink.className = 'UserForumLink';
      forumLink.href = forumUrl;
      forumLink.target = '_blank';
      forumLink.rel = 'noopener';
      forumLink.textContent = 'Forum Profile';
      info.appendChild(forumLink);
    }

    content.appendChild(info);
    // Insert content before the btns bar
    const btns = header.querySelector('#ArticleHeaderBtns');
    header.insertBefore(content, btns);
  }

  // ── Tabs ────────────────────────────────────────────────────────────────────
  if (!btnBar || !body) return;

  btnBar.innerHTML = '';
  let activeBtn = null;
  const setActive = btn => {
    if (activeBtn) activeBtn.classList.remove('PinButtonActive');
    activeBtn = btn;
    btn.classList.add('PinButtonActive');
  };
  const makeBtn = (label, onClick) => {
    const btn = document.createElement('button');
    btn.className = 'PinButton';
    btn.textContent = label;
    btn.addEventListener('click', () => { setActive(btn); onClick(); });
    btnBar.appendChild(btn);
    return btn;
  };

  // Bio
  const showBio = async () => {
    body.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.className = 'UserBio';
    body.appendChild(wrap);
    await renderBody(wrap, md, meta.citations || []);
  };
  const bioBtn = makeBtn('Bio', showBio);

  // Contributions
  makeBtn(`Contributions (${count})`, () => {
    body.innerHTML = '';
    if (!contributed.length) {
      body.innerHTML = '<p class="ArticleEmpty">No contributions found.</p>';
      return;
    }
    const list = document.createElement('div');
    list.className = 'UserContribList';
    const sorted = [...contributed].sort((a, b) => {
      const ad = a.d || '', bd = b.d || '';
      const aUnk = !ad || ad.startsWith('0000');
      const bUnk = !bd || bd.startsWith('0000');
      if (aUnk && bUnk) return 0; if (aUnk) return 1; if (bUnk) return -1;
      return bd.localeCompare(ad);
    });
    sorted.forEach(doc => list.appendChild(renderArticleCompact(doc)));
    body.appendChild(list);
  });

  // Reviews — scan docs.json for Reviews-type docs contributed by this user
  makeBtn('Reviews', async () => {
    body.innerHTML = '<p class="ArticleLoading">Loading reviews…</p>';
    const reviews = allDocs.filter(d =>
      (d.tp || '').toLowerCase() === 'reviews' &&
      (d.c || []).some(c => c.toLowerCase() === userName.toLowerCase())
    );
    body.innerHTML = '';
    if (!reviews.length) {
      body.innerHTML = '<p class="ArticleEmpty">No reviews found.</p>';
      return;
    }
    const wrap = document.createElement('div');
    wrap.className = 'CardWrap';
    reviews.forEach(doc => wrap.appendChild(renderReviewCard(doc)));
    body.appendChild(wrap);
  });

  setActive(bioBtn);
  showBio();
}