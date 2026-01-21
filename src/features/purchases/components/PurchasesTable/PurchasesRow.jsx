import { Row } from '@/components/ui';
import styles from './styles.module.scss';

/**
 *
 * @param {React.ReactNode} children
 *
 * @returns {JSX.Element}
 */

export function PurchasesRow({ children }) {
  return (
    <div className={styles.row}>
      <Row direction="row">{children}</Row>
    </div>
  );
}
