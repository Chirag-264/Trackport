// Static class maps so Tailwind's JIT can detect every class at build time.
// Dynamic `bg-${color}` strings are purged by Tailwind — these maps avoid that.

export const bgSoft: Record<string, string> = {
  primary: 'bg-primary/10',
  success: 'bg-success/10',
  warning: 'bg-warning/10',
  info: 'bg-info/10',
  destructive: 'bg-destructive/10',
  'chart-4': 'bg-chart-4/10',
  muted: 'bg-muted',
};

export const textSoft: Record<string, string> = {
  primary: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
  info: 'text-info',
  destructive: 'text-destructive',
  'chart-4': 'text-chart-4',
  muted: 'text-muted-foreground',
};

export const bgSolid: Record<string, string> = {
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  info: 'bg-info',
  destructive: 'bg-destructive',
  'chart-4': 'bg-chart-4',
  muted: 'bg-muted-foreground',
};

export function softClasses(color: string): string {
  return `${bgSoft[color] ?? 'bg-primary/10'} ${textSoft[color] ?? 'text-primary'}`;
}
