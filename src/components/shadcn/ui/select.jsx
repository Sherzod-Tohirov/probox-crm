import * as React from 'react';
import { cn } from '@/lib/utils';

const Select = React.forwardRef(
  ({ className, children, value, onChange, placeholder, ...props }, ref) => {
    return (
      <div className="relative inline-block">
        <select
          ref={ref}
          value={value}
          onChange={onChange}
          className={cn(
            'h-[40px] appearance-none rounded-[8px] border px-[14px] py-[8px] text-[16px] font-medium leading-none outline-none transition-colors cursor-pointer',
            'border-[var(--primary-border-color)]',
            'focus:ring-2 focus:ring-[var(--primary-button-border-color)] focus:ring-offset-0',
            className
          )}
          style={{
            backgroundColor: 'var(--primary-bg)',
            color: 'var(--primary-color)',
          }}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children}
        </select>
        {/* Custom dropdown arrow */}
        <svg
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.5 6.5L9 11L13.5 6.5"
            stroke="var(--secondary-color)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }
);
Select.displayName = 'Select';

const SelectOption = ({ children, ...props }) => (
  <option {...props}>{children}</option>
);
SelectOption.displayName = 'SelectOption';

export { Select, SelectOption };
