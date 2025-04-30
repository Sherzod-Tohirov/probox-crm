import { useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import {
  deleteMessage,
  postMessage,
  putMessage,
} from "@services/messengerService";
import { useQueryClient } from "@tanstack/react-query";
const useMutateMessages = (action) => {
  const queryClient = useQueryClient();
  const currentClient = useSelector(
    (state) => state.page.clients.currentClient
  );

  if (action === "post") {
    return useMutation({
      mutationFn: (data) =>
        postMessage(data, {
          docEntry: currentClient?.["DocEntry"],
          installmentId: currentClient?.["InstlmntID"],
        }),
      onError: (error) => {
        console.log("Error while posting message: ", error);
      },
      onSuccess: (response) => {
        queryClient.invalidateQueries({
          queryKey: [
            "messages",
            currentClient?.["DocEntry"],
            currentClient?.["InstlmntID"],
          ],
        });
      },
    });
  }

  if (action === "update") {
    return useMutation({
      mutationFn: (data) => putMessage(data.id, { Comments: data.Comments }),
    });
  }

  if (action === "delete") {
    return useMutation({
      mutationFn: (data) => deleteMessage(data.id),
    });
  }
};

export default useMutateMessages;
