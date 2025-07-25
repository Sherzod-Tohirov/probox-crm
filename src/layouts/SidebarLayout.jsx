import styles from '@assets/styles/modules/layout.module.scss';
import useToggle from '../hooks/useToggle';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { BREAKPOINTS } from '@config/breakpoints';
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
  const [isMobile, setIsMobile] = useState(false);
  console.log(isMobile, 'isMobile');
  // Watch for window resize to detect mobile
  useEffect(() => {
    const breakpoint = Number(BREAKPOINTS.md.replace('px', ''));
    console.log(window.innerWidth, breakpoint);
    const checkMobile = () => setIsMobile(window.innerWidth <= breakpoint);
    checkMobile();

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
