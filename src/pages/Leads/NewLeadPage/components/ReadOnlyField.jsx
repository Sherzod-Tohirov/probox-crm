import { cn } from '@/lib/utils';
import { Copy } from 'lucide-react';
import { useCallback } from 'react';

export default function ReadOnlyField({
  label,
  value,
  icon,
  className,
  highlight,
  copyable,
}) {
  const handleCopy = useCallback(() => {
    if (value && copyable) {
      navigator.clipboard.writeText(String(value));
    }
  }, [value, copyable]);

  return (
    <div className={cn('flex flex-col gap-[4px]', className)}>
      <span
        className="text-[12px] font-medium"
        style={{ color: 'var(--secondary-color)' }}
      >
        {label}
      </span>
      <div
        className={cn(
          'flex h-[40px] items-center gap-[8px] rounded-[10px] border px-[12px] text-[14px] font-medium',
          highlight
            ? 'border-amber-400/50 bg-amber-400/10'
            : 'border-[var(--primary-border-color)] bg-[var(--filter-input-bg)]'
        )}
        style={{ color: highlight ? '#f59e0b' : 'var(--primary-color)' }}
      >
        {icon && (
          <span
            className="flex-shrink-0"
            style={{ color: 'var(--secondary-color)' }}
          >
            {icon}
          </span>
        )}
        <span className="flex-1 truncate">{value || '—'}</span>
        {copyable && value && (
          <button
            type="button"
            onClick={handleCopy}
            className="flex-shrink-0 cursor-pointer opacity-40 transition-opacity hover:opacity-80"
          >
            <Copy size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
