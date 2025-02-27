import iconsMap from "@utils/iconsMap";
import styles from "./messenger.module.scss";
import moment from "moment";
import Col from "../Col";
import Row from "../Row";
import Typography from "../Typography";
import Box from "../Box";

export default function Message({ msg }) {
  return (
    <Row className={styles.message}>
      <Col className={styles["message-text"]}>
        <p>{msg.text}</p>
        <time
          className={styles["message-time"]}
          dateTime={moment(msg.timestamp).format("HH:mm")}>
          {moment(msg.timestamp).format("HH:mm")}
        </time>
      </Col>
      <Col>
        <Box dir="row" gap={1} align="center">
          <Typography element="span" className={styles["message-avatar-icon"]}>
            {msg.avattar ? (
              <img src={msg.avatar} width={50} height={50} />
            ) : (
              iconsMap["avatarFilled"]
            )}
          </Typography>
          <Typography element="span" className={styles["message-author"]}>
            {msg.sender}
          </Typography>
        </Box>
      </Col>
    </Row>
  );
}
