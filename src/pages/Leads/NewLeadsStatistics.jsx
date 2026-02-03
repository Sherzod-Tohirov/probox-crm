import { Col, Row } from '@/components/ui';
import DateFilterModal from '@/features/leads/newStatistics/components/modals/DateFilterModal';
import StatisticsHeader from '@/features/leads/newStatistics/components/StatisticsHeader';
import useDateFilterModal from '@/features/leads/newStatistics/hooks/useDateFilterModal';

export default function NewLeadsStatistics() {
  const { isOpen, onClose, onOpen, onApply } = useDateFilterModal();
  return (
    <>
      <Row>
        <Col fullWidth>
          <StatisticsHeader onDateFilterModalOpen={onOpen} />
        </Col>
        <Col fullWidth>
          <Row>
            <Col></Col>
          </Row>
        </Col>
      </Row>
      <DateFilterModal isOpen={isOpen} onClose={onClose} onApply={onApply} />
    </>
  );
}
