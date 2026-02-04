import { useState } from 'react';
import { Button, Col, Modal, Row, DatePicker } from '@/components/ui';

function Footer({ onApply, onClose }) {
  return (
    <Row direction="row" align="center" justify="space-between">
      <Col>
        <Button variant="outlined" color="danger" onClick={onClose}>
          Bekor qilish
        </Button>
      </Col>
      <Col>
        <Button variant="filled" onClick={onApply}>
          Qo'llash
        </Button>
      </Col>
    </Row>
  );
}

export default function DateFilterModal({
  onApply,
  onClose,
  isOpen,
  isLoading,
}) {
  const [dateRange, setDateRange] = useState([]);

  const handleApply = () => {
    onApply(dateRange);
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Statistikalarni ko'rsatish"
      footer={<Footer onApply={handleApply} onClose={onClose} />}
      onClose={onClose}
      isLoading={isLoading}
      size="lg"
    >
      <div style={{ minHeight: '450px', padding: '1rem 0' }}>
        <DatePicker
          mode="range"
          value={dateRange}
          onChange={setDateRange}
          showMonths={2}
          inline
          dateFormat="d.m.Y"
        />
      </div>
    </Modal>
  );
}
