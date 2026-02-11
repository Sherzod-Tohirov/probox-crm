import { Card, Col, Row } from '@/components/ui';
import useSelectorValue from '../../hooks/useSelectorValue';
import moment from 'moment';
import { setNewStatisticsSectionFilter } from '@/store/slices/newStatisticsSlice';
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
import { useDispatch } from 'react-redux';
import { mockBranchData } from '../../utils/mockData';

const today = moment().format('YYYY-MM-DD');

export default function LeadsByBranchSection() {
  const title = "Do'konlar bo'yicha leadlarning taqsimlanishi";
  const date = useSelectorValue('sectionFilters.byBranchDate', today);
  const dispatch = useDispatch();
  const handleDateChange = (date) => {
    dispatch(setNewStatisticsSectionFilter({ byBranchDate: date }));
  };

  const columns = [
    { key: 'branch', title: "Do'kon" },
    { key: 'leads', title: 'Leadlar' },
    { key: 'sold', title: 'Sotildi' },
    { key: 'cr', title: 'CR%' },
    { key: 'revenue', title: 'Daromad' },
  ];

  return (
    <Card
      title={title}
      rightTitle={<DateInput value={date} onChange={handleDateChange} />}
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
                {columns.map((col) => (
                  <TableHead key={col.key}>{col.title}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockBranchData.map((row, i) => (
                <TableRow key={i}>
                  <TableCell className="text-center">{i + 1}</TableCell>
                  {columns.map((col) => (
                    <TableCell key={col.key}>{row[col.key]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell className="text-center font-semibold">—</TableCell>
                <TableCell className="font-semibold">Jami</TableCell>
                <TableCell className="font-semibold">
                  {mockBranchData
                    .reduce((a, b) => a + b.leads, 0)
                    .toLocaleString()}
                </TableCell>
                <TableCell className="font-semibold">
                  {mockBranchData
                    .reduce((a, b) => a + b.sold, 0)
                    .toLocaleString()}
                </TableCell>
                <TableCell className="font-semibold">—</TableCell>
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
