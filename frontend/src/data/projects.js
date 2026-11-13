import {
  FolderKanban,
  Loader,
  CheckCircle2,
  Calendar,
  Globe,
  ShoppingCart,
  Brain,
  Rocket,
  Pencil,
  GitCommit,
  GitPullRequest,
  GitBranch,
} from "lucide-react";

export const projectStats = [
  {
    label: "Total Projects",
    value: "8",
    icon: FolderKanban,
    tint: "bg-[oklch(0.96_0.03_278)] text-[oklch(0.45_0.2_278)]",
  },
  {
    label: "In Progress",
    value: "3",
    icon: Loader,
    tint: "bg-[oklch(0.95_0.03_235)] text-[oklch(0.45_0.15_235)]",
  },
  {
    label: "Completed",
    value: "2",
    icon: CheckCircle2,
    tint: "bg-[oklch(0.94_0.05_155)] text-[oklch(0.4_0.14_155)]",
  },
  {
    label: "Planned",
    value: "3",
    icon: Calendar,
    tint: "bg-[oklch(0.96_0.05_65)] text-[oklch(0.45_0.14_65)]",
  },
];

export const projects = [
  {
    name: "TrackPort",
    description: "Developer productivity hub for projects, tasks, and DSA.",
    status: "In Progress",
    commits: 124,
    files: 86,
    updated: "2h ago",
    icon: Rocket,
    iconTint: "bg-[oklch(0.96_0.03_278)] text-[oklch(0.45_0.2_278)]",
  },
  {
    name: "Portfolio Website",
    description: "Personal portfolio with project showcase and blog.",
    status: "Completed",
    commits: 67,
    files: 42,
    updated: "Yesterday",
    icon: Globe,
    iconTint: "bg-[oklch(0.94_0.05_155)] text-[oklch(0.4_0.14_155)]",
  },
  {
    name: "E-Commerce Platform",
    description: "Online store with cart, checkout, and admin dashboard.",
    status: "In Progress",
    commits: 203,
    files: 156,
    updated: "3d ago",
    icon: ShoppingCart,
    iconTint: "bg-[oklch(0.95_0.03_235)] text-[oklch(0.45_0.15_235)]",
  },
  {
    name: "AI Study Assistant",
    description: "LLM tool for summarizing notes and generating quizzes.",
    status: "Planning",
    commits: 12,
    files: 18,
    updated: "5d ago",
    icon: Brain,
    iconTint: "bg-[oklch(0.96_0.05_65)] text-[oklch(0.42_0.14_65)]",
  },
  {
    name: "Blog Platform",
    description: "Markdown blogging engine with tags and search.",
    status: "Planned",
    commits: 0,
    files: 0,
    updated: "1w ago",
    icon: Pencil,
    iconTint: "bg-[oklch(0.95_0.03_235)] text-[oklch(0.45_0.15_235)]",
  },
  {
    name: "DevOps Dashboard",
    description: "CI/CD monitor with deployment history and alerts.",
    status: "In Progress",
    commits: 89,
    files: 64,
    updated: "4d ago",
    icon: FolderKanban,
    iconTint: "bg-[oklch(0.96_0.03_278)] text-[oklch(0.45_0.2_278)]",
  },
];

export const projectActivity = [
  { icon: GitCommit, title: "Pushed 4 commits to", target: "TrackPort", time: "12m ago" },
  { icon: GitPullRequest, title: "Merged PR #23 in", target: "trackport/api", time: "1h ago" },
  { icon: GitBranch, title: "Created branch", target: "feat/dashboard-ui", time: "3h ago" },
  { icon: Pencil, title: "Updated", target: "Portfolio Website", time: "Yesterday" },
];

export const contributors = [
  { initials: "CH", name: "Chirag" },
  { initials: "AK", name: "Amit" },
  { initials: "RS", name: "Riya" },
  { initials: "JP", name: "Jay" },
];

export const languages = [
  { name: "TypeScript", pct: 42, color: "bg-[oklch(0.55_0.22_278)]" },
  { name: "JavaScript", pct: 28, color: "bg-[oklch(0.68_0.13_235)]" },
  { name: "CSS", pct: 18, color: "bg-[oklch(0.72_0.16_65)]" },
  { name: "Other", pct: 12, color: "bg-muted-foreground/40" },
];

export const repoHealth = { score: 87, trend: "+4" };

export const storageUsed = { used: 2.4, total: 5, unit: "GB" };

export const commitTrend = [
  { week: "W1", count: 18 },
  { week: "W2", count: 24 },
  { week: "W3", count: 31 },
  { week: "W4", count: 28 },
];
