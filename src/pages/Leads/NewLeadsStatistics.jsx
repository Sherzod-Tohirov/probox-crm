import { Col, Row } from '@/components/ui';
import DateFilterModal from '@/features/leads/newStatistics/components/modals/DateFilterModal';
import LeadsOverviewSection from '@/features/leads/newStatistics/components/sections/LeadsOverviewSection';
import StatisticsHeader from '@/features/leads/newStatistics/components/StatisticsHeader';
import useDateFilterModal from '@/features/leads/newStatistics/hooks/useDateFilterModal';

export default function NewLeadsStatistics() {
  const { isOpen, onClose, onOpen, onApply } = useDateFilterModal();
  return (
    <>
      <Row gutter={4}>
        <Col fullWidth>
          <StatisticsHeader onDateFilterModalOpen={onOpen} />
        </Col>
        <Col fullWidth>
          <Row gutter={4}>
            <Col fullWidth>
              <LeadsOverviewSection />
            </Col>
          </Row>
        </Col>
      </Row>
      <DateFilterModal isOpen={isOpen} onClose={onClose} onApply={onApply} />
    </>
  );
}
