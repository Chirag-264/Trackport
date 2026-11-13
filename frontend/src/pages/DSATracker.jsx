import React, { useState } from "react";
import {
  Code2,
  Flame,
  Target,
  Trophy,
  ExternalLink,
  Plus,
  CheckCircle2,
  Sparkles,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

export default function DSATracker() {
  const [streak, setStreak] = useState(12);
  const [dailyGoal, setDailyGoal] = useState(2);
  const [solvedToday, setSolvedToday] = useState(2);
  const [isLogOpen, setIsLogOpen] = useState(false);

  const [problems, setProblems] = useState([
    { id: 1, title: "Two Sum", platform: "LeetCode", difficulty: "Easy", topic: "Arrays & Hash", date: "Today" },
    { id: 2, title: "Longest Substring Without Repeating Characters", platform: "LeetCode", difficulty: "Medium", topic: "Sliding Window", date: "Today" },
    { id: 3, title: "Watermelon", platform: "Codeforces", difficulty: "800", topic: "Math & Brute Force", date: "Yesterday" },
    { id: 4, title: "Invert Binary Tree", platform: "LeetCode", difficulty: "Easy", topic: "Trees", date: "2 days ago" },
    { id: 5, title: "Coin Change", platform: "LeetCode", difficulty: "Medium", topic: "Dynamic Programming", date: "3 days ago" },
  ]);

  const [newProblem, setNewProblem] = useState({
    title: "",
    platform: "LeetCode",
    difficulty: "Medium",
    topic: "Algorithms"
  });

  const handleLogProblem = (e) => {
    e.preventDefault();
    if (!newProblem.title.trim()) return;

    setProblems((prev) => [
      {
        id: Date.now(),
        ...newProblem,
        date: "Just now"
      },
      ...prev
    ]);
    setSolvedToday((v) => v + 1);
    setIsLogOpen(false);
    setNewProblem({ title: "", platform: "LeetCode", difficulty: "Medium", topic: "Algorithms" });
  };

  const getDifficultyBadge = (diff) => {
    switch (diff) {
      case "Easy":
      case "800":
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800 text-[10px]">Easy</Badge>;
      case "Hard":
      case "1600+":
        return <Badge variant="outline" className="bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border-rose-300 dark:border-rose-800 text-[10px]">Hard</Badge>;
      case "Medium":
      default:
        return <Badge variant="outline" className="bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border-amber-300 dark:border-amber-800 text-[10px]">Medium</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Code2 className="h-7 w-7 text-purple-600" />
            DSA Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Build discipline with algorithmic problem solving across LeetCode & Codeforces.
          </p>
        </div>

        <Button
          onClick={() => setIsLogOpen(true)}
          className="rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs h-11 px-5 gap-2 shadow-sm shrink-0"
        >
          <Plus className="h-4 w-4" />
          Log Solved Problem
        </Button>
      </div>

      {/* KPI Streak & Goals Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Streak Card */}
        <div className="rounded-[28px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Current Streak</p>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{streak}</span>
              <span className="text-xl">🔥</span>
              <span className="text-xs font-semibold text-purple-600">days active</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Best Streak: 23 days</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
            <Flame className="h-6 w-6" />
          </div>
        </div>

        {/* Today's Target */}
        <div className="rounded-[28px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Daily Target</p>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{solvedToday} / {dailyGoal}</span>
              <span className="text-xs font-semibold text-emerald-600">problems</span>
            </div>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">Goal completed for today! 🎉</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
            <Target className="h-6 w-6" />
          </div>
        </div>

        {/* Total Solved */}
        <div className="rounded-[28px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Solved</p>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">142</span>
              <span className="text-xs font-semibold text-indigo-600">problems</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Easy: 64 · Med: 62 · Hard: 16</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
            <Trophy className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* External Platform Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* LeetCode Sync */}
        <div className="rounded-[28px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-sm">
              LC
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">LeetCode Sync</h4>
              <p className="text-xs text-slate-500">Solved: 118 problems · Rank: Top 15%</p>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild className="rounded-xl gap-1 text-xs">
            <a href="https://leetcode.com" target="_blank" rel="noreferrer">
              Open <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>

        {/* Codeforces Sync */}
        <div className="rounded-[28px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-sm">
              CF
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Codeforces Sync</h4>
              <p className="text-xs text-slate-500">Solved: 24 problems · Rating: Pupil (1280)</p>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild className="rounded-xl gap-1 text-xs">
            <a href="https://codeforces.com" target="_blank" rel="noreferrer">
              Open <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>
      </div>

      {/* Recent Problems Table */}
      <div className="rounded-[28px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
        <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4">
          Recently Practiced Problems
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {problems.map((p) => (
            <div key={p.id} className="py-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {p.title}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {p.platform} · {p.topic}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {getDifficultyBadge(p.difficulty)}
                <span className="text-xs text-slate-400 hidden sm:inline">{p.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log Problem Modal */}
      <Dialog open={isLogOpen} onOpenChange={setIsLogOpen}>
        <DialogContent className="rounded-[32px] max-w-md p-6">
          <DialogHeader>
            <DialogTitle>Log Solved Problem</DialogTitle>
            <DialogDescription>Record a DSA problem solved on LeetCode or Codeforces.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleLogProblem} className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Problem Title *</label>
              <Input
                required
                placeholder="e.g. Trapping Rain Water"
                value={newProblem.title}
                onChange={(e) => setNewProblem({ ...newProblem, title: e.target.value })}
                className="rounded-xl mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Platform</label>
                <select
                  value={newProblem.platform}
                  onChange={(e) => setNewProblem({ ...newProblem, platform: e.target.value })}
                  className="w-full h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 text-xs mt-1"
                >
                  <option value="LeetCode">LeetCode</option>
                  <option value="Codeforces">Codeforces</option>
                  <option value="HackerRank">HackerRank</option>
                  <option value="GeeksforGeeks">GeeksforGeeks</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Difficulty</label>
                <select
                  value={newProblem.difficulty}
                  onChange={(e) => setNewProblem({ ...newProblem, difficulty: e.target.value })}
                  className="w-full h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 text-xs mt-1"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Topic / Category</label>
              <Input
                placeholder="e.g. Dynamic Programming, Binary Search"
                value={newProblem.topic}
                onChange={(e) => setNewProblem({ ...newProblem, topic: e.target.value })}
                className="rounded-xl mt-1"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsLogOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white">
                Save Problem
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

