import { motion } from 'framer-motion';
import classNames from 'classnames';
import useToggle from '@hooks/useToggle';
import useIsMobile from '@hooks/useIsMobile';
import styles from '@assets/styles/modules/layout.module.scss';
import { useEffect } from 'react';
const sidebarVariants = {
  hidden: {
    x: '-100%',
    transition: { type: 'spring', duration: 0.1 },
  },
  visible: {
    x: 0,
    transition: {
      type: 'spring',
      duration: 0.1,
    },
  },
};

export default function SidebarLayout({ children }) {
  const { isOpen, toggle } = useToggle('sidebar');
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile && !isOpen) {
      toggle();
    }
  }, [isMobile]);

  return (
    <>
      {/* Mobile-only backdrop */}
      {isMobile && isOpen && (
        <div className={styles.backdrop} onClick={toggle} />
      )}

      {isMobile ? (
        <motion.aside
          className={classNames(styles['sidebar-layout'], styles['mobile'])}
          initial="hidden"
          animate={isOpen ? 'visible' : 'hidden'}
          variants={sidebarVariants}
        >
          {children}
        </motion.aside>
      ) : (
        <motion.aside
          className={classNames(styles['sidebar-layout'], {
            [styles['open']]: isOpen,
          })}
        >
          {children}
        </motion.aside>
      )}
    </>
  );
}
