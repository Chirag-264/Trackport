import { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  Calendar,
  List,
  Columns3,
  MessageSquare,
  CheckSquare,
  X,
  Flag,
  Clock,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { tasks, columns, priorityConfig, type Task, type Column as ColumnType, type Priority } from '@/data/tasks';
import { cn } from '@/lib/utils';
import { bgSolid } from '@/lib/colors';

type ViewMode = 'kanban' | 'list' | 'calendar';

export default function Tasks() {
  const [view, setView] = useState<ViewMode>('kanban');
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
      return true;
    });
  }, [search, priorityFilter]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 lg:p-6">
      <PageHeader
        title="Tasks"
        description="Organize work across boards, lists, and calendars."
        actions={
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        }
      />

      {/* Filters bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as Priority | 'all')}>
            <SelectTrigger className="h-9 w-[140px]">
              <Filter className="mr-1.5 h-3.5 w-3.5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center rounded-lg border border-border">
            <Button variant={view === 'kanban' ? 'secondary' : 'ghost'} size="icon" className="h-9 w-9 rounded-r-none" onClick={() => setView('kanban')}>
              <Columns3 className="h-4 w-4" />
            </Button>
            <Button variant={view === 'list' ? 'secondary' : 'ghost'} size="icon" className="h-9 w-9 rounded-none" onClick={() => setView('list')}>
              <List className="h-4 w-4" />
            </Button>
            <Button variant={view === 'calendar' ? 'secondary' : 'ghost'} size="icon" className="h-9 w-9 rounded-l-none" onClick={() => setView('calendar')}>
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {view === 'kanban' && <KanbanView tasks={filtered} onSelect={setSelectedTask} />}
      {view === 'list' && <ListView tasks={filtered} onSelect={setSelectedTask} />}
      {view === 'calendar' && <CalendarView tasks={filtered} onSelect={setSelectedTask} />}

      <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
    </div>
  );
}

function KanbanView({ tasks, onSelect }: { tasks: Task[]; onSelect: (t: Task) => void }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.id);
        return (
          <div key={col.id} className="flex w-72 shrink-0 flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <div className={cn('h-2 w-2 rounded-full', bgSolid[col.color] ?? 'bg-primary')} />
                <span className="text-sm font-semibold">{col.title}</span>
                <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                  {colTasks.length}
                </span>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              {colTasks.map((task) => (
                <TaskCard key={task.id} task={task} onClick={() => onSelect(task)} />
              ))}
              {colTasks.length === 0 && (
                <div className="rounded-lg border border-dashed border-border py-6 text-center text-xs text-muted-foreground">
                  No tasks
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TaskCard({ task, onClick }: { task: Task; onClick: () => void }) {
  const pc = priorityConfig[task.priority];
  return (
    <button
      onClick={onClick}
      className="group w-full rounded-xl border border-border bg-card p-3.5 text-left transition-all hover:border-primary/30 hover:shadow-md hover:shadow-primary/5"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-mono text-[10px] font-medium text-muted-foreground">#{task.id}</span>
        <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-medium', pc.bg, pc.color)}>
          {pc.label}
        </span>
      </div>
      <p className="mt-1.5 text-sm font-medium leading-snug">{task.title}</p>
      <div className="mt-2 flex flex-wrap gap-1">
        {task.labels.slice(0, 3).map((label) => (
          <span key={label} className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            {label}
          </span>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
          {task.subtasks.total > 0 && (
            <span className="flex items-center gap-1">
              <CheckSquare className="h-3 w-3" />
              {task.subtasks.done}/{task.subtasks.total}
            </span>
          )}
          {task.comments > 0 && (
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {task.comments}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <div className={cn('h-2 w-2 rounded-full', bgSolid[task.projectColor] ?? 'bg-primary')} />
          <span className="max-w-[100px] truncate text-[10px] text-muted-foreground">{task.project}</span>
        </div>
      </div>
    </button>
  );
}

function ListView({ tasks, onSelect }: { tasks: Task[]; onSelect: (t: Task) => void }) {
  return (
    <Card className="card-hover overflow-hidden">
      <div className="divide-y divide-border">
        {tasks.map((task) => {
          const pc = priorityConfig[task.priority];
          return (
            <button
              key={task.id}
              onClick={() => onSelect(task)}
              className="group flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/50"
            >
              <div className={cn('h-2 w-2 shrink-0 rounded-full', task.priority === 'urgent' ? 'bg-destructive' : task.priority === 'high' ? 'bg-warning' : task.priority === 'medium' ? 'bg-info' : 'bg-muted-foreground')} />
              <span className="w-12 shrink-0 font-mono text-xs text-muted-foreground">#{task.id}</span>
              <p className="min-w-0 flex-1 truncate text-sm font-medium">{task.title}</p>
              <span className={cn('hidden rounded-md px-1.5 py-0.5 text-[10px] font-medium sm:inline', pc.bg, pc.color)}>
                {pc.label}
              </span>
              <span className="hidden w-32 shrink-0 truncate text-xs text-muted-foreground md:inline">{task.project}</span>
              <span className="hidden shrink-0 text-xs text-muted-foreground lg:inline">{task.dueDate}</span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function CalendarView({ tasks, onSelect }: { tasks: Task[]; onSelect: (t: Task) => void }) {
  const [date, setDate] = useState<Date | undefined>(new Date('2026-08-02'));

  const tasksByDate = useMemo(() => {
    const map: Record<string, Task[]> = {};
    tasks.forEach((t) => {
      const key = t.dueDate;
      if (!map[key]) map[key] = [];
      map[key].push(t);
    });
    return map;
  }, [tasks]);

  const selectedKey = date ? date.toISOString().slice(0, 10) : '';
  const dayTasks = tasksByDate[selectedKey] ?? [];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[auto_1fr]">
      <Card className="card-hover h-fit">
        <CardContent className="p-4">
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={setDate}
            className="p-0"
            modifiers={{
              hasTask: (d) => {
                const key = d.toISOString().slice(0, 10);
                return !!tasksByDate[key];
              },
            }}
            modifiersClassNames={{
              hasTask: 'relative after:absolute after:bottom-1 after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-primary',
            }}
          />
        </CardContent>
      </Card>

      <Card className="card-hover">
        <CardContent className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">
                {date ? date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : 'Select a date'}
              </h3>
              <p className="text-xs text-muted-foreground">{dayTasks.length} task{dayTasks.length !== 1 ? 's' : ''} due</p>
            </div>
          </div>
          {dayTasks.length > 0 ? (
            <div className="space-y-2">
              {dayTasks.map((task) => {
                const pc = priorityConfig[task.priority];
                return (
                  <button
                    key={task.id}
                    onClick={() => onSelect(task)}
                    className="group flex w-full items-center gap-3 rounded-lg border border-border p-3 text-left transition-all hover:border-primary/30 hover:bg-accent/50"
                  >
                    <div className={cn('h-2 w-2 shrink-0 rounded-full', task.priority === 'urgent' ? 'bg-destructive' : task.priority === 'high' ? 'bg-warning' : task.priority === 'medium' ? 'bg-info' : 'bg-muted-foreground')} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{task.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{task.project}</p>
                    </div>
                    <span className={cn('rounded-md px-1.5 py-0.5 text-[10px] font-medium', pc.bg, pc.color)}>
                      {pc.label}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium">No tasks due</p>
              <p className="text-xs text-muted-foreground">Nothing scheduled for this day.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function TaskModal({ task, onClose }: { task: Task | null; onClose: () => void }) {
  if (!task) return null;
  const pc = priorityConfig[task.priority];

  return (
    <Dialog open={!!task} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">#{task.id}</span>
            <span className={cn('rounded-md px-1.5 py-0.5 text-[10px] font-medium', pc.bg, pc.color)}>
              {pc.label}
            </span>
          </div>
          <DialogTitle className="text-lg">{task.title}</DialogTitle>
          <DialogDescription>{task.description}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-2">
          <div className="space-y-3">
            <div>
              <p className="mb-1 text-xs font-medium text-muted-foreground">Project</p>
              <div className="flex items-center gap-2">
                <div className={cn('h-2 w-2 rounded-full', bgSolid[task.projectColor] ?? 'bg-primary')} />
                <span className="text-sm">{task.project}</span>
              </div>
            </div>
            <div>
              <p className="mb-1 text-xs font-medium text-muted-foreground">Priority</p>
              <div className="flex items-center gap-1.5">
                <Flag className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm">{pc.label}</span>
              </div>
            </div>
            <div>
              <p className="mb-1 text-xs font-medium text-muted-foreground">Due Date</p>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm">{new Date(task.dueDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <p className="mb-1 text-xs font-medium text-muted-foreground">Labels</p>
              <div className="flex flex-wrap gap-1">
                {task.labels.map((label) => (
                  <Badge key={label} variant="secondary" className="text-[10px]">{label}</Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1 text-xs font-medium text-muted-foreground">Subtasks</p>
              <p className="text-sm">{task.subtasks.done} of {task.subtasks.total} completed</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-border pt-4">
          <Button size="sm" className="gap-1.5">
            <CheckSquare className="h-3.5 w-3.5" />
            Mark Complete
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <MessageSquare className="h-3.5 w-3.5" />
            Comment ({task.comments})
          </Button>
          <Button variant="ghost" size="icon" className="ml-auto" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
