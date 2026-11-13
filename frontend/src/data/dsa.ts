export interface DsaProblem {
  id: string;
  title: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status: 'solved' | 'attempted' | 'todo';
  url: string;
  solvedDate: string | null;
  timeSpent: string;
  notes: boolean;
}

export const dsaTopics = [
  'Arrays', 'Strings', 'Linked Lists', 'Trees', 'Graphs', 'DP', 'Greedy',
  'Backtracking', 'Heap', 'Trie', 'Hashing', 'Two Pointers', 'Sliding Window',
  'Stack', 'Queue', 'Recursion', 'Bit Manipulation', 'Math',
];

export const dsaProblems: DsaProblem[] = [
  { id: 'd1', title: 'Two Sum', topic: 'Arrays', difficulty: 'Easy', status: 'solved', url: '#', solvedDate: '2026-07-15', timeSpent: '8m', notes: true },
  { id: 'd2', title: 'Add Two Numbers', topic: 'Linked Lists', difficulty: 'Medium', status: 'solved', url: '#', solvedDate: '2026-07-16', timeSpent: '22m', notes: true },
  { id: 'd3', title: 'Longest Substring Without Repeating', topic: 'Sliding Window', difficulty: 'Medium', status: 'solved', url: '#', solvedDate: '2026-07-17', timeSpent: '18m', notes: false },
  { id: 'd4', title: 'Median of Two Sorted Arrays', topic: 'Arrays', difficulty: 'Hard', status: 'solved', url: '#', solvedDate: '2026-07-18', timeSpent: '45m', notes: true },
  { id: 'd5', title: 'Longest Palindromic Substring', topic: 'Strings', difficulty: 'Medium', status: 'solved', url: '#', solvedDate: '2026-07-19', timeSpent: '30m', notes: true },
  { id: 'd6', title: 'Regular Expression Matching', topic: 'DP', difficulty: 'Hard', status: 'attempted', url: '#', solvedDate: null, timeSpent: '60m', notes: true },
  { id: 'd7', title: 'Container With Most Water', topic: 'Two Pointers', difficulty: 'Medium', status: 'solved', url: '#', solvedDate: '2026-07-20', timeSpent: '15m', notes: false },
  { id: 'd8', title: 'Three Sum', topic: 'Two Pointers', difficulty: 'Medium', status: 'solved', url: '#', solvedDate: '2026-07-21', timeSpent: '20m', notes: true },
  { id: 'd9', title: 'Letter Combinations of Phone', topic: 'Backtracking', difficulty: 'Medium', status: 'solved', url: '#', solvedDate: '2026-07-22', timeSpent: '25m', notes: false },
  { id: 'd10', title: 'Remove Nth Node From End', topic: 'Linked Lists', difficulty: 'Medium', status: 'solved', url: '#', solvedDate: '2026-07-23', timeSpent: '12m', notes: true },
  { id: 'd11', title: 'Valid Parentheses', topic: 'Stack', difficulty: 'Easy', status: 'solved', url: '#', solvedDate: '2026-07-24', timeSpent: '6m', notes: false },
  { id: 'd12', title: 'Merge K Sorted Lists', topic: 'Heap', difficulty: 'Hard', status: 'solved', url: '#', solvedDate: '2026-07-25', timeSpent: '38m', notes: true },
  { id: 'd13', title: 'Search in Rotated Sorted Array', topic: 'Arrays', difficulty: 'Medium', status: 'solved', url: '#', solvedDate: '2026-07-26', timeSpent: '28m', notes: true },
  { id: 'd14', title: 'Combination Sum', topic: 'Backtracking', difficulty: 'Medium', status: 'solved', url: '#', solvedDate: '2026-07-27', timeSpent: '24m', notes: false },
  { id: 'd15', title: 'Trapping Rain Water', topic: 'Two Pointers', difficulty: 'Hard', status: 'attempted', url: '#', solvedDate: null, timeSpent: '50m', notes: true },
  { id: 'd16', title: 'N-Queens', topic: 'Backtracking', difficulty: 'Hard', status: 'todo', url: '#', solvedDate: null, timeSpent: '0m', notes: false },
  { id: 'd17', title: 'Max Subarray (Kadane)', topic: 'DP', difficulty: 'Medium', status: 'solved', url: '#', solvedDate: '2026-07-28', timeSpent: '14m', notes: true },
  { id: 'd18', title: 'Climbing Stairs', topic: 'DP', difficulty: 'Easy', status: 'solved', url: '#', solvedDate: '2026-07-29', timeSpent: '4m', notes: false },
  { id: 'd19', title: 'Edit Distance', topic: 'DP', difficulty: 'Hard', status: 'todo', url: '#', solvedDate: null, timeSpent: '0m', notes: false },
  { id: 'd20', title: 'Binary Tree Inorder', topic: 'Trees', difficulty: 'Easy', status: 'solved', url: '#', solvedDate: '2026-07-30', timeSpent: '7m', notes: true },
  { id: 'd21', title: 'Validate Binary Search Tree', topic: 'Trees', difficulty: 'Medium', status: 'solved', url: '#', solvedDate: '2026-07-31', timeSpent: '16m', notes: true },
  { id: 'd22', title: 'Number of Islands', topic: 'Graphs', difficulty: 'Medium', status: 'solved', url: '#', solvedDate: '2026-08-01', timeSpent: '26m', notes: true },
  { id: 'd23', title: 'Course Schedule', topic: 'Graphs', difficulty: 'Medium', status: 'attempted', url: '#', solvedDate: null, timeSpent: '35m', notes: true },
  { id: 'd24', title: 'Implement Trie', topic: 'Trie', difficulty: 'Medium', status: 'solved', url: '#', solvedDate: '2026-08-01', timeSpent: '30m', notes: true },
  { id: 'd25', title: 'Word Search II', topic: 'Trie', difficulty: 'Hard', status: 'todo', url: '#', solvedDate: null, timeSpent: '0m', notes: false },
];

export interface DsaTopicProgress {
  topic: string;
  solved: number;
  total: number;
  color: string;
}

export const dsaTopicProgress: DsaTopicProgress[] = [
  { topic: 'Arrays', solved: 142, total: 160, color: 'primary' },
  { topic: 'Strings', solved: 88, total: 100, color: 'info' },
  { topic: 'Trees', solved: 98, total: 120, color: 'success' },
  { topic: 'Graphs', solved: 76, total: 110, color: 'warning' },
  { topic: 'DP', solved: 64, total: 130, color: 'chart-4' },
  { topic: 'Linked Lists', solved: 54, total: 70, color: 'destructive' },
  { topic: 'Heap', solved: 38, total: 55, color: 'primary' },
  { topic: 'Backtracking', solved: 42, total: 80, color: 'info' },
];

export const dsaDifficultyStats = {
  easy: { solved: 487, total: 620 },
  medium: { solved: 712, total: 980 },
  hard: { solved: 233, total: 420 },
};

export const dsaDailyGoals = [
  { day: 'Mon', goal: 3, done: 3, date: '2026-07-27' },
  { day: 'Tue', goal: 3, done: 4, date: '2026-07-28' },
  { day: 'Wed', goal: 3, done: 2, date: '2026-07-29' },
  { day: 'Thu', goal: 3, done: 3, date: '2026-07-30' },
  { day: 'Fri', goal: 5, done: 5, date: '2026-07-31' },
  { day: 'Sat', goal: 3, done: 4, date: '2026-08-01' },
  { day: 'Sun', goal: 3, done: 2, date: '2026-08-02' },
];

// Heatmap data: 53 weeks x 7 days
export interface HeatmapCell {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

function generateHeatmap(): HeatmapCell[] {
  const cells: HeatmapCell[] = [];
  const today = new Date('2026-08-02');
  for (let i = 370; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dow = d.getDay();
    // simulate more activity on weekdays, less on weekends
    const base = dow === 0 || dow === 6 ? 0.3 : 0.7;
    const r = Math.random();
    let count = 0;
    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (r < base * 0.25) { count = 0; level = 0; }
    else if (r < base * 0.5) { count = 1 + Math.floor(Math.random() * 2); level = 1; }
    else if (r < base * 0.75) { count = 3 + Math.floor(Math.random() * 3); level = 2; }
    else if (r < base * 0.92) { count = 6 + Math.floor(Math.random() * 4); level = 3; }
    else { count = 10 + Math.floor(Math.random() * 8); level = 4; }
    cells.push({ date: d.toISOString().slice(0, 10), count, level });
  }
  return cells;
}

export const dsaHeatmap: HeatmapCell[] = generateHeatmap();

export const dsaMonthlyActivity = [
  { month: 'Jan', solved: 42 },
  { month: 'Feb', solved: 58 },
  { month: 'Mar', solved: 71 },
  { month: 'Apr', solved: 64 },
  { month: 'May', solved: 89 },
  { month: 'Jun', solved: 103 },
  { month: 'Jul', solved: 121 },
  { month: 'Aug', solved: 47 },
];
