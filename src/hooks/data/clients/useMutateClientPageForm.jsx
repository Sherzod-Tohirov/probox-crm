import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateClientExecutor } from "@services/clientsService";
import { setCurrentClient } from "@store/slices/clientsPageSlice";
import useAlert from "@hooks/useAlert";
import { useDispatch, useSelector } from "react-redux";

const useMutateClientPageForm = () => {
  const { alert } = useAlert();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const currentClient = useSelector(
    (state) => state.page.clients.currentClient
  );
  return useMutation({
    mutationFn: updateClientExecutor,
    onError: (error) => {
      console.log("Error while updating client executor: ", error);
    },
    onSuccess: (response) => {
      dispatch(
        setCurrentClient({
          ...currentClient,
          ...(response?.slpCode ? { SlpCode: Number(response.slpCode) } : {}),
          ...(response?.Phone1 ? { Phone1: response.Phone1 } : {}),
          ...(response?.Phone2 ? { Phone2: response.Phone2 } : {}),
          ...(response?.newDueDate ? { NewDueDate: response.newDueDate } : {}),
        })
      );
      // Invalidate clients list query to refresh data when navigating back
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      alert("Ma'lumotlar muvaffaqiyatli yangilandi!");
    },
  });
};

export default useMutateClientPageForm;
