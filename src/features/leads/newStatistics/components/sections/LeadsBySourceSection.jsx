import { Card, Col, Input, Row, Typography } from '@/components/ui';
import useSelectorValue from '../../hooks/useSelectorValue';
import moment from 'moment';
import { setNewStatisticsSectionFilter } from '@/store/slices/newStatisticsSlice';
import Table from '@/components/ui/Table';
import { useDispatch } from 'react-redux';
import useLeadsBySourceTableColumns from '../../hooks/useLeadsBySourceTableColumns';
import { sourceMockData } from '../../utils/mockData';
import { formatterNumber } from '@/utils/formatterNumber';

const today = moment().format('DD.MM.YYYY');

export default function LeadsBySourceSection() {
  const title = "Manbalar bo'yicha leadlarning taqsimlanishi";
  const date = useSelectorValue('sectionFilters.bySourceDate', today);
  const { leadsBySourceTableColumns } = useLeadsBySourceTableColumns();
  const dispatch = useDispatch();
  const handleDateChange = (date) => {
    dispatch(setNewStatisticsSectionFilter({ bySourceDate: date }));
  };

  const rightTitle = (
    <Input
      type="date"
      value={date}
      variant="outlined"
      onChange={handleDateChange}
    />
  );

  return (
    <Card title={title} rightTitle={rightTitle}>
      <Row>
        <Col fullWidth>
          <Table
            showPivotColumn
            columns={leadsBySourceTableColumns}
            data={sourceMockData}
            scrollHeight="450px"
            getRowStyles={() => {}}
            showSummary
            summarySticky
            summaryData={{
              source: <Typography variant="subtitle1">Jami</Typography>,
              leads: (
                <Typography variant="subtitle2" color="success">
                  {formatterNumber(
                    sourceMockData.reduce(
                      (acc, item) => acc + Number(item.leads),
                      0
                    )
                  )}
                </Typography>
              ),
              cr: (
                <Typography variant="subtitle2" color="success">
                  {sourceMockData
                    .reduce((acc, item) => acc + parseFloat(item.cr), 0)
                    .toFixed(1) + '%'}
                </Typography>
              ),
            }}
          />
        </Col>
      </Row>
    </Card>
  );
}
