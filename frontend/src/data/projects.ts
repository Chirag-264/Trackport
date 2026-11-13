export type ProjectStatus = 'active' | 'paused' | 'completed' | 'planning';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Project {
  id: string;
  name: string;
  key: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  members: number;
  tasksTotal: number;
  tasksDone: number;
  dueDate: string;
  startDate: string;
  language: string;
  languageColor: string;
  stars: number;
  lastActivity: string;
  tags: string[];
}

export const projects: Project[] = [
  { id: 'p1', name: 'Nebula UI Kit', key: 'NEB', description: 'Component library for internal tools and design system.', status: 'active', progress: 78, members: 5, tasksTotal: 64, tasksDone: 50, dueDate: '2026-08-14', startDate: '2026-06-01', language: 'TypeScript', languageColor: 'primary', stars: 412, lastActivity: '2h ago', tags: ['design-system', 'react', 'ui'] },
  { id: 'p2', name: 'Orbit API Gateway', key: 'ORB', description: 'Edge routing, rate limiting, and auth middleware.', status: 'active', progress: 45, members: 3, tasksTotal: 38, tasksDone: 17, dueDate: '2026-08-22', startDate: '2026-07-10', language: 'Go', languageColor: 'success', stars: 198, lastActivity: '5h ago', tags: ['backend', 'api', 'edge'] },
  { id: 'p3', name: 'Pulse Analytics', key: 'PLS', description: 'Real-time event streaming dashboard with charts.', status: 'planning', progress: 12, members: 4, tasksTotal: 52, tasksDone: 6, dueDate: '2026-09-03', startDate: '2026-07-25', language: 'TypeScript', languageColor: 'info', stars: 87, lastActivity: '1d ago', tags: ['analytics', 'realtime', 'charts'] },
  { id: 'p4', name: 'Atlas Mobile', key: 'ATL', description: 'React Native companion app for the platform.', status: 'paused', progress: 60, members: 6, tasksTotal: 44, tasksDone: 26, dueDate: '2026-09-10', startDate: '2026-05-15', language: 'TypeScript', languageColor: 'warning', stars: 156, lastActivity: '3d ago', tags: ['mobile', 'react-native'] },
  { id: 'p5', name: 'Quantum Docs', key: 'QDM', description: 'Markdown wiki engine with MDX support.', status: 'completed', progress: 100, members: 2, tasksTotal: 28, tasksDone: 28, dueDate: '2026-07-28', startDate: '2026-06-20', language: 'TypeScript', languageColor: 'chart-4', stars: 73, lastActivity: '1w ago', tags: ['docs', 'mdx'] },
  { id: 'p6', name: 'Vortex CLI', key: 'VTX', description: 'Developer CLI for scaffolding and deployment.', status: 'active', progress: 33, members: 2, tasksTotal: 22, tasksDone: 7, dueDate: '2026-08-30', startDate: '2026-07-18', language: 'Rust', languageColor: 'destructive', stars: 234, lastActivity: '6h ago', tags: ['cli', 'rust', 'tooling'] },
  { id: 'p7', name: 'Lumen Auth', key: 'LUM', description: 'OAuth2 and SSO identity provider service.', status: 'active', progress: 88, members: 3, tasksTotal: 31, tasksDone: 27, dueDate: '2026-08-12', startDate: '2026-06-10', language: 'Go', languageColor: 'success', stars: 121, lastActivity: '1h ago', tags: ['auth', 'security', 'backend'] },
  { id: 'p8', name: 'Drift Chat', key: 'DRF', description: 'WebSocket-based realtime chat platform.', status: 'planning', progress: 8, members: 4, tasksTotal: 48, tasksDone: 4, dueDate: '2026-09-20', startDate: '2026-07-28', language: 'TypeScript', languageColor: 'primary', stars: 45, lastActivity: '2d ago', tags: ['realtime', 'chat', 'websockets'] },
  { id: 'p9', name: 'Sentry Monitor', key: 'SNT', description: 'Uptime and error tracking for production apps.', status: 'active', progress: 67, members: 3, tasksTotal: 36, tasksDone: 24, dueDate: '2026-08-18', startDate: '2026-06-28', language: 'Python', languageColor: 'info', stars: 168, lastActivity: '4h ago', tags: ['monitoring', 'observability'] },
  { id: 'p10', name: 'Forge Builder', key: 'FRG', description: 'CI/CD pipeline orchestration engine.', status: 'paused', progress: 52, members: 5, tasksTotal: 58, tasksDone: 30, dueDate: '2026-09-05', startDate: '2026-05-30', language: 'Go', languageColor: 'success', stars: 92, lastActivity: '5d ago', tags: ['ci-cd', 'devops'] },
  { id: 'p11', name: 'Echo Forms', key: 'ECH', description: 'Dynamic form builder with validation engine.', status: 'active', progress: 71, members: 2, tasksTotal: 26, tasksDone: 18, dueDate: '2026-08-25', startDate: '2026-07-05', language: 'TypeScript', languageColor: 'warning', stars: 64, lastActivity: '3h ago', tags: ['forms', 'react'] },
  { id: 'p12', name: 'Nova Search', key: 'NOV', description: 'Full-text search service with vector ranking.', status: 'planning', progress: 5, members: 3, tasksTotal: 42, tasksDone: 2, dueDate: '2026-10-01', startDate: '2026-07-30', language: 'Python', languageColor: 'info', stars: 31, lastActivity: '1d ago', tags: ['search', 'ai', 'backend'] },
];

export interface ProjectActivity {
  id: string;
  project: string;
  action: string;
  user: string;
  time: string;
  type: 'commit' | 'pr' | 'task' | 'comment' | 'deploy';
}

export const projectActivity: ProjectActivity[] = [
  { id: 'a1', project: 'Nebula UI Kit', action: 'merged PR #284: Add Tooltip animations', user: 'AK', time: '2h ago', type: 'pr' },
  { id: 'a2', project: 'Orbit API Gateway', action: 'committed: feat(rate-limit) token bucket', user: 'JD', time: '5h ago', type: 'commit' },
  { id: 'a3', project: 'Lumen Auth', action: 'deployed v2.4.1 to production', user: 'ML', time: '1h ago', type: 'deploy' },
  { id: 'a4', project: 'Sentry Monitor', action: 'opened task: Alert on 5xx spike', user: 'SR', time: '4h ago', type: 'task' },
  { id: 'a5', project: 'Vortex CLI', action: 'committed: fix(init) template path', user: 'TN', time: '6h ago', type: 'commit' },
  { id: 'a6', project: 'Echo Forms', action: 'commented on PR #91', user: 'AK', time: '3h ago', type: 'comment' },
  { id: 'a7', project: 'Pulse Analytics', action: 'opened PR #45: Chart tooltip system', user: 'ML', time: '1d ago', type: 'pr' },
  { id: 'a8', project: 'Atlas Mobile', action: 'deployed v0.9.0-beta to staging', user: 'JD', time: '3d ago', type: 'deploy' },
];

export const projectInsights = {
  velocity: [
    { week: 'W1', completed: 12, planned: 15 },
    { week: 'W2', completed: 18, planned: 20 },
    { week: 'W3', completed: 14, planned: 18 },
    { week: 'W4', completed: 22, planned: 24 },
    { week: 'W5', completed: 19, planned: 22 },
    { week: 'W6', completed: 26, planned: 28 },
  ],
  distribution: [
    { name: 'Active', value: 6, color: 'hsl(var(--success))' },
    { name: 'Planning', value: 3, color: 'hsl(var(--warning))' },
    { name: 'Paused', value: 2, color: 'hsl(var(--muted-foreground))' },
    { name: 'Completed', value: 1, color: 'hsl(var(--primary))' },
  ],
};
