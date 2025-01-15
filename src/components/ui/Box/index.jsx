import { memo, useMemo } from "react";
import styles from "./box.module.css";

function Box({ children, direction = "horizontal", gap = 0, ...props }) {
  const boxStyle = useMemo(
    () => ({
      flexDirection: direction === "horizontal" ? "row" : "column",
      gap: gap + "rem",
    }),
    [direction, gap]
  );
  return (
    <div style={boxStyle} className={styles.box} {...props}>
      {children}
    </div>
  );
}

export default memo(Box);
