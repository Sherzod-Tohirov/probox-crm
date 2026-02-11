import moment from "moment";
import styles from "./styles/messenger.module.scss";
import classNames from "classnames";

export default function MessageDate({
  date = new Date(),
  format = true,
  size = "",
}) {
  const parsed = moment(date);
  const normalizedDate = parsed.isValid()
    ? parsed.format("YYYY-MM-DD")
    : String(date);
  return (
    <time
      dateTime={format ? normalizedDate : normalizedDate}
      className={classNames(styles["message-date"], styles[size])}>
      {format ? moment(date).format("DD.MM.YYYY") : date}
    </time>
  );
}
