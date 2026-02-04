import { useState } from 'react';
import {
  Button,
  Col,
  Modal,
  Row,
  DatePicker,
  Checkbox,
  Box,
} from '@/components/ui';
import { DATE_FILTER_OPTIONS } from '../../constants/date';

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

function DateOptions({ selectedOption, onChange }) {
  return (
    <Box paddingTop={4}>
      <Row gutter={4}>
        {DATE_FILTER_OPTIONS.map((opt) => (
          <Col key={opt.value}>
            <Checkbox
              color="info"
              checked={selectedOption === opt.value}
              label={opt.label}
              onChange={() => onChange(opt.value)}
            />
          </Col>
        ))}
      </Row>
    </Box>
  );
}

export default function DateFilterModal({
  onApply,
  onClose,
  isOpen,
  isLoading,
}) {
  const [dateRange, setDateRange] = useState([]);
  const [selectedOption, setSelectedOption] = useState('week');
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
      size="md"
    >
      <Row direction="row" gutter={5}>
        <Col>
          <DateOptions
            selectedOption={selectedOption}
            onChange={(opt) => setSelectedOption(opt)}
          />
        </Col>
        <Col>
          {' '}
          <DatePicker
            mode="range"
            value={dateRange}
            onChange={setDateRange}
            showMonths={2}
            inline
            dateFormat="d.m.Y"
          />
        </Col>
      </Row>
    </Modal>
  );
}
