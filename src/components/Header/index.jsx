import { matchPath, useLocation } from "react-router-dom";
import useToggle from "../../hooks/useToggle";
import { Col, Row, Button } from "../ui";
import Divider from "../ui/Divider";
import Input from "../ui/Input";
import styles from "./header.module.scss";
import { isMessengerRoute } from "../../utils/routesConfig";
function Header() {
  const { sidebar, messenger } = useToggle(["sidebar", "messenger"]);
  const { pathname } = useLocation();
  return (
    <header className={styles["site-header"]}>
      <Row direction="row" justify="space-between">
        <Col>
          <Row direction="row" gutter={6} align="center" justify="start">
            <Col align="center" justify="center">
              <Button
                variant="text"
                color="secondary"
                icon={sidebar.isOpen ? "toggleClose" : "toggleOpen"}
                onClick={sidebar.toggle}></Button>
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
              <Button variant={"text"} icon={"expense"} iconColor={"primary"}>
                12900 so'm
              </Button>
            </Col>
            <Col>
              <Button icon={"avatar"} variant={"text"} iconColor={"primary"}>
                Azamat Berdiyev
              </Button>
            </Col>
            {isMessengerRoute(pathname) ? (
              <Col>
                <Button
                  icon={messenger.isOpen ? "toggleOpen" : "toggleClose"}
                  variant={"text"}
                  onClick={messenger.toggle}
                />
              </Col>
            ) : null}
          </Row>
        </Col>
      </Row>
    </header>
  );
}

export default Header;
