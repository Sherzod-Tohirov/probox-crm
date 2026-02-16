import * as React from 'react';
import { cn } from '@/lib/utils';

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-[40px] w-full rounded-[10px] border px-[14px] py-[8px] text-[14px] font-medium outline-none transition-colors',
        'border-[var(--primary-border-color)] bg-[var(--filter-input-bg)]',
        'placeholder:text-[var(--secondary-color)]',
        'focus:ring-2 focus:ring-[var(--primary-button-border-color)] focus:ring-offset-0',
        'disabled:cursor-not-allowed disabled:opacity-60',
        className
      )}
      style={{ color: 'var(--primary-color)' }}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input };
