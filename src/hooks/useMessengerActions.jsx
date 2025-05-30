import { useCallback } from "react";
import useMutateMessages from "@hooks/data/clients/useMutateMessages";

const useMessengerActions = () => {
  const postMessageMutation = useMutateMessages("post");
  const deleteMessageMutation = useMutateMessages("delete");
  const updateMessageMutation = useMutateMessages("update");

  const sendMessage = useCallback(async (data) => {
    try {
      const payload = { Comments: data.msgText };
      await postMessageMutation.mutateAsync(payload);
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
