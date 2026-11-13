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
    const [owner, repo] = url.pathname.replace(/^\//, '').replace(/\.git$/, '').split('/');
    if (!owner || !repo) return null;
    return { owner, repo };
  } catch (_) {
    // Fallback for SSH style URLs.
    const match = githubUrl.match(/github\.com[:/](.+?)\/(.+?)(\.git)?$/);
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
          resolve(json);
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

export async function getRepoStats(githubUrl) {
  const parsed = parseGithubUrl(githubUrl);
  if (!parsed) {
    throw new Error('Invalid GitHub URL');
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

