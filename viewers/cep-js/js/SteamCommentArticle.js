import { setTitle, renderBody, renderContributors, renderRelatedTags, getLinker, esc, fmtDate } from './ArticleUtils.js';
import { renderArticleMeta } from '/viewers/cep-js/js/ArticleUtils.js';

const SCOTT_AVATAR = '/viewers/cep-js/assets/Social Posts/Scott.jpg';
const SCOTT_NAME_HTML = '<span style="color:#aedd08">Scott</span> <span style="color:#e9d528">[developer]</span>';

function buildSteamCommentContent(meta) {
  if (!meta) return '';
  const isDeleted = meta.deleted === true;

  return `
    ${meta.postTitle || meta.postAuthor || meta.postSubject || meta.postTime || isDeleted ? `
      <div class="SteamPostBox">
        <div class="SteamAvatar"></div>
        <div class="SteamPostContent">
          <div class="PostHeaderMeta">
            <span class="PostAuthor">${esc(meta.postAuthor || 'Unknown User')}</span>
            ${meta.postTime ? `<span class="PostTime">${esc(meta.postTime)}</span>` : ''}
            ${isDeleted ? `<span class="PostDeleted">[Deleted]</span>` : ''}
          </div>
          ${meta.postTitle ? `<h3 class="PostTitle">${esc(meta.postTitle)}</h3>` : ''}
          ${meta.postSubject ? `<div class="PostSubject">${esc(meta.postSubject)}</div>` : ''}
        </div>
      </div>` : ''}
    ${meta.commentQuote || meta.commentSubject || meta.commentTime || meta.commentQuoteAuthor ? `
      <div class="SteamPostBox">
        <div class="SteamAvatar" style="background-image:url('${SCOTT_AVATAR}')"></div>
        <div class="SteamPostContent">
          <div class="CommentHeaderMeta">
            <span class="PostAuthor">${SCOTT_NAME_HTML}</span>
            ${meta.commentTime ? `<span class="CommentTime">${esc(meta.commentTime)}</span>` : ''}
          </div>
          ${meta.commentQuote ? `<blockquote class="CommentQuote">${esc(meta.commentQuote)}</blockquote>` : ''}
          ${meta.commentSubject ? `<div class="CommentSubject">${esc(meta.commentSubject)}</div>` : ''}
        </div>
      </div>` : ''}
  `;
}

export async function loadSteamCommentArticle(app, articleId, meta, md, addTag) {
  const body = app.querySelector('#ArticleBody');
  const infobox = app.querySelector('#Infobox');
  if (infobox) infobox.style.display = 'none';

  setTitle(app, meta.title);
  renderArticleMeta(app, articleId);
  if (!body) return;

  body.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.className = 'PostArticleBody';

  wrap.innerHTML = buildSteamCommentContent(meta);

  if (md && md.trim()) {
    const contentDiv = document.createElement('div');
    contentDiv.className = 'PostMarkdownContent';
    wrap.appendChild(contentDiv);
    await renderBody(contentDiv, md, meta.citations);
  } else if (meta.citations?.length) {
    const { buildCitations } = await import('./Citations.js');
    await buildCitations(wrap, meta.citations);
  }

  body.appendChild(wrap);

  const contribEl = app.querySelector('.ArticleContributors');
  if (contribEl) await renderContributors(contribEl, meta);

  renderRelatedTags(app.querySelector('.RelatedTags'), meta, md, addTag);
}

export async function renderSteamComment(item) {
  const wrap = document.createElement('div');
  wrap.className = 'SteamCommentBody';

  const href = `/?v=cep-js&=${encodeURIComponent(item.p)}`;
  
  let meta = null;
  try {
    const res = await fetch(`/content/${item.p}/meta.json`);
    if (res.ok) meta = await res.json();
  } catch {}

  wrap.innerHTML = `
    <div class="SteamCommentHeader">
      <a href="${href}">${esc(item.t || item.p)}</a>
    </div>
    <div class="SteamCommentPreview">
      ${meta ? buildSteamCommentContent(meta) : esc(item.e || '')}
    </div>
  `;

  return wrap;
}