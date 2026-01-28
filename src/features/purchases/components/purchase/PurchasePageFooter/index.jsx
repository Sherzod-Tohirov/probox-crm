import { memo } from 'react';
import { Col, Row, Button } from '@components/ui';
import Footer from '@components/Footer';
import StickyFooterPortal from '@components/Footer/StickyFooterPortal';
import styles from './style.module.scss';

function ConfirmButton({ canConfirm }) {
  if (!canConfirm) return null;
  return (
    <Row gutter={2}>
      <Col>
        <Button variant="outlined">Bekor qilish</Button>
      </Col>
      <Col>
        <Button variant="filled">Tasdiqlash</Button>
      </Col>
    </Row>
  );
}

function SendToApprovelButton({
  isLoading,
  canSendForApprovel,
  handleSendToApprovel,
}) {
  if (!canSendForApprovel) return null;
  return (
    <Col>
      <Button
        variant="filled"
        isLoading={isLoading}
        onClick={handleSendToApprovel}
      >
        Tasdiqlashga yuborish
      </Button>
    </Col>
  );
}

const PurchasePageFooter = ({
  permissions,
  status,
  onSendToApprovel,
  isSendApprovalLoading,
}) => {
  if (status === 'approved') return null;
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
          <ConfirmButton canConfirm={permissions?.canApprove} />
          <SendToApprovelButton
            canSendForApprovel={permissions?.canSendForApprovel}
            handleSendToApprovel={onSendToApprovel}
            isLoading={isSendApprovalLoading}
          />
        </Row>
      </Footer>
    </StickyFooterPortal>
  );
};

export default memo(PurchasePageFooter);
