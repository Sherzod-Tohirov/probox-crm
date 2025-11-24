import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  deleteMessage,
  postMessage,
  putMessage,
} from '@services/messengerService';

/**
 * Dynamic hook to mutate messages for both clients and leads
 * @param {string} action - 'post', 'update', or 'delete'
 * @param {Object} options - Configuration options
 * @param {string} options.entityType - 'client' or 'lead'
 * @param {string} options.entityId - Lead ID (for leads)
 * @param {string} options.docEntry - Doc entry (for clients)
 * @param {string} options.installmentId - Installment ID (for clients)
 */
const useMutateMessages = (action, options = {}) => {
  const queryClient = useQueryClient();
  const { entityType = 'client', entityId, docEntry, installmentId } = options;

  // Build query key based on entity type
  const queryKey =
    entityType === 'lead'
      ? ['messages', 'lead', entityId]
      : ['messages', 'client', docEntry, installmentId];
      
  const invalidateMessages = () => {
    queryClient.invalidateQueries({ queryKey });
  };

  if (action === 'post') {
    return useMutation({
      mutationFn: (data) => {
        console.log(data, 'data inside mutation');
        return postMessage(data, {
          entityType,
          entityId,
          docEntry,
          installmentId,
        });
      },
      onError: (error) => {
        console.log('Error while posting message: ', error);
      },
      onSuccess: (response) => {
        invalidateMessages();
      },
    });
  }

  if (action === 'update') {
    return useMutation({
      mutationFn: (data) =>
        putMessage(
          data.id ?? data._id,
          { Comments: data.Comments, message: data.message },
          { entityType }
        ),
      onError: (error) => {
        console.log('Error while updating message: ', error);
      },
      onSuccess: (response) => {
        invalidateMessages();
      },
    });
  }

  if (action === 'delete') {
    return useMutation({
      mutationFn: (id) => deleteMessage(id, { entityType }),
      onError: (error) => {
        console.log('Error while deleting message: ', error);
      },
      onSuccess: (response) => {
        invalidateMessages();
      },
    });
  }
};

export default useMutateMessages;
