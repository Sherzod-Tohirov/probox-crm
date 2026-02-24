import styles from './loader.module.scss';
import classNames from 'classnames';

export default function PageLoader({ fullscreen = false }) {
  return (
    <div
      className={classNames(styles['page-overlay'], {
        [styles.fullscreen]: fullscreen,
      })}
    >
      <div className={styles['loader-content']}>
        <div className={styles['spinner']} />
        <span className={styles['loader-text']}>Yuklanmoqda...</span>
      </div>
    </div>
  );
}
