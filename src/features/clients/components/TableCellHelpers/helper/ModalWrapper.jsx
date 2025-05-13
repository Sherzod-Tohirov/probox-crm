import { memo, useRef } from "react";
import { useMemo, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { setCurrentClient } from "@store/slices/clientsPageSlice";

import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  FloatingPortal,
} from "@floating-ui/react";

const ModalWrapper = ({ open, setOpen, column, title, children }) => {
  const dispatch = useDispatch();
  const timeoutRef = useRef();

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

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    dispatch(setCurrentClient(column));
    setOpen(true);
  }, [dispatch, column, setOpen]);

  const handleMouseLeave = useCallback(
    (e) => {
      console.log(e.relatedTarget, "relatedTarget");
      if (e.relatedTarget && e.relatedTarget instanceof Window) return;
      timeoutRef.current = setTimeout(() => {
        setOpen(false);
      }, 200); // 200ms delay
    },
    [setOpen]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const wrapperStyles = useMemo(
    () => ({
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }),
    []
  );

  return (
    <div
      style={wrapperStyles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
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
