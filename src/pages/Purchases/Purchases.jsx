import { Col, Row } from '@/components/ui';
import PurchasesHeader from '@/features/purchases/components/PurchasesHeader';

export default function Purchases() {
  return (
    <Row>
      <Col fullWidth flexGrow>
        <PurchasesHeader pageTitle={'Sotib olish'} />
      </Col>
    </Row>
  );
}
