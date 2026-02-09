import { Card, Col, Input, Row } from '@/components/ui';
import useSelectorValue from '../../hooks/useSelectorValue';
import moment from 'moment';
import { setNewStatisticsSectionFilter } from '@/store/slices/newStatisticsSlice';
import Table from '@/components/ui/Table';
import { useDispatch } from 'react-redux';

const today = moment().format('DD.MM.YYYY');

export default function LeadsByCallCenterSection() {
  const title = "Call center bo'yicha leadlarning taqsimlanishi";
  const date = useSelectorValue('sectionFilters.byCallCenterDate', today);
  const dispatch = useDispatch();
  const handleDateChange = (date) => {
    dispatch(setNewStatisticsSectionFilter({ byCallCenterDate: date }));
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
            columns={[]}
            data={[]}
            scrollHeight="450px"
            getRowStyles={() => {}}
          />
        </Col>
      </Row>
    </Card>
  );
}
