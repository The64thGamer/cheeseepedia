import { createResource, createSignal, createEffect, createMemo, untrack, Show, For, Switch, Match } from 'solid-js';
import { searchPath, ResultList, loadSearchData, TagList, Pager, PAGE_SIZE } from './SearchPage';
import { loadFolderIDToTitleMap, loadTypeToIDList, loadViewsMap, loadDiscourseNews, loadDiscourseRecent, loadRecentFanVideos, loadRecentOfficialVideos, loadTaggedByIDs, loadFolderIDToTags } from './GlobalJsonCache';
import { fetchImage, fetchCardExcerpt, fetchMeta, fetchFolderIDFromTitle, fetchThumbnailWLinkToArticle, getFolderPath, fetchContent, convertStartDate, convertEndDate, fetchOld, resolveBracketLinks, highlightText } from './GlobalFunctions';
import { marked } from 'marked';
import { fetchLocationMap,formatDiscourseDate, loadKey, saveKey, fetchMapAll} from './GlobalFunctions';


const EXCLUDE = new Set(['photos','videos','reviews','user','steam comment','theories','meta','transcriptions']);
const TABS = {
  Articles: (t) => !EXCLUDE.has(t),
  Photos:   (t) => t === 'photos',
  Videos:   (t) => t === 'videos',
  Reviews:  (t) => t === 'reviews',
};
const NAV_GROUPS = [
  { name: 'Companies', tags: ['Pizza Time Theatre', 'ShowBiz Pizza Place', "Chuck E. Cheese's", 'Creative Engineering', 'Peter Piper Pizza', 'Discovery Zone', "Zapp's Bar & Grill", "Monterey's", 'Sally Corporation', "Jim Henson's Creature Shop", 'Walt Disney Imagineering'] },
  { name: 'Animatronics', tags: ['Animatronic Shows', 'Stage Variations', 'Animatronics', 'Animatronic Parts', 'Animatronic Preservation', 'Retrofits'] },
  { name: 'Showtapes', tags: ['Showtapes', 'Live Shows', 'ShowBiz Pizza Programs', 'Showtape Formats', 'Family Vision'] },
  { name: 'Locations', tags: ['Locations', 'Cancelled Locations', 'Remodels and Initiatives', 'Arcades and Attractions', 'Store Fixtures', 'Menu Items', 'Tickets', 'Tokens', 'Walkarounds', 'Employee Wear'] },
  { name: 'Merchandise', tags: ['In-Store Merchandise', 'Movies', 'Video Games', 'Products', 'Simulators'] },
  { name: 'Corporate', tags: ['Animatronic Control Systems', 'Programming Systems', 'Other Systems', 'Company Media', 'Puppets', 'Documents'] },
  { name: 'Advertising', tags: ['Social Media and Websites','Ad Vehicles', 'Events', 'Commercials'] },
  { name: 'History', tags: ['Companies/Brands', 'History', 'Characters', 'News Footage'] },
];
const MAX_RANDOM_CARDS = 15;
const LOGOS = {
    standard: 'CEPLogo.avif', dark: 'LogoDark.avif', light: 'LogoLight.avif',
    classic: 'LogoClassic.avif', funnet: 'LogoFunNet.avif', showbiz: 'LogoShowBiz.avif',
    fnaf: 'LogoFNaF.avif', italy: 'LogoPasqually.avif', winter: 'LogoWinter.avif',
    halloween: 'LogoHalloween.avif', pride: 'LogoPride.avif', anniversary: 'LogoAnniversary.avif',
  };
const EDITOR_URL = 'https://cheeseepedia.org/?v=cep-editor';
const SCOTT_AVATAR = '/viewers/cep-js/assets/Social Posts/Scott.jpg';

function ArticleItem(props) {
  const [meta] = createResource(() => fetchMeta(props.id));
  return <Show when={meta()}>{renderStandardArticle(meta())}</Show>;
}

function renderTaggedList(type, ids, data) {
  switch (type.toLowerCase()) {
    case 'photos':
      return (
        <div class="ResultCards">
          <For each={ids}>
            {(id) => <RenderedId id={id} render={renderCard} />}
          </For>
        </div>
      );
    case 'reviews':
    case 'steam comment':
      return (
        <div>
          <For each={ids}>
            {(id) => <RenderedId id={id} render={renderCard} />}
          </For>
        </div>
      );
    default:
      return (
        <For each={ids}>
          {(id) => <ResultList entry={{ id, found: null }} data={data} words={[]} tags={[]} />}
        </For>
      );
  }
}
const FAVICON_BASE = '/viewers/cep-js/compiled-json/favicons';

const stripProto = (s) => s.replace(/^https?:\/\/(www\.)?/, '');
const faviconName = (d) => stripProto(d).replace(/[^\w\-.]/g, '_') + '.png';
const isUrl = (s) => /^https?:\/\//i.test(s);
const getDomain = (url) => {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return null; }
};
const getOrigin = (url) => {
  try { return stripProto(new URL(url).origin); } catch { return null; }
};

function Citation(props) {
  const n = () => props.index + 1;
  const url = () => isUrl(props.cite);
  const domain = () => (url() ? getDomain(props.cite) : null);

  return (
    <div class="CitationItem" id={`cite-${n()}`}>
      <div class="CitationIcon">
        <Show when={domain()}>
          <img
            alt={domain()}
            src={`${FAVICON_BASE}/${faviconName(domain())}`}
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
        </Show>
      </div>
      <div class="CitationText">
        <Show
          when={url()}
          fallback={<span class="CitationTitle">{n()}. {props.cite}</span>}
        >
          <a class="CitationTitle" href={props.cite} target="_blank" rel="noopener">
            {n()}. {getOrigin(props.cite) || domain() || props.cite}
          </a>
          <a class="CitationUrl" href={props.cite} target="_blank" rel="noopener">
            {stripProto(props.cite)}
          </a>
        </Show>
      </div>
    </div>
  );
}

function Citations(props) {
  return (
    <Show when={props.citations?.length}>
      <div class="Citations">
        <h2>Citations</h2>
        <For each={props.citations}>
          {(cite, i) => <Citation cite={cite} index={i()} />}
        </For>
      </div>
    </Show>
  );
}
function ArticleTags(props) {
  const [idTags] = createResource(loadFolderIDToTags);

  return (
    <Show when={idTags()?.[props.folderID]?.length}>
      <h2>Tags</h2>
      <TagList tags={idTags()[props.folderID]} />
    </Show>
  );
}

function EditPageButton(props) {
  return (
    <div class="ArticleTabs">
      <a class="PinButton" href={`${EDITOR_URL}&=${props.folderID}`}>Edit Page</a>
    </div>
  );
}

function ArticleTabs(props) {
  const folderID = () => props.meta.folderID;
  const [active, setActive] = createSignal('Article');
  const [page, setPage] = createSignal(0);

  const selectTab = (name) => {
    setActive(name);
    setPage(0);
  };

  const pages = () => Math.max(1, Math.ceil((groups().get(active())?.length || 0) / PAGE_SIZE));
  const pageIds = () => (groups().get(active()) || []).slice(page() * PAGE_SIZE, (page() + 1) * PAGE_SIZE);

  const goToPage = (i) => {
    setPage(i);
    window.scrollTo({ top: 0 });
  };
  const [loaded] = createResource(() => Promise.all([loadTaggedByIDs(), loadSearchData()]));

  const groups = createMemo(() => {
  const result = new Map();
  if (!loaded()) return result;
  const [tagged, data] = loaded();
  for (const id of tagged[folderID()] || []) {
    const type = data.idType[id] || 'other';
    if (!result.has(type)) result.set(type, []);
    result.get(type).push(id);
  }
  const start = (id) => data.sortKeys?.[id]?.[0] || 0;
  for (const list of result.values()) {
    list.sort((a, b) => {
      const x = start(a);
      const y = start(b);
      if (x === y) return 0;
      if (!x) return 1;
      if (!y) return -1;
      return x - y;
    });
  }
  return result;
});

  const titleCase = (s) => s.replace(/\b\w/g, (c) => c.toUpperCase());

  const editLinks = () => [
    { name: 'Edit Page', href: `${EDITOR_URL}&=${folderID()}` },
    { name: 'Add Review', href: `${EDITOR_URL}&type=Review&tag=${folderID()}` },
    { name: 'Add Images', href: `${EDITOR_URL}&type=Photos&tag=${folderID()}` },
    { name: 'Add Video', href: `${EDITOR_URL}&type=Videos&tag=${folderID()}` },
  ];

  return (
  <>
    <div class="ArticleTabs">
      <select
        class="PinButton"
        value=""
        onChange={(e) => {
          const href = e.target.value;
          e.target.value = '';
          if (href) location.href = href;
        }}
      >
        <option value="" disabled hidden selected>Edit</option>
        <For each={editLinks()}>
          {(link) => <option value={link.href}>{link.name}</option>}
        </For>
      </select>
      <Show when={groups().size}>
        <button
          type="button"
          class="PinButton"
          classList={{ active: active() === 'Article' }}
          aria-pressed={active() === 'Article'}
          onClick={() => selectTab('Article')}
        >
          Article
        </button>
        <For each={[...groups()]}>
          {([type, ids]) => (
            <button
              type="button"
              class="PinButton"
              classList={{ active: active() === type }}
              aria-pressed={active() === type}
              onClick={() => selectTab(type)}
            >
              {titleCase(type)} ({ids.length})
            </button>
          )}
        </For>
      </Show>
    </div>
    <div style={{ display: active() === 'Article' ? '' : 'none' }}>
      {props.children}
    </div>
    <Show when={active() !== 'Article' && loaded() && groups().get(active())}>
      <div class="TaggedList fade-in">
        <Show when={page() > 0}>
          <Pager page={page()} pages={pages()} onPage={goToPage} />
        </Show>
        {renderTaggedList(active(), pageIds(), loaded()[1])}
        <Pager page={page()} pages={pages()} onPage={goToPage} />
      </div>
    </Show>
  </>
);
}

export function renderArticle(meta){

  if (meta.type === 'home') 
    return renderHome();
  if (meta.type === 'notfound') 
    return renderNotFound(meta.folderID);

  switch (meta.type) {
    case "Animatronics":
    case "Animatronic Shows":
    case "Animatronic Parts":
    case "Animatronic Preservation":
    case "Stage Variations":
    case "Walkarounds":
    case "Characters":
    case "Locations":
    case "Cancelled Locations":
    case "Showtapes":
    case "Showtape Formats":
    case "ShowBiz Pizza Programs":
    case "Family Vision":
    case "Live Shows":
    case "Puppets":
    case "Commercials":
    case "News Footage":
    case "Company Media":
    case "Movies":
    case "Transcriptions":
    case "Video Games":
    case "Menu Items":
    case "Tickets":
    case "Tokens":
    case "Documents":
    case "Events":
    case "Remodels and Initiatives":
    case "Retrofits":
    case "History":
    case "Arcades and Attractions":
    case "Companies/Brands":
    case "Animatronic Control Systems":
    case "Other Systems":
    case "Programming Systems":
    case "Simulators":
    case "Social Media and Websites":
    case "Ad Vehicles":
    case "In-Store Merchandise":
    case "Products":
    case "Employee Wear":
    case "Meta":
    case "Store Fixtures":
    case "Reviews":
    case "Steam Comment":
      return renderStandardArticle(meta);
    case "Videos":
      return renderVideoArticle(meta);
    case "Photos":
      return renderPhotoArticle(meta);
    default:
      return renderStandardArticle(meta);
    }
}

export function renderManualCard({ link, thumbnailSrc, title, dateText, views, excerpt = title }) {
  return (
    <div class={`Card fade-in`}>
      <div class={`CardImage`}>
        {thumbnailSrc ? (
          <a href={link}>
            <img src={thumbnailSrc} alt={title} loading="lazy" />
          </a>
        ) : (
          <a class="CardImageExcerpt" href={link}>{excerpt}</a>
        )}
      </div>
      <div class={`CardTextArea`}>
        <div class={`CardLink`}>
          <span>
            <a href={link}>{title}</a>
          </span>
        </div>
        <div class={`CardText`}>
          <strong>{dateText}</strong> 👁{views}
        </div>
      </div>
    </div>
  );
}

export function RenderedId(props) {
  const [out] = createResource(async () => props.render(await fetchMeta(props.id), props.words || []));
  return <Show when={out()}>{out()}</Show>;
}

export async function renderReviewCard(meta) {
  const link = meta.folderID ?? await fetchFolderIDFromTitle(meta.title);
  const [md, old, viewsMap] = await Promise.all([
    fetchContent(link).catch(() => ''),
    fetchOld(link).catch(() => ''),
    loadViewsMap(),
  ]);
  const body = await resolveBracketLinks(md || old);
  const emoji = meta.recommend === true ? '👍' : meta.recommend === false ? '👎' : '';
  const info = [
    convertStartDate(meta.startDate),
    meta.contributors?.join(', '),
    `👁 ${viewsMap[link] || 0}`,
  ].filter(Boolean).join(' · ');

  return (
    <div class="ReviewCard fade-in">
      <div class="ReviewTitle">
        <Show when={emoji}>
          <span class="ReviewEmoji">{emoji}</span>
        </Show>
        <a href={getFolderPath(link)}>{meta.title}</a>
      </div>
      <div class="ReviewMeta">{info}</div>
      <div class="ReviewBody" innerHTML={marked.parse(body)} />
    </div>
  );
}

function SteamCommentContent(props) {
  const m = () => props.meta;
  const hasPost = () => m().postTitle || m().postAuthor || m().postSubject || m().postTime || m().deleted === true;
  const hasComment = () => m().commentQuote || m().commentSubject || m().commentTime || m().commentQuoteAuthor;

  return (
    <>
      <Show when={hasPost()}>
        <div class="SteamPostBox">
          <div class="SteamAvatar"></div>
          <div class="SteamPostContent">
            <div class="PostHeaderMeta">
              <span class="PostAuthor">{m().postAuthor || 'Unknown User'}</span>
              <Show when={m().postTime}>
                <span class="PostTime">{m().postTime}</span>
              </Show>
              <Show when={m().deleted === true}>
                <span class="PostDeleted">[Deleted]</span>
              </Show>
            </div>
            <Show when={m().postTitle}>
              <h3 class="PostTitle">{m().postTitle}</h3>
            </Show>
            <Show when={m().postSubject}>
              <div class="PostSubject">{m().postSubject}</div>
            </Show>
          </div>
        </div>
      </Show>
      <Show when={hasComment()}>
        <div class="SteamPostBox">
          <div class="SteamAvatar" style={{ 'background-image': `url('${SCOTT_AVATAR}')` }}></div>
          <div class="SteamPostContent">
            <div class="CommentHeaderMeta">
              <span class="PostAuthor">
                <span style={{ color: '#aedd08' }}>Scott</span> <span style={{ color: '#e9d528' }}>[developer]</span>
              </span>
              <Show when={m().commentTime}>
                <span class="CommentTime">{m().commentTime}</span>
              </Show>
            </div>
            <Show when={m().commentQuote}>
              <blockquote class="CommentQuote">{m().commentQuote}</blockquote>
            </Show>
            <Show when={m().commentSubject}>
              <div class="CommentSubject">{m().commentSubject}</div>
            </Show>
          </div>
        </div>
      </Show>
    </>
  );
}

export async function renderSteamCommentCard(meta, words = []) {
  const link = meta.folderID ?? await fetchFolderIDFromTitle(meta.title);

  return (
    <div class="SteamCommentBody fade-in">
      <div class="SteamCommentHeader">
        <a href={getFolderPath(link)}>{highlightText(meta.title || link, words)}</a>
      </div>
      <div class="SteamCommentPreview">
        <SteamCommentContent meta={meta} />
      </div>
    </div>
  );
}

export function renderCard(meta, words = []) {
  switch ((meta.type || '').toLowerCase()) {
    case 'reviews':
      return renderReviewCard(meta, words);
    case 'steam comment':
      return renderSteamCommentCard(meta, words);
    default:
      return renderStandardCard(meta, words);
  }
}

export async function renderStandardCard(meta, words = []) {
  const link = await fetchFolderIDFromTitle(meta.title);
  const type = (meta.type || '').toLowerCase();
  const typeClass = type.replace(/s$/, '').replace(/[^a-z0-9]+/g, '-'); 

  let pageThumbnail = await fetchThumbnailWLinkToArticle(meta);
  if (!pageThumbnail) {
    pageThumbnail = await fetchCardExcerpt(meta);
  }

  const viewsMap = await loadViewsMap();

  let label = meta.title;
  if (type === 'photos') {
    try {
      const res = await fetch(`/content/${link}/content.md`);
      const isHtml = (res.headers.get('content-type') || '').includes('text/html');
      if (res.ok && !isHtml) {
        const text = (await res.text()).trim();
        if (text) label = text;
      }
    } catch {}
  }

  const t = typeClass ? ` type-${typeClass}` : '';

  return (
    <div class={`Card fade-in${t}`}>
      <div class={`CardImage${t}`}>{pageThumbnail}</div>
      <div class={`CardTextArea${t}`}>
        <div class={`CardLink${t}`}>
          <span>
            <a href={getFolderPath(link)}>{highlightText(label, words)}</a>
          </span>
        </div>
        <div class={`CardText${t}`}>
          <strong>
            {EXCLUDE.has(type)
              ? convertStartDate(meta.startDate)
              : <>{convertStartDate(meta.startDate)} – {convertEndDate(meta.endDate)}</>}
          </strong>
          {" "}👁{viewsMap[link]}
        </div>
      </div>
    </div>
  );
}

async function loadCardData(meta) {
  const link = await fetchFolderIDFromTitle(meta.title);
  const type = (meta.type || '').toLowerCase();
  const typeClass = type.replace(/s$/, '').replace(/[^a-z0-9]+/g, '-');
  const viewsMap = await loadViewsMap();

  let label = meta.title;
  if (type === 'photos') {
    try {
      const res = await fetch(`/content/${link}/content.md`);
      const isHtml = (res.headers.get('content-type') || '').includes('text/html');
      if (res.ok && !isHtml) {
        const text = (await res.text()).trim();
        if (text) label = text;
      }
    } catch {}
  }

  const dates = EXCLUDE.has(type)
    ? convertStartDate(meta.startDate)
    : `${convertStartDate(meta.startDate)} \u2013 ${convertEndDate(meta.endDate)}`;

  return { link, label, dates, views: viewsMap[link], t: typeClass ? ` type-${typeClass}` : '' };
}

export async function renderStandardCompact(meta, words = []) {
  const { link, label, dates, views, t } = await loadCardData(meta);
  const pageThumbnail = await fetchThumbnailWLinkToArticle(meta);

  return (
    <div class={`Compact fade-in${t}`}>
      <div class={`CompactImage${t}`}>{pageThumbnail}</div>
      <div class={`CompactText${t}`}>
        <div class={`CompactTitle${t}`}>
          <a href={getFolderPath(link)}>{highlightText(label, words)}</a>
        </div>
        <div class={`CompactMeta${t}`}>
          <strong>{dates}</strong> 👁{views}
        </div>
      </div>
    </div>
  );
}

export async function renderStandardList(meta, words = []) {
  const { link, label, dates, views, t } = await loadCardData(meta);

  return (
    <div class={`ListRow fade-in${t}`}>
      <a href={getFolderPath(link)}>{highlightText(label, words)}</a>
      <span class="ListMeta">
        <strong>{dates}</strong> 👁{views}
      </span>
    </div>
  );
}

export function renderNotFound(){
  return(
    <>
    <div class="404">
      You've found an article that doesn't exist yet! Click the logo to head back home.
    </div>
    </>
  )
}

async function loadVideoCards(loader) {
  const ids = await loader();
  const metas = await Promise.all(ids.map((id) => fetchMeta(id).catch(() => null)));
  return Promise.all(metas.filter(Boolean).map((m) => renderStandardCard(m)));
}

export function renderHome() {
  const [news] = createResource(loadDiscourseNews);
  const [recent] = createResource(loadDiscourseRecent);
  const [map] = createResource(fetchMapAll);
  const [officialVideos] = createResource(() => loadVideoCards(loadRecentOfficialVideos));
  const [fanVideos] = createResource(() => loadVideoCards(loadRecentFanVideos));

  return (
    <>
      <br/>
      <div class="Homepage">
        <center>
          Welcome to Cheese-E-Pedia! This unofficial wiki is the archive for all things animatronics!
          <br/>
          Use the search above to explore our site! Something not listed here? Help contribute or <a href="/?v=cep-editor">create a new page!</a>
          <br/><br/>
          <strong>IMPORTANT! You are using an in-development test version of the site, <a href="/?v=cep-js">click here</a> to return to the default viewer! Otherwise thanks for testing this out, I hope this will give you a better experience searching and browsing through the pages. Leave feedback on the <a href="https://forum.cheeseepedia.org/t/cep-solid-wiki-overhaul/485/43">forum thread</a> as this will become the default by likely end of year!</strong>
        </center>

        <h2>News</h2>
        <Tabs
          tabs={[
            {
              name: 'The News',
              content: () => (
                <div class="Carousel">
                  <For each={news() || []}>
                    {(item) =>
                      renderManualCard({
                        link: item.url,
                        thumbnailSrc: item.image_url,
                        title: item.title,
                        dateText: formatDiscourseDate(item.created_at),
                        views: item.views,
                      })
                    }
                  </For>
                </div>
              ),
            },
            {
              name: 'Social Media',
              content: () => (
                <div class="Carousel">
                  <For each={officialVideos() || []}>{(card) => card}</For>
                </div>
              ),
            },
          ]}
        />

        <h2>Wiki</h2>
        <Tabs
          tabs={[
            {
              name: 'Navigation',
              content: () => (
                <nav class="Nav">
                  <For each={NAV_GROUPS}>
                    {(group) => (
                      <details>
                        <summary><a href={searchPath(group.tags)}>{group.name}</a></summary>
                        <div>
                          <For each={group.tags}>
                            {(tag) => <a href={searchPath([tag])}>{tag}</a>}
                          </For>
                        </div>
                      </details>
                    )}
                  </For>
                </nav>
              ),
            },
            {
              name: 'Map',
              content: () => <Show when={!map.loading && map()}>{map()}</Show>,
            }
          ]}
        />

        <h2>Community</h2>
        <Tabs
          tabs={[
            {
              name: 'Fan Videos',
              content: () => (
                <div class="Carousel">
                  <For each={fanVideos() || []}>{(card) => card}</For>
                </div>
              ),
            },
            {
              name: 'New Posts',
              content: () => (
                <div class="Carousel">
                  <For each={recent() || []}>
                    {(item) =>
                      renderManualCard({
                        link: item.url,
                        thumbnailSrc: item.image_url,
                        title: item.title,
                        dateText: formatDiscourseDate(item.created_at),
                        views: item.views,
                      })
                    }
                  </For>
                </div>
              ),
            }
          ]}
        />
      </div>
    </>
  );
}
export function renderFooter(){
  return(
    <>
    <div class="Footer">
          Last build on: <span id="StatBuildDate">???</span>. Content is available under CC BY-SA 4.0. and rehostable. Cheese-E-Pedia is not associated with any person, company, or entity in its articles. <a href="https://youtu.be/Vce1hFNVI1o">All</a> rights <a href="https://vyletpony.bandcamp.com/track/falling-in-love-with-a-corporate-illustration">reserved</a> for <a href="https://youtu.be/y8LVM3rVSM4">our</a> lovely <a href="https://vyletpony.bandcamp.com/track/webpunk-ft-nekosnicker">trans</a> queers <a href="https://youtu.be/hdus_rz7O3o">forever</a>! <a href="https://www.tumblr.com/ytpforyouandme/728755424298401793">Corporations</a> should rot in <a href="https://stomachbook.bandcamp.com/track/my-diorama">hell</a>, keep things <a href="https://youtu.be/tkUgOT22F5s">independent</a> and <a href ="https://crimethinc.com/">community</a> focused, and no <a href="https://consumerrights.wiki/w/Main_Page">gatekeepers!</a>
          <br /><br />
          <a href ="/?v=cep-solid&=75z6oyfn7xf7t4ol">About</a> • <a href ="/?v=cep-solid&=434ngf34ngjktegrgt">Privacy Policy</a> • <a href ="/?v=cep-solid&=o2eldeduwff18fw2">Rules</a> • <a href ="/?v=cep-solid&=v144sposbsi3z29v">FAQ</a> • <a href ="/?v=cep-solid&page=stats">Nerd Stuff</a> • <a href ="/?v=cep-solid&=434ngf34ngjktegrfh">Manual</a> • <a href ="/?v=cep-solid&page=settings">Settings</a>
      </div>
    </>
  )
}

const RANDOM_PHRASES = [
  "CEC Master is watching",
  "Set for a remodel soon!",
  "Set to be demolished soon!",
  "Unacceptable Crust!",
  "Hasta la pasta!",
  "Born on May 17th, 445 B.P. (Before Pasqually)",
  "Sponsored by Winchester Grandma",
  "Formerly Pizza Time Techs",
  "Formerly Chuck-E-Pedia",
  "DRUM SOLO",
  "Poggers...",
  "I was afraid to speak when I was just a lad",
  "Turn off the fruitcake dog!",
  "Bring back Crusty!",
  "Bring back Rick Rat!",
  "Sanctioned by the city of Irving!",
  "Not to be confused with that other site",
  "Fully open sourced!",
  "We canonize trans Beach Bear",
  "Conceptually Unified!",
  "Orange-carpet free!",
  "Sorry about your local",
  "Forever indebted to Miraheze",
  "The articles get a bit quirky at night",
  "Hello? Hello hello?",
  "Thaaaat's me!",
  "Better than any university!",
  "For animatronic lovers",
  "For Uncle Klunk lovers",
  "DONT. SMOKE. CRAYOLAS.",
  "Found out by the dumpster!",
  "Full of non-merch!",
  "Not an encyclopedia of cheese",
  "Formerly an encyclopedia of cheese",
  "Read by Mark Kupferman!",
  "Written by employees!",
  "Save Your Family.",
  "Scan or Ban",
  "Come for the cheese, stay for the pedia!",
  "Nolan did nothing to shape PTT! It was Gene Landrum and Bob Black!",
  "The only (semi complete) showtape archive!",
  "We'll finish the articles some day!",
  "Ar ar ar ar ar",
  "The #10th source for animatronic information",
  "Archive everything!!!",
  "Not to be confused for the FNaF Wiki",
  "Formerly a MediaWiki site!",
  "Wow thats uh, a lot of articles.",
  "Home of your favorite rockabilly relative",
  "Publishers of 'What is This Thing on My Head' by Dook Larue",
  "Able to make every sound in the whole world at the same time but backwards.",
  "The secret FNaF lore!",
  "Just a theory!",
  "The pizza may be recycled but not the articles!",
  "Lovingly crafted by the community",
  "Fixing names like 'Phase 4' and 'The Shelf' since 2022.",
  "The cult of Pasqually",
  "Powered by Gas-O-Hol!",
  "Featured in the news!",
  "The Mult-Eye-Media En-Cy-Clopedia Chuck E. Chees-Ia",
  "Your name is 'Exit'?",
  "Powered by the Awesome Adventure Machine",
  "Paper or Plastic?",
  "Our Community Garden",
  "Santa Lucia! I'ma goin'a crazy! I quit! I go back to Italia!",
  "Pizza, Pizza, Pizza in the Air!",
  "Answers how many electrons can fit in a teaspoon.",
  "Dumpster Diving Experts",
  "Strike It Up FOUND MEDIA!! youtube.com/watch?v=dQw4w9WgXcQ",
  "Down the Rabbit Hole, Into the Pit",
  "I'm- the star of the show, you are -not.",
  "Mr. Munch is ticklin' the cheese.",
  "There's Drum, pasquallin away!",
  "As heard on K-PIZZA and K-CEC",
  "You gave Larry a laserbeam?!?",
  "Pasqually has been banned from Amatuer Hour",
  "Pasqually has canonically committed tax fraud",
  "PROTECT TRANS KIDS!",
  "TRANS RIGHTS!",
  "Even we can't explain the Fun Pass",
  "You're gonna buy the Fun Pass OR ELSE",
  "The false prophet will come bearing the Fun Pass",
  "YOU get a Fun Pass and YOU get a Fun Pass",
  "Mere days from bankrupcy",
  "oh hi mark",
  "Secretly a dough mixer",
  "Home of the Bankrupcy Believers",
  "For the People of the Pizza",
  "Home of the secret last Road Stage!",
  "There's settings on the bottom right!",
  "Featuring your favorite taxidermies!",
  "Not AI slop!",
  "Where lost media becomes found",
  "Home of The Big Cheese",
  "Falling in Love With a Corporate Illustration",
  "Companies are not your friend, steal everything.",
  "Love yourself",
  "Chuck A.I. Cheese",
  "CEC AI World",
  "Let's replace Mark and David with AI",
  "Alright, alright! Who's got my master remote?",
  "Please DON'T call 1-800-NO-MO-ADS today!",
  "Funner than ever!",
  "Who writes this stuff?!",
  "Will be finished by the summer of 2011!",
  "Stay out of chimneys, they could be dangerous.",
  "In Pizza We Trust",
  "Fun Fact: Pasqually's mustache is fake!",
  "What'yall doin'? Playin' games? Eatin' pizza?",
  "1 Minute 'Til Next Show",
  "That's a Deal!",
  "BLLUUUUUUUUUEEEEEEEEEE!!!!",
  "Yeah, we've just been takin' care of business",
  "It's Bluescreen time! Yeah!",
  "Sit back, relax, and soak up the best of CEC TV",
  "Have fun! Be cool!",
  "Don't hurry to worry!",
  "Thank you, thank you Mr. Munch",
  "Chuck E. chose the cheddar and he chewed the cheese he chose",
  "There should be seatbelts in this thing!",
  "WARNING What you are about to see may shock you.",
  "If my lips ain't movin' it ain't working!",
  "Welcome to Showbiz it's all happening here!",
  "Destroy these props as they will not be used again",
  "Peekaboo, we caught you!",
  "If you are here for a birthday party please return to your table in the showroom",
  "Lightly sauce the pizza dough and sprinkle the cheese. Then, choose the toppings of your choice and place evenly over the top of the pizza.",
  "Unbolt Billy Bob and remove from the stage",
  "randy: no fun allowed",
  "Bankruptcy Imminent",
  "cereal... pajamas... movie...",
  "I stopped worrying about what my legacy with the Rock-A-Fire Explosion would be before I found out there were fans.",
  "Majorly Magic",
  "Where A Historian Can Be A Historian",
  "Hater of Discord",
  "It's called a residency.",
  "All Pages, Zero Tokens",
  "Let the enter-train-ment begin!",
  "Every Guest Leaves Happy",
  "Just another Pizza Place...",
  "The Secrets of the Mimic",
  "You always come back.",
  "6AM",
  "Unaffiliated with freddysfanzone.com",
  "What a deceptive calling, I knew Phase 4 was a lie the moment I heard it, obviously.",
  "Help Wanted",
  "My name is David, Dad, I want some bankruptcy, David, that is my name.",
  "They call me The Bomb Thief, uh",
  "Originator of The Goongalar (really)",
  "Honey you mean Helpules",
  "Rule 6: Don't touch Freddy.",
  "Please shout out the contributors if you're doing research for a video!",
  "Toy Chica is William Afton",
  "FNaF: Making more money than CEC since 2014.",
  "We were here before Adventure World became the new 2.0",
  "RIP /cep-js/"
];

const DATE_PHRASES = {
  "01-01": "Enjoy A New Year!",
  "01-04": "Happy Rock-afire Replay deletion Day!",
  "01-06": "RIP Kansas City State Line, you died 3 times.",
  "02-14": "Happy Valentines Day from Cheese-E-Pedia!",
  "03-01": "Happy Birthday Mr. Munch!",
  "03-02": "Today's the anniversary of the first ShowBiz location, Kansas City!",
  "03-25": "Today's the anniversary of the CEC Future Planning Survey!",
  "04-20": "Haha look at the date",
  "05-17": "Today's the anniversary of the first CEC location, Winchester!",
  "05-27": "Happy Birthday Helen Henny!",
  "06-01": "Happy Pride Month! Trans Rights!",
  "06-23": "Happy Birthday Billy Bob!",
  "07-01": "Happy Wrath Month! Trans Rights!",
  "07-14": "Today's the anniversary of Cheese-E-Pedia!",
  "07-24": "Today's the anniversary of Reel to Real!",
  "08-08": "Happy Anniversary FNaF!",
  "08-25": "Happy Rock-afire Replay Anniversary!",
  "08-26": "Happy Birthday Jasper T. Jowls!",
  "09-26": "Happy Anniversary to CEC's 2030 Credit Extension, RIP Bankruptcy Believers.",
  "09-27": "Happy Anniversary RAE Documentary!",
  "10-05": "Happy Anniversary CEC In The Galaxy 5000!",
  "10-27": "Happy Anniversary FNaF Movie!",
  "10-31": "Happy Halloween and Chuck E. Cheese Pizza (Mall Chain) Anniversary!",
  "11-06": "Happy Infinite Fun Pass Glitch Day!",
  "11-07": "Happy CEC Adventure World Anniversary!",
  "11-10": "Happy Anniversary of the first Legacy Location re-opening, Northridge!",
  "11-13": "Look for the Gummy Bear album in stores on November 13th, with lots of music, videos and extras.",
  "11-27": "Happy Chuck E. Cheese Christmas Anniversary!",
  "12-02": "Today's the anniversary of the second CEC location, Kooser!",
  "12-05": "Happy Anniversary FNaF Movie 2!",
  "12-09": "Happy Reel to Real Cease & Desist Day!",
  "12-12": "Happy Birthday Pasqually!",
  "12-25": "Merry Christmas from Cheese-E-Pedia!",
  "12-31": "Happy New Year from Cheese-E-Pedia!",
};

function pickSplash() {
  const now = new Date();
  const key = `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const phrase = DATE_PHRASES[key] ?? RANDOM_PHRASES[Math.floor(Math.random() * RANDOM_PHRASES.length)];
  return `"${phrase}"`;
}

function fitText(el) {
  el.style.fontSize = '';
  let size = parseFloat(getComputedStyle(el).fontSize);
  while (el.scrollWidth > el.clientWidth && size > 8) {
    size -= 1;
    el.style.fontSize = `${size}px`;
  }
}

export function renderSplashText() {
  const text = pickSplash();
  return (
    <div
      class="SplashText"
      ref={(el) => {
        const start = () => {
          if (!el.isConnected) return requestAnimationFrame(start);
          fitText(el);
          new ResizeObserver(() => fitText(el)).observe(el);
        };
        requestAnimationFrame(start);
      }}
    >
      {text}
    </div>
  );
}

export function renderHeader() {
  let file = LOGOS.standard;
  try {
    const t = localStorage.getItem('cep-theme') || 'standard';
    const c = JSON.parse(localStorage.getItem('cep-theme-custom') || 'null');
    file = (t === 'custom' && c?.['--logo']) ? c['--logo'] : (LOGOS[t] || LOGOS.standard);
  } catch {}

  return (
    <>
      <div class="Header">
        {renderSplashText()}
        <a href="/?v=cep-solid" class="Logo">
          <img src={'/viewers/cep-js/assets/Logos/' + file} alt="Cheesepedia" />
        </a>
        <div class="FlavorText">
          Now at <strong><span id="StatArticles">????</span></strong> articles contributed by <strong><span id="StatContributors">???</span></strong> users.
          <br />
          Discussions available on the <strong><a href="https://forum.cheeseepedia.org/">Forums!</a></strong>
        </div>
      </div>
    </>
  );
}

function Tabs(props) {
  const [active, setActive] = createSignal(props.tabs[0].name);

  return (
    <>
      <div>
        <For each={props.tabs}>
          {(t) => (
            <button
              type="button"
              class="PinButton"
              classList={{ active: active() === t.name }}
              aria-pressed={active() === t.name}
              onClick={() => setActive(t.name)}
            >
              {t.name}
            </button>
          )}
        </For>
      </div>
      <For each={props.tabs}>
        {(t) => (
          <div class="TabPanel" style={{ display: active() === t.name ? '' : 'none' }}>
            {t.content()}
          </div>
        )}
      </For>
    </>
  );
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function renderRandomCards() {
  const [tab, setTab] = createSignal(
  loadKey('sRandomTab', 'Articles', (v) => Object.hasOwn(TABS, v))
  );

  const state = {};
  for (const name of Object.keys(TABS)) {
    const [entries, setEntries] = createSignal([]);
    const [loaded, setLoaded] = createSignal(false);
    state[name] = { entries, setEntries, loaded, setLoaded, started: false };
  }
  const current = () => state[tab()];

    let dataPromise;
  const getData = () =>
    (dataPromise ??= Promise.all([loadTypeToIDList(), loadViewsMap()]));

  async function load(name) {
    const s = state[name];
    if (s.started) return;
    s.started = true;

    const matches = TABS[name];
    const [typeMap, viewsMap] = await getData();

    const ids = shuffle(
    Object.entries(typeMap)
    .filter(([type]) => matches(type))
    .flatMap(([, list]) => list)
    );
    let count = 0;

    for (let i = 0; i < ids.length && count < MAX_RANDOM_CARDS; i += 20) {
      const metas = await Promise.all(
        ids.slice(i, i + 20).map((id) => fetchMeta(id).catch(() => null))
      );

      const picked = [];
      for (let k = 0; k < metas.length && count < MAX_RANDOM_CARDS; k++) {
        if (!metas[k]) continue;
        picked.push({ id: ids[i + k], meta: metas[k] });
        count++;
      }

      await Promise.all(
        picked.map(async ({ id, meta }) => {
          const card = await renderStandardCard(meta);
          const views = viewsMap[id];
          s.setEntries((prev) => {
            const next = [...prev, { views, card }];
            next.sort((a, b) => b.views - a.views);
            return next;
          });
        })
      );
    }
    s.setLoaded(true);
  }

  

  createEffect(() => {
    const t = tab();
    saveKey('sRandomTab', t);
    untrack(() => load(t));
  });

  return (
    <>
      <h2>Cheese-E-Shuffle</h2>
      <div>
        <For each={Object.keys(TABS)}>
          {(name) => (
            <button
              type="button"
              class="PinButton"
              classList={{ active: tab() === name }}
              aria-pressed={tab() === name}
              onClick={() => setTab(name)}
            >
              {name}
            </button>
          )}
        </For>
      </div>
      <div id="RandomCards" class="Carousel">
        <For each={current().entries()}>{(e) => e.card}</For>
        <Show when={!current().loaded() && current().entries().length === 0}>
          <div>Loading…</div>
        </Show>
        <Show when={current().loaded() && current().entries().length === 0}>
          <div>Nothing found.</div>
        </Show>
      </div>
    </>
  );
}

function InfoboxList(props) {
  return (
    <Show when={props.items?.length}>
      <div class="infobox-list">
        <strong>{props.title}:</strong>
        <ul>
          <For each={props.items}>{props.children}</For>
        </ul>
      </div>
    </Show>
  );
}



function getEmbed(rawUrl) {
  if (!rawUrl) return null;

  let url;
  try {
    url = new URL(rawUrl.trim());
  } catch {
    return null;
  }
  if (!/^https?:$/.test(url.protocol)) return null;

  const host = url.hostname.replace(/^www\./, '');
  const parts = url.pathname.split('/').filter(Boolean);
  if (host === 'youtu.be' && parts[0]) {
    return { kind: 'iframe', src: `https://www.youtube-nocookie.com/embed/${parts[0]}` };
  }
  if (host.endsWith('youtube.com')) {
    let id = url.searchParams.get('v');
    if (!id && ['embed', 'shorts', 'live'].includes(parts[0])) id = parts[1];
    if (id) return { kind: 'iframe', src: `https://www.youtube-nocookie.com/embed/${id}` };
  }
  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const id = parts.find((p) => /^\d+$/.test(p));
    if (id) return { kind: 'iframe', src: `https://player.vimeo.com/video/${id}` };
  }
  if (host === 'archive.org' && ['details', 'embed'].includes(parts[0]) && parts[1]) {
    return { kind: 'iframe', src: `https://archive.org/embed/${parts[1]}` };
  }
  if (host === 'dailymotion.com' && parts[0] === 'video' && parts[1]) {
    return { kind: 'iframe', src: `https://www.dailymotion.com/embed/video/${parts[1]}` };
  }
  if (host === 'dai.ly' && parts[0]) {
    return { kind: 'iframe', src: `https://www.dailymotion.com/embed/video/${parts[0]}` };
  }
  if (host === 'streamable.com' && parts[0]) {
    const id = parts[0] === 'e' ? parts[1] : parts[0];
    if (id) return { kind: 'iframe', src: `https://streamable.com/e/${id}` };
  }
  return { kind: 'link', src: url.href };
}

function VideoEmbed(props) {
  const embed = () => getEmbed(props.url);

  return (
    <Show when={embed()}>
      <div class="VideoEmbed fade-in">
        <Switch>
          <Match when={embed().kind === 'iframe'}>
            <iframe
              src={embed().src}
              title="Video"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowfullscreen
              referrerpolicy="strict-origin-when-cross-origin"
            />
          </Match>
          <Match when={embed().kind === 'video'}>
            <video src={embed().src} controls preload="metadata" />
          </Match>
          <Match when={embed().kind === 'link'}>
            <a class="VideoLink" href={embed().src} target="_blank" rel="noopener noreferrer">
              {embed().src}
            </a>
          </Match>
        </Switch>
      </div>
    </Show>
  );
}

export function renderVideoArticle(meta) {
  const [thumb] = createResource(async () =>
    fetchImage(await fetchFolderIDFromTitle(meta.pageThumbnailFile))
  );

  const [map] = createResource(() => fetchLocationMap(meta));

  const [content] = createResource(async () => {
    const id = meta.folderID ?? await fetchFolderIDFromTitle(meta.title?.trim());
    const [md, old] = await Promise.all([
      fetchContent(id).catch(() => ''),
      fetchOld(id).catch(() => ''),
    ]);
    return {
      md: await resolveBracketLinks(md),
      old: await resolveBracketLinks(old),
    };
  });

  return (
    <>
      <h1 class="article-title">{meta.title}</h1>
      <EditPageButton folderID={meta.folderID} />
      <div class="ArticleBody type-video">
        <VideoEmbed url={meta.pageThumbnailVideo} />
        <div class="content fade-in type-video">
          <h2>Video Transcription</h2>
          <Show when={!content.loading} fallback={<div>Loading…</div>}>
            <Show
              when={content()?.md || content()?.old}
              fallback={<div class="NoContent fade-in">No transcription provided by source.</div>}
            >
              <Show when={!content().md && content().old}>
                <div class="OldWarning">
                  The following article content is unsourced, in an old formatting, and needs to be rewritten. Any new text added to the page will hide this previous content.
                </div>
              </Show>
              <div class="fade-in" innerHTML={marked.parse(content().md || content().old)} />
            </Show>
          </Show>
        </div>
        <Citations citations={meta.citations} />
        <ArticleTags folderID={meta.folderID}/>
      </div>
    </>
  );
}

export async function renderPhotoCompact(meta) {
  const { link, dates, views } = await loadCardData(meta);
  return (
    <div class="PhotoCompact fade-in">
      <a href={getFolderPath(link)} class="PhotoCompactImage">
        <img alt={meta.title} loading="lazy" src={`/content/${link}/photo.avif`} />
      </a>
      <div class="PhotoCompactDate"><strong>{dates}</strong> 👁 {views || 0}</div>
    </div>
  );
}

export async function renderPhotoList(meta) {
  const link = meta.folderID ?? await fetchFolderIDFromTitle(meta.title);
  return (
    <div class="PhotoListItem fade-in">
      <a href={getFolderPath(link)}>
        <img alt={meta.title} loading="lazy" class="PhotoListImg" src={`/content/${link}/photo.avif`} />
      </a>
    </div>
  );
}

export function renderCompact(meta, words = []) {
  switch ((meta.type || '').toLowerCase()) {
    case 'photos':
      return renderPhotoCompact(meta);
    default:
      return renderStandardCompact(meta, words);
  }
}

export function renderList(meta, words = []) {
  switch ((meta.type || '').toLowerCase()) {
    case 'photos':
      return renderPhotoList(meta);
    default:
      return renderStandardList(meta, words);
  }
}

export function renderPhotoArticle(meta) {
  const [photo] = createResource(() => fetchThumbnailWLinkToArticle(meta));

  const [content] = createResource(async () => {
    const id = meta.folderID ?? await fetchFolderIDFromTitle(meta.title?.trim());
    const [md, old] = await Promise.all([
      fetchContent(id).catch(() => ''),
      fetchOld(id).catch(() => ''),
    ]);
    return {
      md: await resolveBracketLinks(md),
      old: await resolveBracketLinks(old),
    };
  });

  return (
    <>
      <h1 class="article-title">{meta.title}</h1>
      <EditPageButton folderID={meta.folderID} />
      <div class="ArticleBody type-photo">
        <div class="ArticlePhoto fade-in type-photo">
          <Show when={!photo.loading && photo()}>{photo()}</Show>
        </div>
        <div class="content fade-in type-photo">
          <h2>Image Description</h2>
          <Show when={!content.loading} fallback={<div>Loading…</div>}>
            <Show
              when={content()?.md || content()?.old}
              fallback={<div class="NoContent fade-in">No description provided. Help write one for accessibility.</div>}
            >
              <Show when={!content().md && content().old}>
                <div class="OldWarning">
                  The following article content is unsourced, in an old formatting, and needs to be rewritten. Any new text added to the page will hide this previous content.
                </div>
              </Show>
              <div class="fade-in" innerHTML={marked.parse(content().md || content().old)} />
            </Show>
          </Show>
        </div>
        <Citations citations={meta.citations} />
        <ArticleTags folderID={meta.folderID}/>
      </div>
    </>
  );
}

export function renderStandardArticle(meta) {
  const [thumb] = createResource(async () =>
    fetchImage(await fetchFolderIDFromTitle(meta.pageThumbnailFile))
  );

  const [map] = createResource(() => fetchLocationMap(meta));

  const [content] = createResource(async () => {
    const id = meta.folderID ?? await fetchFolderIDFromTitle(meta.title?.trim());
    const [md, old] = await Promise.all([
      fetchContent(id).catch(() => ''),
      fetchOld(id).catch(() => ''),
    ]);
    return {
      md: await resolveBracketLinks(md),
      old: await resolveBracketLinks(old),
    };
  });

  return (
    <>
      <h1 class="article-title">{meta.title}</h1>
      <ArticleTabs meta={meta}>
      <div class="ArticleBody">
        <div class="infobox fade-in">
          <div class="infobox-thumbnail">
            <Show when={!thumb.loading && thumb()}>{thumb()}</Show>
          </div>
          <table>
            <tbody>
              <tr>
                <td><strong>Operated</strong></td>
                <td>
                  {convertStartDate(meta.startDate)}<div class="emoji">🚧</div><br />
                  {convertEndDate(meta.endDate)}<div class="emoji">☠️</div>
                </td>
              </tr>
              <Show when={meta.sqft}>
                <tr>
                  <td><strong>Floorspace</strong></td>
                  <td>{meta.sqft}ft<sup>2</sup><div class="emoji">📐</div></td>
                </tr>
              </Show>
            </tbody>
          </table>
          <InfoboxList title="Remodels" items={meta.remodels}>
            {(r) => (
              <li>
                <strong>{r.n}</strong> ({convertStartDate(r.s)})
              </li>
            )}
          </InfoboxList>

          <InfoboxList title="Stages" items={meta.stages}>
            {(s) => (
              <li>
                <strong>{s.n}</strong> ({convertStartDate(s.s)} – {convertEndDate(s.e)})
                <Show when={s.desc}>
                  <div class="infobox-desc">{s.desc}</div>
                </Show>
              </li>
            )}
          </InfoboxList>

          <InfoboxList title="Franchisees" items={meta.franchisees}>
            {(f) => (
              <li>
                <strong>{f.n}</strong> ({convertStartDate(f.s)} – {convertEndDate(f.e)})
              </li>
            )}
          </InfoboxList>

          <InfoboxList title="Downloads" items={meta.downloadLinks}>
            {(d) => (
              <li>
                <a href={d.url} target="_blank" rel="noopener noreferrer">{d.label}</a>
              </li>
            )}
          </InfoboxList>
          <InfoboxList title="Showtape Formats" items={meta.showtapeFormats}>
            {(f) => <li>{f}</li>}
          </InfoboxList>
          <Show when={meta.credits?.length}>
            <div class="infobox-list">
              <strong>Credits:</strong>
              <ul>
                <For each={meta.credits}>
                  {(c) => <li><strong>{c.role}:</strong> {c.n}</li>}
                </For>
              </ul>
            </div>
          </Show>
          <Show when={!map.loading && map()}>
            {map()}
          </Show>
        </div>
        <div class="content fade-in">
          <Show when={!content.loading} fallback={<div>Loading…</div>}>
            <Show
              when={content()?.md || content()?.old}
              fallback={<div class="NoContent fade-in">No article content. Come write some!</div>}
            >
              <Show when={!content().md && content().old}>
                <div class="OldWarning">
                  The following article content is unsourced, in an old formatting, and needs to be rewritten. Any new text added to the page will hide this previous content.
                </div>
              </Show>
              <div class="fade-in" innerHTML={marked.parse(content().md || content().old)} />
            </Show>
          </Show>
        </div>
        <Citations citations={meta.citations} />
      </div>
      </ArticleTabs>
      <ArticleTags folderID={meta.folderID}/>
    </>
  );
}