import { OrbitProgress } from "react-loading-indicators";
import { motion } from "framer-motion";
import { memo } from "react";

import styles from "./button.module.scss";
import iconsMap from "@utils/iconsMap";
import classNames from "classnames";

import Typography from "../Typography";
import Box from "../Box";

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
  disabled = false,
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
        disabled && styles["disabled"],
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
        <div className={styles["loading-wrapper"]}>
          <OrbitProgress style={{ fontSize: "1rem" }} color="currentColor" />
        </div>
      ) : null}
      <Box
        className={classNames(
          styles[iconPosition],
          isLoading && styles["hide"]
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
