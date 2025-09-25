import classNames from 'classnames';
import styles from './alert.module.scss';
import { Row, Col, Button, Box } from '@components/ui';
import Typography from '../Typography';
import iconsMap from '@utils/iconsMap';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function Alert({
  message,
  type = 'success',
  timer = 4000,
  persistant = false,
  onClose = () => {},
}) {
  const [show, setShow] = useState(true);
  const handleClose = useCallback(() => {
    setShow(false);
    if (typeof onClose === 'function') {
      onClose();
    }
  }, [onClose]);

  const icon = useMemo(
    () => ({
      success: 'tickCircle',
      error: 'closeCircle',
      info: 'infoCircle',
    }),
    []
  );

  useEffect(() => {
    if (persistant) return;

    const timerId = setTimeout(() => {
      setShow(false);
      if (onClose) onClose();
    }, timer);

    return () => {
      clearTimeout(timerId);
    };
  }, [timer, persistant, onClose]);

  return (
    <Row
      direction={'row'}
      className={classNames(styles['alert'], styles[`alert-${type}`])}
      gutter={3}
    >
      <Col>
        <Box>{iconsMap[icon[type]]}</Box>
      </Col>
      <Col flexGrow>
        <Row gutter={2} className={styles['alert-content']}>
          <Col>
            <Typography className={styles['alert-title']} element="strong">
              Xabar
            </Typography>
          </Col>
          <Col>
            <Typography className={styles['alert-desc']} element="p">
              {message}
            </Typography>
          </Col>
        </Row>
      </Col>
      <Col style={{ marginLeft: 'auto' }}>
        <Button icon={'close'} variant={'text'} onClick={handleClose}></Button>
      </Col>
    </Row>
  );
}
