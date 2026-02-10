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
import { mockSourceDetailedData } from '../../utils/mockData';

const today = moment().format('YYYY-MM-DD');

const statusGroups = [
  { key: 'newLeads', label: 'Tushgan leadlar' },
  { key: 'called', label: "Qo'ng'iroq qilingan" },
  { key: 'interested', label: 'Qiziqish bildirgan' },
  { key: 'passport', label: 'Pasport' },
  { key: 'contract', label: 'Skoring' },
  { key: 'visited', label: 'Jarayonda' },
];

const formatNumber = (value) => Number(value || 0).toLocaleString('ru-RU');
const formatPercent = (value) =>
  `${Number(value || 0).toFixed(2).replace('.', ',')}%`;

export default function LeadsBySourceDetailedSection() {
  const title = "Manbalar bo'yicha leadlarning statusi";
  const date = useSelectorValue('sectionFilters.bySourceDate', today);
  const dispatch = useDispatch();

  const handleDateChange = (value) => {
    dispatch(setNewStatisticsSectionFilter({ bySourceDate: value }));
  };

  const totalLeads = mockSourceDetailedData.reduce(
    (sum, row) => sum + Number(row.newLeads || 0),
    0
  );

  const totals = statusGroups.reduce((acc, group) => {
    acc[group.key] = mockSourceDetailedData.reduce(
      (sum, row) => sum + Number(row[group.key] || 0),
      0
    );
    return acc;
  }, {});

  return (
    <Card title={title} rightTitle={<DateInput value={date} onChange={handleDateChange} />}>
      <Row>
        <Col fullWidth>
          <div className="overflow-auto w-full" style={{ maxHeight: '500px' }}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead style={{ width: '52px' }} />
                  <TableHead style={{ minWidth: '180px' }} />
                  {statusGroups.map((group) => (
                    <TableHead
                      key={`group-${group.key}`}
                      colSpan={2}
                      className="text-center"
                      style={{ minWidth: '230px' }}
                    >
                      {group.label}
                    </TableHead>
                  ))}
                </TableRow>
                <TableRow>
                  <TableHead className="text-center" style={{ width: '52px' }}>
                    №
                  </TableHead>
                  <TableHead style={{ minWidth: '180px' }}>Manba</TableHead>
                  {statusGroups.flatMap((group) => [
                    <TableHead key={`${group.key}-count`} className="text-left">
                      Soni
                    </TableHead>,
                    <TableHead key={`${group.key}-percent`} className="text-left">
                      Foizi
                    </TableHead>,
                  ])}
                </TableRow>
              </TableHeader>

              <TableBody>
                <TableRow>
                  <TableCell className="text-center"> </TableCell>
                  <TableCell className="font-semibold">Jami ulush</TableCell>
                  {statusGroups.flatMap((group) => [
                    <TableCell
                      key={`total-count-${group.key}`}
                      className="font-semibold"
                      style={
                        group.key === 'newLeads'
                          ? { color: 'var(--success-color)' }
                          : undefined
                      }
                    >
                      {formatNumber(totals[group.key])}
                    </TableCell>,
                    <TableCell key={`total-percent-${group.key}`} className="font-semibold">
                      {group.key === 'newLeads'
                        ? '100,00%'
                        : formatPercent((totals[group.key] / totalLeads) * 100)}
                    </TableCell>,
                  ])}
                </TableRow>

                {mockSourceDetailedData.map((row, index) => (
                  <TableRow key={row.source || index}>
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell className="font-semibold">{row.source}</TableCell>
                    {statusGroups.flatMap((group) => {
                      const value = Number(row[group.key] || 0);
                      const base = Number(row.newLeads || 0);
                      const percent = base > 0 ? (value / base) * 100 : 0;

                      return [
                        <TableCell
                          key={`${index}-${group.key}-count`}
                          style={
                            group.key === 'newLeads'
                              ? { color: 'var(--success-color)' }
                              : undefined
                          }
                        >
                          {formatNumber(value)}
                        </TableCell>,
                        <TableCell key={`${index}-${group.key}-percent`}>
                          {group.key === 'newLeads'
                            ? formatPercent((value / totalLeads) * 100)
                            : formatPercent(percent)}
                        </TableCell>,
                      ];
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Col>
      </Row>
    </Card>
  );
}
