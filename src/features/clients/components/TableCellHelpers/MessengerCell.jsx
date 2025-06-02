import { useSelector } from "react-redux";
import { Button } from "@components/ui";
import MessengerModal from "@components/ui/Messenger/MessengerModal";
import useFetchMessages from "@hooks/data/clients/useFetchMessages";
import useMessengerActions from "@hooks/useMessengerActions";

import ModalWrapper from "./helper/ModalWrapper";

const MessengerCell = ({ column }) => {
  const modalId = `${column?.["DocEntry"]}-messenger-modal`;
  const isModalOpen = useSelector((state) => state.toggle.modals[modalId]);
  const { currentClient } = useSelector((state) => state.page.clients);
  const { data: messages, isLoading } = useFetchMessages({
    enabled: isModalOpen,
    docEntry: currentClient?.["DocEntry"],
    installmentId: currentClient?.["InstlmntID"],
  });

  const { sendMessage, editMessage, deleteMessage } = useMessengerActions();

  return (
    <ModalWrapper
      modalId={modalId}
      style={{ justifyContent: "center" }}
      column={column}
      title={<Button icon="messenger" variant="text" />}>
      <MessengerModal
        hasToggleControl={true}
        messages={messages || []}
        onEditMessage={editMessage}
        onDeleteMessage={deleteMessage}
        onSendMessage={sendMessage}
        isLoading={isLoading}
      />
    </ModalWrapper>
  );
};

export default MessengerCell;
