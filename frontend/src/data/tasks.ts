export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type Column = 'backlog' | 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Column;
  priority: Priority;
  project: string;
  projectColor: string;
  dueDate: string;
  labels: string[];
  subtasks: { done: number; total: number };
  comments: number;
}

export const tasks: Task[] = [
  { id: '101', title: 'Refactor auth middleware to use JWT v2', description: 'Migrate the existing session-based auth to JWT v2 with refresh token rotation.', status: 'in-progress', priority: 'high', project: 'Orbit API Gateway', projectColor: 'info', dueDate: '2026-08-02', labels: ['backend', 'auth'], subtasks: { done: 3, total: 5 }, comments: 4 },
  { id: '102', title: 'Design chart tooltip system', description: 'Create a reusable tooltip component for all chart types with theming support.', status: 'todo', priority: 'medium', project: 'Pulse Analytics', projectColor: 'warning', dueDate: '2026-08-03', labels: ['design', 'charts'], subtasks: { done: 0, total: 4 }, comments: 2 },
  { id: '103', title: 'Fix mobile header overflow on iOS Safari', description: 'Header content overflows on small viewports due to flexbox min-width bug.', status: 'in-progress', priority: 'urgent', project: 'Atlas Mobile', projectColor: 'success', dueDate: '2026-08-02', labels: ['bug', 'mobile', 'ios'], subtasks: { done: 1, total: 2 }, comments: 8 },
  { id: '104', title: 'Write Button accessibility tests', description: 'Add keyboard navigation and ARIA coverage tests for the Button component.', status: 'backlog', priority: 'low', project: 'Nebula UI Kit', projectColor: 'primary', dueDate: '2026-08-06', labels: ['testing', 'a11y'], subtasks: { done: 0, total: 6 }, comments: 1 },
  { id: '105', title: 'Migrate wiki to MDX', description: 'Convert all markdown docs to MDX with embedded component examples.', status: 'in-progress', priority: 'medium', project: 'Quantum Docs', projectColor: 'chart-4', dueDate: '2026-08-08', labels: ['docs', 'mdx'], subtasks: { done: 5, total: 5 }, comments: 3 },
  { id: '106', title: 'Implement token bucket rate limiter', description: 'Add distributed rate limiting using Redis token bucket algorithm.', status: 'done', priority: 'high', project: 'Orbit API Gateway', projectColor: 'info', dueDate: '2026-07-30', labels: ['backend', 'redis'], subtasks: { done: 4, total: 4 }, comments: 6 },
  { id: '107', title: 'Add dark mode to chart components', description: 'Theme all chart series with CSS variables for dark/light mode.', status: 'todo', priority: 'medium', project: 'Pulse Analytics', projectColor: 'warning', dueDate: '2026-08-05', labels: ['theme', 'charts'], subtasks: { done: 0, total: 3 }, comments: 0 },
  { id: '108', title: 'Set up CI pipeline for Vortex CLI', description: 'Configure GitHub Actions for build, test, and release artifacts.', status: 'in-progress', priority: 'high', project: 'Vortex CLI', projectColor: 'destructive', dueDate: '2026-08-04', labels: ['ci', 'devops'], subtasks: { done: 2, total: 4 }, comments: 2 },
  { id: '109', title: 'OAuth2 SSO integration with Google', description: 'Add Google as an identity provider with PKCE flow.', status: 'backlog', priority: 'medium', project: 'Lumen Auth', projectColor: 'success', dueDate: '2026-08-10', labels: ['auth', 'sso'], subtasks: { done: 0, total: 5 }, comments: 1 },
  { id: '110', title: 'Real-time cursor sharing in Drift Chat', description: 'Broadcast cursor positions via WebSocket for collaborative editing.', status: 'todo', priority: 'low', project: 'Drift Chat', projectColor: 'primary', dueDate: '2026-08-12', labels: ['realtime', 'feature'], subtasks: { done: 0, total: 3 }, comments: 0 },
  { id: '111', title: 'Error tracking dashboard layout', description: 'Design the main dashboard for error grouping and stack traces.', status: 'in-progress', priority: 'high', project: 'Sentry Monitor', projectColor: 'info', dueDate: '2026-08-03', labels: ['design', 'dashboard'], subtasks: { done: 3, total: 3 }, comments: 5 },
  { id: '112', title: 'Form validation engine v2', description: 'Schema-based validation with async rules and cross-field dependencies.', status: 'in-progress', priority: 'urgent', project: 'Echo Forms', projectColor: 'warning', dueDate: '2026-08-02', labels: ['forms', 'validation'], subtasks: { done: 2, total: 6 }, comments: 3 },
  { id: '113', title: 'Vector search ranking algorithm', description: 'Implement cosine similarity ranking with BM25 hybrid scoring.', status: 'backlog', priority: 'medium', project: 'Nova Search', projectColor: 'info', dueDate: '2026-08-15', labels: ['search', 'ai'], subtasks: { done: 0, total: 4 }, comments: 0 },
  { id: '114', title: 'Tooltip animation polish', description: 'Add spring-based enter/exit animations to Tooltip component.', status: 'done', priority: 'low', project: 'Nebula UI Kit', projectColor: 'primary', dueDate: '2026-07-29', labels: ['ui', 'animation'], subtasks: { done: 2, total: 2 }, comments: 1 },
  { id: '115', title: 'Deployment pipeline for Forge Builder', description: 'Blue-green deployment strategy with rollback support.', status: 'todo', priority: 'high', project: 'Forge Builder', projectColor: 'success', dueDate: '2026-08-07', labels: ['devops', 'deploy'], subtasks: { done: 0, total: 5 }, comments: 2 },
];

export const columns: { id: Column; title: string; color: string }[] = [
  { id: 'backlog', title: 'Backlog', color: 'muted' },
  { id: 'todo', title: 'To Do', color: 'info' },
  { id: 'in-progress', title: 'In Progress', color: 'warning' },
  { id: 'done', title: 'Done', color: 'success' },
];

export const priorityConfig: Record<Priority, { label: string; color: string; bg: string }> = {
  low: { label: 'Low', color: 'text-muted-foreground', bg: 'bg-muted' },
  medium: { label: 'Medium', color: 'text-info', bg: 'bg-info/10' },
  high: { label: 'High', color: 'text-warning', bg: 'bg-warning/10' },
  urgent: { label: 'Urgent', color: 'text-destructive', bg: 'bg-destructive/10' },
};
