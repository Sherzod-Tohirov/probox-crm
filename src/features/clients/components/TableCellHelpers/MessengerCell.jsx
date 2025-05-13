import { useSelector } from "react-redux";
import { useState } from "react";
import { Button } from "@components/ui";
import MessengerModal from "@components/ui/Messenger/MessengerModal";
import useFetchMessages from "@hooks/data/useFetchMessages";
import useMessengerActions from "@hooks/useMessengerActions";

import ModalWrapper from "./helper/ModalWrapper";

const MessengerCell = ({ column }) => {
  const [open, setOpen] = useState(false);
  const { currentClient } = useSelector((state) => state.page.clients);

  const { data: messages, isLoading } = useFetchMessages({
    enabled: open,
    docEntry: currentClient?.["DocEntry"],
    installmentId: currentClient?.["InstlmntID"],
  });

  const { sendMessage, editMessage, deleteMessage } = useMessengerActions();

  return (
    <ModalWrapper
      open={open}
      setOpen={setOpen}
      column={column}
      title={<Button icon="messenger" variant="text" />}>
      <MessengerModal
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
