import classNames from "classnames";
import styles from "./input.module.scss";
import { memo } from "react";
import iconsMap from "../../../utils/iconsMap";
import Typography from "../Typography";
import Box from "../Box";

const inputIcons = {
  email: "email",
  select: "arrowDown",
  search: "search",
};

function Input({ type, variant, icon, label, ...props }) {
  if (variant === "search") {
    return (
      <Box dir="row" gap={2} align={"center"}>
        <Typography element="span" className={styles["icon-text"]}>
          {iconsMap["search"]}
        </Typography>
        <input
          type={type}
          className={classNames(styles["input"], styles["search"])}
          {...props}
        />
      </Box>
    );
  }

  return (
    <Box className={styles["input-wrapper"]}>
      {label && (
        <Typography element="label" className={styles["label"]}>
          {label}
        </Typography>
      )}

      <Box>
        <input
          type={type}
          className={classNames(styles["input"], styles[variant])}
          {...props}
        />

        <Typography element="span" className={styles["icon"]}>
          {iconsMap[icon || variant || ""]}
        </Typography>
      </Box>
    </Box>
  );
}

export default memo(Input);
