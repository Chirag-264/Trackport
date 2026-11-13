import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  CheckCircle2,
  GitCommit,
  Code2,
  Download,
  Calendar,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { ChartCard } from '@/components/shared/ChartCard';
import { StatCard } from '@/components/shared/StatCard';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  weeklyTaskCompletion,
  monthlyCodingActivity,
  projectPerformance,
  codingActivityByDay,
  taskCompletionRate,
  languageDistribution,
  productivityScore,
} from '@/data/analytics';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

type Range = 'weekly' | 'monthly';

export default function Analytics() {
  const [range, setRange] = useState<Range>('weekly');

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 lg:p-6">
      <PageHeader
        title="Analytics"
        description="Deep insights into your coding activity and productivity."
        actions={
          <div className="flex items-center gap-2">
            <Select value={range} onValueChange={(v) => setRange(v as Range)}>
              <SelectTrigger className="h-9 w-[120px]">
                <Calendar className="mr-1.5 h-3.5 w-3.5" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        }
      />

      {/* Top stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Productivity Score" value={String(productivityScore.current)} change={`+${productivityScore.current - productivityScore.previous} pts`} trend="up" icon={Activity} color="primary" />
        <StatCard label="Tasks Completed" value="248" change="+18% vs last week" trend="up" icon={CheckCircle2} color="success" />
        <StatCard label="Total Commits" value="3,891" change="-4% vs last week" trend="down" icon={GitCommit} color="warning" />
        <StatCard label="DSA Solved" value="1,432" change="+47 this month" trend="up" icon={Code2} color="info" />
      </div>

      {/* Main charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard
          title="Coding Activity"
          description={range === 'weekly' ? 'Tasks completed vs created (this week)' : 'Commits, PRs, and tasks per month'}
          action={<Badge variant="secondary" className="gap-1"><TrendingUp className="h-3 w-3" />Trending up</Badge>}
        >
          <ResponsiveContainer width="100%" height={260}>
            {range === 'weekly' ? (
              <AreaChart data={weeklyTaskCompletion} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="cCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="cCreated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '0.5rem', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Area type="monotone" dataKey="created" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#cCreated)" name="Created" />
                <Area type="monotone" dataKey="completed" stroke="hsl(var(--success))" strokeWidth={2} fill="url(#cCompleted)" name="Completed" />
              </AreaChart>
            ) : (
              <BarChart data={monthlyCodingActivity} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '0.5rem', fontSize: '12px' }} cursor={{ fill: 'hsl(var(--accent))' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="commits" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Commits" />
                <Bar dataKey="prs" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} name="PRs" />
                <Bar dataKey="tasks" fill="hsl(var(--info))" radius={[4, 4, 0, 0]} name="Tasks" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Task Completion Rate" description="Weekly completion percentage trend">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={taskCompletionRate} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '0.5rem', fontSize: '12px' }} />
              <Line type="monotone" dataKey="rate" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ fill: 'hsl(var(--primary))', r: 4 }} activeDot={{ r: 6 }} name="Completion %" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Project performance + Language distribution */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ChartCard title="Project Performance" description="Velocity, quality, and on-time delivery" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={projectPerformance}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <Radar name="Velocity" dataKey="velocity" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
              <Radar name="Quality" dataKey="quality" stroke="hsl(var(--success))" fill="hsl(var(--success))" fillOpacity={0.2} />
              <Radar name="On-Time" dataKey="onTime" stroke="hsl(var(--info))" fill="hsl(var(--info))" fillOpacity={0.2} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '0.5rem', fontSize: '12px' }} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Languages" description="Distribution by language">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={languageDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3}>
                {languageDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '0.5rem', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-1.5">
            {languageDistribution.map((lang) => (
              <div key={lang.name} className="flex items-center gap-2 text-xs">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: lang.color }} />
                <span className="flex-1">{lang.name}</span>
                <span className="font-medium tabular-nums text-muted-foreground">{lang.value}%</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Coding activity by hour + Productivity breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Coding Activity by Hour" description="When you're most productive during the day">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={codingActivityByDay} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="hour" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '0.5rem', fontSize: '12px' }} cursor={{ fill: 'hsl(var(--accent))' }} />
              <Bar dataKey="activity" fill="hsl(var(--info))" radius={[4, 4, 0, 0]} name="Activity" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card className="card-hover">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Productivity Breakdown</CardTitle>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-semibold">{productivityScore.current}</span>
                <span className="text-xs text-muted-foreground">/ 100</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {productivityScore.breakdown.map((item) => (
              <div key={item.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium tabular-nums">{item.score}</span>
                </div>
                <ProgressBar
                  value={item.score}
                  max={item.max}
                  color={item.score >= 90 ? 'success' : item.score >= 75 ? 'primary' : item.score >= 60 ? 'warning' : 'destructive'}
                  size="md"
                />
              </div>
            ))}
            <div className="flex items-center gap-2 rounded-lg bg-success/10 p-3">
              <TrendingUp className="h-4 w-4 text-success" />
              <p className="text-xs text-muted-foreground">
                Your productivity is up <span className="font-semibold text-success">+8 points</span> from last period.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
