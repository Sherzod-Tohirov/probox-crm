import { useCallback } from "react";
import useMutateMessages from "@hooks/data/useMutateMessages";

const useMessengerActions = () => {
  const postMessageMutation = useMutateMessages("post");

  const send = useCallback(async (data) => {
    try {
      const payload = { Comments: data.msgText };
      await postMessageMutation.mutateAsync(payload);
    } catch (error) {
      console.log(error);
    }
  }, []);
  return { send };
};

export default useMessengerActions;
