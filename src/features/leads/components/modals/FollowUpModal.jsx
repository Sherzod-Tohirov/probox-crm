import { useEffect, useState } from 'react';
import { Modal, Button, Input, Row, Col } from '@components/ui';
import formatDate from '@/utils/formatDate';

export default function FollowUpModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Qayta aloqa sanasini belgilang',
  label = 'Qayta aloqa sanasi va vaqti',
  defaultValue = '',
}) {
  const formattedDefaultValue = defaultValue
    ? formatDate(defaultValue, 'YYYY.MM.DD HH:mm', 'DD.MM.YYYY HH:mm')
    : '';

  const [recallDate, setRecallDate] = useState(formattedDefaultValue);

  useEffect(() => {
    setRecallDate(formattedDefaultValue);
  }, [formattedDefaultValue]);

  const handleConfirm = () => {
    if (!recallDate) return;
    onConfirm(recallDate);
    setRecallDate('');
  };

  const handleClose = () => {
    setRecallDate(formattedDefaultValue);
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
