import { AnimatePresence, motion } from "framer-motion";
import styles from "./modal.module.scss";
import { createPortal } from "react-dom";
import Typography from "../Typography";
import Button from "../Button";
import { useEffect } from "react";
import classNames from "classnames";

export default function Modal({
  isOpen = false,
  onClose = () => "",
  title,
  footer,
  children,
  size = "md",
}) {
  // Prevent background scrolling
  //   useEffect(() => {
  //     if (isOpen) document.body.style.overflow = "hidden";
  //     else document.body.style.overflow = "auto";
  //     return () => {
  //       document.body.style.overflow = "auto";
  //     };
  //   }, [isOpen]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeydown = (event) => {
      if (event.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <motion.div
      className={styles["modal-overlay"]}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}>
      <AnimatePresence>
        <motion.div
          className={classNames(styles["modal"], size)}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}>
          <div className={styles["modal-header"]}>
            {title ? (
              <Typography className={styles["modal-title"]} element="h3">
                {title}
              </Typography>
            ) : (
              ""
            )}
            <Button
              className={styles["modal-close-btn"]}
              variant="text"
              icon={"close"}
              onClick={onClose}></Button>
          </div>
          <div className={styles["modal-body"]}>{children}</div>
          {footer ? <div className={styles["modal-footer"]}>{footer}</div> : ""}
        </motion.div>
      </AnimatePresence>
    </motion.div>,
    document.body
  );
}
