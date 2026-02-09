import { Card, Col, Gauge, Input, Row } from '@/components/ui';
import moment from 'moment';
import { useState } from 'react';
import useLeadsOverviewTableColumns from '@/features/leads/newStatistics/hooks/useLeadsOverviewTableColumns';
import Table from '@/components/ui/Table';
import { setNewStatisticsFilter } from '@/store/slices/newStatisticsSlice';
import { useDispatch, useSelector } from 'react-redux';

const mockData = [
  { levels: 'Yangi lead', leads: 8941, cr: 100 },
  { levels: "Qo'ng'iroq qilindi", leads: 8205, cr: 92 },
  { levels: 'Javob berdi', leads: 5035, cr: 56 },
  { levels: 'Qiziqish bildirdi', leads: 3415, cr: 38 },
  { levels: 'Pasport qabul qilindi', leads: 1683, cr: 19 },
  { levels: 'Tashrif buyurgan', leads: 3683, cr: 41 },
  { levels: 'Shartnoma imzolandi', leads: 1200, cr: 13 },
];

// TODO: Replace with real data from API
const mockGaugeData = {
  total: { value: 8941, total: 8941, label: 'Jami leadlar' },
  items: [
    {
      value: 8205,
      total: 8941,
      label: "Qo'ng'iroq qilindi",
      color: 'green',
    },
    { value: 5035, total: 8941, label: 'Javob berdi', color: 'orange' },
    { value: 3415, total: 8941, label: 'Qiziqish bildirdi', color: 'red' },
    { value: 1683, total: 8941, label: 'Pasport qabul qilindi', color: 'red' },
    { value: 1683, total: 8941, label: 'Pasport qabul qilindi', color: 'red' },
    { value: 1683, total: 8941, label: 'Pasport qabul qilindi', color: 'red' },
    { value: 3683, total: 8941, label: 'Tashrif buyurgan', color: 'orange' },
    { value: 7200, total: 8941, label: 'Tashrif qilindi', color: 'green' },
  ],
};

function TableOverview({ title, date, onSelect }) {
  const { leadsOverviewTableColumns } = useLeadsOverviewTableColumns();

  return (
    <Card
      title={title}
      rightTitle={
        <Input
          type="date"
          value={date}
          variant="outlined"
          onChange={(value) => onSelect(value)}
        />
      }
    >
      <Row>
        <Col fullWidth>
          <Table
            showPivotColumn
            columns={leadsOverviewTableColumns}
            data={mockData}
            scrollHeight="450px"
            getRowStyles={() => {}}
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
  const { overviewDate } = useSelector(
    (state) => state.page.newStatistics.sectionFilters
  );
  const [date, setDate] = useState(overviewDate || today);
  const dispatch = useDispatch();
  return (
    <Row direction={{ xs: 'column', lg: 'row' }} gutter={4}>
      <Col flexGrow fullWidth>
        <TableOverview
          title="Oy bo'yicha leadlarning taqsimlanishi"
          date={date}
          onSelect={(value) => {
            setDate(value);
            dispatch(
              setNewStatisticsFilter({
                sectionFilters: {
                  overviewDate: value,
                },
              })
            );
          }}
        />
      </Col>
      <Col flexGrow fullHeight fullWidth>
        <GaugeOverview data={mockGaugeData} />
      </Col>
    </Row>
  );
}
