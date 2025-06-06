import { forwardRef, memo } from "react";
import styles from "./col.module.scss";
import classNames from "classnames";
function Col(
  {
    children,
    span,
    flexGrow = false,
    align = "",
    justify = "",
    fullWidth = false,
    fullHeight = false,
    offset,
    gutter,
    className,
    style,
  },
  ref
) {
  const colStyle = {
    flex: span ? `0 0 ${(span / 12) * 100}%` : "0 0 auto",
    flexGrow: flexGrow ? 1 : 0,
    gap: `${gutter}rem`,
    marginLeft: offset ? `${(offset / 12) * 100}%` : undefined,
    maxWidth: span ? `${(span / 12) * 100}%` : undefined,
    alignSelf: align,
    justifySelf: justify,
    width: fullWidth ? "100%" : "auto",
    height: fullHeight ? "100%" : "auto",
    ...style,
  };

  return (
    <div
      ref={ref}
      className={classNames(styles.col, className)}
      style={colStyle}>
      {children}
    </div>
  );
}

export default memo(forwardRef(Col));
