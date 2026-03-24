const AVATAR_BASE = '/viewers/cep-js/compiled-json/avatars';
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
  { min:1000, max:99999,start:'#d9d15a', end:'#ce6923', rank:'The Giant Rat That Makes All of the Rules'   },
];

function getTier(count) {
  return TIERS.find(t => count >= t.min && count <= t.max) || TIERS[0];
}

let LINKER = null, QUOTES_CACHE = {};

async function getLinker() {
  if (!LINKER) LINKER = await fetch('/viewers/cep-js/compiled-json/ArticleLinker.json')
    .then(r=>r.ok?r.json():{}).catch(()=>({}));
  return LINKER;
}

async function getQuotes(folderId) {
  if (QUOTES_CACHE[folderId] !== undefined) return QUOTES_CACHE[folderId];
  try {
    const meta = await fetch(`/content/${folderId}/meta.json`).then(r=>r.ok?r.json():{}).catch(()=>({}));
    QUOTES_CACHE[folderId] = meta.quotes || null;
  } catch { QUOTES_CACHE[folderId] = null; }
  return QUOTES_CACHE[folderId];
}

function makeBubble(text) {
  const b = document.createElement('div');
  b.className = 'UserBubble';
  b.textContent = text;
  return b;
}

function makeCard(user, folderId, quote, linker) {
  const count  = user.count || 0;
  const tier   = getTier(count);
  const name   = user.fn || user.name || user.fu || '?';
  const avatar = user.av ? `${AVATAR_BASE}/${user.av}` : null;
  const href   = folderId ? `/?v=cep-js&=${encodeURIComponent(folderId)}` : null;

  const card = document.createElement('div');
  card.className = 'UserCard';
  card.style.background = tier.start === tier.end
    ? tier.start
    : `linear-gradient(0deg, ${tier.start}, ${tier.end})`;
  card.title = 'Rank: ' + tier.rank;

  // Avatar
  if (avatar) {
    const img = document.createElement('img');
    img.className = 'UserAvatar';
    img.src = avatar;
    img.alt = name;
    img.onerror = () => img.style.display = 'none';
    card.appendChild(img);
  }

  // Name + count
  const label = document.createElement('span');
  label.className = 'UserLabel';
  const nameSpan = document.createElement('span');
  nameSpan.className = 'UserName';
  nameSpan.textContent = name;
  const countSpan = document.createElement('span');
  countSpan.className = 'UserCount';
  countSpan.textContent = `(+${count})`;
  label.appendChild(nameSpan);
  label.appendChild(countSpan);

  // Wrap in link if page exists
  if (href) {
    const a = document.createElement('a');
    a.href = href;
    a.className = 'UserLink';
    a.appendChild(label);
    card.appendChild(a);
  } else {
    card.appendChild(label);
  }

  // Quote bubble on hover
  if (quote) {
    const bubble = makeBubble(quote);
    card.appendChild(bubble);
    card.addEventListener('mouseenter', () => bubble.classList.add('UserBubbleVisible'));
    card.addEventListener('mouseleave', () => bubble.classList.remove('UserBubbleVisible'));
  }

  return card;
}

export async function renderUsers(container, users) {
  const linker = await getLinker();

  // Fetch quotes for all users who have a page, in parallel
  const folderIds = users.map(u => linker[u.name] || linker[u.fn] || linker[u.fu] || null);
  await Promise.all(folderIds.map(id => id ? getQuotes(id) : null));

  const wrap = document.createElement('div');
  wrap.className = 'UserCards';

  users.forEach((user, i) => {
    const folderId = folderIds[i];
    const quotes   = folderId ? QUOTES_CACHE[folderId] : null;
    const quote    = quotes?.length ? quotes[Math.floor(Math.random() * quotes.length)] : null;
    wrap.appendChild(makeCard(user, folderId, quote, linker));
  });

  container.appendChild(wrap);
}
