import { Card, Col, Input, Row } from '@/components/ui';
import useSelectorValue from '../../hooks/useSelectorValue';
import moment from 'moment';
import { setNewStatisticsSectionFilter } from '@/store/slices/newStatisticsSlice';
import Table from '@/components/ui/Table';
import { useDispatch } from 'react-redux';

const today = moment().format('DD.MM.YYYY');

export default function LeadsBySourceDetailedSection() {
  const title = "Manbalar bo'yicha leadlarning taqsimlanishi (batafsil)";
  const date = useSelectorValue('sectionFilters.bySourceDate', today);
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
