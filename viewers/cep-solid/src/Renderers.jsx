import { createResource, Show } from 'solid-js';
import { fetchImage, fetchMeta, fetchFolderIDFromTitle,fetchThumbnailWLinkToArticle, getFolderPath, fetchContent, convertStartDate, convertEndDate, fetchOld } from './GlobalFunctions';
import { marked } from 'marked';
import { loadFolderIDToTitleMap, loadViewsMap }  from './GlobalJsonCache'

export async function renderArticle(meta){
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
    case "Videos":
    case "Steam Comments":
      return renderStandardArticle(meta);

    default:
      return renderStandardArticle(meta);
    }
}

export async function renderStandardCard(meta) {
    const pageThumbnail = await fetchThumbnailWLinkToArticle(meta);
    const link = await fetchFolderIDFromTitle(meta.title)

    return (
    <div class="Card">
        <div class="CardImage">{pageThumbnail}</div>
        <div class="CardTextArea">
        <div class="CardLink">
            <span>
            <a href={getFolderPath(link)}>{meta.title}</a>
            </span>
        </div>
        <div class="CardText">
            <strong>{convertStartDate(meta.startDate)} – {convertEndDate(meta.endDate)}</strong>
        </div>
        </div>
    </div>
    );
}

export async function renderRandomCards() {
  const EXCLUDE_TYPES = new Set(['photos', 'videos', 'reviews', 'user', 'meta', 'transcriptions']);

  const folderIDToTitleMap = await loadFolderIDToTitleMap();
  const allIDs = Object.keys(folderIDToTitleMap);

  const viewsMap = await loadViewsMap();

  const picked = [];
  const usedIndices = new Set();
  let attempts = 0;
  const maxAttempts = allIDs.length * 3;

  while (picked.length < 10 && usedIndices.size < allIDs.length && attempts < maxAttempts) {
    attempts++;
    const idx = Math.floor(Math.random() * allIDs.length);
    if (usedIndices.has(idx)) continue;
    usedIndices.add(idx);

    const id = allIDs[idx];
    const m = await fetchMeta(id).catch(() => null);
    if (m && !EXCLUDE_TYPES.has((m.type || '').toLowerCase())) {
      picked.push({ id, meta: m });
    }
  }

  picked.sort((a, b) => (viewsMap[b.id] ?? 0) - (viewsMap[a.id] ?? 0));

  const cards = await Promise.all(picked.map(({ meta }) => renderStandardCard(meta)));

  return (
    <>
        <h2>Random Articles</h2>
        <div id="RandomCards" class="Carousel">
        <For each={cards}>
            {(card) => card}
        </For>
        </div>
    </>
  );
}

export async function renderStandardArticle(meta){
    const [data] = createResource(async () => {
    const thumbnailFolderID = await fetchFolderIDFromTitle(meta.pageThumbnailFile);
    const folderID = await fetchFolderIDFromTitle(meta.title);

    const pageThumbnailFile = await fetchImage(thumbnailFolderID);
    const contentMD = await fetchContent(folderID);
    const oldMD = await fetchOld(folderID);

    return { pageThumbnailFile, contentMD,oldMD };
  });

  return (
    <Show when={!data.loading} fallback={<div>Loading…</div>}>
      <>
        <h1 class="article-title">{meta.title}</h1>
        <div class="infobox">
          <div class="infobox-thumbnail">{data().pageThumbnailFile}</div>
          <table>
            <tbody>
              <tr>
                <td>
                  <strong>Operated</strong>
                </td>
                <td>
                    {convertStartDate(meta.startDate)}<div class="emoji">🚧</div><br/>{convertEndDate(meta.endDate)}<div class="emoji">☠️</div>
                </td>
              </tr>

              <Show when={meta.sqft}>
                <tr>
                  <td>
                    <strong>Floorspace</strong>
                  </td>
                  <td>
                      {meta.sqft}ft<sup>2</sup><div class="emoji">📐</div>
                  </td>
                </tr>
              </Show>

              <Show when={meta.latitudeLongitude?.[0] && meta.latitudeLongitude?.[1]}>
                <tr>
                  <td>
                    <strong>Location</strong>
                  </td>
                  <td>
                      {meta.latitudeLongitude[0]}°<div class="emoji">🗺️</div><br/>{meta.latitudeLongitude[1]}°
                  </td>
                </tr>
              </Show>
            </tbody>
          </table>
          <Show when={meta.credits?.length}>
            <div class="infobox-list">
              <strong>Credits:</strong>
              <ul>
                <For each={meta.credits}>
                  {(credit) => <li><strong>{credit.role}:</strong> {credit.n}</li>}
                </For>
              </ul>
            </div>
          </Show>
        </div>
        <div class="content">
            <Show when={!data().contentMD && data().oldMD}>
                <div class="OldWarning">The following article content is unsourced, in an old formatting, and needs to be rewritten. Any new text added to the page will hide this previous content.</div>
            </Show>
            <div innerHTML={marked.parse(data().contentMD || data().oldMD || "")}/>
        </div>
        
      </>
    </Show>
  );
}