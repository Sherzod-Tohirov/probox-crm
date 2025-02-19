import iconsMap from "@utils/iconsMap";
import styles from "./messenger.module.scss";
import moment from "moment";
import Col from "../Col";
import Row from "../Row";
import Typography from "../Typography";

export default function Message({ children, text, isRead }) {
  return (
    <Row className={styles.message}>
      <Col className={styles["message-text"]}>
        <p>{text}</p>
        <time
          className={styles["message-time"]}
          dateTime={moment().format("HH:mm")}>
          {moment().format("HH:mm")}
        </time>
      </Col>
      <Col className={styles["message-data"]}>
        <Typography element="span" className={styles["message-avatar-icon"]}>
          {iconsMap["avatarFilled"]}
        </Typography>
        <Typography element="span" className={styles["message-author"]}>
          User123
        </Typography>
      </Col>
    </Row>
  );
}
