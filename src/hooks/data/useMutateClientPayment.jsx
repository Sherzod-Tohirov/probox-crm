import { useMutation } from "@tanstack/react-query";
import { addClientPayment } from "@services/clientsService";

const useMutateClientPaymentModal = () => {
  return useMutation({
    mutationFn: addClientPayment,
    onError: (error) => {
      console.log("Error while adding payment in: ", error);
    },
    onSuccess: (response) => {
      if (!response?.data) return;
    },
  });
};

export default useMutateClientPaymentModal;
