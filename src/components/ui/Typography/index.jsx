import classNames from 'classnames';
import { memo, forwardRef } from 'react';
import styles from './typography.module.scss';

const Typography = forwardRef(({
  element: Element = 'p',
  className,
  children,
  variant,
  ...props
}, ref) => {
  return (
    <Element
      ref={ref}
      className={classNames(
        styles['base-typography'],
        styles[variant],
        className
      )}
      {...props}
    >
      {children}
    </Element>
  );
});

export default memo(Typography);
