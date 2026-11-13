export interface Repo {
  id: string;
  name: string;
  fullName: string;
  description: string;
  language: string;
  languageColor: string;
  stars: number;
  forks: number;
  watchers: number;
  isPrivate: boolean;
  defaultBranch: string;
  updatedAt: string;
  openIssues: number;
  openPRs: number;
}

export const repositories: Repo[] = [
  { id: 'r1', name: 'core', fullName: 'trackport/core', description: 'Core platform services and shared infrastructure.', language: 'TypeScript', languageColor: 'primary', stars: 412, forks: 87, watchers: 24, isPrivate: false, defaultBranch: 'main', updatedAt: '2h ago', openIssues: 14, openPRs: 6 },
  { id: 'r2', name: 'ui', fullName: 'trackport/ui', description: 'Design system and React component library.', language: 'TypeScript', languageColor: 'info', stars: 287, forks: 42, watchers: 18, isPrivate: false, defaultBranch: 'main', updatedAt: '5h ago', openIssues: 8, openPRs: 3 },
  { id: 'r3', name: 'gateway', fullName: 'orbit/gateway', description: 'Edge API gateway with rate limiting and routing.', language: 'Go', languageColor: 'success', stars: 198, forks: 31, watchers: 12, isPrivate: false, defaultBranch: 'main', updatedAt: '1d ago', openIssues: 5, openPRs: 2 },
  { id: 'r4', name: 'kit', fullName: 'nebula/kit', description: 'Headless UI primitives for building accessible apps.', language: 'TypeScript', languageColor: 'warning', stars: 156, forks: 28, watchers: 9, isPrivate: false, defaultBranch: 'develop', updatedAt: '3d ago', openIssues: 11, openPRs: 4 },
  { id: 'r5', name: 'cli', fullName: 'trackport/cli', description: 'Developer CLI for scaffolding projects and deployment.', language: 'Rust', languageColor: 'destructive', stars: 234, forks: 19, watchers: 15, isPrivate: false, defaultBranch: 'main', updatedAt: '6h ago', openIssues: 3, openPRs: 1 },
  { id: 'r6', name: 'auth', fullName: 'trackport/auth', description: 'OAuth2 identity provider and SSO service.', language: 'Go', languageColor: 'success', stars: 121, forks: 22, watchers: 8, isPrivate: true, defaultBranch: 'main', updatedAt: '1h ago', openIssues: 2, openPRs: 0 },
];

export interface Commit {
  id: string;
  hash: string;
  message: string;
  author: string;
  repo: string;
  branch: string;
  time: string;
  additions: number;
  deletions: number;
}

export const recentCommits: Commit[] = [
  { id: 'c1', hash: 'a3f2d1c', message: 'feat(auth): implement JWT refresh token rotation', author: 'Alex Kim', repo: 'trackport/auth', branch: 'main', time: '2h ago', additions: 142, deletions: 38 },
  { id: 'c2', hash: '7b8e9f2', message: 'fix(ui): resolve Tooltip positioning on edge cases', author: 'Alex Kim', repo: 'trackport/ui', branch: 'main', time: '5h ago', additions: 24, deletions: 12 },
  { id: 'c3', hash: 'c1d4a8b', message: 'feat(gateway): add token bucket rate limiter', author: 'Alex Kim', repo: 'orbit/gateway', branch: 'main', time: '8h ago', additions: 287, deletions: 14 },
  { id: 'c4', hash: '9e2f1c4', message: 'refactor(cli): extract scaffold templates', author: 'Alex Kim', repo: 'trackport/cli', branch: 'feature/templates', time: '1d ago', additions: 156, deletions: 98 },
  { id: 'c5', hash: '4a7b2e9', message: 'test(ui): add keyboard navigation coverage for Button', author: 'Alex Kim', repo: 'trackport/ui', branch: 'main', time: '1d ago', additions: 64, deletions: 2 },
  { id: 'c6', hash: 'f8c3d5a', message: 'docs(core): update API reference for v2', author: 'Alex Kim', repo: 'trackport/core', branch: 'main', time: '2d ago', additions: 312, deletions: 45 },
  { id: 'c7', hash: '2d9e4f1', message: 'perf(gateway): optimize Redis connection pooling', author: 'Alex Kim', repo: 'orbit/gateway', branch: 'main', time: '2d ago', additions: 38, deletions: 72 },
  { id: 'c8', hash: 'b6a1c7e', message: 'feat(ui): add dark mode to chart components', author: 'Alex Kim', repo: 'trackport/ui', branch: 'feature/charts-dark', time: '3d ago', additions: 198, deletions: 24 },
];

export interface Branch {
  id: string;
  name: string;
  repo: string;
  lastCommit: string;
  author: string;
  updated: string;
  ahead: number;
  behind: number;
  isDefault: boolean;
}

export const branches: Branch[] = [
  { id: 'b1', name: 'main', repo: 'trackport/core', lastCommit: 'a3f2d1c', author: 'Alex Kim', updated: '2h ago', ahead: 0, behind: 0, isDefault: true },
  { id: 'b2', name: 'feature/auth-rotation', repo: 'trackport/core', lastCommit: '7b8e9f2', author: 'Alex Kim', updated: '5h ago', ahead: 4, behind: 1, isDefault: false },
  { id: 'b3', name: 'fix/tooltip-edge', repo: 'trackport/ui', lastCommit: 'c1d4a8b', author: 'Alex Kim', updated: '8h ago', ahead: 2, behind: 3, isDefault: false },
  { id: 'b4', name: 'develop', repo: 'trackport/ui', lastCommit: '9e2f1c4', author: 'Alex Kim', updated: '1d ago', ahead: 8, behind: 0, isDefault: true },
  { id: 'b5', name: 'feature/templates', repo: 'trackport/cli', lastCommit: '4a7b2e9', author: 'Alex Kim', updated: '1d ago', ahead: 6, behind: 2, isDefault: false },
  { id: 'b6', name: 'release/v2.4', repo: 'trackport/auth', lastCommit: 'f8c3d5a', author: 'Alex Kim', updated: '2d ago', ahead: 3, behind: 0, isDefault: false },
];

export interface PullRequest {
  id: string;
  number: number;
  title: string;
  repo: string;
  branch: string;
  author: string;
  status: 'open' | 'merged' | 'closed' | 'draft';
  reviews: number;
  comments: number;
  additions: number;
  deletions: number;
  updated: string;
}

export const pullRequests: PullRequest[] = [
  { id: 'pr1', number: 284, title: 'Add Tooltip animations with spring physics', repo: 'trackport/ui', branch: 'fix/tooltip-edge', author: 'Alex Kim', status: 'open', reviews: 2, comments: 4, additions: 142, deletions: 38, updated: '2h ago' },
  { id: 'pr2', number: 283, title: 'Implement token bucket rate limiter', repo: 'orbit/gateway', branch: 'feature/rate-limit', author: 'Alex Kim', status: 'merged', reviews: 3, comments: 8, additions: 287, deletions: 14, updated: '5h ago' },
  { id: 'pr3', number: 282, title: 'Migrate wiki content to MDX format', repo: 'trackport/core', branch: 'feature/mdx', author: 'Alex Kim', status: 'open', reviews: 1, comments: 3, additions: 312, deletions: 45, updated: '8h ago' },
  { id: 'pr4', number: 281, title: 'OAuth2 SSO integration with Google', repo: 'trackport/auth', branch: 'feature/google-sso', author: 'Alex Kim', status: 'draft', reviews: 0, comments: 1, additions: 98, deletions: 12, updated: '1d ago' },
  { id: 'pr5', number: 280, title: 'Dark mode for chart components', repo: 'trackport/ui', branch: 'feature/charts-dark', author: 'Alex Kim', status: 'open', reviews: 2, comments: 5, additions: 198, deletions: 24, updated: '1d ago' },
  { id: 'pr6', number: 279, title: 'Optimize Redis connection pooling', repo: 'orbit/gateway', branch: 'perf/redis-pool', author: 'Alex Kim', status: 'merged', reviews: 4, comments: 6, additions: 38, deletions: 72, updated: '2d ago' },
  { id: 'pr7', number: 278, title: 'Extract scaffold templates from CLI', repo: 'trackport/cli', branch: 'feature/templates', author: 'Alex Kim', status: 'closed', reviews: 1, comments: 2, additions: 156, deletions: 98, updated: '3d ago' },
];

export interface ActivityItem {
  id: string;
  type: 'commit' | 'pr' | 'issue' | 'star' | 'fork' | 'release' | 'review';
  action: string;
  target: string;
  repo: string;
  time: string;
}

export const githubActivity: ActivityItem[] = [
  { id: 'g1', type: 'commit', action: 'pushed to', target: 'main', repo: 'trackport/auth', time: '2h ago' },
  { id: 'g2', type: 'pr', action: 'opened pull request', target: '#284', repo: 'trackport/ui', time: '3h ago' },
  { id: 'g3', type: 'review', action: 'reviewed pull request', target: '#283', repo: 'orbit/gateway', time: '4h ago' },
  { id: 'g4', type: 'star', action: 'starred', target: 'vercel/next.js', repo: '', time: '5h ago' },
  { id: 'g5', type: 'commit', action: 'pushed to', target: 'main', repo: 'trackport/ui', time: '5h ago' },
  { id: 'g6', type: 'issue', action: 'closed issue', target: '#92', repo: 'trackport/core', time: '6h ago' },
  { id: 'g7', type: 'release', action: 'released', target: 'v2.4.1', repo: 'trackport/auth', time: '8h ago' },
  { id: 'g8', type: 'fork', action: 'forked', target: 'facebook/react', repo: '', time: '1d ago' },
  { id: 'g9', type: 'pr', action: 'merged pull request', target: '#283', repo: 'orbit/gateway', time: '1d ago' },
  { id: 'g10', type: 'commit', action: 'pushed to', target: 'feature/templates', repo: 'trackport/cli', time: '1d ago' },
];

// Contribution graph: 53 weeks x 7 days
export interface ContributionCell {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

function generateContributions(): ContributionCell[] {
  const cells: ContributionCell[] = [];
  const today = new Date('2026-08-02');
  for (let i = 370; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dow = d.getDay();
    const base = dow === 0 || dow === 6 ? 0.35 : 0.75;
    const r = Math.random();
    let count = 0;
    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (r < base * 0.2) { count = 0; level = 0; }
    else if (r < base * 0.45) { count = 1 + Math.floor(Math.random() * 2); level = 1; }
    else if (r < base * 0.7) { count = 3 + Math.floor(Math.random() * 3); level = 2; }
    else if (r < base * 0.9) { count = 6 + Math.floor(Math.random() * 5); level = 3; }
    else { count = 11 + Math.floor(Math.random() * 10); level = 4; }
    cells.push({ date: d.toISOString().slice(0, 10), count, level });
  }
  return cells;
}

export const contributions: ContributionCell[] = generateContributions();

export const contributionStats = {
  total: 3891,
  streak: 47,
  longestStreak: 89,
  bestDay: 18,
  avgPerDay: 10.5,
};

export const monthlyCommits = [
  { month: 'Jan', commits: 142 },
  { month: 'Feb', commits: 198 },
  { month: 'Mar', commits: 231 },
  { month: 'Apr', commits: 184 },
  { month: 'May', commits: 289 },
  { month: 'Jun', commits: 312 },
  { month: 'Jul', commits: 378 },
  { month: 'Aug', commits: 157 },
];
