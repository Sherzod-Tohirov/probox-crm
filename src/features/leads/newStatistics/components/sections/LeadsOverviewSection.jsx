import { Card, Col, Gauge, Row } from '@/components/ui';
import moment from 'moment';
import useLeadsOverviewTableColumns from '@/features/leads/newStatistics/hooks/useLeadsOverviewTableColumns';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shadcn/ui/table';
import { DateInput } from '@/components/shadcn/ui/date-input';
import { setNewStatisticsSectionFilter } from '@/store/slices/newStatisticsSlice';
import { useDispatch } from 'react-redux';
import useSelectorValue from '../../hooks/useSelectorValue';
import {
  mockOverviewGaugeData,
  mockOverviewTableData,
} from '../../utils/mockData';
import useIsMobile from '@/hooks/useIsMobile';

function TableOverview({ title, data, date, onDateChange }) {
  const { leadsOverviewTableColumns } = useLeadsOverviewTableColumns();

  return (
    <Card
      title={title}
      rightTitle={<DateInput value={date} onChange={onDateChange} />}
    >
      <Row>
        <Col fullWidth>
          <div className="w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center" style={{ width: '40px' }}>
                    #
                  </TableHead>
                  {leadsOverviewTableColumns.map((col) => (
                    <TableHead
                      key={col.key}
                      style={{ width: col.width, minWidth: col.minWidth }}
                    >
                      {col.title}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    <TableCell className="text-center">
                      {rowIndex + 1}
                    </TableCell>
                    {leadsOverviewTableColumns.map((col) => (
                      <TableCell key={col.key}>
                        {col.renderCell
                          ? col.renderCell(row, rowIndex)
                          : row[col.key]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell className="text-center font-semibold">—</TableCell>
                  <TableCell className="font-semibold">Jami</TableCell>
                  <TableCell className="font-semibold">
                    {data
                      .reduce((acc, item) => acc + Number(item.leads), 0)
                      .toLocaleString()}
                  </TableCell>
                  <TableCell className="font-semibold">—</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </Col>
      </Row>
    </Card>
  );
}

function GaugeOverview({ data }) {
  const isMobile = useIsMobile();
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
              <Col fullWidth={isMobile} flexShrink={false} key={index}>
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

const today = moment().format('YYYY-MM-DD');

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
