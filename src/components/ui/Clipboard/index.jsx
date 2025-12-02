import { forwardRef, memo, useMemo } from 'react';
import classNames from 'classnames';
import { Copy, Check } from 'lucide-react';
import useClipboard from './useClipboard';
import styles from './clipboard.module.scss';

function Clipboard(
  {
    text,
    children,
    className,
    size = 16,
    placement = 'right',
    onCopy,
    label = 'Nusxalash',
    copiedLabel = 'Nusxalandi',
    as = 'button',
    variant = 'icon', // 'icon' | 'button'
    ...rest
  },
  ref
) {
  const { copied, copy } = useClipboard();

  const handleClick = async (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    const ok = await copy(text);
    onCopy?.(ok);
  };

  const content = useMemo(() => {
    const Icon = copied ? Check : Copy;
    if (variant === 'button') {
      return (
        <span className={styles.buttonContent}>
          <Icon size={size} strokeWidth={1.75} />
          <span className={styles.label}>{copied ? copiedLabel : label}</span>
        </span>
      );
    }
    return (
      <span className={styles.iconOnly}>
        <Icon size={size} strokeWidth={1.75} />
      </span>
    );
  }, [copied, size, label, copiedLabel, variant]);

  const Comp = as;

  return (
    <Comp
      ref={ref}
      className={classNames(styles.clipboard, styles[placement], className, {
        [styles.copied]: copied,
      })}
      onClick={handleClick}
      aria-label={copied ? copiedLabel : label}
      title={copied ? copiedLabel : label}
      {...rest}
    >
      {children || content}
    </Comp>
  );
}

export default memo(forwardRef(Clipboard));
