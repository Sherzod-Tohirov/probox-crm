import classNames from 'classnames';
import PropTypes from 'prop-types';
import { forwardRef, memo } from 'react';
import styles from './badge.module.scss';

function Badge({
  children,
  className,
  color = 'info',
  variant = 'soft',
  size = 'md',
  ...props
}, ref) {
  return (
    <span
      ref={ref}
      className={classNames(
        styles.badge,
        styles[color],
        styles[variant],
        styles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

const ForwardedBadge = memo(forwardRef(Badge));

ForwardedBadge.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  color: PropTypes.oneOf(['info', 'success', 'warning', 'danger']),
  variant: PropTypes.oneOf(['soft', 'solid', 'outlined']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
};

ForwardedBadge.defaultProps = {
  color: 'info',
  variant: 'soft',
  size: 'md',
};

export default ForwardedBadge;
