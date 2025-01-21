import { memo } from "react";
import styles from "./divider.module.scss";
import classNames from "classnames";

function Divider({ color = "primary", ...props }) {
  return <span className={classNames(styles.divider, color)} {...props} />;
}

export default memo(Divider);
