import * as React from 'react';
import { cn } from '../../lib/utils';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';

const badgeVariants: Record<BadgeVariant, string> = {
  default: 'bg-blue-600/20 text-blue-200 border border-blue-500/40',
  secondary: 'bg-zinc-800 text-zinc-200 border border-zinc-700',
  destructive: 'bg-red-600/20 text-red-200 border border-red-500/40',
  outline: 'bg-transparent text-zinc-200 border border-zinc-700',
  success: 'bg-emerald-600/20 text-emerald-200 border border-emerald-500/40',
  warning: 'bg-amber-600/20 text-amber-200 border border-amber-500/40',
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
