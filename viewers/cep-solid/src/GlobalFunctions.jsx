import { loadTitleToFolderIDMap } from './GlobalJsonCache';

export async function fetchMeta(folderID) {
  const res = await fetch(`/content/${folderID}/meta.json`);
  if (!res.ok) throw new Error(`meta.json not found for "${folderID}"`);
  return res.json();
}

export async function fetchFolderIDFromTitle(title) {
  const cache = await loadTitleToFolderIDMap();
  return cache[title] ?? null;
}

export function getCurrentView() {
  return new URLSearchParams(location.search).get('v') || 'cep-js';
}

export function getFolderPath(folderID) {
  return `/?v=${getCurrentView()}&=${folderID}`;
}

export async function fetchImage(folderID) {
  return (
      <a href={getFolderPath(folderID)}>
        <img
          ref={(img) => {
            const low = `/content/${folderID}/lowphoto.avif`;
            const full = `/content/${folderID}/photo.avif`;
            img.onload = () => {
              const hi = new Image();
              hi.onload = () => (img.src = full);
              hi.src = full;
            };
            img.onerror = () => (img.src = full);
            img.src = low;
          }}
          alt=""
          
          loading="lazy"
          class=""
        />
      </a>
    );
}
