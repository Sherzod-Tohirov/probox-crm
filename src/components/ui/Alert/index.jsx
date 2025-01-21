import classNames from "classnames";
import styles from "./alert.module.scss";
import { Row, Col, Button, Box } from "@components/ui";
import Typography from "../Typography";
import iconsMap from "../../../utils/iconsMap";
import { useMemo } from "react";
export default function Alert({
  message,
  type = "success",
  onClose = () => {},
}) {
  const icon = useMemo(
    () => ({
      success: "tickCircle",
      error: "closeCircle",
      warning: "infoCircle",
    }),
    []
  );
  return (
    <Row
      direction={"row"}
      className={classNames(styles["alert"], styles[`alert-${type}`])}
      gutter={3}>
      <Col>
        <Box>{iconsMap[icon[type]]}</Box>
      </Col>
      <Col>
        <Row gutter={2} className={styles["alert-content"]}>
          <Col>
            <Typography className={styles["alert-title"]} element="strong">
              Alert
            </Typography>
          </Col>
          <Col>
            <Typography className={styles["alert-desc"]} element="p">
              {message}
            </Typography>
          </Col>
        </Row>
      </Col>
      <Col>
        <Button icon={"close"} variant={"text"} onClick={onClose}></Button>
      </Col>
    </Row>
  );
}
