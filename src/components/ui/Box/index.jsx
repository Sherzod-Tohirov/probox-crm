import { memo, useMemo } from "react";
import styles from "./box.module.scss";
import classNames from "classnames";

function Box({ children, dir = "row", gap = 0, className, ...props }) {
  const boxStyle = useMemo(
    () => ({
      flexDirection: dir,
      gap: gap + "rem",
    }),
    [dir, gap]
  );
  return (
    <div
      style={boxStyle}
      className={classNames(styles.box, className)}
      {...props}>
      {children}
    </div>
  );
}

export default memo(Box);
