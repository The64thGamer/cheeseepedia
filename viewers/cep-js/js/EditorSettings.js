/**
 * EditorSettings.js
 * Settings modal: GitHub token, contributor name, user page mini-editor.
 */

import { getToken, setToken, getEditorUser, setEditorUser, setChange, randomId } from './EditorStore.js';
import { getAuthenticatedUser } from './EditorGitHub.js';

export function openSettingsModal() {
  let modal = document.getElementById('EditorSettingsModal');
  if (modal) { modal.style.display = 'flex'; populateModal(); return; }

  modal = document.createElement('div');
  modal.id = 'EditorSettingsModal';
  modal.className = 'EditorModal';
  modal.innerHTML = `
    <div class="EditorModalBox">
      <div class="EditorModalHeader">
        <span>Editor Settings</span>
        <button class="EditorModalClose" id="EditorSettingsClose">✕</button>
      </div>
      <div class="EditorModalBody">

        <section class="EditorSettingsSection">
          <h3>GitHub Token</h3>
          <p class="EditorHint">Create a <strong>classic</strong> personal access token at
            <a href="https://github.com/settings/tokens" target="_blank" rel="noopener">github.com/settings/tokens</a>
            with <code>repo</code> scope. It is only stored for this browser session.</p>
          <div class="EditorFieldRow">
            <label class="EditorLabel">Token</label>
            <input type="password" id="EditorTokenInput" class="EditorInput" placeholder="ghp_…" autocomplete="new-password">
          </div>
          <button class="EditorBtn" id="EditorTokenSave">Save Token</button>
          <span class="EditorStatusMsg" id="EditorTokenStatus"></span>
        </section>

        <section class="EditorSettingsSection">
          <h3>Your Contributor Name</h3>
          <p class="EditorHint">This name will be added to the contributors list of any article you edit.</p>
          <div class="EditorFieldRow">
            <label class="EditorLabel">Name</label>
            <input type="text" id="EditorNameInput" class="EditorInput" placeholder="Your name">
          </div>
          <button class="EditorBtn" id="EditorNameLookup">Look Up Profile</button>
          <span class="EditorStatusMsg" id="EditorNameStatus"></span>
        </section>

        <section class="EditorSettingsSection" id="EditorUserSection" style="display:none">
          <h3>Your User Page</h3>

          <div class="EditorFieldRow">
            <label class="EditorLabel">Banner (pageThumbnailFile)</label>
            <input type="text" id="EditorUserBanner" class="EditorInput" placeholder="Article title for banner image">
          </div>

          <div class="EditorFieldRow">
            <label class="EditorLabel">Bio (content.md)</label>
            <textarea id="EditorUserBio" class="EditorTextarea" rows="6" placeholder="Write your bio in markdown…"></textarea>
          </div>

          <div class="EditorFieldGroup">
            <label class="EditorLabel EditorLabelBig">Quotes</label>
            <div id="EditorUserQuotes"></div>
          </div>

          <button class="EditorBtn" id="EditorUserSave">Save User Page</button>
          <span class="EditorStatusMsg" id="EditorUserStatus"></span>
        </section>

      </div>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('EditorSettingsClose').addEventListener('click', () => {
    modal.style.display = 'none';
  });
  modal.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });

  document.getElementById('EditorTokenSave').addEventListener('click', async () => {
    const tok = document.getElementById('EditorTokenInput').value.trim();
    const status = document.getElementById('EditorTokenStatus');
    if (!tok) { status.textContent = 'Enter a token first.'; return; }
    setToken(tok);
    status.textContent = 'Verifying…';
    try {
      const user = await getAuthenticatedUser();
      status.textContent = `✓ Authenticated as ${user.login}`;
      status.style.color = 'var(--good-link)';
    } catch (e) {
      status.textContent = `✗ ${e.message}`;
      status.style.color = 'var(--bad-link)';
    }
  });

  document.getElementById('EditorNameLookup').addEventListener('click', async () => {
    const name = document.getElementById('EditorNameInput').value.trim();
    const status = document.getElementById('EditorNameStatus');
    if (!name) { status.textContent = 'Enter a name first.'; return; }
    status.textContent = 'Looking up…';
    try {
      const r = await fetch('/viewers/cep-js/compiled-json/contributors.json');
      const contribs = r.ok ? await r.json() : [];
      const match = contribs.find(c =>
        (c.name||'').toLowerCase() === name.toLowerCase() ||
        (c.fn||'').toLowerCase() === name.toLowerCase()
      );
      const userData = getEditorUser();
      setEditorUser({ ...userData, name, contribEntry: match || null });
      if (match) {
        status.textContent = `✓ Found: ${match.fn || match.name} (${match.count} contributions)`;
        status.style.color = 'var(--good-link)';
        showUserSection(match);
      } else {
        status.textContent = 'New contributor — user page will be created on first save.';
        status.style.color = 'var(--text)';
        showUserSection(null, name);
      }
    } catch (e) {
      status.textContent = `Error: ${e.message}`;
    }
  });

  document.getElementById('EditorUserSave').addEventListener('click', () => {
    saveUserPage();
  });

  populateModal();
}

function populateModal() {
  const tok = getToken();
  if (tok) document.getElementById('EditorTokenInput').value = tok;
  const user = getEditorUser();
  if (user.name) {
    document.getElementById('EditorNameInput').value = user.name;
    if (user.contribEntry || user.articleId) showUserSection(user.contribEntry, user.name);
  }
}

async function showUserSection(contribEntry, name) {
  const section = document.getElementById('EditorUserSection');
  section.style.display = '';

  const user = getEditorUser();

  // If we have a locally saved version use that, otherwise fetch from server
  let serverMeta = user.userMeta || null;
  let serverContent = user.userContent !== undefined ? user.userContent : null;

  if (!serverMeta && contribEntry) {
    // Look up article ID from linker
    try {
      const r = await fetch('/viewers/cep-js/compiled-json/ArticleLinker.json');
      const linker = r.ok ? await r.json() : {};
      const articleId = linker[contribEntry.fn || contribEntry.name || name] || linker[name] || null;
      if (articleId) {
        const [metaRes, mdRes] = await Promise.all([
          fetch(`/content/${articleId}/meta.json`),
          fetch(`/content/${articleId}/content.md`),
        ]);
        if (metaRes.ok) serverMeta = await metaRes.json();
        if (mdRes.ok) serverContent = await mdRes.text();
        // Save article ID for later use
        setEditorUser({ ...getEditorUser(), articleId });
      }
    } catch {}
  }

  // Banner
  const banner = serverMeta?.pageThumbnailFile || '';
  document.getElementById('EditorUserBanner').value = banner;

  // Bio
  document.getElementById('EditorUserBio').value = serverContent || '';

  // Quotes
  renderQuotesEditor(serverMeta?.quotes || []);

  // Cache what we fetched
  if (serverMeta) setEditorUser({ ...getEditorUser(), userMeta: serverMeta, userContent: serverContent || '' });
}

function renderQuotesEditor(quotes) {
  const container = document.getElementById('EditorUserQuotes');
  container.innerHTML = '';
  const items = [...quotes];
  const render = () => {
    container.innerHTML = '';
    items.forEach((q, i) => {
      const row = document.createElement('div');
      row.className = 'EditorArrayRow';
      const inp = document.createElement('input');
      inp.type = 'text'; inp.className = 'EditorInput'; inp.value = q;
      inp.addEventListener('input', () => { items[i] = inp.value; });
      const del = document.createElement('button');
      del.className = 'EditorBtnSmall EditorBtnDanger'; del.textContent = '✕';
      del.addEventListener('click', () => { items.splice(i,1); render(); });
      row.appendChild(inp); row.appendChild(del);
      container.appendChild(row);
    });
    const addBtn = document.createElement('button');
    addBtn.className = 'EditorBtnSmall'; addBtn.textContent = '+ Add Quote';
    addBtn.addEventListener('click', () => { items.push(''); render(); });
    container.appendChild(addBtn);
    // Store items ref for save
    container._quotes = items;
  };
  render();
}

async function saveUserPage() {
  const status = document.getElementById('EditorUserStatus');
  const user = getEditorUser();
  const name = document.getElementById('EditorNameInput').value.trim() || user.name || 'Anonymous';
  const banner = document.getElementById('EditorUserBanner').value.trim();
  const bio = document.getElementById('EditorUserBio').value;
  const quotes = document.getElementById('EditorUserQuotes')._quotes || [];

  // Find or create article ID for this user
  let articleId = user.articleId;
  if (!articleId && user.contribEntry) {
    // Try to look up in the linker
    try {
      const r = await fetch('/viewers/cep-js/compiled-json/ArticleLinker.json');
      const linker = r.ok ? await r.json() : {};
      articleId = linker[name] || null;
    } catch {}
  }
  if (!articleId) articleId = randomId();

  const meta = {
    ...(user.userMeta || {}),
    title: name,
    type: 'User',
    quotes: quotes.filter(Boolean),
    pageThumbnailFile: banner || undefined,
    contributors: [name],
  };
  if (!meta.pageThumbnailFile) delete meta.pageThumbnailFile;

  setEditorUser({ ...user, name, articleId, userMeta: meta, userContent: bio });
  setChange(articleId, { meta, content: bio, isNew: !user.articleId });
  status.textContent = '✓ Saved locally — will be included in next push.';
  status.style.color = 'var(--good-link)';
}
