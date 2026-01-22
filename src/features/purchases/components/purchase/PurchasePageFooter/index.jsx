import { memo } from 'react';
import { Col, Row, Button } from '@components/ui';
import Footer from '@components/Footer';
import StickyFooterPortal from '@components/Footer/StickyFooterPortal';
import styles from './style.module.scss';

const PurchasePageFooter = () => {
  return (
    <StickyFooterPortal>
      <Footer className={styles['footer-container']}>
        <Row
          direction="row"
          align="center"
          justify={{ xs: 'start', md: 'end' }}
          wrap
          gutter={4}
        >
          <Col>
            <Button variant="filled">Tasdiqlashga yuborish</Button>
          </Col>
        </Row>
      </Footer>
    </StickyFooterPortal>
  );
};

export default memo(PurchasePageFooter);
