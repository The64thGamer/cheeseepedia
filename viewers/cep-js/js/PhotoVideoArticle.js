/**
 * PhotoVideoArticle.js
 * Renderer for pages with type "Photos" or "Videos".
 * Photos: displays photo.avif via ProgressiveImage, then content.md description.
 * Videos: embeds YouTube or archive.org from meta.title, lists mirroredLinks, then content.md.
 * Both show contributors and related tags.
 */
import { ProgressiveImage } from './ProgressiveImage.js';
import { setTitle, renderBody, renderContributors, renderRelatedTags } from './ArticleUtils.js';

function embedVideo(url) {
  const el = document.createElement('div');
  el.className = 'VideoEmbed';

  if (/youtube\.com|youtu\.be/.test(url)) {
    let id = null;
    try {
      const u = new URL(url);
      id = u.searchParams.get('v') || u.pathname.split('/').pop();
    } catch {}
    if (id) {
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${id}`;
      iframe.allowFullscreen = true;
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.style.cssText = 'width:100%;aspect-ratio:16/9;border:0;border-radius:0.5em;';
      el.appendChild(iframe);
      return el;
    }
  }

  if (/archive\.org/.test(url)) {
    const match = url.match(/archive\.org\/(?:details|embed)\/([^/?#]+)/);
    const id = match ? match[1] : null;
    if (id) {
      const iframe = document.createElement('iframe');
      iframe.src = `https://archive.org/embed/${id}`;
      iframe.allowFullscreen = true;
      iframe.style.cssText = 'width:100%;aspect-ratio:16/9;border:0;border-radius:0.5em;';
      el.appendChild(iframe);
      return el;
    }
  }

  // Fallback: plain link
  const a = document.createElement('a');
  a.href = url; a.target = '_blank'; a.rel = 'noopener';
  a.textContent = url;
  el.appendChild(a);
  return el;
}

export async function loadPhotoVideoArticle(app, articleId, meta, md, addTag) {
  const body    = app.querySelector('#ArticleBody');
  const infobox = app.querySelector('#Infobox');
  if (infobox) infobox.style.display = 'none';

  setTitle(app, meta.title);
  if (!body) return;
  body.innerHTML = '';

  const isVideo = (meta.type || '').toLowerCase() === 'videos';
  const wrap = document.createElement('div');
  wrap.className = isVideo ? 'VideoArticle' : 'PhotoArticle';
  body.appendChild(wrap);

  if (isVideo) {
    // Primary embed from meta.title (the URL)
    const primaryUrl = meta.title || '';
    if (primaryUrl && /^https?:\/\//.test(primaryUrl)) {
      wrap.appendChild(embedVideo(primaryUrl));
    }

    // Mirrored links
    const mirrors = meta.mirroredLinks || [];
    if (mirrors.length) {
      const mirrorsWrap = document.createElement('div');
      mirrorsWrap.className = 'VideoMirrors';
      const label = document.createElement('p');
      label.className = 'VideoMirrorsLabel';
      label.textContent = 'Mirrored copies:';
      mirrorsWrap.appendChild(label);
      const ul = document.createElement('ul');
      mirrors.forEach(url => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = url; a.target = '_blank'; a.rel = 'noopener';
        try {
          const host = new URL(url).hostname.replace(/^www\./, '');
          a.textContent = host;
        } catch { a.textContent = url; }
        li.appendChild(a);
        ul.appendChild(li);
      });
      mirrorsWrap.appendChild(ul);
      wrap.appendChild(mirrorsWrap);
    }
  } else {
    // Photo — ProgressiveImage loads lowphoto.avif → photo.avif from the article folder
    const imgWrap = document.createElement('div');
    imgWrap.className = 'PhotoArticleImage';
    imgWrap.appendChild(ProgressiveImage(articleId, meta.title || ''));
    wrap.appendChild(imgWrap);
  }

  // Description / content.md
  if (md && md.trim()) {
    const desc = document.createElement('div');
    desc.className = isVideo ? 'VideoDescription' : 'PhotoDescription';
    wrap.appendChild(desc);
    await renderBody(desc, md, meta.citations);
  }

  const contribEl = app.querySelector('.ArticleContributors');
  if (contribEl) await renderContributors(contribEl, meta);

  renderRelatedTags(app.querySelector('.RelatedTags'), meta, md, addTag);
}