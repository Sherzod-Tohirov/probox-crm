import { useState, memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './tabs.module.scss';

function Tabs({
  tabs = [],
  value,
  onChange,
  variant = 'underline',
  className,
  contentClassName,
}) {
  const [internal, setInternal] = useState(tabs?.[0]?.key || 'tab-0');
  const active = value !== undefined ? value : internal;

  const handleChange = (key) => {
    if (onChange) onChange(key);
    else setInternal(key);
  };

  return (
    <div className={classNames(styles['tabs'], className)}>
      <div className={classNames(styles['tab-list'], styles[variant])}>
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            className={classNames(styles['tab'], {
              [styles['active']]: active === t.key,
            })}
            onClick={() => handleChange(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className={classNames(styles['tab-panel'], contentClassName)}>
        {tabs.find((t) => t.key === active)?.content || null}
      </div>
    </div>
  );
}

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.node.isRequired,
      content: PropTypes.node,
    })
  ).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
  variant: PropTypes.oneOf(['underline', 'pill']),
  className: PropTypes.string,
  contentClassName: PropTypes.string,
};

export default memo(Tabs);
