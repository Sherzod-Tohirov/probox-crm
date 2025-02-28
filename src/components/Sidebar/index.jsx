import Logo from "../Logo";
import styles from "./sidebar.module.scss";
import { Row, Col, List, Typography } from "@components/ui";
import useToggle from "@hooks/useToggle";
import sidebarLinks from "@utils/sidebarLinks";
import iconsMap from "@utils/iconsMap";
import { useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";

export default function Sidebar() {
  const { pathname } = useLocation();
  const { isOpen } = useToggle("sidebar");

  const renderLinks = useCallback(
    (link) => {
      return (
        <Link
          className={classNames(
            styles[`sidebar-link`],
            styles[pathname.startsWith(link.path) ? "active" : ""],
            link.color && styles[link.color],
            !isOpen && styles["minified"]
          )}
          to={link.path}>
          {iconsMap[link.icon]}
          <Typography
            element="span"
            className={classNames(styles["sidebar-link-title"], {
              [styles["minified"]]: !isOpen,
            })}>
            {link.title}
          </Typography>
        </Link>
      );
    },
    [pathname, isOpen]
  );
  return (
    <Row className={styles.sidebar} wrap gutter={8}>
      <Col>
        <Logo isMinified={!isOpen} />
      </Col>
      <Col>
        <Row gutter={3} align={!isOpen ? "center" : "start"}>
          <Col>
            <Typography
              element="span"
              className={classNames(
                styles["sidebar-text"],
                !isOpen && styles["minified"]
              )}>
              MAIN
            </Typography>
          </Col>
          <Col>
            <List gutter={1} items={sidebarLinks} renderItem={renderLinks} />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
