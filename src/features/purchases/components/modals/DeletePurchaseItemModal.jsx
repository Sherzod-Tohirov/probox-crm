import { Delete } from '@/assets/images/icons/Icons';
import { Button, Box, Col, Modal, Row, Typography } from '@/components/ui';

function ModalFooter({ onCancel, onApply }) {
  return (
    <Row direction="row" justify="space-between" align="center" gutter={2}>
      <Col>
        <Button onClick={onCancel} color="danger" variant="outlined">
          Bekor qilish
        </Button>
      </Col>
      <Col>
        <Button type="submit" onClick={onApply}>
          O'chirish
        </Button>
      </Col>
    </Row>
  );
}

export function DeletePurchaseItemModal({ modal, onApply, onCancel }) {
  return (
    <Modal
      isOpen={!!modal}
      onClose={onCancel}
      size="sm"
      title="Mahsulotni o'chirish"
      footer={<ModalFooter onApply={onApply} onCancel={onCancel} />}
    >
      <Box padding={6} paddingX={10}>
        <Row gutter={5} align="center" justify="center">
          <Col>
            <Typography element="span" color="error">
              <Delete width={45} height={45} />
            </Typography>
          </Col>
          <Col>
            <Typography color="secondary" align="center" variant="h5">
              Siz rostdan ham ushbu{' '}
              <Typography element="strong" color="primary">
                {`${modal?.payload?.product_name ?? 'kiritilgan'}`}
              </Typography>{' '}
              qurilmasini o'chirmoqchimisiz?
            </Typography>
          </Col>
        </Row>
      </Box>
    </Modal>
  );
}
