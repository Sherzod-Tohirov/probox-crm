import { memo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { setCurrentClient } from '@store/slices/clientsPageSlice';
import _ from 'lodash';
import styles from './style.module.scss';

import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  FloatingPortal,
} from '@floating-ui/react';
import classNames from 'classnames';
import { toggleModal } from '@store/slices/toggleSlice';

const ModalWrapper = ({
  modalId,
  column,
  title,
  children,
  style,
  allowClick = false,
}) => {
  const dispatch = useDispatch();
  const containerRef = useRef(null);
  const floatingRef = useRef(null);
  const isModalOpen = useSelector((state) => state.toggle.modals?.[modalId]);
  const { x, y, strategy, refs, update } = useFloating({
    placement: 'top-end',
    middleware: [
      offset(10), // spacing from the button
      flip(), // flip to opposite side if not enough space
      shift({ padding: 8 }), // shift into view if near edges
    ],
    whileElementsMounted: autoUpdate,
  });
  const handleClickOutside = useCallback(
    (event) => {
      if (!isModalOpen) return;

      const isClickInsideContainer = containerRef.current?.contains(
        event.target
      );
      const isClickInsideFloating = floatingRef.current?.contains(event.target);

      // Check for common UI overlay elements
      const isClickInsidePopover =
        event.target.closest('.flatpickr-calendar') || // Flatpickr calendar
        event.target.closest('.select__menu') || // React-select menu
        event.target.closest('[role="listbox"]') || // Generic listbox (dropdowns)
        event.target.closest('[role="dialog"]') || // Generic dialogs
        event.target.closest('[role="tooltip"]'); // Tooltips

      if (
        !isClickInsideContainer &&
        !isClickInsideFloating &&
        !isClickInsidePopover
      ) {
        dispatch(toggleModal(modalId));
      }
    },
    [isModalOpen, modalId, dispatch]
  );

  useEffect(() => {
    // Only add the listener when the modal is open
    if (isModalOpen) {
      // Use capture phase to handle clicks before they reach other elements
      document.addEventListener('mousedown', handleClickOutside, true);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside, true);
      };
    }
  }, [isModalOpen, handleClickOutside]);

  // Sync floating when modal opens
  useEffect(() => {
    if (isModalOpen) update();
  }, [isModalOpen, update]);

  const handleClick = useCallback(
    (e) => {
      if (!allowClick) {
        e.stopPropagation();
        dispatch(setCurrentClient(column));
        setTimeout(() => {
          dispatch(toggleModal(modalId));
        }, 0);
      }
    },
    [column, dispatch, modalId]
  );

  return (
    <div
      id={modalId}
      style={style}
      className={classNames(styles['modal-wrapper'], 'cell-modal')}
      onClick={handleClick}
      ref={containerRef}
    >
      <div ref={refs.setReference}>{title}</div>
      <AnimatePresence>
        {isModalOpen && (
          <FloatingPortal>
            <motion.div
              ref={(el) => {
                refs.setFloating(el);
                floatingRef.current = el;
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              style={{
                position: strategy,
                top: y ? y - 5 : 0,
                left: x ? x - 5 : 0,
                zIndex: 999999,
                pointerEvents: 'auto',
              }}
            >
              {children}
            </motion.div>
          </FloatingPortal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default memo(ModalWrapper);
