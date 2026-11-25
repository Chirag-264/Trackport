import { useState } from 'react';
import {
  Star,
  GitFork,
  Eye,
  Lock,
  GitCommit,
  GitPullRequest,
  GitBranch,
  Activity,
  Search,
  CheckCircle2,
  XCircle,
  FileText,
  CircleDot,
  Rocket,
  Star as StarIcon,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { ChartCard } from '@/components/shared/ChartCard';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
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
  repositories,
  recentCommits,
  branches,
  pullRequests,
  githubActivity,
  contributions,
  contributionStats,
  monthlyCommits,
  type PullRequest as PR,
} from '@/data/github';
import { cn } from '@/lib/utils';
import { bgSolid } from '@/lib/colors';

const prStatusConfig: Record<PR['status'], { color: string; icon: typeof GitPullRequest }> = {
  open: { color: 'text-success', icon: GitPullRequest },
  merged: { color: 'text-chart-4', icon: CheckCircle2 },
  closed: { color: 'text-muted-foreground', icon: XCircle },
  draft: { color: 'text-muted-foreground', icon: FileText },
};

const activityIcon: Record<string, typeof GitCommit> = {
  commit: GitCommit,
  pr: GitPullRequest,
  issue: CircleDot,
  star: StarIcon,
  fork: GitFork,
  release: Rocket,
  review: Eye,
};

const heatmapColors = [
  'bg-muted/50',
  'bg-primary/20',
  'bg-primary/40',
  'bg-primary/60',
  'bg-primary',
];

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];

export default function GitHub() {
  const [search, setSearch] = useState('');

  const filteredRepos = repositories.filter(
    (r) => r.name.toLowerCase().includes(search.toLowerCase()) || r.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 lg:p-6">
      <PageHeader
        title="GitHub"
        description="Your repositories, commits, branches, and pull requests."
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Commits" value={contributionStats.total.toLocaleString()} change={`${contributionStats.avgPerDay} avg/day`} trend="up" icon={GitCommit} color="primary" />
        <StatCard label="Repositories" value={String(repositories.length * 8)} change="+3 this month" trend="up" icon={GitBranch} color="info" />
        <StatCard label="Pull Requests" value="184" change="+12 this week" trend="up" icon={GitPullRequest} color="success" />
        <StatCard label="Total Stars" value="1,284" change="+87 this month" trend="up" icon={Star} color="warning" />
      </div>

      {/* Contribution graph */}
      <Card className="card-hover">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-base">Contribution Graph</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              {contributionStats.total.toLocaleString()} contributions in the last year
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-destructive" />
              <span className="font-medium">{contributionStats.streak} day streak</span>
            </div>
            <div className="hidden items-center gap-1.5 text-muted-foreground sm:flex">
              <span>Less</span>
              {heatmapColors.map((c, i) => (
                <div key={i} className={cn('h-3 w-3 rounded-sm', c)} />
              ))}
              <span>More</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto scrollbar-thin">
            <div className="flex flex-col gap-1">
              <div className="ml-8 flex gap-1 text-[10px] text-muted-foreground">
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
                        const cell = contributions[weekIdx * 7 + dayIdx];
                        if (!cell) return <div key={dayIdx} className="h-3 w-3" />;
                        return (
                          <div
                            key={dayIdx}
                            className={cn('h-3 w-3 rounded-sm transition-colors hover:ring-1 hover:ring-primary', heatmapColors[cell.level])}
                            title={`${cell.date}: ${cell.count} contributions`}
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

      {/* Monthly commits chart */}
      <ChartCard title="Monthly Commits" description="Commit activity over the past 8 months">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyCommits} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} dy={8} />
            <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={28} />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '0.5rem', fontSize: '12px' }} cursor={{ fill: 'hsl(var(--accent))' }} />
            <Bar dataKey="commits" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Commits" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Tabs: Repositories / Commits / Branches / PRs / Activity */}
      <Tabs defaultValue="repos" className="space-y-4">
        <TabsList className="h-9">
          <TabsTrigger value="repos" className="text-xs">Repositories</TabsTrigger>
          <TabsTrigger value="commits" className="text-xs">Commits</TabsTrigger>
          <TabsTrigger value="branches" className="text-xs">Branches</TabsTrigger>
          <TabsTrigger value="prs" className="text-xs">Pull Requests</TabsTrigger>
          <TabsTrigger value="activity" className="text-xs">Activity</TabsTrigger>
        </TabsList>

        {/* Repositories */}
        <TabsContent value="repos" className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search repositories..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-9 pl-9" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRepos.map((repo) => (
              <Card key={repo.id} className="card-hover">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {repo.isPrivate ? (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <GitBranch className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="font-mono text-sm font-medium">{repo.fullName}</span>
                    </div>
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{repo.description}</p>
                  <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <div className={cn('h-2.5 w-2.5 rounded-full', bgSolid[repo.languageColor] ?? 'bg-primary')} />
                      {repo.language}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {repo.stars}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="h-3 w-3" />
                      {repo.forks}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                    <span>Updated {repo.updatedAt}</span>
                    <div className="flex items-center gap-2">
                      {repo.openPRs > 0 && <Badge variant="secondary" className="text-[10px]">{repo.openPRs} PRs</Badge>}
                      {repo.openIssues > 0 && <Badge variant="outline" className="text-[10px]">{repo.openIssues} issues</Badge>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Commits */}
        <TabsContent value="commits">
          <Card className="card-hover overflow-hidden">
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {recentCommits.map((commit) => (
                  <div key={commit.id} className="group flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-accent/50">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <GitCommit className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{commit.message}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-mono">{commit.hash}</span>
                        <span>·</span>
                        <span>{commit.author}</span>
                        <span>·</span>
                        <span className="font-mono">{commit.repo}</span>
                        <span>·</span>
                        <Badge variant="outline" className="text-[10px]">{commit.branch}</Badge>
                      </div>
                    </div>
                    <div className="hidden shrink-0 items-center gap-3 text-xs sm:flex">
                      <span className="text-success">+{commit.additions}</span>
                      <span className="text-destructive">-{commit.deletions}</span>
                      <span className="text-muted-foreground">{commit.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branches */}
        <TabsContent value="branches">
          <Card className="card-hover overflow-hidden">
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {branches.map((branch) => (
                  <div key={branch.id} className="group flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-accent/50">
                    <GitBranch className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-medium">{branch.name}</span>
                        {branch.isDefault && <Badge variant="secondary" className="text-[10px]">default</Badge>}
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {branch.repo} · {branch.author} · {branch.updated}
                      </p>
                    </div>
                    <div className="hidden items-center gap-3 text-xs sm:flex">
                      {branch.ahead > 0 && (
                        <span className="flex items-center gap-1 text-success">
                          <ArrowUp className="h-3 w-3" />
                          {branch.ahead}
                        </span>
                      )}
                      {branch.behind > 0 && (
                        <span className="flex items-center gap-1 text-destructive">
                          <ArrowDown className="h-3 w-3" />
                          {branch.behind}
                        </span>
                      )}
                      <span className="font-mono text-muted-foreground">{branch.lastCommit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pull Requests */}
        <TabsContent value="prs">
          <Card className="card-hover overflow-hidden">
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {pullRequests.map((pr) => {
                  const config = prStatusConfig[pr.status];
                  const Icon = config.icon;
                  return (
                    <div key={pr.id} className="group flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-accent/50">
                      <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', config.color)} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-muted-foreground">#{pr.number}</span>
                          <p className="truncate text-sm font-medium">{pr.title}</p>
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span className="font-mono">{pr.repo}</span>
                          <span>·</span>
                          <Badge variant="outline" className="text-[10px]">{pr.branch}</Badge>
                          <span>·</span>
                          <span>{pr.author}</span>
                          <span>·</span>
                          <span>{pr.updated}</span>
                        </div>
                      </div>
                      <div className="hidden shrink-0 items-center gap-3 text-xs sm:flex">
                        <span className="text-success">+{pr.additions}</span>
                        <span className="text-destructive">-{pr.deletions}</span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <GitPullRequest className="h-3 w-3" />
                          {pr.reviews}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <FileText className="h-3 w-3" />
                          {pr.comments}
                        </span>
                      </div>
                      <StatusBadge status={pr.status} className="hidden md:inline-flex" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity */}
        <TabsContent value="activity">
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-base">Recent Activity</CardTitle>
              <Badge variant="secondary" className="gap-1">
                <Activity className="h-3 w-3" />
                Live feed
              </Badge>
            </CardHeader>
            <CardContent className="space-y-1">
              {githubActivity.map((item) => {
                const Icon = activityIcon[item.type] ?? GitCommit;
                return (
                  <div key={item.id} className="flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-accent/50">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm">
                        <span className="text-muted-foreground">{item.action}</span>{' '}
                        <span className="font-medium">{item.target}</span>
                      </p>
                      {item.repo && <p className="truncate font-mono text-xs text-muted-foreground">{item.repo}</p>}
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">{item.time}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ArrowUp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
}

function ArrowDown({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function Flame({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}
