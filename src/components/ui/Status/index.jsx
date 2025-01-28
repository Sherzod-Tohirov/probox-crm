import classNames from "classnames";
import styles from "./status.module.scss";

export default function Status({ status, ...props }) {
  const lowerCaseStatus = String(status).toLowerCase();
  console.log(lowerCaseStatus);
  const statusText = {
    paid: "Paid",
    partially_paid: "Partially paid",
    unpaid: "Unpaid",
  };
  return (
    <span
      className={classNames(styles.status, styles[lowerCaseStatus])}
      {...props}>
      {statusText[lowerCaseStatus]}
    </span>
  );
}
