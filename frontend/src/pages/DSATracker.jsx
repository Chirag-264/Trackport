import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Code2, Flame, Target, Trophy, ExternalLink, Plus, Minus, CheckCircle2, Trash2, Loader2, CalendarDays, RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getDsaProgress, createDsaProblem, deleteDsaProblem, syncLeetCodeSolved, updateDsaDailyProgress } from '@/services/dsa.service';
import { updateDailyGoal } from '@/services/user.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

const emptyStats = { totalSolved: 0, solvedToday: 0, actualSolvedToday: 0, manualProgressCount: 0, dailyGoal: 2, streak: 0, weekCount: 0, monthCount: 0, weeklyCounts: [], calendar: [] };

export default function DSATracker() {
  const { user, updateUser } = useAuth();
  const [stats, setStats] = useState(emptyStats);
  const [problems, setProblems] = useState([]);
  const [pagination, setPagination] = useState({ nextSkip: 0, hasMore: false, total: 0 });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [newProblem, setNewProblem] = useState({ title: '', platform: 'LeetCode', difficulty: 'Medium', topic: '', problemUrl: '' });
  const [syncConfigured, setSyncConfigured] = useState(false);
  const [syncingLeetCode, setSyncingLeetCode] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');
  const [syncError, setSyncError] = useState('');
  const [savingProgress, setSavingProgress] = useState(false);
  const [progressMessage, setProgressMessage] = useState('');
  const [progressError, setProgressError] = useState('');
  const [savingGoal, setSavingGoal] = useState(false);
  const initializationStarted = useRef(false);

  const loadProgress = async ({ skip = 0, append = false } = {}) => {
    try {
      setError('');
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
      const response = await getDsaProgress({ skip, timezone });
      const data = response.data;
      setProblems((current) => append ? [...current, ...(data.problems || [])] : (data.problems || []));
      setStats({ ...emptyStats, ...data.stats });
      setPagination(data.pagination || { nextSkip: 0, hasMore: false, total: data.problems?.length || 0 });
      setSyncConfigured(Boolean(data.leetcodeSyncConfigured));
      return data;
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not load your practice history.');
      return null;
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const runLeetCodeSync = async (force = false) => {
    setSyncingLeetCode(true);
    setSyncError('');
    setSyncMessage('');
    try {
      const response = await syncLeetCodeSolved({ force });
      const { checked = 0, imported = 0, updated = 0, cached = false, rateLimited = false } = response.data;
      if (rateLimited) setSyncMessage(`Alfa is rate limiting requests, so TrackPort used your last saved LeetCode snapshot (${checked} recent problems). Try syncing later.`);
      else if (cached) setSyncMessage(`Recent LeetCode data refreshed from cache: ${imported} added, ${updated} updated.`);
      else setSyncMessage(`LeetCode refresh complete: ${checked} recent accepted submissions checked, ${imported} added, ${updated} refreshed.`);
      await loadProgress();
    } catch (requestError) {
      setSyncError(requestError.response?.data?.message || 'Could not load recent LeetCode solves.');
    } finally {
      setSyncingLeetCode(false);
    }
  };

  useEffect(() => {
    if (initializationStarted.current) return;
    initializationStarted.current = true;
    (async () => {
      const data = await loadProgress();
      if (data?.leetcodeSyncConfigured) await runLeetCodeSync(false);
    })();
  }, []);

  const handleLogProblem = async (event) => {
    event.preventDefault();
    if (!newProblem.title.trim()) return;
    try {
      setSaving(true);
      await createDsaProblem({ ...newProblem, title: newProblem.title.trim() });
      setNewProblem({ title: '', platform: 'LeetCode', difficulty: 'Medium', topic: '', problemUrl: '' });
      setIsLogOpen(false);
      await loadProgress();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not save this problem.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDsaProblem(id);
      await loadProgress();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not remove this problem.');
    }
  };

  const handleSeeMore = async () => {
    setLoadingMore(true);
    await loadProgress({ skip: pagination.nextSkip, append: true });
  };

  const handleGoalChange = async (change) => {
    const dailyGoal = Math.max(1, Math.min(100, stats.dailyGoal + change));
    if (dailyGoal === stats.dailyGoal || savingGoal) return;
    setSavingGoal(true);
    setProgressError('');
    try {
      const response = await updateDailyGoal(dailyGoal);
      setStats((current) => ({ ...current, dailyGoal: response.data.dailyGoal }));
      updateUser({ ...user, dailyGoal: response.data.dailyGoal });
    } catch (requestError) {
      setProgressError(requestError.response?.data?.message || 'Could not update your daily goal.');
    } finally {
      setSavingGoal(false);
    }
  };

  const handleProgressChange = async (change) => {
    const actualCount = stats.actualSolvedToday || 0;
    const nextCount = Math.max(actualCount, Math.min(100, displayedProgress + change));
    if (nextCount === displayedProgress || savingProgress) return;
    setSavingProgress(true);
    setProgressError('');
    setProgressMessage('');
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
      await updateDsaDailyProgress(nextCount, timezone);
      const data = await loadProgress();
      if (data) setProgressMessage('Today’s progress updated.');
    } catch (requestError) {
      setProgressError(requestError.response?.data?.message || 'Could not save today’s progress.');
    } finally {
      setSavingProgress(false);
    }
  };

  const displayedProgress = Math.max(stats.actualSolvedToday || 0, stats.manualProgressCount || 0);
  const goalProgress = stats.dailyGoal ? Math.min(100, Math.round((displayedProgress / stats.dailyGoal) * 100)) : 0;
  const calendarWeeks = useMemo(() => {
    const calendar = stats.calendar || [];
    if (!calendar.length) return [];
    const firstDayOffset = new Date(`${calendar[0].date}T00:00:00`).getDay();
    const cells = [...Array(firstDayOffset).fill(null), ...calendar];
    const weeks = [];
    for (let index = 0; index < cells.length; index += 7) weeks.push(cells.slice(index, index + 7));
    return weeks;
  }, [stats.calendar]);
  const usernameLinks = [
    { label: 'LeetCode', short: 'LC', username: user?.leetcodeUsername, url: (name) => `https://leetcode.com/${encodeURIComponent(name)}/`, tint: 'text-amber-500 bg-amber-500/10' },
    { label: 'Codeforces', short: 'CF', username: user?.codeforcesUsername, url: (name) => `https://codeforces.com/profile/${encodeURIComponent(name)}`, tint: 'text-blue-500 bg-blue-500/10' }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5"><Code2 className="h-7 w-7 text-purple-600" />DSA Practice</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Your LeetCode solved history, daily activity, and practice streak in one place.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {syncConfigured
            ? <Button variant="outline" disabled={syncingLeetCode} onClick={() => runLeetCodeSync(true)} className="rounded-2xl font-semibold text-xs h-11 px-4 gap-2">{syncingLeetCode ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}{syncingLeetCode ? 'Syncing…' : 'Sync LeetCode'}</Button>
            : <Button asChild variant="outline" className="rounded-2xl font-semibold text-xs h-11 px-4 gap-2"><Link to="/settings"><Code2 className="h-4 w-4" />Add LeetCode username</Link></Button>}
          <Button onClick={() => setIsLogOpen(true)} className="rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs h-11 px-5 gap-2"><Plus className="h-4 w-4" />Log Problem</Button>
        </div>
      </div>

      {error && <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">{error}</div>}
      {syncMessage && <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">{syncMessage}</div>}
      {syncError && <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">{syncError}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard title="Current Streak" value={stats.streak} suffix="days" icon={<Flame className="h-6 w-6" />} iconClass="bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400" />
        <div className="rounded-[28px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex items-center justify-between gap-3">
          <div><p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Today's Goal</p><div className="flex items-baseline gap-1.5 mt-1"><span className="text-3xl font-extrabold text-slate-900 dark:text-white">{displayedProgress} / {stats.dailyGoal}</span><span className="text-xs font-semibold text-purple-600">problems</span></div><p className="text-[10px] text-slate-400 mt-1">Adjust your daily target</p></div>
          <div className="flex items-center gap-1.5">
            <Button type="button" aria-label="Decrease daily goal" variant="outline" disabled={savingGoal || stats.dailyGoal <= 1} onClick={() => handleGoalChange(-1)} className="h-9 w-9 p-0 rounded-xl"><Minus className="h-4 w-4" /></Button>
            <Button type="button" aria-label="Increase daily goal" variant="outline" disabled={savingGoal || stats.dailyGoal >= 100} onClick={() => handleGoalChange(1)} className="h-9 w-9 p-0 rounded-xl"><Plus className="h-4 w-4" /></Button>
          </div>
        </div>
        <MetricCard title="Solved Problems" value={stats.totalSolved} suffix="total" icon={<Trophy className="h-6 w-6" />} iconClass="bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400" />
      </div>

      <div className="rounded-[28px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div><h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2"><CalendarDays className="h-4 w-4 text-purple-600" />Activity calendar</h3><p className="text-xs text-slate-500 mt-1">Daily activity combines LeetCode submissions, logged problems, and your saved progress.</p></div>
          <span className="text-xs text-slate-500">{stats.streak} day current streak · {stats.weekCount} this week · {stats.monthCount} this month</span>
        </div>
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-1.5 min-w-max" aria-label="Last 365 days of solved problems">
            {calendarWeeks.map((week, weekIndex) => <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => {
                if (!day) return <div key={`empty-${dayIndex}`} className="h-3 w-3" />;
                const level = day.count === 0 ? 'bg-slate-100 dark:bg-slate-800' : day.count === 1 ? 'bg-emerald-200 dark:bg-emerald-900' : day.count < 4 ? 'bg-emerald-400 dark:bg-emerald-700' : 'bg-emerald-600 dark:bg-emerald-500';
                return <div key={day.date} title={`${day.date}: ${day.count} activity count`} className={`h-3 w-3 rounded-[3px] ${level}`} />;
              })}
            </div>)}
          </div>
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1"><span>365 days ago</span><span>Today</span></div>
      </div>

      <div className="rounded-[28px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
        <div className="flex items-center justify-between text-xs font-bold mb-2"><span className="text-slate-600 dark:text-slate-300">Daily goal progress</span><span className="text-purple-600 dark:text-purple-400">{displayedProgress} / {stats.dailyGoal}</span></div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden"><div className="bg-purple-600 h-full rounded-full transition-all" style={{ width: `${goalProgress}%` }} /></div>
        <div className="mt-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div><p className="text-xs font-semibold text-slate-700 dark:text-slate-200">Completed today</p><p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Track LeetCode work outside the recent import. Logged problems count automatically.</p></div>
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <Button type="button" aria-label="Decrease completed today" variant="outline" disabled={savingProgress || displayedProgress <= (stats.actualSolvedToday || 0)} onClick={() => handleProgressChange(-1)} className="h-9 w-9 p-0 rounded-xl"><Minus className="h-4 w-4" /></Button>
              <span className="min-w-8 text-center text-lg font-bold tabular-nums text-purple-600 dark:text-purple-400" aria-live="polite">{displayedProgress}</span>
              <Button type="button" aria-label="Increase completed today" variant="outline" disabled={savingProgress || displayedProgress >= 100} onClick={() => handleProgressChange(1)} className="h-9 w-9 p-0 rounded-xl"><Plus className="h-4 w-4" /></Button>
            </div>
          </div>
          {progressMessage && <p role="status" className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">{progressMessage}</p>}
          {progressError && <p role="alert" className="text-xs text-rose-600 dark:text-rose-400 mt-2">{progressError}</p>}
        </div>
        <div className="grid grid-cols-7 gap-2 mt-5">{(stats.weeklyCounts || []).map((day) => <div key={day.date} className="text-center"><p className="text-[10px] text-slate-400">{new Date(`${day.date}T00:00:00`).toLocaleDateString(undefined, { weekday: 'short' })}</p><div className={`mt-1 rounded-xl py-2 text-xs font-semibold ${day.count ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}>{day.count}</div></div>)}</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {usernameLinks.map((platform) => <div key={platform.label} className="rounded-[28px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex items-center justify-between gap-3"><div className="flex items-center gap-3.5 min-w-0"><div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm ${platform.tint}`}>{platform.short}</div><div className="min-w-0"><h4 className="text-sm font-bold text-slate-900 dark:text-white">{platform.label}</h4><p className="text-xs text-slate-500 truncate">{platform.username ? `Connected profile: ${platform.username}` : 'Add your username in Settings'}</p></div></div>{platform.username && <Button variant="outline" size="sm" asChild className="rounded-xl gap-1 text-xs"><a href={platform.url(platform.username)} target="_blank" rel="noreferrer">Open <ExternalLink className="h-3 w-3" /></a></Button>}</div>)}
      </div>

      <div className="rounded-[28px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
        <div className="flex items-center justify-between gap-3 mb-4"><div><h3 className="font-bold text-base text-slate-900 dark:text-white">Solved problems</h3><p className="text-xs text-slate-500 mt-1">Showing {problems.length} of {pagination.total} recorded problems</p></div><span className="text-xs text-slate-500">{stats.weekCount} this week · {stats.monthCount} this month</span></div>
        {loading ? <div className="py-10 flex items-center justify-center gap-2 text-sm text-slate-400"><Loader2 className="h-4 w-4 animate-spin" />Loading history…</div> : problems.length === 0 ? <div className="py-10 text-center text-sm text-slate-400"><CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-50" />No solved problems have been imported yet.</div> : <div className="divide-y divide-slate-100 dark:divide-slate-800">{problems.map((problem) => <div key={problem._id} className="py-3 flex items-center justify-between gap-3"><div className="flex items-center gap-3 min-w-0"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /><div className="min-w-0"><p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{problem.title}</p><p className="text-[11px] text-slate-400 mt-0.5">{problem.platform}{problem.topic ? ` · ${problem.topic}` : ''} · {new Date(problem.solvedAt).toLocaleDateString()}</p></div></div><div className="flex items-center gap-2 shrink-0"><Badge variant="outline" className="text-[10px]">{problem.difficulty}</Badge>{problem.problemUrl && <a aria-label={`Open ${problem.title}`} href={problem.problemUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-purple-600"><ExternalLink className="h-4 w-4" /></a>}<button type="button" aria-label={`Delete ${problem.title}`} onClick={() => handleDelete(problem._id)} className="text-slate-400 hover:text-rose-500"><Trash2 className="h-4 w-4" /></button><span className="text-xs text-slate-400 hidden sm:inline"><CalendarDays className="h-3 w-3 inline mr-1" />{new Date(problem.solvedAt).toLocaleDateString()}</span></div></div>)}</div>}
        {pagination.hasMore && <div className="pt-4 text-center"><Button variant="outline" disabled={loadingMore} onClick={handleSeeMore} className="rounded-xl min-w-36">{loadingMore ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Loading…</> : 'See more'}</Button></div>}
      </div>

      <Dialog open={isLogOpen} onOpenChange={setIsLogOpen}>
        <DialogContent className="rounded-[32px] max-w-md p-6">
          <DialogHeader><DialogTitle>Log a solved problem</DialogTitle><DialogDescription>This entry updates your history, daily goal, calendar, and streak.</DialogDescription></DialogHeader>
          <form onSubmit={handleLogProblem} className="space-y-4 py-2">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">Problem title<Input required maxLength={160} value={newProblem.title} onChange={(event) => setNewProblem({ ...newProblem, title: event.target.value })} className="rounded-xl mt-1" placeholder="e.g. Trapping Rain Water" /></label>
            <div className="grid grid-cols-2 gap-3"><label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Platform<select value={newProblem.platform} onChange={(event) => setNewProblem({ ...newProblem, platform: event.target.value })} className="w-full h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 text-xs mt-1"><option>LeetCode</option><option>Codeforces</option><option>HackerRank</option><option>GeeksforGeeks</option><option>Other</option></select></label><label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Difficulty<select value={newProblem.difficulty} onChange={(event) => setNewProblem({ ...newProblem, difficulty: event.target.value })} className="w-full h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 text-xs mt-1"><option>Easy</option><option>Medium</option><option>Hard</option></select></label></div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">Topic<Input maxLength={80} value={newProblem.topic} onChange={(event) => setNewProblem({ ...newProblem, topic: event.target.value })} className="rounded-xl mt-1" placeholder="Dynamic programming" /></label>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">Problem URL (optional)<Input type="url" value={newProblem.problemUrl} onChange={(event) => setNewProblem({ ...newProblem, problemUrl: event.target.value })} className="rounded-xl mt-1" placeholder="https://…" /></label>
            <DialogFooter className="pt-2"><Button type="button" variant="outline" onClick={() => setIsLogOpen(false)} className="rounded-xl">Cancel</Button><Button type="submit" disabled={saving} className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white">{saving ? 'Saving…' : 'Save Problem'}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MetricCard({ title, value, suffix, icon, iconClass }) {
  return <div className="rounded-[28px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex items-center justify-between"><div><p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{title}</p><div className="flex items-baseline gap-1.5 mt-1"><span className="text-3xl font-extrabold text-slate-900 dark:text-white">{value}</span><span className="text-xs font-semibold text-purple-600">{suffix}</span></div></div><div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconClass}`}>{icon}</div></div>;
}
