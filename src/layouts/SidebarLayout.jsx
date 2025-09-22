import { motion } from 'framer-motion';
import classNames from 'classnames';
import useToggle from '@hooks/useToggle';
import useIsMobile from '@hooks/useIsMobile';
import styles from '@assets/styles/modules/layout.module.scss';
import { useLayoutEffect, useState } from 'react';
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
  const [hasMounted, setHasMounted] = useState(false);
  const isMobile = useIsMobile();
  console.log(isOpen, 'isOpen', isMobile, 'isMobile');
  useLayoutEffect(() => {
    if (!isMobile && !isOpen) {
      toggle();
    }
    setHasMounted(true);
  }, [isMobile]);

  if (!hasMounted) return null;

  return (
    <>
      {/* Mobile-only backdrop */}
      {isMobile && isOpen && (
        <div className={styles.backdrop} onClick={toggle} />
      )}

      {isMobile ? (
        <motion.aside
          className={classNames(styles['sidebar-layout'], styles['mobile'], {
            [styles['open']]: isOpen,
          })}
          initial="hidden"
          animate={isOpen ? 'visible' : 'hidden'}
          variants={sidebarVariants}
        >
          {children}
        </motion.aside>
      ) : (
        <aside
          className={classNames(styles['sidebar-layout'], {
            [styles['open']]: isOpen,
          })}
        >
          {children}
        </aside>
      )}
    </>
  );
}
