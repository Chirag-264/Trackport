import { cn } from '@/lib/utils';

export interface AvatarGroupProps {
  initials: string[];
  max?: number;
  size?: 'sm' | 'md';
  className?: string;
}

const sizeMap = {
  sm: 'h-6 w-6 text-[10px]',
  md: 'h-8 w-8 text-xs',
};

const gradients = [
  'from-primary to-info',
  'from-success to-primary',
  'from-warning to-destructive',
  'from-info to-chart-4',
  'from-chart-4 to-primary',
];

export function AvatarGroup({ initials, max = 3, size = 'sm', className }: AvatarGroupProps) {
  const visible = initials.slice(0, max);
  const overflow = initials.length - max;

  return (
    <div className={cn('flex -space-x-2', className)}>
      {visible.map((init, i) => (
        <div
          key={i}
          className={cn(
            'flex items-center justify-center rounded-full bg-gradient-to-br font-semibold text-primary-foreground ring-2 ring-card',
            sizeMap[size],
            gradients[i % gradients.length]
          )}
        >
          {init}
        </div>
      ))}
      {overflow > 0 && (
        <div
          className={cn(
            'flex items-center justify-center rounded-full bg-muted font-semibold text-muted-foreground ring-2 ring-card',
            sizeMap[size]
          )}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}
