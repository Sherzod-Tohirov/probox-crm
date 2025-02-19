import moment from "moment";
import styles from "./messenger.module.scss";
export default function MessageDate({ date = new Date() }) {
  return (
    <time
      dateTime={moment(date).format("DD-MM-YYYY")}
      className={styles["message-date"]}>
      {moment(date).format("DD-MM-YYYY")}
    </time>
  );
}
