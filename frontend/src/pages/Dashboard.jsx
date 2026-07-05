import { act, useEffect, useState } from "react";
import DashboardHeader from "@/components/Dashboard/DashboardHeader.jsx";
import StatsGrid from "@/components/Dashboard/StatsGrid.jsx";
import TaskCompletion from "@/components/Dashboard/TaskCompletion.jsx";
import OngoingTasks from "@/components/Dashboard/OngoingTasks.jsx";
import DsaTracker from "@/components/Dashboard/DsaTracker.jsx";
import GithubOverview from "@/components/Dashboard/GithubOverview.jsx";
import RecentProjects from "@/components/Dashboard/RecentProjects.jsx";
import QuickActions from "@/components/Dashboard/QuickActions.jsx";
import {
  FolderKanban,
  ListChecks,
  CheckCircle2,
  Clock,
  GitCommit,
  GitPullRequest,
  GitBranch,
} from "lucide-react";

const stats = [
  { label: "Total Projects", value: "8", sub: "Active projects", icon: FolderKanban, tint: "bg-[oklch(0.96_0.03_278)] text-[oklch(0.45_0.2_278)]" },
  { label: "Total Tasks", value: "34", sub: "All tasks", icon: ListChecks, tint: "bg-[oklch(0.95_0.03_235)] text-[oklch(0.45_0.15_235)]" },
  { label: "Completed Tasks", value: "21", sub: "61.8% of all tasks", icon: CheckCircle2, tint: "bg-[oklch(0.94_0.05_155)] text-[oklch(0.4_0.14_155)]" },
  { label: "Pending Tasks", value: "13", sub: "Needs attention", icon: Clock, tint: "bg-[oklch(0.96_0.05_65)] text-[oklch(0.45_0.14_65)]" },
  
];

const ongoingTasks = [
  { name: "TrackPort v2.0", due: "May 25", days: 2, priority: "high" },
  { name: "Authentication System", due: "May 28", days: 5, priority: "high" },
  { name: "Database Integration", due: "May 30", days: 7, priority: "med" },
  { name: "Landing Page Design", due: "Jun 2", days: 10, priority: "med" },
  { name: "API Documentation", due: "Jun 5", days: 13, priority: "low" },
];

const projects = [
  { name: "TrackPort", updated: "2 hours ago", status: "In Progress", tone: "bg-primary-soft text-[oklch(0.4_0.18_278)]" },
  { name: "Portfolio Website", updated: "Yesterday", status: "Completed", tone: "bg-[oklch(0.94_0.05_155)] text-[oklch(0.38_0.14_155)]" },
  { name: "Blog Platform", updated: "3 days ago", status: "Planning", tone: "bg-[oklch(0.96_0.05_65)] text-[oklch(0.42_0.14_65)]" },
];

const activity = [
  { icon: GitCommit, text: "Pushed 3 commits to", target: "trackport/web", time: "12m ago" },
  { icon: GitPullRequest, text: "Opened PR #23 in", target: "trackport/api", time: "1h ago" },
  { icon: GitBranch, text: "Created branch", target: "feat/auth-flow", time: "3h ago" },
];

const week = ["M", "T", "W", "T", "F", "S", "S"];
const streakData = [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0];


export default function Dashboard() {

  // Dark mode
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const saved = typeof window !== "undefined" && localStorage.getItem("theme");
    const isDark = saved ? saved === "dark" : window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    setDark(!!isDark);
  }, []);
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", dark);
    try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch {}
  }, [dark]);

  return (
    <div className="w-full text-foreground">
        
        {/* Main */}
        <main className="min-w-0 flex-1">
          {/* Header */}
          <DashboardHeader dark={dark} setDark={setDark}/>

          {/* Stats */}
          <StatsGrid stats={stats}/>

          {/* Grid Row 1 */}
          <section className="mt-3.75 grid grid-cols-1 gap-4 xl:grid-cols-3">
            {/* Task completion */}
            <TaskCompletion />

            {/* Ongoing tasks */}
            <OngoingTasks ongoingTasks={ongoingTasks}/>

            {/* DSA */}
            <DsaTracker week={week} streakData={streakData}/>
          </section>

          {/* Grid Row 2 */}
          <section className="mt-3.75 grid grid-cols-1 gap-4 xl:grid-cols-3">
            {/* GitHub */}
            <GithubOverview activity={activity}/>

            {/* Recent Projects */}
            <RecentProjects projects={projects}/>

            {/* Quick actions */}
            <QuickActions />
          </section>
        </main>
    </div>
  );
}


