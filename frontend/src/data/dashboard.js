import {
  FolderKanban,
  ListChecks,
  CheckCircle2,
  Clock,
  GitCommit,
  GitPullRequest,
  GitBranch,
} from "lucide-react";

export const dashboardStats = [
  {
    label: "Total Projects",
    value: "8",
    icon: FolderKanban,
    tint: "bg-[oklch(0.96_0.03_278)] text-[oklch(0.45_0.2_278)]",
  },
  {
    label: "Total Tasks",
    value: "34",
    icon: ListChecks,
    tint: "bg-[oklch(0.95_0.03_235)] text-[oklch(0.45_0.15_235)]",
  },
  {
    label: "Completed Tasks",
    value: "21",
    icon: CheckCircle2,
    tint: "bg-[oklch(0.94_0.05_155)] text-[oklch(0.4_0.14_155)]",
  },
  {
    label: "Pending Tasks",
    value: "13",
    icon: Clock,
    tint: "bg-[oklch(0.96_0.05_65)] text-[oklch(0.45_0.14_65)]",
  },
];

export const ongoingTasks = [
  { name: "TrackPort v2.0", due: "May 25", days: 2, priority: "high" },
  { name: "Authentication System", due: "May 28", days: 5, priority: "high" },
  { name: "Database Integration", due: "May 30", days: 7, priority: "med" },
  { name: "Landing Page Design", due: "Jun 2", days: 10, priority: "med" },
];

export const recentProjects = [
  {
    name: "TrackPort",
    updated: "2h ago",
    status: "In Progress",
    tone: "bg-primary-soft text-[oklch(0.4_0.18_278)]",
  },
  {
    name: "Portfolio Website",
    updated: "Yesterday",
    status: "Completed",
    tone: "bg-[oklch(0.94_0.05_155)] text-[oklch(0.38_0.14_155)]",
  },
  {
    name: "Blog Platform",
    updated: "3d ago",
    status: "Planning",
    tone: "bg-[oklch(0.96_0.05_65)] text-[oklch(0.42_0.14_65)]",
  },
];

export const githubActivity = [
  { icon: GitCommit, text: "Pushed 3 commits to", target: "trackport/web", time: "12m ago" },
  { icon: GitPullRequest, text: "Opened PR #23 in", target: "trackport/api", time: "1h ago" },
  { icon: GitBranch, text: "Created branch", target: "feat/auth-flow", time: "3h ago" },
];

export const dsaSolvedDates = [
  "2026-07-01",
  "2026-07-02",
  "2026-07-03",
  "2026-07-05",
  "2026-07-06",
  "2026-07-08",
];
