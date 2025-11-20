import { FloatingPortal } from '@floating-ui/react';
import { motion } from 'framer-motion';
import { forwardRef, memo } from 'react';
import PropTypes from 'prop-types';
import iconsMap from '@utils/iconsMap';
import styles from './contextMenu.module.scss';

const ContextMenu = forwardRef(function ContextMenu(
  { floatingStyles, onClose, menuItems = [], className },
  ref
) {
  return (
    <FloatingPortal>
      <motion.div
        ref={ref}
        className={`${styles['context-menu-container']} ${className || ''}`}
        style={floatingStyles}
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      >
        <ul className={styles['context-menu-list']}>
          {menuItems.map((item, index) => (
            <li
              key={item.key || item.label || index}
              className={`${styles['context-menu-item']} ${
                item.danger ? styles['danger'] : ''
              } ${item.disabled ? styles['disabled'] : ''}`}
              onClick={() => {
                if (item.disabled) return;
                item.onClick?.();
                if (item.closeOnClick !== false) {
                  onClose?.();
                }
              }}
            >
              {item.icon && (
                <span className={styles['item-icon']}>
                  {iconsMap[item.icon]}
                </span>
              )}
              <span className={styles['item-label']}>{item.label}</span>
              {item.shortcut && (
                <span className={styles['item-shortcut']}>{item.shortcut}</span>
              )}
            </li>
          ))}
        </ul>
      </motion.div>
    </FloatingPortal>
  );
});

ContextMenu.propTypes = {
  floatingStyles: PropTypes.object,
  onClose: PropTypes.func,
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      label: PropTypes.string.isRequired,
      icon: PropTypes.string,
      onClick: PropTypes.func,
      danger: PropTypes.bool,
      disabled: PropTypes.bool,
      shortcut: PropTypes.string,
      closeOnClick: PropTypes.bool,
    })
  ),
  className: PropTypes.string,
};

ContextMenu.defaultProps = {
  menuItems: [],
};

export default memo(ContextMenu);
