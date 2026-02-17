import { cn } from '@/lib/utils';
import { Clipboard } from '@components/ui';
export default function ReadOnlyField({
  label,
  value,
  icon,
  className,
  highlight,
  copyable,
}) {
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
            ? ''
            : 'border-[var(--primary-border-color)] bg-[var(--primary-input-bg)]'
        )}
        style={
          highlight
            ? {
                borderColor: 'var(--success-color)',
                backgroundColor: 'var(--success-bg)',
                color: 'var(--success-color)',
              }
            : { color: 'var(--primary-color)' }
        }
      >
        {icon && (
          <span
            className="shrink-0"
            style={{ color: 'var(--secondary-color)' }}
          >
            {icon}
          </span>
        )}
        <span className="flex-1 truncate">{value || '—'}</span>
        {copyable && value && <Clipboard text={value} />}
      </div>
    </div>
  );
}
