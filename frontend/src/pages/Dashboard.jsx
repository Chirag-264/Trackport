import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Folder,
  ListChecks,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ChevronRight,
  Flame,
  GitBranch,
  Plus,
  Code2,
  BarChart3,
  Sparkles,
  AlertCircle,
  Loader2,
  Calendar
} from "lucide-react";
import { getDashboardData } from "@/services/dashboard.service";
import { createProject } from "@/services/project.service";
import { createTask } from "@/services/task.service";
import { getProjects } from "@/services/project.service";
import { getDsaProgress } from "@/services/dsa.service";
import { getGitHubStats } from "@/services/dashboard.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [practiceStats, setPracticeStats] = useState({ streak: 0, solvedToday: 0, dailyGoal: 2, weekCount: 0, monthCount: 0, weeklyCounts: [] });
  const [projectChoices, setProjectChoices] = useState([]);
  const [githubRepos, setGithubRepos] = useState([]);

  // Modals from Quick Actions
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [projectForm, setProjectForm] = useState({ title: "", description: "", status: "In Progress" });
  const [submittingProject, setSubmittingProject] = useState(false);

  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: "", deadline: "", projectId: "none" });
  const [submittingTask, setSubmittingTask] = useState(false);

  const navigate = useNavigate();

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [res, dsaResponse, projectResponse] = await Promise.all([
        getDashboardData(),
        getDsaProgress().catch(() => null),
        getProjects().catch(() => null)
      ]);
      if (res?.success) {
        setData(res.data);
      }
      if (dsaResponse?.success) setPracticeStats(dsaResponse.data.stats);
      const projects = projectResponse?.data?.projects || res?.data?.recentProjects || [];
      setProjectChoices(projects);
      const linkedRepos = await Promise.all((projects || [])
        .filter((project) => project.githubUrl)
        .slice(0, 3)
        .map(async (project) => {
          try {
            const response = await getGitHubStats(project.githubUrl);
            return { ...response.data, title: project.title };
          } catch {
            return null;
          }
        }));
      setGithubRepos(linkedRepos.filter(Boolean));
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard metrics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!projectForm.title.trim()) return;
    try {
      setSubmittingProject(true);
      await createProject(projectForm);
      setIsNewProjectOpen(false);
      setProjectForm({ title: "", description: "", status: "In Progress" });
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create project");
    } finally {
      setSubmittingProject(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!taskForm.title.trim()) {
      alert("Please enter a task title.");
      return;
    }
    try {
      setSubmittingTask(true);
      await createTask({
        title: taskForm.title.trim(),
        deadline: taskForm.deadline || undefined,
        ...(taskForm.projectId !== "none" ? { projectId: taskForm.projectId } : {})
      });
      setIsNewTaskOpen(false);
      setTaskForm({ title: "", deadline: "", projectId: "none" });
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create task");
    } finally {
      setSubmittingTask(false);
    }
  };

  // Safe fallback stats
  const stats = data?.stats || {
    totalProjects: 0,
    planningProjects: 0,
    inProgressProjects: 0,
    completedProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    taskCompletionRate: 0
  };

  const recentProjects = data?.recentProjects || [];
  const upcomingTasks = data?.upcomingTasks || [];

  // Donut chart calculations
  const completionRate = stats.taskCompletionRate || (stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0);
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionRate / 100) * circumference;

  const completedPct = completionRate;
  const toDoPct = Math.max(0, 100 - completedPct);
  const todayGoalPercent = practiceStats.dailyGoal ? Math.min(100, Math.round((practiceStats.solvedToday / practiceStats.dailyGoal) * 100)) : 0;
  const githubTotals = githubRepos.reduce((totals, repo) => ({
    stars: totals.stars + (repo.stargazers_count || 0),
    forks: totals.forks + (repo.forks_count || 0),
    issues: totals.issues + (repo.open_issues_count || 0)
  }), { stars: 0, forks: 0, issues: 0 });

  return (
    <div className="space-y-5 pb-6">
      {error && <div role="alert" className="flex items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"><span>{error}</span><button type="button" onClick={loadData} className="font-semibold underline">Retry</button></div>}
      {/* ROW 1: 4 Stat Cards matching Image 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Projects */}
        <div className="rounded-[26px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Projects</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Folder className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {stats.totalProjects}
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-purple-600 dark:text-purple-400 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-600" />
              <span>{stats.inProgressProjects} in progress</span>
            </div>
          </div>
        </div>

        {/* Total Tasks */}
        <div className="rounded-[26px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Tasks</span>
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <ListChecks className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {stats.totalTasks}
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
              <span>This is all time</span>
            </div>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="rounded-[26px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Completed Tasks</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {stats.completedTasks}
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              <span>{completionRate}% of all tasks</span>
            </div>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="rounded-[26px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Pending Tasks</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {stats.pendingTasks}
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
              <span>Due or pending</span>
            </div>
          </div>
        </div>
      </div>

      {data?.leetcode && <section className="rounded-[26px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div><h2 className="text-sm font-bold text-slate-900 dark:text-white">LeetCode progress</h2><p className="text-xs text-slate-500 mt-1">{data.leetcode.username} · public profile via Alfa</p></div>
          <Link to="/dsa" className="text-xs font-semibold text-purple-600 hover:text-purple-700">Open DSA tracker <ChevronRight className="inline h-3 w-3" /></Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {[['Solved', data.leetcode.stats?.totalSolved], ['Easy', data.leetcode.stats?.easySolved], ['Medium', data.leetcode.stats?.mediumSolved], ['Hard', data.leetcode.stats?.hardSolved]].map(([label, value]) => <div key={label} className="rounded-2xl bg-slate-50 dark:bg-slate-800/70 p-3"><p className="text-[10px] uppercase tracking-wide text-slate-500">{label}</p><p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{Number(value || 0).toLocaleString()}</p></div>)}
        </div>
        {(data.leetcode.recentSolved || []).length > 0 && <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-3"><p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">Recent accepted problems</p><div className="flex flex-wrap gap-2">{data.leetcode.recentSolved.map((problem) => <a key={`${problem.titleSlug}-${problem.solvedAt}`} href={problem.problemUrl} target="_blank" rel="noreferrer" className="rounded-xl bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:text-purple-600">{problem.title}</a>)}</div></div>}
        <p className="text-[10px] text-slate-400 mt-3">Updated {new Date(data.leetcode.fetchedAt).toLocaleString()}</p>
      </section>}

      {/* ROW 2: 3 Cards matching Image 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Card 1: Tasks Completion Donut Ring */}
        <div className="rounded-[28px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Tasks Completion</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Overall development progress</p>

            <div className="flex items-center justify-between gap-4 mt-4">
              {/* Circular SVG Donut */}
              <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    className="text-slate-100 dark:text-slate-800"
                    strokeWidth="14"
                    stroke="currentColor"
                    fill="transparent"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    stroke="url(#purpleGradient)"
                    strokeWidth="14"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700 ease-out"
                  />
                  <defs>
                    <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {completionRate}%
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                    Completed
                  </span>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-2.5 flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <span className="h-2 w-2 rounded-full bg-purple-600" />
                    Completed
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {stats.completedTasks} ({completedPct}%)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <span className="h-2 w-2 rounded-full bg-indigo-500" />
                    Pending tasks
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {stats.pendingTasks} ({toDoPct}%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Motivation Banner matching Image 2 */}
          <div className="mt-4 p-2.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-semibold flex items-center justify-center gap-2">
            <span>🎯 Great progress! Keep pushing forward 💪</span>
          </div>
        </div>

        {/* Card 2: Upcoming Deadlines */}
        <div className="rounded-[28px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Upcoming Deadlines</h3>
              <Link to="/tasks" className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline">
                View all
              </Link>
            </div>

            <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
              {upcomingTasks.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  <Calendar className="h-8 w-8 mx-auto text-slate-300 dark:text-slate-700 mb-1.5" />
                  No urgent deadlines due soon. You are all set!
                </div>
              ) : (
                upcomingTasks.slice(0, 4).map((task) => {
                  const daysLeft = Math.ceil((new Date(task.deadline) - new Date()) / (1000 * 60 * 60 * 24));
                  return (
                    <div key={task._id} className="py-2.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center shrink-0">
                          <Folder className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {task.title}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                            {task.projectId?.title || "Project Milestone"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                          {new Date(task.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </p>
                        <p className={`text-[10px] font-medium ${daysLeft <= 3 ? "text-rose-500 font-bold" : "text-amber-500"}`}>
                          {daysLeft <= 0 ? "Due today" : `${daysLeft} days left`}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Card 3: DSA Tracker Card matching Image 2 */}
        <div className="rounded-[28px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                DSA Tracker
              </h3>
              <Link to="/dsa" className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Streak & Best Streak */}
            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Current Streak</p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{practiceStats.streak}</span>
                  <span className="text-base">🔥</span>
                  <span className="text-xs font-semibold text-slate-500">days</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Based on your saved practice log</p>
              </div>

              {/* Weekly Calendar Dots Grid (M T W T F S S) */}
              <div className="flex items-center gap-1.5">
                {(practiceStats.weeklyCounts || []).map((day) => (
                  <div key={day.date} className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-bold text-slate-400">{new Date(`${day.date}T00:00:00`).toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 1)}</span>
                    <span className={`h-2.5 w-2.5 rounded-full ${day.count ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"}`} title={`${day.count} problems solved`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Today's Goal Progress */}
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-600 dark:text-slate-300">Today's Goal</span>
                <span className="text-slate-900 dark:text-white">{practiceStats.solvedToday} / {practiceStats.dailyGoal} problems</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-600 h-full rounded-full transition-all" style={{ width: `${todayGoalPercent}%` }} />
              </div>
              <p className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 mt-2 flex items-center gap-1">
                {todayGoalPercent >= 100 ? "Goal completed!" : `${Math.max(0, practiceStats.dailyGoal - practiceStats.solvedToday)} more to reach today's goal`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 3: 3 Cards matching Image 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Card 1: DSA Progress Sparkline */}
        <div className="rounded-[28px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">DSA Progress</h3>
              <Button asChild variant="outline" size="xs" className="rounded-xl text-xs font-semibold h-7">
                <Link to="/dsa">Start Practicing</Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              {/* This Week */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] text-slate-500 font-medium">This Week</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{practiceStats.weekCount}</p>
                <p className="text-[10px] text-purple-600 font-semibold">Problems Solved</p>
                {/* Mini SVG Trend Line */}
                <svg className="w-full h-7 mt-2 text-purple-500" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M0 25 Q20 20, 35 15 T70 10 T100 5" strokeLinecap="round" />
                </svg>
              </div>

              {/* This Month */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] text-slate-500 font-medium">This Month</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{practiceStats.monthCount}</p>
                <p className="text-[10px] text-indigo-600 font-semibold">Problems Solved</p>
                <svg className="w-full h-7 mt-2 text-indigo-500" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M0 28 Q25 22, 50 18 T80 8 T100 3" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 dark:text-slate-500 italic mt-4 border-t border-slate-100 dark:border-slate-800 pt-3">
            "The only way to get better is to practice consistently. - TrackPort"
          </p>
        </div>

        {/* Card 2: GitHub Overview */}
        <div className="rounded-[28px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                <GitBranch className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                GitHub Overview
              </h3>
              <button
                onClick={() => navigate("/projects")}
                className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline"
              >
                View Details
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2 mt-3 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
              <div>
                <p className="text-sm font-extrabold text-slate-900 dark:text-white">{githubRepos.length}</p>
                <p className="text-[10px] text-slate-500">Synced repos</p>
              </div>
              <div>
                <p className="text-sm font-extrabold text-slate-900 dark:text-white">{githubTotals.stars}</p>
                <p className="text-[10px] text-slate-500">Stars</p>
              </div>
              <div>
                <p className="text-sm font-extrabold text-slate-900 dark:text-white">{githubTotals.forks}</p>
                <p className="text-[10px] text-slate-500">Forks</p>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              {githubRepos.length === 0 ? (
                <p className="text-xs text-slate-500">Add a public GitHub repository URL to a project to see its current stars and forks here.</p>
              ) : githubRepos.map((repo) => (
                <a key={repo.html_url} href={repo.html_url} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 text-xs hover:text-purple-600">
                  <GitBranch className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                  <span className="truncate text-slate-700 dark:text-slate-300">{repo.title} <span className="text-slate-400">? {repo.language || 'Unknown language'}</span></span>
                  <span className="text-[10px] text-slate-400 ml-auto shrink-0">{repo.open_issues_count} open issues</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Card 3: Quick Actions 4-Grid matching Image 2 */}
        <div className="rounded-[28px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Quick Actions</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Shortcuts to get things done</p>

            <div className="grid grid-cols-2 gap-3 mt-4">
              {/* Action 1: New Project */}
              <button
                onClick={() => setIsNewProjectOpen(true)}
                className="p-3.5 rounded-2xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800/50 hover:bg-purple-100/80 dark:hover:bg-purple-900/60 transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
                  <Plus className="h-4 w-4" />
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">New Project</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Create a new project</p>
              </button>

              {/* Action 2: New Task */}
              <button
                onClick={() => setIsNewTaskOpen(true)}
                className="p-3.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/50 hover:bg-indigo-100/80 dark:hover:bg-indigo-900/60 transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
                  <ListChecks className="h-4 w-4" />
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">New Task</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Add a new task</p>
              </button>

              {/* Action 3: DSA Practice */}
              <button
                onClick={() => navigate("/dsa")}
                className="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/50 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/60 transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
                  <Code2 className="h-4 w-4" />
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">DSA Practice</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Solve problems</p>
              </button>

              {/* Action 4: View Analytics */}
              <button
                onClick={() => navigate("/analytics")}
                className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/50 hover:bg-amber-100/80 dark:hover:bg-amber-900/60 transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
                  <BarChart3 className="h-4 w-4" />
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">View Analytics</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">AI insights & stats</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK ACTION: CREATE PROJECT MODAL */}
      <Dialog open={isNewProjectOpen} onOpenChange={setIsNewProjectOpen}>
        <DialogContent className="rounded-[32px] max-w-md p-6">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>Add a new development workspace to track.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateProject} className="space-y-4 py-2">
            <div>
              <Label htmlFor="qp-title">Title *</Label>
              <Input
                id="qp-title"
                required
                placeholder="e.g. Distributed Task Queue"
                value={projectForm.title}
                onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                className="rounded-xl mt-1"
              />
            </div>
            <div>
              <Label htmlFor="qp-desc">Description</Label>
              <Input
                id="qp-desc"
                placeholder="Short summary of the project"
                value={projectForm.description}
                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                className="rounded-xl mt-1"
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsNewProjectOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button type="submit" disabled={submittingProject} className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white">
                {submittingProject ? "Creating..." : "Create Project"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* QUICK ACTION: CREATE TASK MODAL */}
      <Dialog open={isNewTaskOpen} onOpenChange={setIsNewTaskOpen}>
        <DialogContent className="rounded-[32px] max-w-md p-6">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>Optionally connect this task to one of your projects.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateTask} className="space-y-4 py-2">
            <div>
              <Label htmlFor="qt-title">Task Title *</Label>
              <Input
                id="qt-title"
                required
                placeholder="e.g. Implement JWT refresh token rotation"
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                className="rounded-xl mt-1"
              />
            </div>
            <div>
              <Label>Project (optional)</Label>
              <Select value={taskForm.projectId} onValueChange={(val) => setTaskForm({ ...taskForm, projectId: val })}>
                <SelectTrigger className="rounded-xl mt-1">
                  <SelectValue placeholder="Choose a project" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="none">No project</SelectItem>
                  {projectChoices.map((p) => (
                    <SelectItem key={p._id} value={p._id}>
                      {p.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="qt-date">Deadline (Optional)</Label>
              <Input
                id="qt-date"
                type="date"
                value={taskForm.deadline}
                onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })}
                className="rounded-xl mt-1"
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsNewTaskOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button type="submit" disabled={submittingTask} className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white">
                {submittingTask ? "Adding..." : "Add Task"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
