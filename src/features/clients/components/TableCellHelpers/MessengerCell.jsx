import { useSelector } from 'react-redux';
import { Button } from '@components/ui';
import MessengerModal from '@components/ui/Messenger/MessengerModal';
import useFetchMessages from '@hooks/data/clients/useFetchMessages';
import useMessengerActions from '@hooks/useMessengerActions';

import ModalWrapper from './helper/ModalWrapper';

const MessengerCell = ({ column }) => {
  const modalId = `${column?.['DocEntry']}-${column?.InstlmntID}-messenger-modal`;
  const isModalOpen = useSelector((state) => state.toggle.modals[modalId]);
  const docEntry = column?.['DocEntry'];
  const installmentId = column?.['InstlmntID'];
  const { data: messages, isLoading } = useFetchMessages({
    enabled: isModalOpen,
    docEntry,
    installmentId,
  });

  const { sendMessage, editMessage, deleteMessage } = useMessengerActions({
    entityType: 'client',
    docEntry,
    installmentId,
  });

  return (
    <ModalWrapper
      modalId={modalId}
      style={{ justifyContent: 'center' }}
      column={column}
      title={<Button icon="messenger" variant="text" />}
    >
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
