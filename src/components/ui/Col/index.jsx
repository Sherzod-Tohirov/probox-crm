import { memo } from "react";
import styles from "./col.module.scss";
import classNames from "classnames";
function Col({
  children,
  span,
  align = "",
  justify = "",
  offset,
  gutter,
  className,
  style,
}) {
  const colStyle = {
    flex: span ? `0 0 ${(span / 12) * 100}%` : "0 0 auto",
    gap: `${gutter}rem`,
    marginLeft: offset ? `${(offset / 12) * 100}%` : undefined,
    maxWidth: span ? `${(span / 12) * 100}%` : undefined,
    alignSelf: align,
    justifySelf: justify,
    ...style,
  };

  return (
    <div className={classNames(styles.col, className)} style={colStyle}>
      {children}
    </div>
  );
}

export default memo(Col);
