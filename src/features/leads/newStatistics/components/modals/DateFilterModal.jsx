import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Col,
  Modal,
  Row,
  Checkbox,
  Box,
} from '@/components/ui';
import { DATE_FILTER_OPTIONS } from '../../constants/date';
import moment from 'moment';
import useIsMobile from '@/hooks/useIsMobile';
import { Button } from '@/components/shadcn/ui/button';
import { Calendar } from '@/components/shadcn/ui/calendar';
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import styles from './dateFilterModal.module.scss';

const FORMAT = 'dd.MM.yyyy';

function toTextRange(range) {
  if (!range?.from || !range?.to) return [];
  return [format(range.from, FORMAT), format(range.to, FORMAT)];
}

function normalizePersistedRange(range = []) {
  if (!Array.isArray(range) || range.length < 2) return undefined;
  const from = moment(range[0], 'DD.MM.YYYY', true);
  const to = moment(range[1], 'DD.MM.YYYY', true);
  if (!from.isValid() || !to.isValid()) return undefined;
  return { from: from.toDate(), to: to.toDate() };
}

function Footer({ onApply, onClose, isMobile }) {
  return (
    <Row
      direction={isMobile ? 'column' : 'row'}
      align="center"
      justify="space-between"
      gutter={isMobile ? 2 : 0}
      className={styles.footerRow}
    >
      <Col>
        <Button variant="outline" onClick={onClose} className={styles.actionButton}>
          Bekor qilish
        </Button>
      </Col>
      <Col>
        <Button variant="default" onClick={onApply} className={styles.actionButton}>
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
  const [calendarRange, setCalendarRange] = useState(undefined);
  const [displayMonth, setDisplayMonth] = useState(new Date());
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
      const normalized = normalizePersistedRange(persistedFilter.dateRange);
      if (normalized) {
        setCalendarRange(normalized);
        setDisplayMonth(normalized.from);
      }
    }
  }, [isOpen, persistedFilter?.selectedOption, persistedFilter?.dateRange]);

  useEffect(() => {
    if (!isOpen) return;

    const today = new Date();
    const dayRange = { from: startOfDay(today), to: endOfDay(today) };
    const weekRange = {
      from: startOfWeek(today, { weekStartsOn: 1 }),
      to: endOfWeek(today, { weekStartsOn: 1 }),
    };
    const monthRange = { from: startOfMonth(today), to: endOfMonth(today) };

    switch (selectedOption) {
      case 'week': {
        setCalendarRange(weekRange);
        setDateRange(toTextRange(weekRange));
        setDisplayMonth(weekRange.from);
        return;
      }
      case 'today': {
        setCalendarRange(dayRange);
        setDateRange(toTextRange(dayRange));
        setDisplayMonth(dayRange.from);
        return;
      }
      case 'month': {
        setCalendarRange(monthRange);
        setDateRange(toTextRange(monthRange));
        setDisplayMonth(monthRange.from);
        return;
      }

      case 'calendar': {
        if (!calendarRange?.from) {
          const initial = { from: startOfMonth(today), to: endOfMonth(today) };
          setCalendarRange(initial);
          setDateRange(toTextRange(initial));
          setDisplayMonth(initial.from);
        }
        return;
      }

      default: {
        setCalendarRange(weekRange);
        setDateRange(toTextRange(weekRange));
        setDisplayMonth(weekRange.from);
        return;
      }
    }
  }, [isOpen, selectedOption]);

  const handleCalendarChange = (nextRange) => {
    setCalendarRange(nextRange);
    if (!nextRange?.from || !nextRange?.to) return;
    setDateRange(toTextRange(nextRange));
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Statistikalarni ko'rsatish"
      footer={<Footer onApply={handleApply} onClose={onClose} isMobile={isMobile} />}
      onClose={onClose}
      isLoading={isLoading}
      size={isMobile ? 'sm' : 'md'}
      className={styles.modal}
      bodyClassName={styles.body}
      footerClassName={styles.footer}
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
          <div className={styles.calendarPanel}>
            <Calendar
              mode="range"
              selected={calendarRange}
              onSelect={handleCalendarChange}
              month={displayMonth}
              onMonthChange={setDisplayMonth}
              numberOfMonths={isMobile ? 1 : 2}
              defaultMonth={displayMonth}
              showOutsideDays
              className={styles.calendar}
            />
          </div>
        </Col>
      </Row>
    </Modal>
  );
}
