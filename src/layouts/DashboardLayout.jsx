import { useEffect, useState } from 'react';
import styles from '@assets/styles/modules/layout.module.scss';

export default function DashboardLayout({ children }) {
  const [isScaled, setIsScaled] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('uiScale');
    const initial = saved ? parseFloat(saved) : 1;
    const clamped = Math.min(1.5, Math.max(0.8, Number.isFinite(initial) ? initial : 1));
    document.documentElement.style.setProperty('--ui-scale', String(clamped));
    setIsScaled(Math.abs(clamped - 1) > 0.001);
  }, []);

  return (
    <main id="dashboard-layout-main" className={styles['dashboard-layout']}>
      <div className={styles['ui-scale-outer']}>
        <div
          className={`${styles['ui-scale-inner']} ${isScaled ? styles['ui-scale-inner--scaled'] : ''}`}
        >
          {children}
        </div>
      </div>
      <div id="footer-root" className={styles['footer-portal-root']} />
    </main>
  );
}
