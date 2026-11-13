import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface StatCardProps {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: LucideIcon;
  color?: 'primary' | 'success' | 'warning' | 'info' | 'destructive';
}

const colorMap: Record<string, { bg: string; text: string; ring: string }> = {
  primary: { bg: 'bg-primary/10', text: 'text-primary', ring: 'ring-primary/20' },
  success: { bg: 'bg-success/10', text: 'text-success', ring: 'ring-success/20' },
  warning: { bg: 'bg-warning/10', text: 'text-warning', ring: 'ring-warning/20' },
  info: { bg: 'bg-info/10', text: 'text-info', ring: 'ring-info/20' },
  destructive: { bg: 'bg-destructive/10', text: 'text-destructive', ring: 'ring-destructive/20' },
};

export function StatCard({ label, value, change, trend, icon: Icon, color = 'primary' }: StatCardProps) {
  const c = colorMap[color];
  return (
    <Card className="card-hover overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <p className="text-2xl font-semibold tracking-tight">{value}</p>
          </div>
          <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl ring-1', c.bg, c.text, c.ring)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5">
          <span
            className={cn(
              'inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium',
              trend === 'up' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
            )}
          >
            {trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {change.split(' ')[0]}
          </span>
          <span className="text-xs text-muted-foreground">{change.split(' ').slice(1).join(' ')}</span>
        </div>
      </CardContent>
    </Card>
  );
}
