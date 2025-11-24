import { useCallback } from 'react';
import useMutateMessages from '@hooks/data/useMutateMessages';

/**
 * Dynamic hook for messenger actions
 * @param {Object} options - Configuration options
 * @param {string} options.entityType - 'client' or 'lead'
 * @param {string} options.entityId - Lead ID (for leads)
 * @param {string} options.docEntry - Doc entry (for clients)
 * @param {string} options.installmentId - Installment ID (for clients)
 */
const useMessengerActions = (options = {}) => {
  const { entityType = 'client' } = options;

  const postMessageMutation = useMutateMessages('post', options);
  const deleteMessageMutation = useMutateMessages('delete', options);
  const updateMessageMutation = useMutateMessages('update', options);

  const sendMessage = useCallback(
    async (data) => {
      try {
        // For leads: only text messages
        if (entityType === 'lead') {
          const payload = {
            Comments: data.msgText || data.message || data.Comments,
          };
          await postMessageMutation.mutateAsync(payload);
          return;
        }

        // For clients: support files and audio
        const files = new FormData();
        if (data.msgAudio) {
          const audioFile = new File([data.msgAudio], 'audio.mp3', {
            type: 'audio/webm',
          });
          files.append('audio', audioFile);
          files.append('audioDuration', data.msgAudio.duration);
        }

        if (!files.has('audio') && data.msgPhoto && data.msgPhoto.length > 0) {
          for (let i = 0; i < data.msgPhoto.length; i++) {
            const file = data.msgPhoto[i];
            files.append('image', data.msgPhoto[i]);
          }
        }

        const payload = data.msgText
          ? {
              Comments: data.msgText ?? null,
            }
          : null;
        await postMessageMutation.mutateAsync(payload ?? files);
      } catch (error) {
        console.log(error);
      }
    },
    [entityType, postMessageMutation]
  );

  const deleteMessage = useCallback(
    async (id) => {
      try {
        await deleteMessageMutation.mutateAsync(id);
      } catch (error) {
        console.log(error);
      }
    },
    [deleteMessageMutation]
  );

  const editMessage = useCallback(
    async (id, data) => {
      try {
        const payload =
          entityType === 'lead'
            ? { id, Comments: data.message || data.Comments || data.msgText }
            : { id, ...data };
        await updateMessageMutation.mutateAsync(payload);
      } catch (error) {
        console.log(error);
      }
    },
    [entityType, updateMessageMutation]
  );

  return { sendMessage, deleteMessage, editMessage };
};

export default useMessengerActions;
