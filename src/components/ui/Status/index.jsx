import classNames from "classnames";
import styles from "./status.module.scss";

export default function Status({ status, ...props }) {
  const lowerCaseStatus = String(status).toLowerCase();
  const statusText = {
    paid: "To'langan",
    partial: "Qisman",
    unpaid: "To'lanmagan",
    product: "Mahsulot",
  };
  return (
    <span
      className={classNames(styles.status, styles[lowerCaseStatus])}
      {...props}>
      {statusText[lowerCaseStatus]}
    </span>
  );
}
