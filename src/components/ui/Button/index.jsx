import { OrbitProgress } from "react-loading-indicators";
import { motion } from "framer-motion";
import { forwardRef, memo } from "react";

import styles from "./button.module.scss";
import iconsMap from "@utils/iconsMap";
import classNames from "classnames";

import Typography from "../Typography";
import Box from "../Box";

function Button(
  {
    children,
    className,
    variant = "filled",
    color,
    icon,
    iconPosition = "left",
    iconSize = 24,
    iconColor,
    isLoading = false,
    fullWidth = false,
    disabled = false,
    ...props
  },
  ref
) {
  return (
    <motion.button
      ref={ref}
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
          <Typography
            element="span"
            className={classNames(
              styles["icon-text"],
              styles[`icon-size-${iconSize}px`]
            )}>
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

export default memo(forwardRef(Button));
