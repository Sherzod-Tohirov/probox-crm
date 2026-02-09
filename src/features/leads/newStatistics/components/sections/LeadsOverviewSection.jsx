import { Card, Col, Gauge, Input, Row } from '@/components/ui';
import moment from 'moment';
import useLeadsOverviewTableColumns from '@/features/leads/newStatistics/hooks/useLeadsOverviewTableColumns';
import Table from '@/components/ui/Table';
import { setNewStatisticsSectionFilter } from '@/store/slices/newStatisticsSlice';
import { useDispatch } from 'react-redux';
import useSelectorValue from '../../hooks/useSelectorValue';
import {
  mockOverviewGaugeData,
  mockOverviewTableData,
} from '../../utils/mockData';

function TableOverview({ title, data, date, onDateChange }) {
  const { leadsOverviewTableColumns } = useLeadsOverviewTableColumns();

  return (
    <Card
      title={title}
      rightTitle={
        <Input
          type="date"
          value={date}
          variant="outlined"
          onChange={(value) => onDateChange(value)}
        />
      }
    >
      <Row>
        <Col fullWidth>
          <Table
            showPivotColumn
            columns={leadsOverviewTableColumns}
            data={data}
            scrollHeight="450px"
            getRowStyles={() => {}}
            showSummary
          />
        </Col>
      </Row>
    </Card>
  );
}

function GaugeOverview({ data }) {
  return (
    <Card bodyPadding="16px">
      <Row direction="column" gutter={4} align="center">
        <Col>
          <Gauge
            value={data.total.value}
            total={data.total.total}
            label={data.total.label}
            size="md"
          />
        </Col>
        <Col fullWidth>
          <Row
            direction={{ xs: 'column', sm: 'row' }}
            gutter={1}
            justify="center"
            wrap
          >
            {data.items.map((item, index) => (
              <Col flexShrink={false} key={index}>
                <Gauge
                  value={item.value}
                  total={item.total}
                  label={item.label}
                  color={item.color}
                  size="sm"
                  percentagePosition="bottom-center"
                  withCard
                />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Card>
  );
}

const today = moment().format('DD.MM.YYYY');

export default function LeadsOverviewSection() {
  const dispatch = useDispatch();
  const overviewDate = useSelectorValue('sectionFilters.overviewDate', today);

  const handleDateChange = (date) => {
    dispatch(setNewStatisticsSectionFilter({ overviewDate: date }));
  };

  return (
    <Row direction={{ xs: 'column', lg: 'row' }} gutter={4}>
      <Col flexGrow fullWidth>
        <TableOverview
          date={overviewDate}
          onDateChange={handleDateChange}
          data={mockOverviewTableData}
          title="Oy bo'yicha leadlarning taqsimlanishi"
        />
      </Col>
      <Col flexGrow fullHeight fullWidth>
        <GaugeOverview data={mockOverviewGaugeData} />
      </Col>
    </Row>
  );
}
