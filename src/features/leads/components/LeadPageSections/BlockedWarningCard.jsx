import { Card, Typography } from '@components/ui';
import styles from './style.module.scss';

export default function BlockedWarningCard() {
  return (
    <Card className={styles['blocked-warning']}>
      <div className={styles['warning-content']}>
        <div className={styles['warning-icon']}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
              fill="currentColor"
            />
          </svg>
        </div>
        <div className={styles['warning-text']}>
          <Typography variant="h6" className={styles['warning-title']}>
            Lead bloklangan
          </Typography>
          <Typography variant="body2" className={styles['warning-description']}>
            Bu lead bloklangan. Hech qanday o'zgartirishlar kiritib bo'lmaydi.
            Blokni ochish uchun manager bilan bog'laning.
          </Typography>
        </div>
      </div>
    </Card>
  );
}
