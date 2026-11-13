export const weeklyTaskCompletion = [
  { day: 'Mon', completed: 6, created: 8 },
  { day: 'Tue', completed: 8, created: 10 },
  { day: 'Wed', completed: 5, created: 7 },
  { day: 'Thu', completed: 9, created: 12 },
  { day: 'Fri', completed: 11, created: 9 },
  { day: 'Sat', completed: 3, created: 2 },
  { day: 'Sun', completed: 2, created: 1 },
];

export const monthlyCodingActivity = [
  { month: 'Jan', commits: 142, prs: 12, tasks: 48 },
  { month: 'Feb', commits: 198, prs: 18, tasks: 62 },
  { month: 'Mar', commits: 231, prs: 22, tasks: 71 },
  { month: 'Apr', commits: 184, prs: 16, tasks: 54 },
  { month: 'May', commits: 289, prs: 28, tasks: 89 },
  { month: 'Jun', commits: 312, prs: 31, tasks: 103 },
  { month: 'Jul', commits: 378, prs: 34, tasks: 121 },
  { month: 'Aug', commits: 157, prs: 13, tasks: 47 },
];

export const projectPerformance = [
  { name: 'Nebula UI', velocity: 78, quality: 92, onTime: 88 },
  { name: 'Orbit API', velocity: 45, quality: 85, onTime: 72 },
  { name: 'Pulse', velocity: 12, quality: 78, onTime: 60 },
  { name: 'Atlas', velocity: 60, quality: 88, onTime: 75 },
  { name: 'Lumen', velocity: 88, quality: 95, onTime: 94 },
  { name: 'Sentry', velocity: 67, quality: 90, onTime: 82 },
];

export const codingActivityByDay = [
  { hour: '00h', activity: 2 },
  { hour: '04h', activity: 1 },
  { hour: '08h', activity: 8 },
  { hour: '10h', activity: 14 },
  { hour: '12h', activity: 11 },
  { hour: '14h', activity: 18 },
  { hour: '16h', activity: 22 },
  { hour: '18h', activity: 16 },
  { hour: '20h', activity: 9 },
  { hour: '22h', activity: 4 },
];

export const taskCompletionRate = [
  { week: 'W1', rate: 72 },
  { week: 'W2', rate: 78 },
  { week: 'W3', rate: 65 },
  { week: 'W4', rate: 84 },
  { week: 'W5', rate: 79 },
  { week: 'W6', rate: 91 },
  { week: 'W7', rate: 88 },
  { week: 'W8', rate: 93 },
];

export const languageDistribution = [
  { name: 'TypeScript', value: 42, color: 'hsl(var(--primary))' },
  { name: 'Go', value: 24, color: 'hsl(var(--success))' },
  { name: 'Python', value: 18, color: 'hsl(var(--info))' },
  { name: 'Rust', value: 9, color: 'hsl(var(--destructive))' },
  { name: 'Other', value: 7, color: 'hsl(var(--muted-foreground))' },
];

export const productivityScore = {
  current: 87,
  previous: 79,
  breakdown: [
    { label: 'Task Velocity', score: 92, max: 100 },
    { label: 'Code Quality', score: 88, max: 100 },
    { label: 'Consistency', score: 84, max: 100 },
    { label: 'Collaboration', score: 79, max: 100 },
    { label: 'DSA Practice', score: 95, max: 100 },
  ],
};
