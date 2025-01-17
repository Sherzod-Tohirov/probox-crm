import { Col, Row, Button } from "../ui";
import Input from "../ui/Input";
import styles from "./header.module.scss";
function Header() {
  return (
    <header className={styles["site-header"]}>
      <Row>
        <Col>
          <Row direction="row">
            <Col>
              <Button variant="text" color="secondary" icon="toggle" />
            </Col>
            <Col></Col>
            <Col>
              <Input type="search" placeholder="Search" />
            </Col>
          </Row>
        </Col>
        <Col></Col>
      </Row>
    </header>
  );
}

export default Header;
