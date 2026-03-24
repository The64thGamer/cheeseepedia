/**
 * EditorGitHub.js
 * Handles the GitHub API: fork, branch, multi-file commit, pull request.
 */

import { getToken, getAllChanges, clearAllChanges } from './EditorStore.js';

const OWNER  = 'The64thGamer';
const REPO   = 'cheeseepedia';
const BRANCH = 'main';

async function ghFetch(path, opts = {}) {
  const token = getToken();
  if (!token) throw new Error('No GitHub token set.');
  const res = await fetch(`https://api.github.com${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `GitHub API error ${res.status}`);
  }
  return res.status === 204 ? null : res.json();
}

export async function getAuthenticatedUser() {
  return ghFetch('/user');
}

async function ensureForkSynced(userLogin) {
  // Create fork if it doesn't exist
  let forkExists = false;
  try {
    await ghFetch(`/repos/${userLogin}/${REPO}`);
    forkExists = true;
  } catch {
    await ghFetch(`/repos/${OWNER}/${REPO}/forks`, { method: 'POST', body: {} });
    for (let i = 0; i < 12; i++) {
      await new Promise(r => setTimeout(r, 2500));
      try { await ghFetch(`/repos/${userLogin}/${REPO}`); forkExists = true; break; } catch {}
    }
  }

  // Always sync fork to upstream main before branching so PRs show real diffs
  try {
    await ghFetch(`/repos/${userLogin}/${REPO}/merge-upstream`, {
      method: 'POST',
      body: { branch: BRANCH },
    });
  } catch {
    // merge-upstream may fail if already up to date — that's fine
  }
}

async function getUpstreamSha() {
  // Always read from upstream (OWNER), not fork, so we're on latest main
  const ref = await ghFetch(`/repos/${OWNER}/${REPO}/git/ref/heads/${BRANCH}`);
  return ref.object.sha;
}

async function createBranch(userLogin, sha) {
  const branchName = `cep-edit-${Date.now()}`;
  await ghFetch(`/repos/${userLogin}/${REPO}/git/refs`, {
    method: 'POST',
    body: { ref: `refs/heads/${branchName}`, sha },
  });
  return branchName;
}

function toBase64(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

/**
 * Push all pending changes as a single commit and open a PR.
 * onProgress(pct, message) — called with 0–100 and a status string.
 */
export async function pushAllChanges(onProgress) {
  onProgress(0, 'Authenticating…');
  const user = await getAuthenticatedUser();
  const userLogin = user.login;

  onProgress(10, 'Syncing fork to latest main…');
  await ensureForkSynced(userLogin);

  onProgress(20, 'Getting latest upstream commit…');
  const sha = await getUpstreamSha();

  onProgress(25, 'Creating branch…');
  const branchName = await createBranch(userLogin, sha);

  const changes = getAllChanges();
  const entries = Object.entries(changes);
  const treeItems = [];

  onProgress(30, 'Preparing files…');
  let i = 0;
  for (const [articleId, change] of entries) {
    // meta.json — add contributor at push time
    if (change.meta) {
      let finalMeta = { ...change.meta };
      const name = (change.editorName || 'Anonymous').trim();
      const existing = finalMeta.contributors || [];
      if (!existing.some(c => c.toLowerCase() === name.toLowerCase())) {
        finalMeta = { ...finalMeta, contributors: [...existing, name] };
      }
      const content = toBase64(JSON.stringify(finalMeta, null, 2));
      const blob = await ghFetch(`/repos/${userLogin}/${REPO}/git/blobs`, {
        method: 'POST', body: { content, encoding: 'base64' },
      });
      treeItems.push({ path: `content/${articleId}/meta.json`, mode: '100644', type: 'blob', sha: blob.sha });
    }
    // content.md
    if (change.content !== undefined) {
      const blob = await ghFetch(`/repos/${userLogin}/${REPO}/git/blobs`, {
        method: 'POST', body: { content: toBase64(change.content), encoding: 'base64' },
      });
      treeItems.push({ path: `content/${articleId}/content.md`, mode: '100644', type: 'blob', sha: blob.sha });
    }
    // photo.avif (stored as base64 data URL, strip prefix)
    if (change.photo) {
      const raw = change.photo.includes(',') ? change.photo.split(',')[1] : change.photo;
      const blob = await ghFetch(`/repos/${userLogin}/${REPO}/git/blobs`, {
        method: 'POST', body: { content: raw, encoding: 'base64' },
      });
      treeItems.push({ path: `content/${articleId}/photo.avif`, mode: '100644', type: 'blob', sha: blob.sha });
    }
    i++;
    onProgress(30 + Math.floor((i / entries.length) * 40), `Uploading ${i}/${entries.length} files…`);
  }

  onProgress(72, 'Creating tree…');
  // Use upstream base commit tree so we diff against real current state
  const baseCommit = await ghFetch(`/repos/${OWNER}/${REPO}/git/commits/${sha}`);
  const newTree = await ghFetch(`/repos/${userLogin}/${REPO}/git/trees`, {
    method: 'POST',
    body: { base_tree: baseCommit.tree.sha, tree: treeItems },
  });

  onProgress(82, 'Creating commit…');
  const changedTitles = entries.map(([, c]) => c.meta?.title || c.articleId).filter(Boolean);
  const commitMsg = changedTitles.length <= 3
    ? `Edit: ${changedTitles.join(', ')}`
    : `Edit ${changedTitles.length} articles`;

  const newCommit = await ghFetch(`/repos/${userLogin}/${REPO}/git/commits`, {
    method: 'POST',
    body: { message: commitMsg, tree: newTree.sha, parents: [sha] },
  });

  onProgress(90, 'Pushing…');
  await ghFetch(`/repos/${userLogin}/${REPO}/git/refs/heads/${branchName}`, {
    method: 'PATCH', body: { sha: newCommit.sha },
  });

  onProgress(95, 'Opening pull request…');
  const pr = await ghFetch(`/repos/${OWNER}/${REPO}/pulls`, {
    method: 'POST',
    body: {
      title: commitMsg,
      head: `${userLogin}:${branchName}`,
      base: BRANCH,
      body: `Submitted via Cheese-E-Pedia editor.\n\nChanged articles:\n${changedTitles.map(t => `- ${t}`).join('\n')}`,
    },
  });

  onProgress(100, 'Done!');
  clearAllChanges();
  window.dispatchEvent(new CustomEvent('cep-changes-updated'));
  return pr;
}
