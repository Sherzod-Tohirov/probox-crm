import classNames from "classnames";
import { memo } from "react";
import styles from "./button.module.scss";
import iconsMap from "@utils/iconsMap";
import Typography from "../Typography";
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
      <Typography element="span" className={styles["icon-text"]}>
        {iconsMap[icon]}
      </Typography>
      {children}
    </button>
  );
}

export default memo(Button);
