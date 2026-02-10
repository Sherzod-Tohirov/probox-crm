import { Col, Row } from '@/components/ui';
import DateFilterModal from '@/features/leads/newStatistics/components/modals/DateFilterModal';
import LeadsByBranchSection from '@/features/leads/newStatistics/components/sections/LeadsByBranchSection';
import LeadsByBranchDetailedSection from '@/features/leads/newStatistics/components/sections/LeadsByBranchDetailedSection';
import LeadsByCallCenterSection from '@/features/leads/newStatistics/components/sections/LeadsByCallCenterSection';
import LeadsBySourceSection from '@/features/leads/newStatistics/components/sections/LeadsBySourceSection';
import LeadsBySourceDetailedSection from '@/features/leads/newStatistics/components/sections/LeadsBySourceDetailedSection';
import LeadsByDateChartSection from '@/features/leads/newStatistics/components/sections/LeadsByDateChartSection';
import LeadsOverviewSection from '@/features/leads/newStatistics/components/sections/LeadsOverviewSection';
import LeadsDistributionSection from '@/features/leads/newStatistics/components/sections/LeadsDistributionSection';
import StaffPerformanceChartSection from '@/features/leads/newStatistics/components/sections/StaffPerformanceChartSection';
import LeadsByTimeChartSection from '@/features/leads/newStatistics/components/sections/LeadsByTimeChartSection';
import LeadsHourlyDistributionSection from '@/features/leads/newStatistics/components/sections/LeadsHourlyDistributionSection';
import StatisticsHeader from '@/features/leads/newStatistics/components/StatisticsHeader';
import useDateFilterModal from '@/features/leads/newStatistics/hooks/useDateFilterModal';
import useFetchLeadOperatorAnalytics from '@/hooks/data/leads/statistics/useFetchLeadOperatorAnalytics';
import { useSelector } from 'react-redux';

export default function NewLeadsStatistics() {
  const { isOpen, onClose, onOpen, onApply } = useDateFilterModal();
  const [startDate, endDate] = useSelector(
    (state) => state.page.newStatistics.dateRange
  );
  const {
    data: operatorAnalytics,
    isLoading: isOperatorAnalyticsLoading,
    isFetching: isOperatorAnalyticsFetching,
  } = useFetchLeadOperatorAnalytics({
    start: startDate,
    end: endDate,
  });

  return (
    <>
      <Row gutter={4}>
        <Col fullWidth>
          <StatisticsHeader onDateFilterModalOpen={onOpen} />
        </Col>
        {/* 8. Call center operator table */}
        <Col fullWidth>
          <LeadsByCallCenterSection
            data={operatorAnalytics}
            isLoading={
              isOperatorAnalyticsLoading || isOperatorAnalyticsFetching
            }
          />
        </Col>

        {/* 9. Call center bar chart */}
        <Col fullWidth>
          <StaffPerformanceChartSection
            data={operatorAnalytics}
            isLoading={
              isOperatorAnalyticsLoading || isOperatorAnalyticsFetching
            }
          />
        </Col>
        <Col fullWidth>
          <Row gutter={4}>
            {/* 1. Overview: Table + Gauges */}
            <Col fullWidth>
              <LeadsOverviewSection />
            </Col>

            {/* 2. Source table with date columns */}
            <Col fullWidth>
              <LeadsBySourceSection />
            </Col>

            {/* 3. Leads by date bar chart with tabs */}
            <Col fullWidth>
              <LeadsByDateChartSection />
            </Col>

            {/* 4. Detailed source table */}
            <Col fullWidth>
              <LeadsBySourceDetailedSection />
            </Col>

            {/* 5. Branch table */}
            <Col fullWidth>
              <LeadsByBranchSection />
            </Col>

            {/* 6. Detailed branch table */}
            <Col fullWidth>
              <LeadsByBranchDetailedSection />
            </Col>

            {/* 7. Distribution donuts + summary */}
            <Col fullWidth>
              <LeadsDistributionSection />
            </Col>

            {/* 10. Hourly distribution table */}
            <Col fullWidth>
              <LeadsHourlyDistributionSection />
            </Col>

            {/* 11. Leads by time area chart */}
            <Col fullWidth>
              <LeadsByTimeChartSection />
            </Col>
          </Row>
        </Col>
      </Row>
      <DateFilterModal isOpen={isOpen} onClose={onClose} onApply={onApply} />
    </>
  );
}
