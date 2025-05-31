import useAlert from "@hooks/useAlert";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePartialPayment } from "@services/clientsService";

const useMutatePartialPayment = () => {
  const { alert } = useAlert();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePartialPayment,
    onError: (error) => {
      console.log("Error while updating partial payment: ", error);
      alert("Qisman to'lovda xatolik yuz berdi!", { type: "error" });
    },
    onSuccess: (response) => {
      if (response) {
        queryClient.invalidateQueries({ queryKey: ["clients"] });
        queryClient.invalidateQueries({ queryKey: ["statistics"] });
      }
    },
  });
};

export default useMutatePartialPayment;
