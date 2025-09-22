import moment from "moment";
import styles from "./styles/messenger.module.scss";
import classNames from "classnames";

export default function MessageDate({
  date = new Date(),
  format = true,
  size = "",
}) {
  return (
    <time
      dateTime={format ? moment(date).format("YYYY-MM-DD") : date}
      className={classNames(styles["message-date"], styles[size])}>
      {format ? moment(date).format("DD-MM-YYYY") : date}
    </time>
  );
}
