import { createResource, createSignal, createEffect, untrack, Show, For,Switch, Match } from 'solid-js';
import { fetchImage, fetchCardExcerpt, fetchMeta, fetchFolderIDFromTitle, fetchThumbnailWLinkToArticle, getFolderPath, fetchContent, convertStartDate, convertEndDate, fetchOld, resolveBracketLinks } from './GlobalFunctions';
import { marked } from 'marked';
import { loadFolderIDToTitleMap,loadTypeToIDList, loadViewsMap, loadNews, loadRecentFanVideos,loadRecentOfficialVideos }  from './GlobalJsonCache'
import { fetchLocationMap,formatDiscourseDate, loadKey, saveKey, fetchMapAll} from './GlobalFunctions';
import { Search } from './Search';

const EXCLUDE = new Set(['photos','videos','reviews','user','steam comments','theories','meta','transcriptions']);
const TABS = {
  Articles: (t) => !EXCLUDE.has(t),
  Photos:   (t) => t === 'photos',
  Videos:   (t) => t === 'videos',
  Reviews:  (t) => t === 'reviews',
};
const MAX_RANDOM_CARDS = 15;
const LOGOS = {
    standard: 'CEPLogo.avif', dark: 'LogoDark.avif', light: 'LogoLight.avif',
    classic: 'LogoClassic.avif', funnet: 'LogoFunNet.avif', showbiz: 'LogoShowBiz.avif',
    fnaf: 'LogoFNaF.avif', italy: 'LogoPasqually.avif', winter: 'LogoWinter.avif',
    halloween: 'LogoHalloween.avif', pride: 'LogoPride.avif', anniversary: 'LogoAnniversary.avif',
  };

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
    case "Costumed Characters":
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
    case "Corporate Documents":
    case "Promotional Material":
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
    case "Steam Comments":
      return renderStandardArticle(meta);
    case "Videos":
      return renderVideoArticle(meta);
    case "Photos":
      return renderPhotoArticle(meta);
    default:
      return renderStandardArticle(meta);
    }
}

export function renderManualCard({ link, thumbnailSrc, title, dateText, views}) {
  return (
    <div class={`Card fade-in`}>
      <div class={`CardImage`}>
        <a href={link}>
          <img src={thumbnailSrc} alt={title} loading="lazy" />
        </a>
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

export async function renderStandardCard(meta) {
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
            <a href={getFolderPath(link)}>{label}</a>
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

export async function renderStandardCompact(meta) {
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
            <a href={getFolderPath(link)}>{label}</a>
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

export async function renderStandardList(meta) {
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
            <a href={getFolderPath(link)}>{label}</a>
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
  const [news] = createResource(loadNews);
  const [map] = createResource(fetchMapAll);
  const [officialVideos] = createResource(() => loadVideoCards(loadRecentOfficialVideos));
  const [fanVideos] = createResource(() => loadVideoCards(loadRecentFanVideos));

  return (
    <>
      <div class="Homepage">
        <center>
          Welcome to Cheese-E-Pedia! This unofficial wiki is the archive for all things animatronics!
          <br />
          Use the search above to explore our site! Something not listed here? Help contribute or <a href="/?v=cep-editor">create a new page!</a>
        </center>

        <h2>News</h2>
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
        <div class="Carousel">
          <For each={officialVideos() || []}>{(card) => card}</For>
        </div>

        <h2>Wiki</h2>
        <Show when={!map.loading && map()}>
          {map()}
        </Show>
        <h2>Community</h2>
        <div class="Carousel">
          <For each={fanVideos() || []}>{(card) => card}</For>
        </div>
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
        <div class="SplashText" id="SpashText">. . .</div>
        <a href="/?v=cep-solid" class="Logo">
          <img src={'/viewers/cep-js/assets/Logos/' + file} alt="Cheesepedia" />
        </a>
        <div class="FlavorText">
          Now at <strong><span id="StatArticles">????</span></strong> articles contributed by <strong><span id="StatContributors">???</span></strong> users.
          <br />
          Discussions available on the <strong><a href="https://forum.cheeseepedia.org/">Forums!</a></strong>
        </div>
        <div class="Search"><Search /></div>
      </div>
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
    const id = await fetchFolderIDFromTitle(meta.title);
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
      </div>
    </>
  );
}

export function renderPhotoArticle(meta) {
  const [photo] = createResource(() => fetchThumbnailWLinkToArticle(meta));

  const [content] = createResource(async () => {
    const id = await fetchFolderIDFromTitle(meta.title);
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
    const id = await fetchFolderIDFromTitle(meta.title);
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
      </div>
    </>
  );
}