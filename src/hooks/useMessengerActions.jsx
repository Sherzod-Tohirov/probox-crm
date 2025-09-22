import { useCallback } from 'react';
import useMutateMessages from '@hooks/data/clients/useMutateMessages';

const useMessengerActions = () => {
  const postMessageMutation = useMutateMessages('post');
  const deleteMessageMutation = useMutateMessages('delete');
  const updateMessageMutation = useMutateMessages('update');

  const sendMessage = useCallback(async (data) => {
    try {
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
  }, []);

  const deleteMessage = useCallback(async (id) => {
    try {
      await deleteMessageMutation.mutateAsync(id);
    } catch (error) {
      console.log(error);
    }
  }, []);
  const editMessage = useCallback(async (id, data) => {
    try {
      await updateMessageMutation.mutateAsync({ id, ...data });
    } catch (error) {
      console.log(error);
    }
  }, []);

  return { sendMessage, deleteMessage, editMessage };
};

export default useMessengerActions;
