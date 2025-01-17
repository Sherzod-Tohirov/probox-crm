import classNames from "classnames";
import styles from "./input.module.scss";
import { memo } from "react";

function Input({ type, variant, ...props }) {
  return (
    <input
      type={type}
      className={classNames(styles["inp"], styles[variant])}
      {...props}
    />
  );
}

export default memo(Input);
