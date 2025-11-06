import { Typography, Row } from '@components/ui';
import styles from './leadPageForm.module.scss';

export default function FieldGroup({ title, children, style }) {
  return (
    <div className={styles['field-group']} style={style}>
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
