import { loadTitleToFolderIDMap } from './GlobalJsonCache';

const MNAMES=['','Jan. ','Feb. ','Mar. ','Apr. ','May ','Jun. ','Jul. ','Aug. ','Sep. ','Oct. ','Nov. ','Dec.'];

export async function fetchMeta(folderID) {
  const res = await fetch(`/content/${folderID}/meta.json`);
  if (!res.ok) throw new Error(`meta.json not found for "${folderID}"`);
  return res.json();
}

export async function fetchContent(folderID) {
  const res = await fetch(`/content/${folderID}/content.md`);
  if (!res.ok) throw new Error(`content.md not found for "${folderID}"`);
  return res.text();
}

export async function fetchOld(folderID) {
  const res = await fetch(`/content/${folderID}/old.md`);
  if (!res.ok) return "";
  return res.text();
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

export function convertStartDate(date) {
  if (!date || date === '0000-00-00' || !date.trim()) return '???';

  const [y, m, d] = date.split('-');
  const year = parseInt(y, 10);
  const month = parseInt(m, 10);
  const day = parseInt(d, 10);

  if (!year) return '???';

  const monthName = month ? MNAMES[month] : '';
  const dayNum = day ? String(day) : '';

  if (monthName && dayNum) return `${monthName} ${dayNum}, ${year}`;
  if (monthName) return `${monthName} ${year}`;
  return String(year);
}


export function convertEndDate(date) {
  if (date === '0000-00-00') return '???';
  if (!date || !date.trim()) return 'Present';

  const [y, m, d] = date.split('-');
  const year = parseInt(y, 10);
  const month = parseInt(m, 10);
  const day = parseInt(d, 10);

  if (!year) return '???';

  const monthName = month ? MNAMES[month] : '';
  const dayNum = day ? String(day) : '';

  if (monthName && dayNum) return `${monthName} ${dayNum}, ${year}`;
  if (monthName) return `${monthName} ${year}`;
  return String(year);
}
export async function fetchImage(folderID) {
  if (!folderID) return null;

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

export async function fetchThumbnailWLinkToArticle(meta) {
  if (!meta?.pageThumbnailFile) return null;

  const link = await fetchFolderIDFromTitle(meta.title)
  const thumbnailFolderID = await fetchFolderIDFromTitle(meta.pageThumbnailFile);
  if (!thumbnailFolderID) return null;

  return (
    <a href={getFolderPath(link)}>
      <img
        ref={(img) => {
          const low = `/content/${thumbnailFolderID}/lowphoto.avif`;
          const full = `/content/${thumbnailFolderID}/photo.avif`;
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