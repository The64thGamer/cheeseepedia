import { createResource, Show, For } from 'solid-js';
import { fetchImage, fetchFolderIDFromTitle, fetchMeta } from './GlobalFunctions';

function App(meta) {
  const [data] = createResource(async () => {
    const folderID = await fetchFolderIDFromTitle(meta.pageThumbnailFile);
    const thumbnailUrl = await fetchImage(folderID);

    return { thumbnailUrl };
  });

  return (
    <Show when={!data.loading} fallback={<div>Loading…</div>}>
      <>
        <link rel="icon" href="/viewers/cep-js/assets/Logos/favicon-cep.ico"></link>
        <link rel="stylesheet" href="/viewers/cep-js/main.css"></link>
        <h1 class="article-title">{meta.title}</h1>
        <div class="infobox">
          <div class="infobox-thumbnail">{data().thumbnailUrl}</div>
          <div class="infobox-date">{meta.startDate}</div>
        </div>
      </>
    </Show>
  );
}

export default App;