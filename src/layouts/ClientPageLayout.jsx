import styles from "@styles/modules/layout.module.scss";
import { Col, Row, Navigation } from "@components/ui";
import { Outlet } from "react-router-dom";
import Footer from "@components/Footer";
export default function ClientPageLayout() {
  return (
    <>
      <Row className={styles["client-page-layout"]} gutter={6}>
        <Col>
          <Navigation />
        </Col>
        <Col style={{ width: "100%" }}>
          <Outlet />
        </Col>
      </Row>
      {/* <Footer></Footer> */}
    </>
  );
}
