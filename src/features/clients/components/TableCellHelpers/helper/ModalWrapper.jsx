import { memo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { setCurrentClient } from "@store/slices/clientsPageSlice";
import _ from "lodash";
import styles from "./style.module.scss";

import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  FloatingPortal,
} from "@floating-ui/react";
import classNames from "classnames";
import { toggleModal } from "@store/slices/toggleSlice";

const ModalWrapper = ({ modalId, column, title, children, style }) => {
  const dispatch = useDispatch();
  const containerRef = useRef(null);
  const isModalOpen = useSelector((state) => state.toggle.modals?.[modalId]);
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
    if (isModalOpen) update();
  }, [isModalOpen, update]);

  const handleClick = useCallback(
    (e) => {
      e.stopPropagation();
      dispatch(setCurrentClient(column));
      dispatch(toggleModal(modalId));
    },
    [column, dispatch, modalId]
  );

  return (
    <div
      id={modalId}
      style={style}
      className={classNames(styles["modal-wrapper"], "cell-modal")}
      onClick={handleClick}
      ref={containerRef}>
      <div ref={refs.setReference}>{title}</div>
      <AnimatePresence>
        {isModalOpen && (
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
