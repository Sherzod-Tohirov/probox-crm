import { AnimatePresence, motion } from 'framer-motion';
import styles from './style.module.scss';
import { useState } from 'react';

const Accordion = ({
  title,
  children,
  isEnabled = true,
  defaultOpen = false,
  isOpen: controlledOpen, // new controlled prop
  onToggle, // new controlled handler
}) => {
  const isControlled = controlledOpen !== undefined;

  const internalOpen = useState(defaultOpen);
  const [uncontrolledOpen, setUncontrolledOpen] = internalOpen;

  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  const handleToggle = () => {
    if (!isEnabled) return;
    if (isControlled && onToggle) {
      onToggle(!controlledOpen);
    } else {
      setUncontrolledOpen((prev) => !prev);
    }
  };

  if (!isEnabled) {
    return <>{children}</>;
  }

  return (
    <div
      className={`${styles.accordionItem} ${isEnabled ? '' : styles.disabled}`}
    >
      {title && (
        <div
          className={styles.accordionHeader}
          onClick={handleToggle}
          role="button"
          tabIndex={0}
        >
          <span className={styles.accordionTitle}>{title}</span>
          <span
            className={`${styles.accordionIcon} ${
              isOpen ? styles.open : styles.closed
            }`}
          >
            {isOpen ? '-' : '+'}
          </span>
        </div>
      )}

      <AnimatePresence initial={false}>
        {isOpen && isEnabled && (
          <motion.div
            key="content"
            className={styles.accordionContent}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className={styles.innerContent}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Accordion;
