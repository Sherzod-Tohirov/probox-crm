import { memo, useMemo } from "react";
import styles from "./box.module.scss";
import classNames from "classnames";

function Box({
  children,
  dir = "row",
  align,
  justify,
  gap = 0,
  className,
  ...props
}) {
  const boxStyle = useMemo(
    () => ({
      flexDirection: dir,
      alignItems: align,
      justifyContent: justify,
      gap: gap + "rem",
    }),
    [dir, gap, align, justify]
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
