import classNames from "classnames";
import styles from "./alert.module.scss";
import { Row, Col, Button, Box } from "@components/ui";
import Typography from "../Typography";
import iconsMap from "../../../utils/iconsMap";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function Alert({
  message,
  type = "success",
  timer = 5000,
  persistant = false,
  onClose = () => {},
}) {
  const [closeAlert, setCloseAlert] = useState(false);
  const handleClose = useCallback(() => {
    setCloseAlert(true);
    if (onClose) onClose();
  }, [onClose]);

  const icon = useMemo(
    () => ({
      success: "tickCircle",
      error: "closeCircle",
      info: "infoCircle",
    }),
    []
  );

  useEffect(() => {
    if (persistant) return;

    const timerId = setTimeout(() => {
      setCloseAlert(true);
      if (onClose) onClose();
      console.log("close alert");
    }, timer);

    return () => {
      clearTimeout(timerId);
    };
  }, [timer, persistant, onClose]);

  if (closeAlert) {
    return null;
  }

  return (
    <Row
      direction={"row"}
      className={classNames(styles["alert"], styles[`alert-${type}`], {
        disappear: closeAlert,
      })}
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
        <Button icon={"close"} variant={"text"} onClick={handleClose}></Button>
      </Col>
    </Row>
  );
}
