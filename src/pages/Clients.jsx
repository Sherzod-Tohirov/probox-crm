import { Outlet } from "react-router-dom";
import { Col, Row } from "@components/ui";
import Navigation from "@components/ui/Navigation";
import Filter from "@features/clients/components/Filter";

export default function Clients() {
  return (
    <Row gutter={6}>
      <Col>
        <Navigation />
      </Col>
      <Col>
        <Filter />
      </Col>
      <Outlet />
    </Row>
  );
}
