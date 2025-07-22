import { useMutation } from '@tanstack/react-query';
import { useSelector } from 'react-redux';

import {
  deleteMessage,
  postMessage,
  putMessage,
} from '@services/messengerService';
import { useQueryClient } from '@tanstack/react-query';

const invalidateMessages = (queryClient, currentClient) => {
  queryClient.invalidateQueries({
    queryKey: [
      'messages',
      currentClient?.['DocEntry'],
      currentClient?.['InstlmntID'],
    ],
  });
};
const useMutateMessages = (action) => {
  const queryClient = useQueryClient();
  const currentClient = useSelector(
    (state) => state.page.clients.currentClient
  );

  if (action === 'post') {
    return useMutation({
      mutationFn: (data) => {
        console.log(data, 'data inside mutation');
        return postMessage(data, {
          docEntry: currentClient?.['DocEntry'],
          installmentId: currentClient?.['InstlmntID'],
        });
      },
      onError: (error) => {
        console.log('Error while posting message: ', error);
      },
      onSuccess: (response) => {
        invalidateMessages(queryClient, currentClient);
      },
    });
  }

  if (action === 'update') {
    return useMutation({
      mutationFn: (data) =>
        putMessage(data.id ?? data._id, { Comments: data.Comments }),
      onError: (error) => {
        console.log('Error while updating message: ', error);
      },
      onSuccess: (response) => {
        invalidateMessages(queryClient, currentClient);
      },
    });
  }

  if (action === 'delete') {
    return useMutation({
      mutationFn: (id) => deleteMessage(id),
      onError: (error) => {
        console.log('Error while deleting message: ', error);
      },
      onSuccess: (response) => {
        invalidateMessages(queryClient, currentClient);
      },
    });
  }
};

export default useMutateMessages;
