import styles from "./row.module.scss";
import { memo } from "react";
import classNames from "classnames";

// Row Component
function Row({
  children,
  gutter,
  direction = "column",
  justify = "start",
  align = "start",
  flexGrow = false,
  wrap,
  className,
  style,
}) {
  const rowStyle = {
    display: "flex",
    flexGrow: flexGrow ? "1" : "0",
    width: "100%",
    flexDirection: direction,
    flexWrap: wrap ? "wrap" : "nowrap",
    justifyContent: justify,
    alignItems: align,
    gap: gutter + "rem",
    ...style,
  };

  return (
    <div className={classNames(styles.row, className)} style={rowStyle}>
      {children}
    </div>
  );
}

export default memo(Row);
