import { Col, Row, Typography } from '@/components/ui';
import styles from './styles.scss';
import classNames from 'classnames';

export function PurchasesCell({ title, children, className = '', ...props }) {
  return (
    <Col className={classNames(styles.cell, className)} {...props}>
      <Row gutter={2}>
        <Col>
          <Typography variant="body1" element="h5">
            {title}
          </Typography>
        </Col>
        <Col>{children}</Col>
      </Row>
    </Col>
  );
}
