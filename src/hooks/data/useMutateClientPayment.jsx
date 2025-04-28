import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addClientPayment } from "@services/clientsService";
import useAlert from "@hooks/useAlert";

const useMutateClientPaymentModal = (props = {}) => {
  const queryClient = useQueryClient();
  const { alert } = useAlert();
  return useMutation({
    mutationFn: addClientPayment,
    onError: (error) => {
      alert("To'lovni amalga oshirishda muammo yuz berdi!", {
        type: "error",
      });
      console.log("Error while adding payment in: ", error);
    },
    onSuccess: (response) => {
      if (response) {
        alert("To'lov muvaffaqiyatli amalga oshirildi!");
        if (props?.onSuccess) {
          props.onSuccess(response);
        }
      }
      queryClient.invalidateQueries("clientEntries", {
        exact: true,
        refetchActive: true,
        refetchInactive: true,
      });
    },
  });
};

export default useMutateClientPaymentModal;
