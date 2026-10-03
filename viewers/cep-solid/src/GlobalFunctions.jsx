import { loadTitleToFolderIDMap } from './GlobalJsonCache';
import { marked } from 'marked';
import { createMap, loadPins } from './MapRenderer';

const MAP_TYPES = new Set(['locations', 'cancelled locations']);
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

function decodeEntities(str) {
  const el = document.createElement("textarea");
  el.innerHTML = str;
  return el.value;
}

export async function fetchCardExcerpt(meta, maxLength = 160) {
  const folderID = await fetchFolderIDFromTitle(meta.title);
  if (!folderID) return(
    <a href={getFolderPath(folderID)} class="CardImageExcerpt">
      Error?
    </a>
  );

  const contentMD = (await fetchContent(folderID)) || (await fetchOld(folderID));
  if (!contentMD) return(
    <a href={getFolderPath(folderID)} class="CardImageExcerpt">
      No Article Content. Come write some!
    </a>
  );

  const plainText = decodeEntities(contentMD)
    .split("[").join("")
    .split("]").join("")
    .split("#").join("")
    .replace(/\s+/g, " ")
    .trim();

  if (!plainText) return(
    <a href={getFolderPath(folderID)} class="CardImageExcerpt">
      No Article Content. Come write some!
    </a>
  );

  const excerpt = plainText.length <= maxLength
    ? plainText
    : `${plainText.slice(0, plainText.slice(0, maxLength).lastIndexOf(" "))}…`;

  return (
    <a href={getFolderPath(folderID)} class="CardImageExcerpt">
      {excerpt}
    </a>
  );
}

export function loadKey(key, fallback = null, validate) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    const value = typeof fallback === 'string' ? raw : JSON.parse(raw);
    return validate && !validate(value) ? fallback : value;
  } catch {
    return fallback; 
  }
}

export function saveKey(key, value) {
  try {
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    return true;
  } catch {
    return false; 
  }
}

export async function fetchThumbnailWLinkToArticle(meta) {
  const link = await fetchFolderIDFromTitle(meta.title);
  if (!link) return null;

  let thumbnailFolderID = null;

  if (meta?.pageThumbnailFile) {
    thumbnailFolderID = await fetchFolderIDFromTitle(meta.pageThumbnailFile);
  } else {
    const hasOwnPhoto = await new Promise((resolve) => {
      const probe = new Image();
      probe.onload = () => resolve(true);
      probe.onerror = () => resolve(false);
      probe.src = `/content/${link}/photo.avif`;
    });
    if (hasOwnPhoto) thumbnailFolderID = link;
  }
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

function mapContainer(setup) {
  return (
    <div
      class="MapContainer fade-in"
      ref={(el) => {
        const start = () => (el.isConnected ? setup(el) : requestAnimationFrame(start));
        requestAnimationFrame(start);
      }}
    />
  );
}

export async function resolveBracketLinks(md) {
  const parts = md.split(/(```[\s\S]*?```|`[^`\n]*`)/);

  const processed = await Promise.all(
    parts.map(async (part, i) => {
      if (i % 2) return part;

      const re = /(?<![\]\\])\[([^\[\]\n]+)\](?![(\[:])/g;
      const matches = [...part.matchAll(re)];

      const replacements = await Promise.all(
        matches.map(async (m) => {
          const text = m[1].trim();
          if (!text || /^[xX]$/.test(text)) return m[0]; 

          if (/^\d+$/.test(text)) return `<sup><a href="#cite-${text}">(${text})</a></sup>`;

          const id = await fetchFolderIDFromTitle(text);
          if (!id) return `<span class="BadLink">${text}</span>`;        
          return `[${text}](${getFolderPath(id)})`;
        })
      );

      let out = '';
      let last = 0;
      matches.forEach((m, j) => {
        out += part.slice(last, m.index) + replacements[j];
        last = m.index + m[0].length;
      });
      return out + part.slice(last);
    })
  );

  return processed.join('');
}

export async function fetchLocationMap(meta) {
  if (!MAP_TYPES.has((meta?.type || '').toLowerCase())) return null;

  const folderID = await fetchFolderIDFromTitle(meta?.title);
  if (!folderID) return null;

  const loc = (await loadPins()).find((l) => l.p === folderID);
  if (!loc) return null;

  return mapContainer((el) => createMap(el, [loc], { single: true }));
}
 
export async function fetchMapForIDs(ids) {
  const wanted = new Set(ids);
  const locs = (await loadPins()).filter((l) => wanted.has(l.p));
  if (!locs.length) return null;
 
  return mapContainer((el) => createMap(el, locs, { fit: true }));
}
 
export async function fetchMapAll() {
  const locs = await loadPins();
  if (!locs.length) return null;
 
  return mapContainer((el) => createMap(el, locs));
}
 
