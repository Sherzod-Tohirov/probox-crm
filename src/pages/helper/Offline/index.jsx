import { Button, Box } from '@components/ui';
import styles from './offline.module.scss';
import { motion } from 'framer-motion';
import { WifiOff, RefreshCw } from 'lucide-react';

export default function Offline() {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className={styles.offline}>
      <motion.div
        className={styles.container}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <motion.div
          className={styles.illustration}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: 0.2,
            type: 'spring',
            stiffness: 180,
            damping: 12,
          }}
        >
          <div className={styles['pulse-ring']} />
          <WifiOff className={styles.icon} />
        </motion.div>

        <motion.h1
          className={styles.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          Internet ulanmagan
        </motion.h1>

        <motion.div
          className={styles['desc-wrapper']}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
        >
          <motion.p
            className={styles.desc}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
          >
            Iltimos, internet ulanishini tekshiring. Ulanish tiklanganda
            sahifani yangilashingiz mumkin.
          </motion.p>
        </motion.div>

        <motion.div
          className={styles['button-wrapper']}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <Box dir="row" gap={3} justify="center">
            <Button variant="filled" onClick={handleReload}>
              <RefreshCw size={16} style={{ marginRight: 6 }} /> Sahifani
              yangilash
            </Button>
          </Box>
        </motion.div>
      </motion.div>
    </div>
  );
}
