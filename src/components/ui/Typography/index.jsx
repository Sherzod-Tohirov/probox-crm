import classNames from "classnames";
import { memo } from "react";
import styles from "./typography.module.scss";
function Typography({
  element: Element = "p",
  className,
  children,
  variant,
  ...props
}) {
  return (
    <Element className={classNames(styles[variant], className)} {...props}>
      {children}
    </Element>
  );
}

export default memo(Typography);
