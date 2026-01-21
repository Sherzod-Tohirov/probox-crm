import { Button, Box } from '@components/ui';
import styles from './notFound.module.scss';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  const navigate = useNavigate();
  
  return (
    <div className={styles['not-found']}>
      <motion.div
        className={styles.container}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className={styles['error-illustration']}>
          <motion.div
            className={styles['number-404']}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 180, damping: 12 }}
          >
            <motion.span 
              className={styles['number']}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 150 }}
            >
              4
            </motion.span>
            <motion.span 
              className={styles['number-zero']}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 150 }}
            >
              0
            </motion.span>
            <motion.span 
              className={styles['number']}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 150 }}
            >
              4
            </motion.span>
          </motion.div>
        </div>
        
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Sahifa topilmadi
        </motion.h1>
        
        <motion.p
          className={styles.desc}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Kechirasiz, siz qidirayotgan sahifa mavjud emas yoki ko'chirilgan.
        </motion.p>
        
        <motion.div
          className={styles['button-wrapper']}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Box dir="row" gap={3} justify="center">
            <Button
              icon="home"
              variant="filled"
              onClick={() => navigate('/')}
              className={styles['btn-primary']}
            >
              Bosh sahifa
            </Button>
            <Button
              icon="arrowLeft"
              iconSize={14}
              variant="outlined"
              onClick={() => navigate(-2)}
              className={styles['btn-outlined']}
            >
              Orqaga
            </Button>
          </Box>
        </motion.div>
      </motion.div>
    </div>
  );
}
