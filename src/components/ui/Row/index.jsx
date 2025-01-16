import styles from "./row.module.scss";
import { memo } from "react";
import classNames from "classnames";

// Row Component
function Row({
  children,
  gutter,
  direction = "vertical",
  justify,
  align,
  wrap,
  className,
  style,
}) {
  const rowStyle = {
    display: "flex",
    flexDirection: direction === "horizontal" ? "row" : "column",
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
