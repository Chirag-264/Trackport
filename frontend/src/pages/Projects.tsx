import { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  Star,
  Circle,
  MoreHorizontal,
  LayoutGrid,
  List,
  Activity,
  GitCommit,
  GitPullRequest,
  MessageSquare,
  Rocket,
  TrendingUp,
  ChevronDown,
  Users,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { ChartCard } from '@/components/shared/ChartCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip as RechartsTooltip,
} from 'recharts';
import { projects, projectActivity, projectInsights, type ProjectStatus } from '@/data/projects';
import { cn } from '@/lib/utils';
import { softClasses, bgSolid } from '@/lib/colors';

type SortKey = 'name' | 'dueDate' | 'stars';
const PAGE_SIZE = 10;

export default function Projects() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortKey>('stars');
  const [view, setView] = useState<'table' | 'grid'>('table');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    let result = projects.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
    );
    if (statusFilter !== 'all') result = result.filter((p) => p.status === statusFilter);
    result = [...result].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'stars') return b.stars - a.stars;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
    return result;
  }, [search, statusFilter, sortBy]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const activityIcon: Record<string, typeof GitCommit> = {
    commit: GitCommit,
    pr: GitPullRequest,
    task: Circle,
    comment: MessageSquare,
    deploy: Rocket,
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 lg:p-6">
      <PageHeader
        title="Projects"
        description="Manage and track all your projects in one place."
        actions={
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        }
      />

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Total Projects', value: projects.length, icon: LayoutGrid, color: 'primary' },
          { label: 'Active', value: projects.filter(p => p.status === 'active').length, icon: Activity, color: 'success' },
          { label: 'Planning', value: projects.filter(p => p.status === 'planning').length, icon: Circle, color: 'warning' },
          { label: 'Completed', value: projects.filter(p => p.status === 'completed').length, icon: Star, color: 'info' },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="card-hover">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="text-2xl font-semibold">{s.value}</p>
                  </div>
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', softClasses(s.color))}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Status distribution */}
      <ChartCard title="Status Distribution" description="Projects by current status">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={projectInsights.distribution}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={75}
              paddingAngle={3}
            >
              {projectInsights.distribution.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <RechartsTooltip
              contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '0.5rem', fontSize: '12px' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Filters bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setVisibleCount(PAGE_SIZE); }}
            className="h-9 pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v as ProjectStatus | 'all'); setVisibleCount(PAGE_SIZE); }}>
            <SelectTrigger className="h-9 w-[140px]">
              <Filter className="mr-1.5 h-3.5 w-3.5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortKey)}>
            <SelectTrigger className="h-9 w-[140px]">
              <ArrowUpDown className="mr-1.5 h-3.5 w-3.5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stars">Stars</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="dueDate">Due Date</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center rounded-lg border border-border">
            <Button variant={view === 'table' ? 'secondary' : 'ghost'} size="icon" className="h-9 w-9 rounded-r-none" onClick={() => setView('table')}>
              <List className="h-4 w-4" />
            </Button>
            <Button variant={view === 'grid' ? 'secondary' : 'ghost'} size="icon" className="h-9 w-9 rounded-l-none" onClick={() => setView('grid')}>
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Projects table / grid */}
      {view === 'table' ? (
        <Card className="card-hover overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[280px]">Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Language</TableHead>
                <TableHead className="hidden sm:table-cell">Stars</TableHead>
                <TableHead className="hidden md:table-cell">Members</TableHead>
                <TableHead className="hidden lg:table-cell">Due</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((project) => (
                <TableRow key={project.id} className="group">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-semibold', softClasses(project.languageColor))}>
                        {project.key}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{project.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{project.description}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={project.status} />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center gap-1.5">
                      <div className={cn('h-2.5 w-2.5 rounded-full', bgSolid[project.languageColor] ?? 'bg-primary')} />
                      <span className="text-sm">{project.language}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="h-3.5 w-3.5" />
                      <span className="tabular-nums">{project.stars}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-3.5 w-3.5" />
                      <span className="tabular-nums">{project.members}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                    {new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {hasMore && (
            <div className="flex justify-center border-t border-border py-4">
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
                <ChevronDown className="h-4 w-4" />
                Load More
              </Button>
            </div>
          )}
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((project) => (
              <Card key={project.id} className="card-hover">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg text-sm font-semibold', softClasses(project.languageColor))}>
                        {project.key}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{project.name}</p>
                        <StatusBadge status={project.status} />
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">{project.description}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                    <div className="flex -space-x-2">
                      {['AK', 'JD', 'ML'].map((init, i) => (
                        <div key={i} className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[10px] font-medium ring-2 ring-background">
                          {init}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {project.stars}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {project.members}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {hasMore && (
            <div className="flex justify-center">
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
                <ChevronDown className="h-4 w-4" />
                Load More
              </Button>
            </div>
          )}
        </>
      )}

      {/* Recent activity + GitHub activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base">Recent Activity</CardTitle>
            <Badge variant="secondary" className="gap-1">
              <Activity className="h-3 w-3" />
              Live
            </Badge>
          </CardHeader>
          <CardContent className="space-y-1">
            {projectActivity.slice(0, 5).map((activity) => {
              const Icon = activityIcon[activity.type] ?? Circle;
              return (
                <div key={activity.id} className="flex items-start gap-3 rounded-lg px-2.5 py-2.5 transition-colors hover:bg-accent/50">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span>{' '}
                      <span className="text-muted-foreground">{activity.action}</span>
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{activity.project}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{activity.time}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base">GitHub Activity</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent className="space-y-1">
            {projects.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center gap-3 rounded-lg px-2.5 py-2.5 transition-colors hover:bg-accent/50">
                <div className={cn('h-2.5 w-2.5 shrink-0 rounded-full', bgSolid[p.languageColor] ?? 'bg-primary')} />
                <span className="min-w-0 flex-1 truncate font-mono text-xs">{p.name.toLowerCase().replace(/\s/g, '-')}</span>
                <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <GitCommit className="h-3 w-3" />
                    {Math.floor(p.stars * 1.5)}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitPullRequest className="h-3 w-3" />
                    {Math.floor(p.stars / 8)}
                  </span>
                </div>
              </div>
            ))}
            <div className="mt-1 flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2.5">
              <TrendingUp className="h-4 w-4 shrink-0 text-success" />
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-success">+24%</span> commit activity vs last week
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
