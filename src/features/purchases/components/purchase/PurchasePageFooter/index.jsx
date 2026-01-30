import { memo } from 'react';
import { Col, Row, Button } from '@components/ui';
import Footer from '@components/Footer';
import StickyFooterPortal from '@components/Footer/StickyFooterPortal';
import styles from './style.module.scss';

function ConfirmButton({ canConfirm, confirm, cancel }) {
  if (!canConfirm) return null;
  return (
    <Col flexGrow>
      <Row gutter={2} direction="row" justify="end">
        <Col>
          <Button
            variant="outlined"
            isLoading={cancel.loading}
            onClick={cancel.run}
          >
            Bekor qilish
          </Button>
        </Col>
        <Col>
          <Button
            variant="filled"
            isLoading={confirm.loading}
            onClick={confirm.run}
          >
            Tasdiqlash
          </Button>
        </Col>
      </Row>
    </Col>
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

const PurchasePageFooter = ({ permissions, status, actions }) => {
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
          <ConfirmButton
            canConfirm={permissions?.canApprove}
            confirm={actions.confirm}
            cancel={actions.cancel}
          />
          <SendToApprovelButton
            canSendForApprovel={permissions?.canSendForApprovel}
            handleSendToApprovel={actions.approval.run}
            isLoading={actions.approval.loading}
          />
        </Row>
      </Footer>
    </StickyFooterPortal>
  );
};

export default memo(PurchasePageFooter);
