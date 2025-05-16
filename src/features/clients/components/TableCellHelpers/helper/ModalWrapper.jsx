import { memo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { setCurrentClient } from "@store/slices/clientsPageSlice";

import useClickOutside from "@hooks/helper/useClickOutside";
import styles from "./style.module.scss";

import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  FloatingPortal,
} from "@floating-ui/react";
import { flushSync } from "react-dom";

const ModalWrapper = ({ open, setOpen, column, title, children, style }) => {
  const dispatch = useDispatch();
  const containerRef = useRef();
  const { currentClient } = useSelector((state) => state.page.clients);
  const { x, y, strategy, refs, update } = useFloating({
    placement: "top-end",
    middleware: [
      offset(10), // spacing from the button
      flip(), // flip to opposite side if not enough space
      shift({ padding: 8 }), // shift into view if near edges
    ],
    whileElementsMounted: autoUpdate,
  });

  // Sync floating when modal opens
  useEffect(() => {
    if (open) update();
  }, [open, update]);

  const handleClick = useCallback(
    (e) => {
      e.stopPropagation();
      setOpen((prev) => !prev);
    },
    [column, dispatch, setOpen]
  );

  return (
    <div
      style={style}
      className={styles["modal-wrapper"]}
      onClick={handleClick}
      ref={containerRef}>
      <div ref={refs.setReference}>{title}</div>
      <AnimatePresence>
        {open && (
          <FloatingPortal>
            <motion.div
              ref={refs.setFloating}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              style={{
                position: strategy,
                top: y ? y - 5 : 0,
                left: x ? x - 5 : 0,
                zIndex: 999999,
                pointerEvents: "auto",
              }}>
              {children}
            </motion.div>
          </FloatingPortal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default memo(ModalWrapper);
