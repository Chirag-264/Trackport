import React, { useEffect, useState } from "react";
import { BarChart3, TrendingUp, CheckCircle2, Clock, FolderKanban, Sparkles } from "lucide-react";
import { getProjects } from "@/services/project.service";
import { getTasks } from "@/services/task.service";
import api from "@/services/api";

export default function Analytics() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState('');
  const [prompt, setPrompt] = useState('');
  const [aiReply, setAiReply] = useState('');
  const [aiError, setAiError] = useState('');
  const [askingAI, setAskingAI] = useState(false);

  const askAI = async (event) => {
    event.preventDefault();
    if (!prompt.trim()) return;
    setAskingAI(true);
    setAiError('');
    setAiReply('');
    try {
      const response = await api.post('/analytics/chat', { prompt: prompt.trim() });
      setAiReply(response.data.data.reply);
    } catch (error) {
      setAiError(error.response?.data?.message || 'The AI coach could not respond. Check the server configuration and try again.');
    } finally {
      setAskingAI(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setDataError('');
        const [projRes, taskRes] = await Promise.all([getProjects(), getTasks()]);
        if (projRes?.success) setProjects(projRes.data.projects || []);
        if (taskRes?.success) setTasks(taskRes.data.tasks || []);
      } catch (err) {
        console.error(err);
        setDataError('Could not load analytics. Check your connection and try again.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalProjects = projects.length;
  const inProgress = projects.filter((p) => p.status === "In Progress").length;
  const completed = projects.filter((p) => p.status === "Completed").length;
  const planning = projects.filter((p) => p.status === "Planning").length;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const taskRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Tech stack frequency map
  const techMap = {};
  projects.forEach((p) => {
    if (Array.isArray(p.techStack)) {
      p.techStack.forEach((tech) => {
        const clean = tech.trim();
        if (clean) techMap[clean] = (techMap[clean] || 0) + 1;
      });
    }
  });

  const sortedTech = Object.entries(techMap).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
          <BarChart3 className="h-7 w-7 text-purple-600" />
          Developer Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          High-level insights into your software development velocity and stack distribution.
        </p>
      </div>

      {dataError && <p role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">{dataError}</p>}
      {loading && <p aria-live="polite" className="text-xs text-slate-400">Refreshing your project and task summaries…</p>}

      {/* Primary KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-[28px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Projects Tracked</p>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{totalProjects}</p>
          <p className="text-xs text-purple-600 font-medium mt-1">Across all statuses</p>
        </div>

        <div className="rounded-[28px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Sprint Completion</p>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{taskRate}%</p>
          <p className="text-xs text-emerald-600 font-medium mt-1">{completedTasks} goals cleared</p>
        </div>

        <div className="rounded-[28px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Shipped Projects</p>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{completed}</p>
          <p className="text-xs text-indigo-600 font-medium mt-1">Production ready</p>
        </div>

        <div className="rounded-[28px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">In Backlog</p>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{pendingTasks}</p>
          <p className="text-xs text-amber-600 font-medium mt-1">Upcoming milestones</p>
        </div>
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Project Status Breakdown */}
        <div className="rounded-[28px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
          <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4">
            Project Status Distribution
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="flex items-center gap-2 text-blue-600">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                  In Progress
                </span>
                <span>{inProgress} projects</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full"
                  style={{ width: `${totalProjects ? (inProgress / totalProjects) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="flex items-center gap-2 text-emerald-600">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  Completed
                </span>
                <span>{completed} projects</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${totalProjects ? (completed / totalProjects) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="flex items-center gap-2 text-amber-500">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  Planning
                </span>
                <span>{planning} projects</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full"
                  style={{ width: `${totalProjects ? (planning / totalProjects) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack Distribution */}
        <div className="rounded-[28px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
          <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4">
            Top Technologies Used
          </h3>
          {sortedTech.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              Add tech stacks to your projects to see your language breakdown here.
            </p>
          ) : (
            <div className="space-y-3">
              {sortedTech.slice(0, 5).map(([tech, count]) => (
                <div key={tech} className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {tech}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-purple-600 h-full rounded-full"
                        style={{ width: `${Math.min(100, (count / totalProjects) * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-slate-400 w-8 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <section className="rounded-[28px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-1"><Sparkles className="h-4 w-4 text-purple-600" /><h2 className="font-bold text-base text-slate-900 dark:text-white">AI study coach</h2></div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Ask for a practical next step. TrackPort adds compact project details or solved LeetCode summaries only when your question is about that data.</p>
        <form onSubmit={askAI} className="flex flex-col sm:flex-row gap-2">
          <input value={prompt} onChange={(event) => setPrompt(event.target.value)} maxLength={1000} placeholder="What should I focus on this week?" className="h-11 flex-1 rounded-2xl border border-slate-200 bg-white/80 px-4 text-sm dark:border-slate-700 dark:bg-slate-800/80" />
          <button disabled={askingAI || !prompt.trim()} className="h-11 rounded-2xl bg-purple-600 px-5 text-sm font-semibold text-white disabled:opacity-50">{askingAI ? 'Thinking…' : 'Ask coach'}</button>
        </form>
        {aiError && <p role="alert" className="mt-3 text-xs text-rose-600">{aiError}</p>}
        {aiReply && <div className="mt-4 whitespace-pre-wrap rounded-2xl bg-purple-50/80 p-4 text-sm leading-6 text-slate-700 dark:bg-purple-950/30 dark:text-slate-200">{aiReply}</div>}
      </section>
    </div>
  );
}

