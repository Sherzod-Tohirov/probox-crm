import iconsMap from "@utils/iconsMap";
import styles from "./messenger.module.scss";
import moment from "moment";
import Col from "../Col";
import Row from "../Row";
export default function Message({ children, isRead }) {
  return (
    <Row className={styles.message}>
      <Col className={styles["message-text"]}>
        <p>{children}</p>
      </Col>
      <Col className={styles["message-time"]}>
        {isRead ? iconsMap["doubleTick"] : ""}
        <time className="time" dateTime={moment().format("HH:mm")}>
          {moment().format("HH:mm")}
        </time>
      </Col>
    </Row>
  );
}
