import { Card, Col, Row } from '@/components/ui';
import useSelectorValue from '../../hooks/useSelectorValue';
import moment from 'moment';
import { setNewStatisticsSectionFilter } from '@/store/slices/newStatisticsSlice';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shadcn/ui/table';
import { DateInput } from '@/components/shadcn/ui/date-input';
import { useDispatch } from 'react-redux';
import { mockLeadsByTimeData } from '../../utils/mockData';

const today = moment().format('YYYY-MM-DD');

export default function LeadsHourlyDistributionSection() {
  const title = "Qo'ng'iroqlarning soatlik taqsimoti";
  const date = useSelectorValue('sectionFilters.byTimeDate', today);
  const dispatch = useDispatch();

  const handleDateChange = (value) => {
    dispatch(setNewStatisticsSectionFilter({ byTimeDate: value }));
  };

  const hours = mockLeadsByTimeData.hours.slice(0, 11);
  const values = mockLeadsByTimeData.series[0]?.data?.slice(0, 11) || [];
  const total = values.reduce((sum, value) => sum + value, 0);

  return (
    <Card title={title} rightTitle={<DateInput value={date} onChange={handleDateChange} />}>
      <Row>
        <Col fullWidth>
          <div className="overflow-auto w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead style={{ width: '140px' }}>Soat</TableHead>
                  {hours.map((hour) => (
                    <TableHead key={hour} className="text-center">{hour}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-semibold">Soni</TableCell>
                  {values.map((value, index) => (
                    <TableCell key={`v-${hours[index]}`} className="text-center">
                      {index === 0 ? total.toLocaleString() : value.toLocaleString()}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Foizi</TableCell>
                  {values.map((value, index) => (
                    <TableCell key={`p-${hours[index]}`} className="text-center">
                      {index === 0
                        ? '100%'
                        : `${((value / total) * 100).toFixed(2)}%`}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </Col>
      </Row>
    </Card>
  );
}
