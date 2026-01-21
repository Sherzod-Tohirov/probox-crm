import { Button, Box } from '@components/ui';
import styles from './error.module.scss';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Error({
  error = {
    message: "Nimadir noto'g'ri ketdi. Iltimos, qayta urinib ko'ring.",
  },
  onRetry = () => {
    window.location.reload();
  },
}) {
  const navigate = useNavigate();
  
  return (
    <div className={styles['page-error']}>
      <motion.div
        className={styles.container}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className={styles['error-icon']}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 12 }}
        >
          <div className={styles['icon-circle']}>
            <svg
              width="90"
              height="90"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </motion.div>

        <motion.h1
          className={styles.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Kechirasiz, xatolik yuz berdi
        </motion.h1>

        <motion.div
          className={styles['error-details']}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className={styles.desc}>{error.message}</p>
          {error.stack && (
            <details className={styles['error-stack']}>
              <summary>Texnik ma'lumotlar</summary>
              <pre>{error.stack}</pre>
            </details>
          )}
        </motion.div>

        <motion.div
          className={styles['button-wrapper']}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Box dir="row" gap={3} justify="center" align="center">
            <Button 
              icon="refresh" 
              variant="filled" 
              onClick={onRetry}
              className={styles['btn-primary']}
            >
              Qayta yuklash
            </Button>
            <Button
              icon="home"
              variant="outlined"
              onClick={() => navigate('/')}
              className={styles['btn-outlined']}
            >
              Bosh sahifa
            </Button>
          </Box>
        </motion.div>
      </motion.div>
    </div>
  );
}
