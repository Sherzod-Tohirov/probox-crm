import * as React from 'react';
import { cn } from '@/lib/utils';

const Table = React.forwardRef(({ className, ...props }, ref) => (
    <div className="relative block w-full overflow-auto rounded-[24px] border border-[var(--primary-border-color)] bg-[var(--primary-bg)] p-[12px]">
        <table
            ref={ref}
            className={cn(
                'w-full min-w-full caption-bottom border-separate border-spacing-x-0 border-spacing-y-[8px] text-[17px]',
                className
            )}
            {...props}
        />
    </div>
));
Table.displayName = 'Table';

const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
    <thead
        ref={ref}
        className={cn('sticky top-0 z-10', className)}
        {...props}
    />
));
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef(({ className, ...props }, ref) => (
    <tbody
        ref={ref}
        className={cn(
            '[&_tr:nth-child(even)]:bg-[var(--primary-table-hover-bg)]',
            className
        )}
        {...props}
    />
));
TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef(({ className, ...props }, ref) => (
    <tfoot
        ref={ref}
        className={cn(
            'font-semibold [&>tr]:last:border-b-0 [&>tr>td]:border-t [&>tr>td]:border-[var(--chart-grid-color)]',
            className
        )}
        {...props}
    />
));
TableFooter.displayName = 'TableFooter';

const TableRow = React.forwardRef(({ className, ...props }, ref) => (
    <tr
        ref={ref}
        className={cn(
            'transition-colors [&>td:first-child]:rounded-l-[14px] [&>td:last-child]:rounded-r-[14px] [&>th:first-child]:rounded-l-[14px] [&>th:last-child]:rounded-r-[14px] [&>td]:border-b [&>td]:border-[var(--chart-grid-color)] [&>th]:border-b [&>th]:border-[var(--chart-grid-color)] [&>td+td]:border-l [&>td+td]:border-[var(--chart-grid-color)] [&>th+th]:border-l [&>th+th]:border-[var(--chart-grid-color)]',
            className
        )}
        {...props}
    />
));
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef(({ className, ...props }, ref) => (
    <th
        ref={ref}
        className={cn(
            'h-[46px] border-b border-[var(--chart-grid-color)] px-[20px] pb-[4px] text-center align-middle text-[16px] font-semibold tracking-normal whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
            className
        )}
        style={{ color: 'var(--primary-color)' }}
        {...props}
    />
));
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef(({ className, ...props }, ref) => (
    <td
        ref={ref}
        className={cn(
            'h-[48px] border-b border-[var(--chart-grid-color)] px-[20px] py-[4px] align-middle text-[15px] text-center font-medium [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
            className
        )}
        style={{ color: 'var(--primary-color)' }}
        {...props}
    />
));
TableCell.displayName = 'TableCell';

const TableCaption = React.forwardRef(({ className, ...props }, ref) => (
    <caption
        ref={ref}
        className={cn('mt-4 text-[14px]', className)}
        style={{ color: 'var(--secondary-color)' }}
        {...props}
    />
));
TableCaption.displayName = 'TableCaption';

export {
    Table,
    TableHeader,
    TableBody,
    TableFooter,
    TableHead,
    TableRow,
    TableCell,
    TableCaption,
};
