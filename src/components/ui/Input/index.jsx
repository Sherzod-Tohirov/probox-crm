import classNames from "classnames";
import styles from "./input.module.scss";
import { memo } from "react";
import iconsMap from "../../../utils/iconsMap";
import Typography from "../Typography";

function Input({ type, variant, icon, ...props }) {
  return (
    <div className={styles["input-wrapper"]}>
      <Typography element="span" className={styles["icon-text"]}>
        {icon || variant === "search" ? iconsMap[variant] : ""}
      </Typography>
      <input
        type={type}
        className={classNames(styles["input"], styles[variant])}
        {...props}
      />
    </div>
  );
}

export default memo(Input);
