import useSidebar from "../../hooks/useSidebar";
import { Col, Row, Button } from "../ui";
import Divider from "../ui/Divider";
import Input from "../ui/Input";
import styles from "./header.module.scss";
function Header() {
  const { toggleSidebar, isOpen } = useSidebar();
  return (
    <header className={styles["site-header"]}>
      <Row direction="row" justify="space-between">
        <Col>
          <Row direction="row" gutter={6} align="center" justify="start">
            <Col align="center" justify="center">
              <Button
                variant="text"
                color="secondary"
                icon={isOpen ? "toggleClose" : "toggleOpen"}
                onClick={toggleSidebar}></Button>
            </Col>
            <Col align="stretch">
              <Divider />
            </Col>
            <Col>
              <Input type="search" variant={"search"} placeholder="Search" />
            </Col>
          </Row>
        </Col>
        <Col>
          <Row direction="row" gutter={6}>
            <Col>
              <Button icon={"telephoneFilled"} variant={"text"} />
            </Col>
            <Col>
              <Button icon={"notification"} variant={"text"}>
                Notification
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </header>
  );
}

export default Header;
