import {
  Col,
  Input,
  Navigation,
  Row,
  Typography,
  Badge,
} from '@/components/ui';

const courierOptions = [
  { value: 'courier1', label: 'Alisher Alisherov' },
  { value: 'courier2', label: 'Bobur Boburov' },
  { value: 'courier3', label: 'Dilshod Dilshodov' },
];

const warehouseOptions = [
  { value: 'warehouse1', label: 'Parkent' },
  { value: 'warehouse2', label: 'Toshkent' },
  { value: 'warehouse3', label: 'Samarqand' },
];

export default function PurchaseHeader() {
  return (
    <Row direction="row" justify="space-between">
      <Col fullWidth flexGrow>
        <Navigation fallbackBackPath="/purchases" />
      </Col>
      <Col fullWidth>
        <Row direction="row" align="center" justify="end" gutter={4}>
          <Col span={6}>
            <Input
              variant="outlined"
              type="select"
              placeholder="Yetkazib beruvchi"
              options={courierOptions}
            />
          </Col>
          <Col span={6}>
            <Input
              variant="outlined"
              type="select"
              placeholder="Omborxona"
              options={warehouseOptions}
            />
          </Col>
          <Col span={4}>
            <Row direction="row" gutter={2} align="center">
              <Col>
                <Typography color="secondary" variant="body2">
                  Status:
                </Typography>
              </Col>
              <Col>
                <Badge size="lg" color="warning">
                  Kutilmoqda
                </Badge>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
