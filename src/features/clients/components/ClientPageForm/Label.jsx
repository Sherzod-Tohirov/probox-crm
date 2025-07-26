import iconsMap from '@utils/iconsMap';
import styles from './style.module.scss';

export default function Label({ children, icon, ...props }) {
  return (
    <label className={styles.label} {...props}>
      {iconsMap[icon]}
      {children}
    </label>
  );
}
