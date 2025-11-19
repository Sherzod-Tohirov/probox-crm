import { useMemo } from 'react';
import { Row, Col, Table, Typography } from '@components/ui';
import StatisticChart from '@features/statistics/components/StatisticChart';

export default function LeadsStatistics() {
  const chartData = useMemo(
    () => [
      { day: '01.11', leads: 24, converted: 8 },
      { day: '02.11', leads: 32, converted: 11 },
      { day: '03.11', leads: 18, converted: 6 },
      { day: '04.11', leads: 40, converted: 13 },
      { day: '05.11', leads: 28, converted: 9 },
      { day: '06.11', leads: 36, converted: 14 },
      { day: '07.11', leads: 22, converted: 7 },
      { day: '08.11', leads: 31, converted: 10 },
      { day: '09.11', leads: 26, converted: 8 },
      { day: '10.11', leads: 35, converted: 12 },
    ],
    []
  );

  const tableData = useMemo(
    () => [
      {
        operator: 'Operator 1',
        leads: 120,
        converted: 38,
        conversionRate: '31.7%',
        avgResponseTime: '2m 10s',
      },
      {
        operator: 'Operator 2',
        leads: 98,
        converted: 24,
        conversionRate: '24.5%',
        avgResponseTime: '2m 42s',
      },
      {
        operator: 'Scoring',
        leads: 64,
        converted: 18,
        conversionRate: '28.1%',
        avgResponseTime: '3m 05s',
      },
      {
        operator: 'Seller',
        leads: 75,
        converted: 26,
        conversionRate: '34.7%',
        avgResponseTime: '1m 54s',
      },
      {
        operator: 'Operator M',
        leads: 52,
        converted: 12,
        conversionRate: '23.1%',
        avgResponseTime: '3m 20s',
      },
    ],
    []
  );

  const columns = useMemo(
    () => [
      { key: 'operator', title: 'Operator', width: { xl: '28%' } },
      {
        key: 'leads',
        title: 'Leadlar',
        width: { xl: '16%' },
        horizontal: 'end',
      },
      {
        key: 'converted',
        title: 'Konvertatsiya qilingan',
        width: { xl: '22%' },
        horizontal: 'end',
      },
      {
        key: 'conversionRate',
        title: 'Konversiya %',
        width: { xl: '18%' },
        horizontal: 'end',
      },
      {
        key: 'avgResponseTime',
        title: "O'rtacha javob vaqti",
        width: { xl: '16%' },
        horizontal: 'end',
      },
    ],
    []
  );

  return (
    <Row gutter={8} style={{ width: '100%', height: '100%' }}>
      <Col fullWidth>
        <Typography element="strong" style={{ fontSize: '3.2rem' }}>
          Leadlar statistikasi
        </Typography>
      </Col>
      <Col fullWidth>
        <StatisticChart
          title={'Kunlik leadlar'}
          data={chartData}
          keys={{ name: 'day', firstLine: 'leads', secondLine: 'converted' }}
        />
      </Col>
      <Col fullWidth>
        <Table
          id={'leads-statistics-table'}
          scrollable
          scrollHeight={'auto'}
          uniqueKey={'operator'}
          data={tableData}
          columns={columns}
        />
      </Col>
    </Row>
  );
}
