import { Row, Col, Button, Typography, Modal } from '@components/ui';

export default function ConfirmModal({
  isOpen = false,
  title = 'Tasdiqlash',
  subtitle = '',
  desc,
  message = 'Haqiqatan ham bu amalni bajarishni xohlaysizmi?',
  confirmText = "O'chirish",
  cancelText = 'Bekor qilish',
  confirmColor = 'danger',
  onConfirm = () => {},
  onCancel = () => {},
}) {
  const footer = (
    <Row direction="row" gutter={2} justify="end">
      <Col>
        <Button variant="outlined" onClick={onCancel}>
          {cancelText}
        </Button>
      </Col>
      <Col>
        <Button color={confirmColor} variant="filled" onClick={onConfirm}>
          {confirmText}
        </Button>
      </Col>
    </Row>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      footer={footer}
      size="sm"
    >
      <Row
        direction="column"
        gap={1}
        align={'center'}
        style={{ padding: '4px 0' }}
      >
        <Col>
          <Typography
            element="h3"
            style={{ fontSize: '5rem', fontWeight: 700 }}
          >
            {subtitle}
          </Typography>
        </Col>
        {(desc || message) && (
          <Col>
            <Typography
              element="p"
              style={{ fontSize: '3.8rem', opacity: 0.9 }}
            >
              {desc || message}
            </Typography>
          </Col>
        )}
      </Row>
    </Modal>
  );
}
