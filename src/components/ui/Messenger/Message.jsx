import iconsMap from "@utils/iconsMap";
import styles from "./messenger.module.scss";
import moment from "moment";
import Col from "../Col";
import Row from "../Row";
import Typography from "../Typography";
import Box from "../Box";
import { motion } from "framer-motion";
import useFetchExecutors from "@hooks/data/useFetchExecutors";
export default function Message({ msg }) {
  const { data: executors } = useFetchExecutors();
  const foundExecutor = executors?.find(
    (executor) => executor?.["SlpCode"] === msg?.["SlpCode"]
  );
  return (
    <motion.div
      className={styles.message}
      initial={{ scale: 0, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0, y: -20 }}
      transition={{ damping: 20, type: "spring", duration: 0.05 }}>
      <Col>
        <Box dir="column" className={styles["message-text"]}>
          <p>{msg?.["Comments"]}</p>
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
              <img src={msg.avatar} width={50} height={50} />
            ) : (
              iconsMap["avatarFilled"]
            )}
          </Typography>
          <Typography element="span" className={styles["message-author"]}>
            {foundExecutor?.["SlpName"] || "Boshqa"}
          </Typography>
        </Box>
      </Col>
    </motion.div>
  );
}
