import classNames from 'classnames';
import PropTypes from 'prop-types';
import { forwardRef, memo } from 'react';
import styles from './badge.module.scss';

function Badge(
  {
    children,
    className,
    color = 'info',
    variant = 'soft',
    size = 'md',
    filled = false,
    ...props
  },
  ref
) {
  // If filled prop is used, override variant
  const effectiveVariant = filled ? 'filled' : variant;
  
  return (
    <span
      ref={ref}
      className={classNames(
        styles.badge,
        styles[
          typeof color === 'boolean' ? (color ? 'success' : 'danger') : color
        ],
        styles[effectiveVariant],
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
  color: PropTypes.oneOf([
    'info',
    'success',
    'warning',
    'danger',
    'extrasuccess',
    'black',
  ]),
  variant: PropTypes.oneOf(['soft', 'solid', 'outlined', 'filled']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  filled: PropTypes.bool,
};

ForwardedBadge.defaultProps = {
  color: 'info',
  variant: 'outlined',
  size: 'md',
  filled: false,
};

export default ForwardedBadge;
