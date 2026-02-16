import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-[8px] px-[10px] py-[4px] text-[12px] font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-[var(--button-bg)] text-[var(--button-color)]',
        secondary: 'bg-[var(--filter-input-bg)] text-[var(--primary-color)]',
        destructive: 'bg-[var(--danger-color)] text-white',
        outline: 'border border-[var(--primary-border-color)] text-[var(--primary-color)]',
        success: 'bg-emerald-500/15 text-emerald-600',
        warning: 'bg-amber-500/15 text-amber-600',
        info: 'bg-blue-500/15 text-blue-600',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Badge = React.forwardRef(({ className, variant, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
});
Badge.displayName = 'Badge';

export { Badge, badgeVariants };
