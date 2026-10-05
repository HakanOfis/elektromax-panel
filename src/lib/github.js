import { BRANCH, CONTENT_PATH, OWNER, PANEL_CONFIG_PATH, REPO } from "@/config";

const API = "https://api.github.com";

export class GitHubError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function call(token, path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
    cache: "no-store",
  });
  if (!res.ok) {
    let msg = res.statusText;
    try {
      msg = (await res.json()).message ?? msg;
    } catch {
      // geen json
    }
    throw new GitHubError(res.status, msg);
  }
  return res.status === 204 ? null : res.json();
}

const repoPath = `/repos/${OWNER}/${REPO}`;

function decodeBase64Utf8(b64) {
  const bytes = Uint8Array.from(atob(b64.replace(/\n/g, "")), (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function utf8ToBase64(text) {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

// Versleutelde paneelconfiguratie: publiek leesbaar (zonder sleutel).
export async function loadPanelConfig() {
  try {
    const f = await call(null, `${repoPath}/contents/${PANEL_CONFIG_PATH}?ref=${BRANCH}`);
    return JSON.parse(decodeBase64Utf8(f.content));
  } catch (e) {
    if (e.status === 404) return null;
    throw e;
  }
}

export async function loadContent(token) {
  const f = await call(token, `${repoPath}/contents/${CONTENT_PATH}?ref=${BRANCH}`);
  return JSON.parse(decodeBase64Utf8(f.content));
}

export async function checkToken(token) {
  const repo = await call(token, repoPath);
  const repos = await call(token, `/user/repos?per_page=100`).catch(() => null);
  return {
    canPush: Boolean(repo.permissions?.push),
    // Fine-grained sleutels kunnen ALLE publieke repo's lezen (niet schrijven); die tellen dus niet mee.
    // Zichtbare privé-repo's betekenen wél dat de sleutel te ruim is ingesteld.
    otherRepos: Array.isArray(repos)
      ? repos.filter((r) => r.private && r.full_name.toLowerCase() !== `${OWNER}/${REPO}`.toLowerCase()).map((r) => r.full_name)
      : [],
  };
}

export async function putFile(token, path, base64, message) {
  let sha;
  try {
    sha = (await call(token, `${repoPath}/contents/${path}?ref=${BRANCH}`)).sha;
  } catch (e) {
    if (e.status !== 404) throw e;
  }
  return call(token, `${repoPath}/contents/${path}`, {
    method: "PUT",
    body: JSON.stringify({ message, content: base64, branch: BRANCH, ...(sha ? { sha } : {}) }),
  });
}

// Alle wijzigingen (tekst + foto's) in één commit, via de Git Data API.
export async function commitFiles(token, files, message) {
  const ref = await call(token, `${repoPath}/git/ref/heads/${BRANCH}`);
  const parent = await call(token, `${repoPath}/git/commits/${ref.object.sha}`);
  const tree = [];
  for (const f of files) {
    const blob = await call(token, `${repoPath}/git/blobs`, {
      method: "POST",
      body: JSON.stringify({ content: f.base64, encoding: "base64" }),
    });
    tree.push({ path: f.path, mode: "100644", type: "blob", sha: blob.sha });
  }
  const newTree = await call(token, `${repoPath}/git/trees`, {
    method: "POST",
    body: JSON.stringify({ base_tree: parent.tree.sha, tree }),
  });
  const commit = await call(token, `${repoPath}/git/commits`, {
    method: "POST",
    body: JSON.stringify({ message, tree: newTree.sha, parents: [ref.object.sha] }),
  });
  await call(token, `${repoPath}/git/refs/heads/${BRANCH}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: commit.sha }),
  });
  return commit.sha;
}

// Laatste publicatie-run (vereist Actions: Read; anders null).
export async function latestDeploy(token) {
  try {
    const r = await call(token, `${repoPath}/actions/runs?per_page=1&branch=${BRANCH}`);
    const run = r.workflow_runs?.[0];
    return run ? { sha: run.head_sha, status: run.status, conclusion: run.conclusion, url: run.html_url } : null;
  } catch {
    return null;
  }
}
