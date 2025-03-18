import iconsMap from "@utils/iconsMap";
import styles from "./messenger.module.scss";
import moment from "moment";
import Col from "../Col";
import Typography from "../Typography";
import Box from "../Box";
import { motion } from "framer-motion";
export default function Message({ msg }) {
  console.log(moment(msg.timestamp).format("HH:mm"), "time");
  return (
    <motion.div
      className={styles.message}
      initial={{ scale: 0, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0, y: -20 }}
      transition={{ damping: 20, type: "spring", duration: 0.05 }}>
      <Col>
        <Box dir="column" className={styles["message-text"]}>
          <p>{msg.text}</p>
          <time
            className={styles["message-time"]}
            dateTime={moment(msg.timestamp).format("HH:mm")}>
            {moment(msg.timestamp).format("HH:mm")}
          </time>
        </Box>
      </Col>
      <Col>
        <Box dir="row" gap={1} align="center">
          <Typography element="span" className={styles["message-avatar-icon"]}>
            {msg.avatar ? (
              <img style={{borderRadius: "50%"}} src={msg.avatar} width={20} height={20} />
            ) : (
              iconsMap["avatarFilled"]
            )}
          </Typography>
          <Typography element="span" className={styles["message-author"]}>
            {msg.sender}
          </Typography>
        </Box>
      </Col>
    </motion.div>
  );
}
