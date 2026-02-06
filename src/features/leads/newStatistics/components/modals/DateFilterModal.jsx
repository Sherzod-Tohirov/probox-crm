import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
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
import moment from 'moment';
import useIsMobile from '@/hooks/useIsMobile';

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
  const persistedFilter = useSelector((state) => state.page?.newStatistics);
  const [dateRange, setDateRange] = useState([]);
  const [selectedOption, setSelectedOption] = useState('today');
  const isMobile = useIsMobile();
  const handleApply = () => {
    onApply({
      selectedOption,
      dateRange,
    });
  };

  useEffect(() => {
    if (!isOpen) return;
    if (persistedFilter?.selectedOption) {
      setSelectedOption(persistedFilter.selectedOption);
    }
    if (Array.isArray(persistedFilter?.dateRange)) {
      setDateRange(persistedFilter.dateRange);
    }
  }, [isOpen, persistedFilter?.selectedOption, persistedFilter?.dateRange]);

  useEffect(() => {
    const today = moment();
    const startOfDay = today.startOf('day').format('DD.MM.YYYY');
    const endOfDay = today.endOf('day').format('DD.MM.YYYY');
    const startOfWeek = today.startOf('week').format('DD.MM.YYYY');
    const endOfWeek = today.endOf('week').format('DD.MM.YYYY');
    const startOfMonth = today.startOf('month').format('DD.MM.YYYY');
    const endOfMonth = today.endOf('month').format('DD.MM.YYYY');
    switch (selectedOption) {
      case 'week': {
        setDateRange([startOfWeek, endOfWeek]);
        return;
      }
      case 'today': {
        setDateRange([startOfDay, endOfDay]);
        return;
      }
      case 'month': {
        setDateRange([startOfMonth, endOfMonth]);
        return;
      }

      case 'calendar': {
        setDateRange(null);
        return;
      }

      default: {
        setDateRange([startOfWeek, endOfWeek]);
        return;
      }
    }
  }, [selectedOption]);

  return (
    <Modal
      isOpen={isOpen}
      title="Statistikalarni ko'rsatish"
      footer={<Footer onApply={handleApply} onClose={onClose} />}
      onClose={onClose}
      isLoading={isLoading}
      size={isMobile ? 'sm' : 'md'}
    >
      <Row
        direction={isMobile ? 'column' : 'row'}
        justify="space-between"
        gutter={5}
      >
        <Col>
          <DateOptions
            selectedOption={selectedOption}
            onChange={setSelectedOption}
          />
        </Col>
        <Col>
          <DatePicker
            mode="range"
            value={dateRange}
            onChange={(value) => {
              if (!value) {
                setDateRange([]);
                return;
              }
              const formattedValue = value.map((date) =>
                moment(date).format('DD.MM.YYYY')
              );
              setDateRange(formattedValue);
            }}
            showMonths={2}
            inline
            dateFormat="d.m.Y"
            locale="uz"
          />
        </Col>
      </Row>
    </Modal>
  );
}
