import classNames from "classnames";
import { memo } from "react";
import styles from "./typography.module.scss";
function Typography({ element: Element = "p", children, variant, ...props }) {
  return (
    <Element className={classNames(styles[variant])} {...props}>
      {children}
    </Element>
  );
}

export default memo(Typography);
