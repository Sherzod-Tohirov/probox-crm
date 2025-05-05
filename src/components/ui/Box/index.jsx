import { memo, useMemo } from "react";
import styles from "./box.module.scss";
import classNames from "classnames";
import { motion } from "framer-motion";

function Box({
  children,
  dir = "row",
  align = "start",
  justify = "start",
  gap = 0,
  pos = "static",
  height = "auto",
  width = "100%",
  padding = 0,
  paddingX = 0,
  paddingY = 0,
  paddingTop = 0,
  paddingBottom = 0,
  paddingLeft = 0,
  paddingRight = 0,
  margin = 0,
  marginX = 0,
  marginY = 0,
  marginTop = 0,
  marginBottom = 0,
  marginLeft = 0,
  marginRight = 0,
  className,
  component,
  ...props
}) {
  const boxStyle = useMemo(
    () => ({
      position: pos,
      width: width || "100%",
      height,
      flexDirection: dir,
      alignItems: align,
      justifyContent: justify,
      gap: gap + "rem",
      padding: `${paddingTop || paddingY || padding}rem ${
        paddingRight || paddingX || padding
      }rem ${paddingBottom || paddingY || padding}rem ${
        paddingLeft || paddingX || padding
      }rem`,
      margin: `${marginTop || marginY || margin}rem ${
        marginRight || marginX || margin
      }rem ${marginBottom || marginY || margin}rem ${
        marginLeft || marginX || margin
      }rem`,
    }),
    [
      dir,
      gap,
      align,
      justify,
      pos,
      padding,
      paddingX,
      paddingY,
      paddingTop,
      paddingBottom,
      paddingLeft,
      paddingRight,
      margin,
      marginX,
      marginY,
      marginTop,
      marginBottom,
      marginLeft,
      marginRight,
    ]
  );
  const Component = component || motion.div;
  return (
    <Component
      style={{ ...boxStyle }}
      className={classNames(styles.box, className)}
      {...props}>
      {children}
    </Component>
  );
}

export default memo(Box);
