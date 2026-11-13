import {
  FolderKanban,
  CheckCircle2,
  Code2,
  GitCommit,
  Plus,
  ArrowRight,
  TrendingUp,
  Flame,
  GitPullRequest,
  Star,
  GitFork,
  Calendar,
  Users,
  Clock,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { ChartCard } from '@/components/shared/ChartCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  dashboardStats,
  recentProjects,
  ongoingTasks,
  githubOverview,
  dsaOverview,
  weeklyActivity,
} from '@/data/dashboard';
import { cn } from '@/lib/utils';
import { softClasses, bgSolid } from '@/lib/colors';
import { Link } from 'react-router-dom';

const iconMap: Record<string, typeof FolderKanban> = {
  FolderKanban,
  CheckCircle2,
  Code2,
  GitCommit,
};

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 lg:p-6">
      <PageHeader
        title="Welcome back, Alex"
        description="Here's what's happening across your workspace today."
        actions={
          <Button variant="outline" size="sm" className="gap-1.5">
            <Calendar className="h-4 w-4" />
            Aug 2, 2026
          </Button>
        }
      />

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat) => {
          const Icon = iconMap[stat.icon] ?? FolderKanban;
          return (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              change={stat.change}
              trend={stat.trend}
              icon={Icon}
              color={stat.color as 'primary' | 'success' | 'info' | 'warning'}
            />
          );
        })}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Weekly activity chart */}
        <ChartCard
          title="Weekly Activity"
          description="Tasks, commits, and DSA problems by day"
          className="lg:col-span-2"
          action={
            <Badge variant="secondary" className="gap-1">
              <TrendingUp className="h-3 w-3" />
              +18% this week
            </Badge>
          }
        >
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={weeklyActivity} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDsa" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--info))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--info))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} dy={8} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={28} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                  fontSize: '12px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
              />
              <Area type="monotone" dataKey="commits" stroke="hsl(var(--success))" strokeWidth={2} fill="url(#colorCommits)" name="Commits" />
              <Area type="monotone" dataKey="tasks" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#colorTasks)" name="Tasks" />
              <Area type="monotone" dataKey="dsa" stroke="hsl(var(--info))" strokeWidth={2} fill="url(#colorDsa)" name="DSA" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* DSA tracker overview */}
        <Card className="card-hover flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">DSA Tracker</CardTitle>
              <Link to="/dsa">
                <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                  View all
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-semibold tracking-tight">{dsaOverview.totalSolved.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total problems solved</p>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-warning/10 px-2.5 py-1.5">
                <Flame className="h-4 w-4 text-warning" />
                <span className="text-sm font-semibold text-warning">{dsaOverview.streak}d streak</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg bg-success/10 p-2.5 text-center">
                <p className="text-lg font-semibold text-success">{dsaOverview.easySolved}</p>
                <p className="text-[10px] font-medium text-muted-foreground">Easy</p>
              </div>
              <div className="rounded-lg bg-warning/10 p-2.5 text-center">
                <p className="text-lg font-semibold text-warning">{dsaOverview.mediumSolved}</p>
                <p className="text-[10px] font-medium text-muted-foreground">Medium</p>
              </div>
              <div className="rounded-lg bg-destructive/10 p-2.5 text-center">
                <p className="text-lg font-semibold text-destructive">{dsaOverview.hardSolved}</p>
                <p className="text-[10px] font-medium text-muted-foreground">Hard</p>
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">This week</p>
                <span className="text-xs font-semibold text-success">+{dsaOverview.solvedToday} solved today</span>
              </div>
              <ResponsiveContainer width="100%" height={48}>
                <BarChart data={dsaOverview.weekActivity} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Bar dataKey="solved" fill="hsl(var(--info))" radius={[3, 3, 0, 0]} name="Solved" />
                  <XAxis dataKey="day" hide />
                  <YAxis hide domain={[0, 'dataMax']} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '0.5rem', fontSize: '11px' }}
                    cursor={{ fill: 'hsl(var(--accent))' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <Link to="/dsa" className="mt-auto">
              <Button variant="outline" size="sm" className="w-full gap-1.5">
                <Code2 className="h-3.5 w-3.5" />
                Practice today
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent projects + Ongoing tasks */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent projects */}
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base">Recent Projects</CardTitle>
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="sm" className="h-7 gap-1 text-xs">
                <Plus className="h-3.5 w-3.5" />
                New Project
              </Button>
              <Link to="/projects">
                <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                  View all
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            {recentProjects.map((project) => (
              <div
                key={project.id}
                className="group flex items-center gap-3 rounded-lg px-2.5 py-2.5 transition-all hover:bg-accent/50"
              >
                <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-semibold', softClasses(project.color))}>
                  {project.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{project.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{project.description}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <StatusBadge status={project.status} />
                  <span className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
                    <Users className="h-3 w-3" />
                    {project.members}
                  </span>
                  <span className="hidden items-center gap-1 text-xs text-muted-foreground md:flex">
                    <Clock className="h-3 w-3" />
                    {project.dueDate}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Ongoing tasks */}
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base">Ongoing Tasks</CardTitle>
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="sm" className="h-7 gap-1 text-xs">
                <Plus className="h-3.5 w-3.5" />
                New Task
              </Button>
              <Link to="/tasks">
                <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                  View all
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            {ongoingTasks.map((task) => (
              <div
                key={task.id}
                className="group flex items-center gap-3 rounded-lg px-2.5 py-2.5 transition-all hover:bg-accent/50"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-success" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{task.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{task.project}</p>
                </div>
                <span className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
                  <Clock className="h-3 w-3" />
                  {task.dueDate}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* GitHub overview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ChartCard
          title="GitHub Commits"
          description="This week's commit activity"
          className="lg:col-span-2"
          action={
            <Link to="/github">
              <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                View all
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          }
        >
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={githubOverview.weeklyCommits} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} dy={8} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={28} domain={[0, 'dataMax + 5']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                  fontSize: '12px',
                }}
                cursor={{ fill: 'hsl(var(--accent))' }}
              />
              <Bar dataKey="commits" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Commits" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card className="card-hover">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">GitHub Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border p-3">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <GitCommit className="h-3.5 w-3.5" />
                  <span className="text-xs">Commits</span>
                </div>
                <p className="mt-1 text-xl font-semibold">{githubOverview.totalCommits.toLocaleString()}</p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <GitFork className="h-3.5 w-3.5" />
                  <span className="text-xs">Repos</span>
                </div>
                <p className="mt-1 text-xl font-semibold">{githubOverview.totalRepos}</p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <GitPullRequest className="h-3.5 w-3.5" />
                  <span className="text-xs">PRs</span>
                </div>
                <p className="mt-1 text-xl font-semibold">{githubOverview.totalPRs}</p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Star className="h-3.5 w-3.5" />
                  <span className="text-xs">Stars</span>
                </div>
                <p className="mt-1 text-xl font-semibold">{githubOverview.totalStars.toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Top Repositories</p>
              {githubOverview.topRepos.map((repo) => (
                <div key={repo.name} className="flex items-center gap-2 text-sm">
                  <div className={cn('h-2 w-2 rounded-full', bgSolid[repo.color] ?? 'bg-primary')} />
                  <span className="flex-1 truncate font-mono text-xs">{repo.name}</span>
                  <Star className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs tabular-nums text-muted-foreground">{repo.stars}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
