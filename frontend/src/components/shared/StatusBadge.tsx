import { cn } from '@/lib/utils';

export interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string; dot: string }> = {
  active: { label: 'Active', className: 'bg-success/10 text-success border-success/20', dot: 'bg-success' },
  paused: { label: 'Paused', className: 'bg-muted text-muted-foreground border-border', dot: 'bg-muted-foreground' },
  completed: { label: 'Completed', className: 'bg-primary/10 text-primary border-primary/20', dot: 'bg-primary' },
  planning: { label: 'Planning', className: 'bg-warning/10 text-warning border-warning/20', dot: 'bg-warning' },
  open: { label: 'Open', className: 'bg-success/10 text-success border-success/20', dot: 'bg-success' },
  merged: { label: 'Merged', className: 'bg-chart-4/10 text-chart-4 border-chart-4/20', dot: 'bg-chart-4' },
  closed: { label: 'Closed', className: 'bg-muted text-muted-foreground border-border', dot: 'bg-muted-foreground' },
  draft: { label: 'Draft', className: 'bg-muted text-muted-foreground border-border', dot: 'bg-muted-foreground' },
  solved: { label: 'Solved', className: 'bg-success/10 text-success border-success/20', dot: 'bg-success' },
  attempted: { label: 'Attempted', className: 'bg-warning/10 text-warning border-warning/20', dot: 'bg-warning' },
  todo: { label: 'To Do', className: 'bg-muted text-muted-foreground border-border', dot: 'bg-muted-foreground' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.todo;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        config.className,
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dot)} />
      {config.label}
    </span>
  );
}
