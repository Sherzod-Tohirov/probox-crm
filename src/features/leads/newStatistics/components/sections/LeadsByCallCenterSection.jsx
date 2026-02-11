import { Card, Col, Row, Skeleton } from '@/components/ui';
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
import useFetchExecutors from '@/hooks/data/useFetchExecutors';
import { useMemo } from 'react';

const today = moment().format('YYYY-MM-DD');

const stageGroups = [
  { key: 'called', label: "Qo'ng'iroqlar" },
  { key: 'interested', label: 'Qiziqish bildirgan' },
  { key: 'passport', label: 'Pasport' },
  { key: 'meetingSet', label: 'Uchrashuv' },
  { key: 'visit', label: "Uchrashuv bo'ldi" },
  { key: 'purchase', label: "Xarid bo'ldi" },
];

const formatNumber = (value) => Number(value || 0).toLocaleString('ru-RU');
const formatPercent = (value) =>
  `${Number(value || 0)
    .toFixed(2)
    .replace('.', ',')}%`;

export default function LeadsByCallCenterSection({
  data = {},
  isLoading = false,
}) {
  const title = "Aloqa markazlari ko'rsatkichlari";
  const date = useSelectorValue('sectionFilters.byCallCenterDate', today);
  const dispatch = useDispatch();
  const { data: executors = [], isLoading: isExecutorsLoading } =
    useFetchExecutors();

  const handleDateChange = (value) => {
    dispatch(setNewStatisticsSectionFilter({ byCallCenterDate: value }));
  };

  const centerRows = useMemo(() => {
    const list = Array.isArray(data?.analytics1_funnel_by_operators)
      ? data.analytics1_funnel_by_operators
      : [];
    const executorMap = new Map(
      executors.map((executor) => [
        String(
          executor?.SlpCode ?? executor?.slpCode ?? executor?.Slp_Code ?? ''
        ),
        executor?.SlpName ?? executor?.slpName ?? '',
      ])
    );

    return [...list]
      .map((item) => {
        const totals = item?.totals || {};
        const code = String(item?.operator ?? '');
        return {
          name: executorMap.get(code) || `Operator ${code}`,
          leads: Number(totals.leads || 0),
          called: Number(totals.called || 0),
          interested: Number(totals.interested || 0),
          passport: Number(totals.passport || 0),
          meetingSet: Number(totals.meetingSet || 0),
          visit: Number(totals.visit || 0),
          purchase: Number(totals.purchase || 0),
        };
      })
      .sort((a, b) => b.leads - a.leads);
  }, [data, executors]);

  const totalLeads = centerRows.reduce((sum, row) => sum + row.leads, 0);
  const totals = stageGroups.reduce((acc, group) => {
    acc[group.key] = centerRows.reduce(
      (sum, row) => sum + Number(row[group.key] || 0),
      0
    );
    return acc;
  }, {});

  return (
    <Card
      title={title}
      rightTitle={<DateInput value={date} onChange={handleDateChange} />}
    >
      <Row>
        <Col fullWidth>
          {isLoading || isExecutorsLoading ? (
            <div className="w-full overflow-hidden rounded-xl border border-[var(--chart-grid-color)] p-4">
              <div className="grid grid-cols-6 gap-3 mb-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={`table-header-${index}`} height="22px" />
                ))}
              </div>
              <div className="space-y-2">
                {Array.from({ length: 8 }).map((_, rowIndex) => (
                  <div key={`table-row-${rowIndex}`} className="grid grid-cols-6 gap-3">
                    {Array.from({ length: 6 }).map((__, colIndex) => (
                      <Skeleton key={`table-cell-${rowIndex}-${colIndex}`} height="18px" />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full overflow-auto">
              <Table className="border-collapse border-spacing-0 [&_th]:border [&_th]:border-[var(--chart-grid-color)] [&_td]:border [&_td]:border-[var(--chart-grid-color)]">
                <TableHeader>
                <TableRow>
                  <TableHead style={{ width: '52px' }} />
                  <TableHead style={{ minWidth: '180px' }} />
                  <TableHead style={{ minWidth: '160px' }} />
                  {stageGroups.map((group) => (
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
                  <TableHead style={{ minWidth: '180px' }}>
                    Aloqa markazi
                  </TableHead>
                  <TableHead style={{ minWidth: '160px' }}>Leadlar</TableHead>
                  {stageGroups.flatMap((group) => [
                    <TableHead key={`${group.key}-count`}>Soni</TableHead>,
                    <TableHead key={`${group.key}-percent`}>Foizi</TableHead>,
                  ])}
                </TableRow>
                </TableHeader>

                <TableBody>
                <TableRow>
                  <TableCell className="text-center"> </TableCell>
                  <TableCell className="font-semibold">Jami ulush</TableCell>
                  <TableCell
                    className="font-semibold"
                    style={{ color: 'var(--success-color)' }}
                  >
                    {formatNumber(totalLeads)}
                  </TableCell>
                  {stageGroups.flatMap((group) => [
                    <TableCell
                      key={`total-count-${group.key}`}
                      className="font-semibold"
                    >
                      {formatNumber(totals[group.key])}
                    </TableCell>,
                    <TableCell
                      key={`total-percent-${group.key}`}
                      className="font-semibold"
                    >
                      {formatPercent(
                        totalLeads > 0
                          ? (totals[group.key] / totalLeads) * 100
                          : 0
                      )}
                    </TableCell>,
                  ])}
                </TableRow>

                {centerRows.map((row, index) => (
                  <TableRow key={`${row.name}-${index}`}>
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell className="font-semibold">{row.name}</TableCell>
                    <TableCell style={{ color: 'var(--success-color)' }}>
                      {formatNumber(row.leads)}
                    </TableCell>
                    {stageGroups.flatMap((group) => {
                      const value = Number(row[group.key] || 0);
                      const percent =
                        row.leads > 0 ? (value / row.leads) * 100 : 0;
                      return [
                        <TableCell key={`${row.name}-${group.key}-count`}>
                          {formatNumber(value)}
                        </TableCell>,
                        <TableCell key={`${row.name}-${group.key}-percent`}>
                          {formatPercent(percent)}
                        </TableCell>,
                      ];
                    })}
                  </TableRow>
                ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Col>
      </Row>
    </Card>
  );
}
