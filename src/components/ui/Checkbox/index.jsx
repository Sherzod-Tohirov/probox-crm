import { forwardRef, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './checkbox.module.scss';

const Checkbox = forwardRef(function Checkbox(
  {
    className,
    label,
    checked,
    defaultChecked,
    disabled,
    indeterminate = false,
    size = 'md',
    color = 'info',
    onChange,
    name,
    value,
    ...props
  },
  ref
) {
  const internalRef = useRef(null);

  useEffect(() => {
    if (internalRef.current) {
      internalRef.current.indeterminate = Boolean(indeterminate) && !checked;
    }
  }, [indeterminate, checked]);

  const supportedColors = new Set([
    'info',
    'danger',
    'success',
    'primary',
    'secondary',
    'dark',
  ]);
  const resolvedColor = supportedColors.has(color) ? color : 'info';

  return (
    <label
      className={classNames(
        styles['checkbox'],
        styles[`size-${size}`],
        styles[`color-${resolvedColor}`],
        disabled && styles['disabled'],
        className
      )}
    >
      <input
        ref={(node) => {
          internalRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref && typeof ref === 'object') ref.current = node;
        }}
        type="checkbox"
        className={styles['checkbox-input']}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={onChange}
        name={name}
        value={value}
        {...props}
      />
      <span
        className={styles['checkbox-box']}
        data-indeterminate={indeterminate ? 'true' : undefined}
        aria-hidden="true"
      />
      {label ? <span className={styles['checkbox-text']}>{label}</span> : null}
    </label>
  );
});

Checkbox.propTypes = {
  className: PropTypes.string,
  label: PropTypes.node,
  checked: PropTypes.bool,
  defaultChecked: PropTypes.bool,
  disabled: PropTypes.bool,
  indeterminate: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  color: PropTypes.oneOf([
    'info',
    'danger',
    'success',
    'primary',
    'secondary',
    'dark',
  ]),
  onChange: PropTypes.func,
  name: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Checkbox;
