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
import { mockBranchDetailedData } from '../../utils/mockData';

const today = moment().format('YYYY-MM-DD');

export default function LeadsByBranchDetailedSection() {
  const title = "Do'konlar bo'yicha leadlarning taqsimlanishi (batafsil)";
  const date = useSelectorValue('sectionFilters.byBranchDate', today);
  const dispatch = useDispatch();
  const handleDateChange = (date) => {
    dispatch(setNewStatisticsSectionFilter({ byBranchDate: date }));
  };

  const columns = [
    { key: 'branch', title: "Do'kon" },
    { key: 'newLeads', title: 'Yangi' },
    { key: 'called', title: "Qo'ng'iroq" },
    { key: 'answered', title: 'Javob' },
    { key: 'interested', title: 'Qiziqish' },
    { key: 'passport', title: 'Pasport' },
    { key: 'visited', title: 'Tashrif' },
    { key: 'contract', title: 'Shartnoma' },
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
              {mockBranchDetailedData.map((row, i) => (
                <TableRow key={i}>
                  <TableCell className="text-center">{i + 1}</TableCell>
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {typeof row[col.key] === 'number'
                        ? row[col.key].toLocaleString()
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
                {columns.slice(1).map((col) => (
                  <TableCell key={col.key} className="font-semibold">
                    {mockBranchDetailedData
                      .reduce((a, b) => a + (b[col.key] || 0), 0)
                      .toLocaleString()}
                  </TableCell>
                ))}
              </TableRow>
            </TableFooter>
            </Table>
          </div>
        </Col>
      </Row>
    </Card>
  );
}
