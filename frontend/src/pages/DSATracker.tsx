import { useState, useMemo } from 'react';
import {
  Search,
  Flame,
  TrendingUp,
  CheckCircle2,
  Circle,
  Clock,
  ChevronRight,
  Target,
  ChevronDown,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { ChartCard } from '@/components/shared/ChartCard';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  dsaProblems,
  dsaTopics,
  dsaDifficultyStats,
  dsaHeatmap,
  dsaMonthlyActivity,
  type DsaProblem,
} from '@/data/dsa';
import { cn } from '@/lib/utils';

const difficultyConfig = {
  Easy: { color: 'text-success', bg: 'bg-success/10', border: 'border-success/20' },
  Medium: { color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20' },
  Hard: { color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/20' },
};

const statusConfig = {
  solved: { color: 'text-success', bg: 'bg-success', icon: CheckCircle2 },
  attempted: { color: 'text-warning', bg: 'bg-warning', icon: Circle },
  todo: { color: 'text-muted-foreground', bg: 'bg-muted-foreground', icon: Circle },
};

const heatmapColors = [
  'bg-muted/50',
  'bg-success/20',
  'bg-success/40',
  'bg-success/60',
  'bg-success',
];

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];

export default function DSATracker() {
  const [search, setSearch] = useState('');
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState(10);

  const filtered = useMemo(() => {
    return dsaProblems.filter((p) => {
      if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (topicFilter !== 'all' && p.topic !== topicFilter) return false;
      if (difficultyFilter !== 'all' && p.difficulty !== difficultyFilter) return false;
      return true;
    });
  }, [search, topicFilter, difficultyFilter]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const totalSolved = dsaDifficultyStats.easy.solved + dsaDifficultyStats.medium.solved + dsaDifficultyStats.hard.solved;
  const totalAll = dsaDifficultyStats.easy.total + dsaDifficultyStats.medium.total + dsaDifficultyStats.hard.total;
  const solvedToday = 2;
  const streak = 23;

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 lg:p-6">
      <PageHeader
        title="DSA Tracker"
        description="Track your problem-solving progress and keep your streak alive."
      />

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="card-hover">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Solved</p>
                <p className="text-2xl font-semibold">{totalSolved.toLocaleString()}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">of {totalAll.toLocaleString()} total</p>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Current Streak</p>
                <p className="text-2xl font-semibold">{streak} days</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10 text-warning">
                <Flame className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Best: 89 days</p>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Solved Today</p>
                <p className="text-2xl font-semibold">{solvedToday}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-info/10 text-info">
                <Target className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-2 text-xs text-info">Keep the streak going</p>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">This Month</p>
                <p className="text-2xl font-semibold">47</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-2 text-xs text-success">+12% vs last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Difficulty breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="card-hover flex flex-col">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Difficulty Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 space-y-5">
            {(['Easy', 'Medium', 'Hard'] as const).map((diff) => {
              const stats = dsaDifficultyStats[diff.toLowerCase() as 'easy' | 'medium' | 'hard'];
              const dc = difficultyConfig[diff];
              return (
                <div key={diff} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className={cn('font-medium', dc.color)}>{diff}</span>
                    <span className="text-muted-foreground">
                      <span className="font-medium text-foreground">{stats.solved}</span> / {stats.total}
                    </span>
                  </div>
                  <ProgressBar
                    value={stats.solved}
                    max={stats.total}
                    color={diff === 'Easy' ? 'success' : diff === 'Medium' ? 'warning' : 'destructive'}
                    size="md"
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>

        <ChartCard title="Monthly Activity" description="Problems solved per month" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dsaMonthlyActivity} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} dy={8} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={28} />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '0.5rem', fontSize: '12px' }}
                cursor={{ fill: 'hsl(var(--accent))' }}
              />
              <Bar dataKey="solved" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} name="Solved" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Heatmap */}
      <Card className="card-hover">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-base">Activity Heatmap</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">Daily problem-solving activity over the past year</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Less</span>
            {heatmapColors.map((c, i) => (
              <div key={i} className={cn('h-3 w-3 rounded-sm', c)} />
            ))}
            <span>More</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto scrollbar-thin">
            <div className="flex flex-col gap-1">
              <div className="ml-7 flex gap-1 text-[10px] text-muted-foreground">
                {monthLabels.map((m, i) => (
                  <span key={i} className="w-12">{m}</span>
                ))}
              </div>
              <div className="flex gap-1">
                <div className="flex flex-col gap-1 text-[10px] text-muted-foreground">
                  {['Mon', '', 'Wed', '', 'Fri', '', ''].map((d, i) => (
                    <span key={i} className="h-3 leading-3">{d}</span>
                  ))}
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 53 }, (_, weekIdx) => (
                    <div key={weekIdx} className="flex flex-col gap-1">
                      {Array.from({ length: 7 }, (_, dayIdx) => {
                        const cellIdx = weekIdx * 7 + dayIdx;
                        const cell = dsaHeatmap[cellIdx];
                        if (!cell) return <div key={dayIdx} className="h-3 w-3" />;
                        return (
                          <div
                            key={dayIdx}
                            className={cn('h-3 w-3 rounded-sm transition-colors hover:ring-1 hover:ring-primary', heatmapColors[cell.level])}
                            title={`${cell.date}: ${cell.count} problems`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Problems table */}
      <Card className="card-hover overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-base">Problems</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search problems..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-48 pl-9"
              />
            </div>
            <Select value={topicFilter} onValueChange={setTopicFilter}>
              <SelectTrigger className="h-9 w-[130px]">
                <SelectValue placeholder="Topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Topics</SelectItem>
                {dsaTopics.slice(0, 12).map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="h-9 w-[130px]">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {visible.map((problem) => (
              <ProblemRow key={problem.id} problem={problem} />
            ))}
            {filtered.length === 0 && (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No problems match your filters.
              </div>
            )}
          </div>
          {hasMore && (
            <div className="flex justify-center border-t border-border py-4">
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setVisibleCount((c) => c + 10)}>
                <ChevronDown className="h-4 w-4" />
                Load More
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ProblemRow({ problem }: { problem: DsaProblem }) {
  const dc = difficultyConfig[problem.difficulty];
  const sc = statusConfig[problem.status];
  const StatusIcon = sc.icon;

  return (
    <div className="group flex items-center gap-3 px-5 py-3 transition-colors hover:bg-accent/50">
      <StatusIcon className={cn('h-4 w-4 shrink-0', sc.color)} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{problem.title}</p>
        <p className="truncate text-xs text-muted-foreground">{problem.topic}</p>
      </div>
      <Badge variant="outline" className={cn('shrink-0 border text-[10px] font-medium', dc.border, dc.color, dc.bg)}>
        {problem.difficulty}
      </Badge>
      {problem.solvedDate && (
        <span className="hidden shrink-0 items-center gap-1 text-xs text-muted-foreground sm:flex">
          <Clock className="h-3 w-3" />
          {problem.timeSpent}
        </span>
      )}
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  );
}
