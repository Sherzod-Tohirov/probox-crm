import styles from "./row.module.scss";
import { forwardRef, memo } from "react";
import classNames from "classnames";
import { motion } from "framer-motion";

// Row Component
function Row(
  {
    children,
    gutter,
    direction = "column",
    justify = "start",
    align = "start",
    flexGrow = false,
    wrap,
    className,
    style,
    animated = false,
    ...props
  },
  ref
) {
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

  const Component = animated ? motion.div : "div";

  return (
    <Component
      ref={ref}
      className={classNames(styles.row, className)}
      style={rowStyle}
      {...props}>
      {children}
    </Component>
  );
}

export default memo(forwardRef(Row));
