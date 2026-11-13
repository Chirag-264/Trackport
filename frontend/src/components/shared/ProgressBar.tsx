import { cn } from '@/lib/utils';

export interface ProgressBarProps {
  value: number;
  max?: number;
  color?: 'primary' | 'success' | 'warning' | 'info' | 'destructive' | 'chart-4';
  size?: 'sm' | 'md';
  showLabel?: boolean;
  className?: string;
}

const colorMap: Record<string, string> = {
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  info: 'bg-info',
  destructive: 'bg-destructive',
  'chart-4': 'bg-chart-4',
};

export function ProgressBar({
  value,
  max = 100,
  color = 'primary',
  size = 'sm',
  showLabel = false,
  className,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'h-1.5 w-full overflow-hidden rounded-full bg-muted',
          size === 'md' && 'h-2'
        )}
      >
        <div
          className={cn('h-full rounded-full transition-all duration-500', colorMap[color])}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="w-9 shrink-0 text-right text-xs font-medium tabular-nums text-muted-foreground">
          {Math.round(pct)}%
        </span>
      )}
    </div>
  );
}
