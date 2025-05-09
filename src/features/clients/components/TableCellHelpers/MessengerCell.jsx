import { useMemo, useState, useCallback, useEffect } from "react";
import { Button } from "@components/ui";
import { AnimatePresence, motion } from "framer-motion";
import MessengerModal from "@components/ui/Messenger/MessengerModal";
import useFetchMessages from "@hooks/data/useFetchMessages";
import useMessengerActions from "@hooks/useMessengerActions";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentClient } from "@store/slices/clientsPageSlice";

import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  FloatingPortal,
} from "@floating-ui/react";

const MessengerCell = ({ column }) => {
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const { currentClient } = useSelector((state) => state.page.clients);

  const { data: messages, isLoading } = useFetchMessages({
    enabled: showModal,
    docEntry: currentClient?.["DocEntry"],
    installmentId: currentClient?.["InstlmntID"],
  });

  const { sendMessage, editMessage, deleteMessage } = useMessengerActions();
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
    if (showModal) update();
  }, [showModal, update]);

  const handleMouseEnter = useCallback(() => {
    dispatch(setCurrentClient(column));
    setShowModal(true);
  }, [dispatch, column]);

  const handleMouseLeave = useCallback(() => {
    setShowModal(false);
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
      <Button ref={refs.setReference} icon="messenger" variant="text" />
      <AnimatePresence>
        {showModal && (
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
              <MessengerModal
                messages={messages || []}
                onEditMessage={editMessage}
                onDeleteMessage={deleteMessage}
                onSendMessage={sendMessage}
                isLoading={isLoading}
              />
            </motion.div>
          </FloatingPortal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MessengerCell;
