import { Typography, Row } from '@components/ui';
import styles from './leadPageForm.module.scss';

export default function FieldGroup({ title, children }) {
  return (
    <div className={styles['field-group']}>
      <Typography variant="body1" className={styles['field-label']}>
        {title}
      </Typography>
      <Row
        direction={{ xs: 'column', md: 'row' }}
        gutter={{ xs: 2, md: 3 }}
        wrap
      >
        {children}
      </Row>
    </div>
  );
}
