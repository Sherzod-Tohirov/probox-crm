import classNames from "classnames";
import { memo } from "react";
import styles from "./button.module.scss";
import iconsMap from "@utils/iconsMap";
function Button({ children, className, variant, color, icon, ...props }) {
  return (
    <button
      className={classNames(
        className,
        styles["btn"],
        styles[variant],
        styles[color],
        { icon }
      )}
      {...props}>
      {iconsMap[icon]} {children}
    </button>
  );
}

export default memo(Button);
