import { useState } from 'react';
import { Modal, Button, Input, Row, Col } from '@components/ui';

export default function FollowUpModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Qayta aloqa sanasini belgilang',
  label = 'Qayta aloqa sanasi va vaqti',
  // defaultValue = '',
}) {
  const [recallDate, setRecallDate] = useState('');

  const handleConfirm = () => {
    if (!recallDate) return;
    onConfirm(recallDate);
    setRecallDate('');
  };

  const handleClose = () => {
    setRecallDate('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      size="sm"
      footer={
        <Row gutter={2} direction="row" justify="end">
          <Col>
            <Button variant="outlined" onClick={handleClose}>
              Bekor qilish
            </Button>
          </Col>
          <Col>
            <Button
              variant="filled"
              onClick={handleConfirm}
              disabled={!recallDate}
            >
              Saqlash
            </Button>
          </Col>
        </Row>
      }
    >
      <Row gutter={4}>
        <Col fullWidth>
          <Input
            type="date"
            includeTime
            label={label}
            variant="filled"
            value={recallDate}
            datePickerOptions={{
              minDate: 'today',
            }}
            onChange={(val) => {
              const raw = val?.target?.value ?? val;
              setRecallDate(raw);
            }}
          />
        </Col>
      </Row>
    </Modal>
  );
}
