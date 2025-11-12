import { Row, Col, Navigation, Button } from '@components/ui';

export default function ClientPageHeader({
  isSaveButtonDisabled,
  isLoading,
  onSave,
}) {
  return (
    <Row
      direction="row"
      align="center"
      justify="space-between"
      gutter={3}
      wrap
    >
      <Col>
        <Navigation fallbackBackPath="/clients" />
      </Col>
      <Col>
        <Button
          disabled={isSaveButtonDisabled}
          isLoading={isLoading}
          type="submit"
          form="clientForm"
          variant="filled"
        >
          Saqlash
        </Button>
      </Col>
    </Row>
  );
}
