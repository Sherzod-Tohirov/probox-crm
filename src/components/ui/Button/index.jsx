import classNames from "classnames";
import { memo } from "react";
import styles from "./button.module.scss";
import iconsMap from "@utils/iconsMap";
import Typography from "../Typography";
import { OrbitProgress } from "react-loading-indicators";
import Box from "../Box";
function Button({
  children,
  className,
  variant,
  color,
  icon,
  iconPosition = "left",
  isLoading = false,
  ...props
}) {
  return (
    <button
      className={classNames(
        className,
        styles["btn"],
        styles[variant],
        styles[color],
        isLoading && styles["loading"],
        { icon }
      )}
      disabled={isLoading}
      {...props}>
      {isLoading ? (
        <Box
          className={styles["loading-wrapper"]}
          gap={2}
          align="center"
          justify="center">
          <OrbitProgress style={{ fontSize: "1rem" }} color="currentColor" />
        </Box>
      ) : (
        ""
      )}
      <Box
        className={classNames(
          isLoading && styles["hide"],
          styles[iconPosition]
        )}
        gap={2}
        align="center"
        justify="center">
        {icon ? (
          <Typography element="span" className={styles["icon-text"]}>
            {iconsMap[icon]}
          </Typography>
        ) : (
          ""
        )}
        {children}
      </Box>
    </button>
  );
}

export default memo(Button);
