import { memo } from "react";
import styles from "./divider.module.scss";
import classNames from "classnames";

function Divider({ color = "primary", height, style, ...props }) {
  const dividerStyles = {
    ...(height ? { height } : {}),
    ...style,
  };
  return (
    <span
      style={dividerStyles}
      className={classNames(styles.divider, styles[color])}
      {...props}
    />
  );
}

export default memo(Divider);
