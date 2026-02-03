import { Button, Col, Row, Typography } from '@/components/ui';

export default function StatisticsHeader({ onDateFilterModalOpen }) {
  return (
    <Row direction="row" gutter={4} align="center" justify="space-between">
      <Col>
        <Typography variant="h5" element="h1">
          Statistika
        </Typography>
      </Col>
      <Col>
        <Button
          onClick={onDateFilterModalOpen}
          icon="settings"
          iconColor="primary"
          variant="outlined"
        >
          Statistikalarni ko'rish
        </Button>
      </Col>
    </Row>
  );
}
