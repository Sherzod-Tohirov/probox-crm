import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => onOpenChange?.(false)}
      />
      <div className="relative z-50">{children}</div>
    </div>
  );
};

const DialogContent = React.forwardRef(({ className, children, onClose, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative flex flex-col gap-[20px] rounded-[20px] border p-[24px] shadow-lg',
      'bg-[var(--primary-bg)] border-[var(--primary-border-color)]',
      'w-[90vw] max-w-[600px] max-h-[85vh] overflow-y-auto',
      className
    )}
    {...props}
  >
    {children}
    {onClose && (
      <button
        onClick={onClose}
        className="absolute right-[16px] top-[16px] rounded-[8px] p-[6px] opacity-70 transition-opacity hover:opacity-100"
        style={{ color: 'var(--secondary-color)' }}
      >
        <X size={18} />
      </button>
    )}
  </div>
));
DialogContent.displayName = 'DialogContent';

const DialogHeader = ({ className, ...props }) => (
  <div className={cn('flex flex-col gap-[8px]', className)} {...props} />
);
DialogHeader.displayName = 'DialogHeader';

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn('text-[18px] font-semibold', className)}
    style={{ color: 'var(--primary-color)' }}
    {...props}
  />
));
DialogTitle.displayName = 'DialogTitle';

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-[14px]', className)}
    style={{ color: 'var(--secondary-color)' }}
    {...props}
  />
));
DialogDescription.displayName = 'DialogDescription';

const DialogFooter = ({ className, ...props }) => (
  <div
    className={cn(
      'flex flex-col-reverse gap-[8px] sm:flex-row sm:justify-end',
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter };
