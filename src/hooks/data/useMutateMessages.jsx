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

  const postMutation = useMutation({
    mutationFn: (data) =>
      postMessage(data, { entityType, entityId, docEntry, installmentId }),
    onError: (error) => {
      console.log('Error while posting message: ', error);
    },
    onSuccess: () => {
      invalidateMessages();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) =>
      putMessage(
        data.id ?? data._id,
        { Comments: data.Comments, message: data.message },
        { entityType }
      ),
    onError: (error) => {
      console.log('Error while updating message: ', error);
    },
    onSuccess: () => {
      invalidateMessages();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteMessage(id, { entityType }),
    onMutate: async (id) => {
      // Cancel any in-flight refetches so they don't overwrite the optimistic update
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the current cache value for rollback on error
      const previousData = queryClient.getQueryData(queryKey);

      // Optimistically remove the message from all pages in the infinite query cache
      queryClient.setQueryData(queryKey, (old) => {
        if (!old?.pages) return old;
        return {
          ...old,
          pages: old.pages.map((page) => {
            if (!page) return page;
            // Lead pages: { data: [...], page, totalPages, ... }
            if (Array.isArray(page.data)) {
              return { ...page, data: page.data.filter((m) => m?._id !== id) };
            }
            // Client pages: flat array
            if (Array.isArray(page)) {
              return page.filter((m) => m?._id !== id);
            }
            return page;
          }),
        };
      });

      return { previousData };
    },
    onError: (error, _id, context) => {
      console.log('Error while deleting message: ', error);
      // Restore previous cache on failure
      if (context?.previousData !== undefined) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },
    onSuccess: () => {
      // Refetch to confirm server state after successful delete
      queryClient.invalidateQueries({ queryKey });
    },
  });

  if (action === 'post') return postMutation;
  if (action === 'update') return updateMutation;
  if (action === 'delete') return deleteMutation;
};

export default useMutateMessages;
