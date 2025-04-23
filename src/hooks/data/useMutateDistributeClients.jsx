import { useMutation, useQueryClient } from "@tanstack/react-query";
import { distributeClients } from "@services/clientsService";
import useAlert from "@hooks/useAlert";

const useMutateDistributeClients = () => {
  const { alert } = useAlert();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: distributeClients,
    onError: (error) => {
      console.log("Error while distributing clients: ", error);
      alert("Taqsimlashda xatolik yuz berdi!", { type: "error" });
    },
    onSuccess: (response) => {
      if (response) {
        alert("Muvaffaqiyatli taqsimlandi!");
        queryClient.invalidateQueries({ queryKey: ["clients"] });
      }
    },
  });
};

export default useMutateDistributeClients;
