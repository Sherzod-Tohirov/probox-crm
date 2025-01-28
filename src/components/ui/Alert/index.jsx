import classNames from "classnames";
import styles from "./alert.module.scss";
import { Row, Col, Button, Box } from "@components/ui";
import Typography from "../Typography";
import iconsMap from "@utils/iconsMap";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CSSTransition } from "react-transition-group";
export default function Alert({
  message,
  show: showAlert,
  type = "success",
  timer = 4000,
  persistant = false,
  onClose = () => {},
}) {
  const [show, setShow] = useState(showAlert);
  const handleClose = useCallback(() => {
    setShow(false);
    if (onClose) onClose();
  }, [onClose]);

  useEffect(() => {
    setShow(showAlert);
  }, [showAlert]);

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
      setShow(false);
      if (onClose) onClose();
      console.log("close alert");
    }, timer);

    return () => {
      clearTimeout(timerId);
    };
  }, [timer, persistant, onClose]);
  console.log(show, "closeAlert");

  return (
    <CSSTransition
      in={show}
      timeout={300}
      classNames={{
        enter: styles["alert-enter"],
        enterActive: styles["alert-enter-active"],
        exit: styles["alert-exit"],
        exitActive: styles["alert-exit-active"],
      }}
      unmountOnExit
      mountOnEnter>
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
          <Button
            icon={"close"}
            variant={"text"}
            onClick={handleClose}></Button>
        </Col>
      </Row>
    </CSSTransition>
  );
}
