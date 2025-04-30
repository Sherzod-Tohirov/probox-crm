import moment from "moment";
import styles from "./messenger.module.scss";

export default function MessageDate({ date = new Date(), format = true }) {
  return (
    <time
      dateTime={format ? moment(date).format("YYYY-MM-DD") : date}
      className={styles["message-date"]}>
      {format ? moment(date).format("DD-MM-YYYY") : date}
    </time>
  );
}
