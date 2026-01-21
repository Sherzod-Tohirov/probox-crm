import { Col, Row } from '@/components/ui';

export default function Calculator() {
  return (
    <Row style={{ width: '100%', height: '80dvh' }}>
      <Col flexGrow fullWidth>
        <iframe
          src="https://serene-manatee-3e31cf.netlify.app/"
          width="100%"
          height="100%"
        ></iframe>
      </Col>
    </Row>
  );
}
