import { memo } from "react";
import PropTypes from "prop-types";
import styles from "./col.module.scss";
import classNames from "classnames";
function Col({ children, span, offset, className, style }) {
  const colStyle = {
    flex: span ? `0 0 ${(span / 12) * 100}%` : "1 1 auto",
    marginLeft: offset ? `${(offset / 12) * 100}%` : undefined,
    maxWidth: span ? `${(span / 12) * 100}%` : undefined,
    ...style,
  };

  return (
    <div className={classNames(styles.col, className)} style={colStyle}>
      {children}
    </div>
  );
}

export default memo(Col);
