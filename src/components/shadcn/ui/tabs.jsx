import * as React from 'react';
import { cn } from '@/lib/utils';

const TabsContext = React.createContext({ value: '', onChange: () => {} });

const Tabs = ({ value, onChange, children, className, ...props }) => {
  return (
    <TabsContext.Provider value={{ value, onChange }}>
      <div className={cn('flex flex-col', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};
Tabs.displayName = 'Tabs';

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'inline-flex items-center gap-[4px] rounded-[12px] p-[4px]',
      'bg-[var(--filter-input-bg)]',
      className
    )}
    {...props}
  />
));
TabsList.displayName = 'TabsList';

const TabsTrigger = React.forwardRef(
  ({ className, value, children, ...props }, ref) => {
    const ctx = React.useContext(TabsContext);
    const isActive = ctx.value === value;
    return (
      <button
        ref={ref}
        type="button"
        onClick={() => ctx.onChange?.(value)}
        className={cn(
          'inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-[10px] px-[14px] py-[7px] text-[13px] font-semibold transition-all',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
          isActive
            ? 'bg-[var(--primary-bg)] text-[var(--primary-color)] shadow-sm'
            : 'text-[var(--secondary-color)] hover:text-[var(--primary-color)]',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
TabsTrigger.displayName = 'TabsTrigger';

const TabsContent = React.forwardRef(
  ({ className, value, children, ...props }, ref) => {
    const ctx = React.useContext(TabsContext);
    if (ctx.value !== value) return null;
    return (
      <div ref={ref} className={cn('mt-[12px]', className)} {...props}>
        {children}
      </div>
    );
  }
);
TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent };
