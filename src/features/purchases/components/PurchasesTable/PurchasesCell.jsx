import { Col, Row, Typography } from '@/components/ui';
import styles from './styles.module.scss';
import classNames from 'classnames';
import React from 'react';

function renderCell(children, textColor) {
  console.log(React.isValidElement(children));
  if (React.isValidElement(children)) {
    return children;
  }

  return (
    <Typography
      className={classNames(styles.desc, {
        [styles.notApplyColor]: textColor !== 'inherit',
      })}
      color={textColor}
    >
      {children}
    </Typography>
  );
}

export function PurchasesCell({
  title,
  textColor = 'inherit',
  children,
  className = '',
  ...props
}) {
  return (
    <Col fullWidth className={classNames(styles.cell, className)} {...props}>
      <Row gutter={0.5}>
        <Col>
          <Typography className={styles.title} element="h5">
            {title}
          </Typography>
        </Col>
        <Col>{renderCell(children, textColor)}</Col>
      </Row>
    </Col>
  );
}
