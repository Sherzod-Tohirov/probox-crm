import { AnimatePresence, motion } from 'framer-motion';
import styles from './style.module.scss';
import { useState } from 'react';
import Typography from '../Typography';

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

  const variants = {
    open: {
      height: 'auto',
      opacity: 1,
      transition: { type: 'spring', stiffness: 260, damping: 24 },
    },
    collapsed: {
      height: 0,
      opacity: 0,
      transition: { duration: 0.2, ease: 'easeInOut' },
    },
  };

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
      className={`${styles.accordionItem} ${!title ? styles.noTitle : ''} ${isEnabled ? '' : styles.disabled}`}
    >
      {title && (
        <Typography
          variant="body1"
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
        </Typography>
      )}

      <AnimatePresence initial={false}>
        {isEnabled && (
          <motion.div
            key="content"
            className={styles.accordionContent}
            initial="collapsed"
            animate={isOpen ? 'open' : 'collapsed'}
            exit="collapsed"
            variants={variants}
          >
            <div
              className={styles.innerContent}
              aria-hidden={!isOpen}
              style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Accordion;
