(async function() {
  while (!window.editorLibsReady || !window.toastui || !window.OctokitClass) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  const { Editor } = window.toastui;

const currentPageTitle      = window.EDITOR_CONFIG.pageTitle;
const currentPageCategories = window.EDITOR_CONFIG.pageCategories;

  let currentPagePath = 'content' + window.location.pathname;
  if (currentPagePath.endsWith('/')) currentPagePath = currentPagePath.slice(0, -1);
  currentPagePath += '.md';

  const GITHUB_OWNER  = 'The64thGamer';
  const GITHUB_REPO   = 'cheeseepedia';
  const GITHUB_BRANCH = 'main';
  const USERNAME_KEY  = 'cheeseepedia_username';

  let markdownUrl = window.location.pathname;
  if (markdownUrl.endsWith('/')) markdownUrl = markdownUrl.slice(0, -1);
  markdownUrl += '.md';

  let editor = null;
  let octokit = null;
  let userLogin = '';
  let originalFrontmatter = '';

  // ─── HELPERS ──────────────────────────────────────────────────────────────

  // Escape a value for use inside a TOML double-quoted string.
  function toTomlStr(str) {
    return String(str).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  }

  // Hugo's jsonify can sometimes leave stray wrapping quote characters
  // in the JS string value. Strip them before embedding in TOML.
  function safeTitle(str) {
    return toTomlStr(String(str).replace(/^"+|"+$/g, ''));
  }

  function parseFrontmatter(markdown) {
    const match = markdown.match(/^\+\+\+\n([\s\S]*?)\n\+\+\+\n([\s\S]*)$/);
    if (match) return { frontmatter: match[1], content: match[2] };
    return { frontmatter: '', content: markdown };
  }

  function updateContributors(frontmatter, username) {
    const re = /contributors\s*=\s*\[([^\]]*)\]/;
    const match = frontmatter.match(re);
    if (!match) {
      return frontmatter.trimEnd() + `\ncontributors = ["${toTomlStr(username)}"]`;
    }
    const names = [...match[1].matchAll(/"([^"]*)"/g)].map(m => m[1]);
    if (names.includes(username)) return frontmatter;
    names.push(username);
    return frontmatter.replace(re, `contributors = [${names.map(n => `"${toTomlStr(n)}"`).join(', ')}]`);
  }

  // ─── EDITOR ───────────────────────────────────────────────────────────────

  function initEditor(markdownContent) {
    editor = new Editor({
      el: document.querySelector('#editor'),
      height: '600px',
      initialEditType: 'wysiwyg',
      previewStyle: 'vertical',
      initialValue: markdownContent,
      usageStatistics: false,
      theme: 'dark',
      toolbarItems: [
        ['heading', 'bold', 'italic', 'strike'],
        ['hr', 'quote'],
        ['ul', 'ol', 'task', 'indent', 'outdent'],
        ['table', 'link'],
        ['code', 'codeblock']
      ]
    });
  }

  async function loadMarkdownFile() {
    try {
      const response = await fetch(markdownUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      const markdown = await response.text();
      if (markdown.trim().startsWith('<!DOCTYPE') || markdown.trim().startsWith('<html')) {
        throw new Error('File not found at ' + markdownUrl);
      }
      const { frontmatter, content } = parseFrontmatter(markdown);
      originalFrontmatter = frontmatter;
      initEditor(content);
      document.getElementById('github-auth-section').style.display = 'none';
      document.getElementById('editor-section').style.display = 'block';
    } catch (error) {
      alert('Error loading file: ' + error.message);
    }
  }

  // ─── AUTH ─────────────────────────────────────────────────────────────────

  document.getElementById('auth-and-load').addEventListener('click', async () => {
    const token = document.getElementById('edit-github-token').value.trim();
    if (!token) { alert('Please enter your GitHub token'); return; }

    octokit = new OctokitClass({ auth: token });
    try {
      const { data: user } = await octokit.rest.users.getAuthenticated();
      userLogin = user.login;
      await loadMarkdownFile();
    } catch (error) {
      octokit = null;
      userLogin = '';
      alert('Invalid GitHub token: ' + error.message);
    }
  });

  // All Other Actions require the token to be loaded first
  function requireAuth() {
    if (!octokit) {
      alert('Please enter your GitHub token and load the editor first.');
      return false;
    }
    return true;
  }

  // ─── CUSTOM TOOLBAR ───────────────────────────────────────────────────────

  document.getElementById('insert-wikilink').addEventListener('click', () => {
    const title = prompt('Enter wiki page title:');
    const ob = '{' + '{'; const cb = '}' + '}';
    if (title) editor.insertText(ob + '< wiki-link "' + title + '" >' + cb);
  });

  document.getElementById('insert-citation').addEventListener('click', () => {
    const num = prompt('Enter citation number:', '1');
    const ob = '{' + '{'; const cb = '}' + '}';
    if (num && /^\d+$/.test(num)) editor.insertText(ob + '< cite ' + num + ' >' + cb);
  });

  // ─── SAVE PAGE EDIT ───────────────────────────────────────────────────────

  document.getElementById('save-changes-btn').addEventListener('click', async () => {
    const username = localStorage.getItem(USERNAME_KEY) || 'Anonymous';
    const updatedFrontmatter = updateContributors(originalFrontmatter, username);
    const fullContent = `+++\n${updatedFrontmatter}\n+++\n${editor.getMarkdown()}`;

    document.getElementById('save-progress-modal').style.display = 'block';
    try {
      await saveToGitHub(fullContent);
    } catch (error) {
      document.getElementById('save-progress').style.display = 'none';
      document.getElementById('save-error').style.display = 'block';
      document.getElementById('save-error-message').textContent = error.message;
    }
  });

  document.getElementById('cancel-edit-btn').addEventListener('click', () => {
    if (confirm('Discard changes?')) location.reload();
  });
  document.getElementById('close-save-modal').addEventListener('click', () => location.reload());
  document.getElementById('retry-save').addEventListener('click', () => {
    document.getElementById('save-error').style.display = 'none';
    document.getElementById('save-progress').style.display = 'block';
    document.getElementById('save-changes-btn').click();
  });

  function setSaveProgress(step, status) {
    const el = document.getElementById(`save-progress-${step}`);
    if (el) el.textContent = status === 'success' ? '✅' : status === 'error' ? '❌' : '⏳';
  }

  async function saveToGitHub(content) {
    setSaveProgress(1, 'loading');
    await octokit.rest.users.getAuthenticated();
    setSaveProgress(1, 'success');

    setSaveProgress(2, 'loading');
    await ensureFork(octokit, userLogin);
    setSaveProgress(2, 'success');

    setSaveProgress(3, 'loading');
    const { branchName, baseSha } = await createBranch(octokit, userLogin, 'edit');
    setSaveProgress(3, 'success');

    setSaveProgress(4, 'loading');
    await commitFiles(octokit, userLogin, branchName, baseSha,
      [{ path: currentPagePath, content }],
      `Edit: ${currentPageTitle}`);
    setSaveProgress(4, 'success');

    setSaveProgress(5, 'loading');
    const { data: pr } = await octokit.rest.pulls.create({
      owner: GITHUB_OWNER, repo: GITHUB_REPO,
      title: `Edit: ${currentPageTitle}`,
      head: `${userLogin}:${branchName}`, base: GITHUB_BRANCH,
      body: `## Page Edit\n\nEdited via web interface.\n\n**Page:** ${currentPageTitle}\n**File:** \`${currentPagePath}\``
    });
    setSaveProgress(5, 'success');

    document.getElementById('save-progress').style.display = 'none';
    document.getElementById('save-success').style.display = 'block';
    document.getElementById('save-pr-link').href = pr.html_url;
  }

  // ─── SHARED GITHUB HELPERS ────────────────────────────────────────────────

  async function ensureFork(kit, login) {
    let exists = false;
    try {
      await kit.rest.repos.get({ owner: login, repo: GITHUB_REPO });
      exists = true;
    } catch (e) {
      if (e.status === 404) {
        await kit.rest.repos.createFork({ owner: GITHUB_OWNER, repo: GITHUB_REPO });
        await new Promise(r => setTimeout(r, 5000));
      } else throw e;
    }
    if (exists) {
      try {
        await kit.request('POST /repos/{owner}/{repo}/merge-upstream', {
          owner: login, repo: GITHUB_REPO, branch: GITHUB_BRANCH
        });
      } catch (e) { console.log('Fork sync skipped:', e.message); }
    }
  }

  async function createBranch(kit, login, prefix) {
    const { data: ref } = await kit.rest.git.getRef({
      owner: login, repo: GITHUB_REPO, ref: `heads/${GITHUB_BRANCH}`
    });
    const baseSha = ref.object.sha;
    const branchName = `${prefix}-${Date.now()}`;
    await kit.rest.git.createRef({
      owner: login, repo: GITHUB_REPO,
      ref: `refs/heads/${branchName}`, sha: baseSha
    });
    return { branchName, baseSha };
  }

  // Accepts an array of { path, content } objects and commits them all in one tree
  async function commitFiles(kit, login, branchName, baseSha, files, message) {
    const treeEntries = await Promise.all(files.map(async ({ path, content }) => {
      const b64 = btoa(unescape(encodeURIComponent(content)));
      const { data: blob } = await kit.rest.git.createBlob({
        owner: login, repo: GITHUB_REPO, content: b64, encoding: 'base64'
      });
      return { path, mode: '100644', type: 'blob', sha: blob.sha };
    }));

    const { data: baseCommit } = await kit.rest.git.getCommit({
      owner: login, repo: GITHUB_REPO, commit_sha: baseSha
    });
    const { data: newTree } = await kit.rest.git.createTree({
      owner: login, repo: GITHUB_REPO,
      base_tree: baseCommit.tree.sha, tree: treeEntries
    });
    const { data: newCommit } = await kit.rest.git.createCommit({
      owner: login, repo: GITHUB_REPO,
      message, tree: newTree.sha, parents: [baseSha]
    });
    await kit.rest.git.updateRef({
      owner: login, repo: GITHUB_REPO,
      ref: `heads/${branchName}`, sha: newCommit.sha
    });
    return newCommit;
  }

  // ─── REVIEW MODAL ─────────────────────────────────────────────────────────

  const reviewModal = document.getElementById('review-modal');

  function showReviewStep(num) {
    document.querySelectorAll('#review-modal .step').forEach(s => s.style.display = 'none');
    document.getElementById(`review-step-${num}`).style.display = 'block';
  }

  document.getElementById('write-review-btn').addEventListener('click', () => {
    if (!requireAuth()) return;
    const name = localStorage.getItem(USERNAME_KEY) || 'Anonymous';
    document.getElementById('review-author-note').textContent =
      `Submitting under ${name} — you can change this in the bottom right settings.`;
    reviewModal.style.display = 'block';
    showReviewStep(1);
  });

  document.querySelector('.close-review').addEventListener('click', () => {
    reviewModal.style.display = 'none';
  });

  document.getElementById('review-submit').addEventListener('click', async () => {
    const recommend = document.querySelector('input[name="review-recommend"]:checked');
    const title     = document.getElementById('review-title').value.trim();
    const body      = document.getElementById('review-body').value.trim();

    if (!recommend) { alert('Please select whether you recommend this.'); return; }
    if (!title)     { alert('Please enter a review title.'); return; }
    if (!body)      { alert('Please write your review.'); return; }

    showReviewStep(2);
    await submitReview();
  });

  document.getElementById('review-done').addEventListener('click', () => {
    reviewModal.style.display = 'none';
  });

  document.getElementById('review-retry').addEventListener('click', () => {
    document.getElementById('review-error').style.display = 'none';
    document.getElementById('review-progress').style.display = 'block';
    for (let i = 1; i <= 5; i++) {
      const el = document.getElementById(`review-prog-${i}`);
      if (el) el.textContent = '⏳';
    }
    submitReview();
  });

  function setReviewProgress(step, status) {
    const el = document.getElementById(`review-prog-${step}`);
    if (el) el.textContent = status === 'success' ? '✅' : status === 'error' ? '❌' : '⏳';
  }

  async function submitReview() {
    try {
      const recommend = document.querySelector('input[name="review-recommend"]:checked').value;
      const title     = document.getElementById('review-title').value.trim();
      const body      = document.getElementById('review-body').value.trim();
      const author    = localStorage.getItem(USERNAME_KEY) || 'Anonymous';

      const today = new Date();
      const startDate = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

      setReviewProgress(1, 'loading');
      await octokit.rest.users.getAuthenticated();
      setReviewProgress(1, 'success');

      setReviewProgress(2, 'loading');
      await ensureFork(octokit, userLogin);
      setReviewProgress(2, 'success');

      setReviewProgress(3, 'loading');
      const { branchName, baseSha } = await createBranch(octokit, userLogin, 'review');
      setReviewProgress(3, 'success');

      setReviewProgress(4, 'loading');
      const randomName = Math.random().toString(36).substring(2, 18);
      const fileContent =
`+++
recommend = ${recommend}
title = "${toTomlStr(title)}"
startDate = "${startDate}"
page = "${safeTitle(currentPageTitle)}"
contributors = ["${toTomlStr(author)}"]
tags = ["Reviews"]
categories = ["User-Generated Content"]
+++
${body}`;

      await commitFiles(octokit, userLogin, branchName, baseSha,
        [{ path: `content/reviews/${randomName}.md`, content: fileContent }],
        `Review: ${currentPageTitle}`);
      setReviewProgress(4, 'success');

      setReviewProgress(5, 'loading');
      const { data: pr } = await octokit.rest.pulls.create({
        owner: GITHUB_OWNER, repo: GITHUB_REPO,
        title: `Review: ${currentPageTitle}`,
        head: `${userLogin}:${branchName}`, base: GITHUB_BRANCH,
        body: `## Review Submission\n\n**Page:** ${currentPageTitle}\n**Title:** ${title}\n**Recommend:** ${recommend === 'true' ? 'Yes 👍' : 'No 👎'}\n**Author:** ${author}`
      });
      setReviewProgress(5, 'success');

      document.getElementById('review-progress').style.display = 'none';
      document.getElementById('review-success').style.display = 'block';
      document.getElementById('review-pr-link').href = pr.html_url;

    } catch (error) {
      console.error('Review submit error:', error);
      for (let i = 1; i <= 5; i++) {
        const el = document.getElementById(`review-prog-${i}`);
        if (el && el.textContent === '⏳') { el.textContent = '❌'; break; }
      }
      document.getElementById('review-progress').style.display = 'none';
      document.getElementById('review-error').style.display = 'block';
      document.getElementById('review-error-msg').textContent = error.message;
    }
  }

  // ─── GALLERY MODAL ────────────────────────────────────────────────────────

  const galleryModal = document.getElementById('gallery-upload-modal');
  let galleryFiles = [];

  const galleryYear = document.getElementById('gallery-year');
  for (let y = new Date().getFullYear(); y >= 1950; y--) {
    const o = document.createElement('option');
    o.value = y; o.textContent = y;
    galleryYear.appendChild(o);
  }
  const galleryDay = document.getElementById('gallery-day');
  for (let d = 1; d <= 31; d++) {
    const o = document.createElement('option');
    o.value = String(d).padStart(2, '0'); o.textContent = d;
    galleryDay.appendChild(o);
  }

  function showGalleryStep(num) {
    document.querySelectorAll('#gallery-upload-modal .step').forEach(s => s.style.display = 'none');
    document.getElementById(`gallery-step-${num}`).style.display = 'block';
  }

  document.getElementById('add-to-gallery-btn').addEventListener('click', () => {
    if (!requireAuth()) return;
    galleryModal.style.display = 'block';
    showGalleryStep(2);
  });
  document.querySelector('.close-gallery').addEventListener('click', () => {
    galleryModal.style.display = 'none';
  });

  document.getElementById('gallery-next-2').addEventListener('click', () => {
    const files = Array.from(document.getElementById('gallery-image-files').files);
    if (!files.length) { alert('Please select at least one image'); return; }
    if (files.some(f => !f.name.toLowerCase().endsWith('.avif'))) { alert('Only .avif files allowed'); return; }
    galleryFiles = files;
    showGalleryStep(3);
  });
  document.getElementById('gallery-back-2').addEventListener('click', () => showGalleryStep(2));
  document.getElementById('gallery-next-3').addEventListener('click', () => {
    if (!document.getElementById('gallery-description').value.trim()) { alert('Please enter a description'); return; }
    showGalleryStep(4);
  });
  document.getElementById('gallery-back-3').addEventListener('click', () => showGalleryStep(3));
  document.getElementById('gallery-next-4').addEventListener('click', () => {
    showGalleryStep(5);
    uploadGalleryImages();
  });
  document.getElementById('gallery-done').addEventListener('click', () => location.reload());
  document.getElementById('gallery-retry').addEventListener('click', () => showGalleryStep(2));

  function setGalleryProgress(step, status) {
    const el = document.getElementById(`gallery-prog-${step}`);
    if (el) el.textContent = status === 'success' ? '✅' : status === 'error' ? '❌' : '⏳';
  }

  async function uploadGalleryImages() {
    try {
      const desc  = document.getElementById('gallery-description').value.trim();
      const year  = document.getElementById('gallery-year').value;
      const month = document.getElementById('gallery-month').value;
      const day   = document.getElementById('gallery-day').value;
      const dateStr = `${year || '0000'}-${month || '00'}-${day || '00'}`;

      setGalleryProgress(1, 'loading');
      await octokit.rest.users.getAuthenticated();
      setGalleryProgress(1, 'success');

      setGalleryProgress(2, 'loading');
      await ensureFork(octokit, userLogin);
      const { branchName, baseSha } = await createBranch(octokit, userLogin, 'photos');
      setGalleryProgress(2, 'success');

      setGalleryProgress(3, 'loading');
      const fileData   = [];
      const imageBlobs = [];

      for (const file of galleryFiles) {
        const randomName = Math.random().toString(36).substring(2, 18);
        const filename   = `${randomName}.avif`;
        fileData.push({ filename, randomName });

        const base64 = await new Promise((res, rej) => {
          const reader = new FileReader();
          reader.onload  = () => res(reader.result.split(',')[1]);
          reader.onerror = rej;
          reader.readAsDataURL(file);
        });
        const { data: blob } = await octokit.rest.git.createBlob({
          owner: userLogin, repo: GITHUB_REPO, content: base64, encoding: 'base64'
        });
        imageBlobs.push({ path: `static/photos/${filename}`, sha: blob.sha });
      }
      setGalleryProgress(3, 'success');

      setGalleryProgress(4, 'loading');
      const mdFiles = fileData.map(info => ({
        path: `content/photos/${info.randomName}.md`,
        content:
`+++
title = "${toTomlStr(info.filename)}"
startDate = "${dateStr}"
citations = []
pages = ["${safeTitle(currentPageTitle)}"]
tags = ["Photos"]
categories = ${JSON.stringify(currentPageCategories || [])}
+++
${desc}`
      }));

      // Commit images (raw blobs) + markdown files together
      const { data: baseCommit } = await octokit.rest.git.getCommit({
        owner: userLogin, repo: GITHUB_REPO, commit_sha: baseSha
      });

      // Build markdown blobs
      const mdBlobEntries = await Promise.all(mdFiles.map(async f => {
        const b64 = btoa(unescape(encodeURIComponent(f.content)));
        const { data: blob } = await octokit.rest.git.createBlob({
          owner: userLogin, repo: GITHUB_REPO, content: b64, encoding: 'base64'
        });
        return { path: f.path, mode: '100644', type: 'blob', sha: blob.sha };
      }));

      const treeEntries = [
        ...imageBlobs.map(b => ({ path: b.path, mode: '100644', type: 'blob', sha: b.sha })),
        ...mdBlobEntries
      ];

      const { data: newTree } = await octokit.rest.git.createTree({
        owner: userLogin, repo: GITHUB_REPO,
        base_tree: baseCommit.tree.sha, tree: treeEntries
      });
      const { data: newCommit } = await octokit.rest.git.createCommit({
        owner: userLogin, repo: GITHUB_REPO,
        message: `Add ${fileData.length} photo(s): ${desc.substring(0, 50)}`,
        tree: newTree.sha, parents: [baseSha]
      });
      await octokit.rest.git.updateRef({
        owner: userLogin, repo: GITHUB_REPO,
        ref: `heads/${branchName}`, sha: newCommit.sha
      });
      setGalleryProgress(4, 'success');

      setGalleryProgress(5, 'loading');
      // (step 5 was committing — now step 5 is just the old step 5+6 combined)
      setGalleryProgress(5, 'success');

      setGalleryProgress(6, 'loading');
      const { data: pr } = await octokit.rest.pulls.create({
        owner: GITHUB_OWNER, repo: GITHUB_REPO,
        title: `Add photos to ${currentPageTitle}`,
        head: `${userLogin}:${branchName}`, base: GITHUB_BRANCH,
        body: `## Photo Submission\n\n**Description:** ${desc}\n**Date:** ${dateStr}\n**Page:** ${currentPageTitle}\n\n**Files:** ${fileData.length} photo(s)`
      });
      setGalleryProgress(6, 'success');

      document.getElementById('gallery-progress').style.display = 'none';
      document.getElementById('gallery-success').style.display = 'block';
      document.getElementById('gallery-pr-link').href = pr.html_url;

    } catch (error) {
      console.error('Gallery upload error:', error);
      document.getElementById('gallery-progress').style.display = 'none';
      document.getElementById('gallery-error').style.display = 'block';
      document.getElementById('gallery-error-msg').textContent = error.message;
    }
  }

})();