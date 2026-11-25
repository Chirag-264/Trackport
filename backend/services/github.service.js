// Service to fetch GitHub repository statistics.
// Uses the public GitHub REST API. No authentication required for public repos.
// Returns a subset of repo data useful for the dashboard.

import https from 'https';
import { URL } from 'url';

/**
 * Extract owner and repo name from a GitHub URL.
 * Supports URLs like:
 *   https://github.com/owner/repo
 *   git@github.com:owner/repo.git
 */
function parseGithubUrl(githubUrl) {
  try {
    const url = new URL(githubUrl.replace(/^git@/, 'https://'));
    if (!['github.com', 'www.github.com'].includes(url.hostname.toLowerCase())) return null;
    const [owner, repo] = url.pathname.replace(/^\//, '').replace(/\.git$/, '').split('/');
    if (!owner || !repo || !/^[a-zA-Z0-9_.-]+$/.test(owner) || !/^[a-zA-Z0-9_.-]+$/.test(repo)) return null;
    return { owner, repo };
  } catch (_) {
    // SSH remotes use a colon before the owner/repository path.
    const match = String(githubUrl).match(/^git@github\.com:([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+?)(?:\.git)?$/);
    if (match) return { owner: match[1], repo: match[2] };
    return null;
  }
}

function httpsGetJson(options) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (res.statusCode < 200 || res.statusCode >= 300) {
            const error = new Error(json.message || `GitHub returned HTTP ${res.statusCode}`);
            error.statusCode = res.statusCode === 404 ? 404 : res.statusCode === 403 ? 429 : 502;
            reject(error);
            return;
          }
          resolve(json);
        } catch (e) {
          reject(e);
        }
      });
    });
    req.setTimeout(8000, () => req.destroy(new Error('GitHub request timed out')));
    req.on('error', reject);
    req.end();
  });
}

export async function getRepoStats(githubUrl) {
  const parsed = parseGithubUrl(githubUrl);
  if (!parsed) {
    const error = new Error('Enter a valid GitHub repository URL');
    error.statusCode = 400;
    throw error;
  }
  const { owner, repo } = parsed;
  const options = {
    hostname: 'api.github.com',
    path: `/repos/${owner}/${repo}`,
    method: 'GET',
    headers: {
      'User-Agent': 'TrackPort-App',
      Accept: 'application/vnd.github.v3+json',
    },
  };
  const data = await httpsGetJson(options);
  // Return only the fields the frontend needs.
  return {
    stargazers_count: data.stargazers_count,
    forks_count: data.forks_count,
    open_issues_count: data.open_issues_count,
    watchers_count: data.watchers_count,
    language: data.language,
    description: data.description,
    html_url: data.html_url,
    owner: data.owner?.login,
    avatar_url: data.owner?.avatar_url,
  };
}

export async function getGithubUserStats(username) {
  const safeUsername = String(username || '').trim();
  if (!/^[a-zA-Z0-9-]{1,39}$/.test(safeUsername)) throw new Error('Invalid GitHub username');
  const data = await httpsGetJson({
    hostname: 'api.github.com',
    path: `/users/${encodeURIComponent(safeUsername)}`,
    method: 'GET',
    headers: { 'User-Agent': 'TrackPort-App', Accept: 'application/vnd.github.v3+json' }
  });
  return {
    login: data.login,
    name: data.name,
    avatar_url: data.avatar_url,
    public_repos: data.public_repos,
    followers: data.followers,
    following: data.following,
    html_url: data.html_url
  };
}

export async function getGithubRepositories(username) {
  const safeUsername = String(username || '').trim();
  if (!/^[a-zA-Z0-9-]{1,39}$/.test(safeUsername)) {
    const error = new Error('Add a valid GitHub username in Settings before importing repositories');
    error.statusCode = 400;
    throw error;
  }
  const data = await httpsGetJson({
    hostname: 'api.github.com',
    path: `/users/${encodeURIComponent(safeUsername)}/repos?type=owner&sort=updated&per_page=100`,
    method: 'GET',
    headers: { 'User-Agent': 'TrackPort-App', Accept: 'application/vnd.github.v3+json' }
  });
  if (!Array.isArray(data)) {
    const error = new Error('GitHub returned an unexpected repository list');
    error.statusCode = 502;
    throw error;
  }
  return data.map((repo) => ({
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description || '',
    htmlUrl: repo.html_url,
    homepage: repo.homepage || '',
    language: repo.language || '',
    topics: Array.isArray(repo.topics) ? repo.topics : [],
    stars: repo.stargazers_count || 0,
    updatedAt: repo.updated_at,
    fork: Boolean(repo.fork)
  }));
}

