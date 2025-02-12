import classNames from "classnames";
import { memo } from "react";
import styles from "./button.module.scss";
import iconsMap from "@utils/iconsMap";
import Typography from "../Typography";
import { OrbitProgress } from "react-loading-indicators";
import Box from "../Box";
import { motion } from "framer-motion";
function Button({
  children,
  className,
  variant = "filled",
  color,
  icon,
  iconPosition = "left",
  iconColor,
  isLoading = false,
  fullWidth = false,
  ...props
}) {
  return (
    <motion.button
      className={classNames(
        className,
        styles["btn"],
        styles[variant],
        styles[color],
        styles[`icon-${iconColor}-color`],
        isLoading && styles["loading"],
        fullWidth && styles["full-width"],
        { icon }
      )}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 15,
        duration: 0.1,
      }}
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
    </motion.button>
  );
}

export default memo(Button);
