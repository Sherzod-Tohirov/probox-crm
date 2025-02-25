import { AnimatePresence, motion } from "framer-motion";
import styles from "./modal.module.scss";
import { createPortal } from "react-dom";
import Typography from "../Typography";
import Button from "../Button";
import { forwardRef, memo, useCallback, useEffect } from "react";
import classNames from "classnames";

const Modal = forwardRef(function Modal(
  {
    isOpen = false,
    onClose = () => "",
    title,
    footer,
    preventScroll = false,
    children,
    size = "md",
  },
  ref
) {
  // Prevent background scrolling
  useEffect(() => {
    if (preventScroll) {
      if (isOpen) document.body.style.overflow = "hidden";
      else document.body.style.overflow = "auto";
      return () => {
        document.body.style.overflow = "auto";
      };
    }
  }, [isOpen, preventScroll]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeydown = (event) => {
      if (event.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [isOpen, onClose]);

  const handleOverlayClick = useCallback(
    (event) => {
      if (event.target === event.currentTarget) onClose();
    },
    [onClose]
  );

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className={styles["modal-overlay"]}
          onClick={handleOverlayClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}>
          <motion.div
            ref={ref}
            className={classNames(styles["modal"], size)}
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 25,
              },
            }}
            exit={{
              opacity: 0,
              y: 50,
              scale: 0.95,
              transition: {
                duration: 0.2,
              },
            }}
            onClick={(e) => e.stopPropagation()}>
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
                onClick={onClose}
              />
            </div>
            <div className={styles["modal-body"]}>{children}</div>
            {footer ? (
              <div className={styles["modal-footer"]}>{footer}</div>
            ) : (
              ""
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
});

Modal.displayName = "Modal";

export default memo(Modal);
