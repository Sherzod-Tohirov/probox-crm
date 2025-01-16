import Logo from "../Logo";
import styles from "./sidebar.module.scss";
import { Row, Col, List, Typography } from "../ui";
import { sidebarLinks } from "../../utils/constants";
import iconsMap from "../../utils/iconsMap";

import { useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";

export default function Sidebar() {
  const { pathname } = useLocation();
  console.log("pathname: ", pathname);
  const renderLinks = useCallback(
    (link) => {
      return (
        <Link
          className={classNames(
            styles[`sidebar-link`],
            styles[pathname === link.path ? "active" : ""]
          )}
          to={link.path}>
          {iconsMap[link.icon]}
          <Typography element="span">{link.title}</Typography>
        </Link>
      );
    },
    [pathname]
  );
  return (
    <Row className={styles.sidebar} wrap gutter={8}>
      <Col>
        <Logo />
      </Col>
      <Col>
        <Row gutter={3}>
          <Col>
            <Typography element="span" className={styles["sidebar-text"]}>
              MAIN
            </Typography>
          </Col>
          <Col>
            <List items={sidebarLinks} renderItem={renderLinks} />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
