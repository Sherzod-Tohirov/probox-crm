import { useMemo, useState, useRef, useEffect } from "react";

import { Button } from "@components/ui";

import { AnimatePresence, motion } from "framer-motion";
import MessengerModal from "@components/ui/Messenger/MessengerModal";
import useFetchMessages from "@hooks/data/useFetchMessages";
import useMessengerActions from "@hooks/useMessengerActions";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentClient } from "@store/slices/clientsPageSlice";

const MessengerCell = ({ column }) => {
  const [showModal, setShowModal] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const { currentClient } = useSelector((state) => state.page.clients);

  const buttonRef = useRef(null);
  const modalRef = useRef(null);
  const enterTimer = useRef(null);
  const leaveTimer = useRef(null);

  const dispatch = useDispatch();
  const { data: messages, isLoading } = useFetchMessages({
    enabled: showModal,
    docEntry: currentClient?.["DocEntry"],
    installmentId: currentClient?.["InstlmntID"],
  });

  const { send } = useMessengerActions();

  // Calculate modal position
  const calculateModalPosition = () => {
    if (!buttonRef.current) return { top: 0, left: 0 };

    const boundaries = buttonRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const modalHeight = modalRef.current?.offsetHeight || 300; // Estimate or measure modal height
    const scrollY = window.scrollY;

    // Vertical position: below the button by default
    let top = boundaries.bottom + scrollY + 10; // 10px offset below button

    // Adjust if modal would overflow bottom of viewport
    const spaceBelow = windowHeight - boundaries.bottom;
    if (spaceBelow < modalHeight && boundaries.top > modalHeight) {
      // Show above button if there's not enough space below but enough above
      top = boundaries.top + scrollY - modalHeight - 10; // 10px above button
    }

    // Horizontal position: align modal's right edge near button's left edge
    const modalWidth = modalRef.current?.offsetWidth || 300; // Estimate or measure modal width
    let left = boundaries.left - modalWidth - 10; // 10px offset to the left of button

    // Prevent modal from overflowing left edge
    const minLeft = 10; // Minimum margin from left edge
    left = Math.max(minLeft, left);

    return { top, left };
  };

  // Update position on mouse enter
  const handleMouseEnter = () => {
    clearTimeout(leaveTimer.current); // Cancel pending close
    setPosition(calculateModalPosition());
    enterTimer.current = setTimeout(() => {
      dispatch(setCurrentClient(column));
      setShowModal(true);
    }, 100); // Delay open
  };

  // Close modal on mouse leave
  const handleMouseLeave = () => {
    clearTimeout(enterTimer.current); // Cancel pending open
    leaveTimer.current = setTimeout(() => {
      setShowModal(false);
    }, 300); // Delay close
  };

  // Update position on scroll or resize when modal is open
  useEffect(() => {
    if (!showModal) return;

    const handleScrollOrResize = () => {
      setPosition(calculateModalPosition());
    };

    // Debounce scroll and resize events
    let timeout;
    const debouncedUpdate = () => {
      clearTimeout(timeout);
      timeout = setTimeout(handleScrollOrResize, 50);
    };

    window.addEventListener("scroll", debouncedUpdate);
    window.addEventListener("resize", debouncedUpdate);

    // Initial position update
    handleScrollOrResize();

    return () => {
      window.removeEventListener("scroll", debouncedUpdate);
      window.removeEventListener("resize", debouncedUpdate);
      clearTimeout(timeout);
    };
  }, [showModal]);

  const wrapperStyles = useMemo(
    () => ({
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }),
    []
  );

  return (
    <motion.div
      style={wrapperStyles}
      id="messenger-modal"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      <Button ref={buttonRef} icon="messenger" variant="text" />
      <AnimatePresence>
        {showModal && (
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.1 }}
            style={{
              position: "fixed",
              top: position.top,
              left: position.left,
              zIndex: 99999999,
              pointerEvents: "auto",
            }}>
            <MessengerModal
              messages={messages || []}
              onSendMessage={send}
              isLoading={isLoading}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MessengerCell;
