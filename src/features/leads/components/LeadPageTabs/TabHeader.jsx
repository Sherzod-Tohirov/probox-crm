import { Typography, Button, Row, Col } from '@components/ui';
import styles from './leadPageTabs.module.scss';

export default function TabHeader({
  title,
  onSave,
  disabled = false,
  isSubmitting = false,
}) {
  return (
    <Row
      className={styles['tab-header']}
      direction="row"
      justify="space-between"
      align="center"
    >
      <Col>
        <Typography variant="h6" className={styles['tab-title']}>
          {title}
        </Typography>
      </Col>
      <Col>
        <Button
          variant="filled"
          onClick={onSave}
          disabled={disabled || isSubmitting}
          className={styles['tab-save-button']}
          isLoading={isSubmitting}
        >
          {isSubmitting ? 'Saqlanmoqda...' : 'Saqlash'}
        </Button>
      </Col>
    </Row>
  );
}
