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
import useLeadsBySourceTableColumns from '../../hooks/useLeadsBySourceTableColumns';
import { sourceMockData } from '../../utils/mockData';
import { formatterNumber } from '@/utils/formatterNumber';
import { Typography } from '@/components/ui';

const today = moment().format('YYYY-MM-DD');

export default function LeadsBySourceSection() {
  const title = "Manbalar bo'yicha leadlarning taqsimlanishi";
  const date = useSelectorValue('sectionFilters.bySourceDate', today);
  const { leadsBySourceTableColumns } = useLeadsBySourceTableColumns();
  const dispatch = useDispatch();
  const handleDateChange = (date) => {
    dispatch(setNewStatisticsSectionFilter({ bySourceDate: date }));
  };

  return (
    <Card title={title} rightTitle={<DateInput value={date} onChange={handleDateChange} />}>
      <Row>
        <Col fullWidth>
          <div className="overflow-auto" style={{ maxHeight: '450px' }}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center" style={{ width: '40px' }}>
                    #
                  </TableHead>
                  {leadsBySourceTableColumns.map((col) => (
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
                {sourceMockData.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    <TableCell className="text-center">{rowIndex + 1}</TableCell>
                    {leadsBySourceTableColumns.map((col) => (
                      <TableCell key={col.key}>
                        {col.renderCell ? col.renderCell(row, rowIndex) : row[col.key]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell className="text-center font-semibold">—</TableCell>
                  <TableCell>
                    <Typography variant="subtitle1">Jami</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" color="success">
                      {formatterNumber(
                        sourceMockData.reduce(
                          (acc, item) => acc + Number(item.leads),
                          0
                        )
                      )}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" color="success">
                      {sourceMockData
                        .reduce((acc, item) => acc + parseFloat(item.cr), 0)
                        .toFixed(1) + '%'}
                    </Typography>
                  </TableCell>
                  {leadsBySourceTableColumns.slice(3).map((col) => (
                    <TableCell key={`summary-${col.key}`}>—</TableCell>
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
