import { cn } from '@/lib/utils';

function ButtonGroup({ children, className }) {
    return (
        <div
            className={cn(
                'inline-flex min-h-[52px] items-center rounded-[16px] p-[6px]',
                className
            )}
            style={{ backgroundColor: 'var(--segmented-bg)' }}
        >
            {children}
        </div>
    );
}

function ButtonGroupItem({ children, active = false, onClick, className }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                'h-[45px] px-4 text-[16px] font-medium transition-all whitespace-nowrap rounded-[12px] border border-transparent',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0',
                className
            )}
            style={{
                backgroundColor: active ? 'var(--segmented-active-bg)' : 'transparent',
                color: active ? 'var(--primary-color)' : 'var(--segmented-text-color)',
                boxShadow: active ? 'var(--segmented-active-shadow)' : 'none',
            }}
        >
            {children}
        </button>
    );
}

export { ButtonGroup, ButtonGroupItem };
