export interface Stat {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: string;
  color: string;
}

export const dashboardStats: Stat[] = [
  { label: 'Active Projects', value: '12', change: '+2 this week', trend: 'up', icon: 'FolderKanban', color: 'primary' },
  { label: 'Tasks Completed', value: '248', change: '+18% vs last week', trend: 'up', icon: 'CheckCircle2', color: 'success' },
  { label: 'DSA Solved', value: '1,432', change: '+47 this month', trend: 'up', icon: 'Code2', color: 'info' },
  { label: 'GitHub Commits', value: '3,891', change: '-4% vs last week', trend: 'down', icon: 'GitCommit', color: 'warning' },
];

export interface RecentProject {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'completed' | 'planning';
  members: number;
  dueDate: string;
  color: string;
}

export const recentProjects: RecentProject[] = [
  { id: 'p1', name: 'Nebula UI Kit', description: 'Component library for internal tools', status: 'active', members: 5, dueDate: 'Aug 14', color: 'primary' },
  { id: 'p2', name: 'Orbit API Gateway', description: 'Edge routing and rate limiting', status: 'active', members: 3, dueDate: 'Aug 22', color: 'info' },
  { id: 'p3', name: 'Pulse Analytics', description: 'Real-time event streaming dashboard', status: 'planning', members: 4, dueDate: 'Sep 03', color: 'warning' },
  { id: 'p4', name: 'Atlas Mobile', description: 'React Native companion app', status: 'paused', members: 6, dueDate: 'Sep 10', color: 'success' },
  { id: 'p5', name: 'Quantum Docs', description: 'Markdown wiki engine', status: 'completed', members: 2, dueDate: 'Jul 28', color: 'chart-4' },
];

export interface OngoingTask {
  id: string;
  title: string;
  project: string;
  dueDate: string;
  assignees: string[];
}

export const ongoingTasks: OngoingTask[] = [
  { id: 't1', title: 'Refactor auth middleware', project: 'Orbit API Gateway', dueDate: 'Today', assignees: ['AK', 'JD'] },
  { id: 't2', title: 'Design chart tooltip system', project: 'Pulse Analytics', dueDate: 'Tomorrow', assignees: ['ML'] },
  { id: 't3', title: 'Fix mobile header overflow', project: 'Atlas Mobile', dueDate: 'Today', assignees: ['AK', 'SR', 'TN'] },
  { id: 't4', title: 'Write Button accessibility tests', project: 'Nebula UI Kit', dueDate: 'Aug 06', assignees: ['JD'] },
  { id: 't5', title: 'Migrate wiki to MDX', project: 'Quantum Docs', dueDate: 'Aug 08', assignees: ['ML', 'AK'] },
];

export interface GithubOverview {
  totalCommits: number;
  totalRepos: number;
  totalPRs: number;
  totalStars: number;
  weeklyCommits: { day: string; commits: number }[];
  topRepos: { name: string; stars: number; language: string; color: string }[];
}

export const githubOverview: GithubOverview = {
  totalCommits: 3891,
  totalRepos: 47,
  totalPRs: 184,
  totalStars: 1284,
  weeklyCommits: [
    { day: 'Mon', commits: 12 },
    { day: 'Tue', commits: 19 },
    { day: 'Wed', commits: 24 },
    { day: 'Thu', commits: 17 },
    { day: 'Fri', commits: 31 },
    { day: 'Sat', commits: 8 },
    { day: 'Sun', commits: 5 },
  ],
  topRepos: [
    { name: 'trackport/core', stars: 412, language: 'TypeScript', color: 'primary' },
    { name: 'trackport/ui', stars: 287, language: 'TypeScript', color: 'info' },
    { name: 'orbit/gateway', stars: 198, language: 'Go', color: 'success' },
    { name: 'nebula/kit', stars: 156, language: 'TypeScript', color: 'warning' },
  ],
};

export interface DsaOverview {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalEasy: number;
  totalMedium: number;
  totalHard: number;
  streak: number;
  solvedToday: number;
  weekActivity: { day: string; solved: number }[];
}

export const dsaOverview: DsaOverview = {
  totalSolved: 1432,
  easySolved: 487,
  mediumSolved: 712,
  hardSolved: 233,
  totalEasy: 620,
  totalMedium: 980,
  totalHard: 420,
  streak: 23,
  solvedToday: 2,
  weekActivity: [
    { day: 'Mon', solved: 3 },
    { day: 'Tue', solved: 4 },
    { day: 'Wed', solved: 2 },
    { day: 'Thu', solved: 3 },
    { day: 'Fri', solved: 5 },
    { day: 'Sat', solved: 4 },
    { day: 'Sun', solved: 2 },
  ],
};

export const weeklyActivity: { day: string; tasks: number; commits: number; dsa: number }[] = [
  { day: 'Mon', tasks: 6, commits: 12, dsa: 2 },
  { day: 'Tue', tasks: 8, commits: 19, dsa: 3 },
  { day: 'Wed', tasks: 5, commits: 24, dsa: 4 },
  { day: 'Thu', tasks: 9, commits: 17, dsa: 2 },
  { day: 'Fri', tasks: 11, commits: 31, dsa: 5 },
  { day: 'Sat', tasks: 3, commits: 8, dsa: 6 },
  { day: 'Sun', tasks: 2, commits: 5, dsa: 4 },
];
