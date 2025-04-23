import { useMutation } from "@tanstack/react-query";
import { updateClientExecutor } from "@services/clientsService";
import { setCurrentClient } from "@store/slices/clientsPageSlice";
import useAlert from "@hooks/useAlert";
import { useDispatch, useSelector } from "react-redux";

const useMutateClientPageForm = () => {
  const { alert } = useAlert();
  const dispatch = useDispatch();
  const currentClient = useSelector(
    (state) => state.page.clients.currentClient
  );
  return useMutation({
    mutationFn: updateClientExecutor,
    onError: (error) => {
      console.log("Error while updating client executor: ", error);
    },
    onSuccess: (response) => {
      if (response?.slpCode) {
        dispatch(
          setCurrentClient({
            ...currentClient,
            SlpCode: Number(response.slpCode),
          })
        );
      }
      alert("Ma'lumotlar muvaffaqiyatli yangilandi!");
    },
  });
};

export default useMutateClientPageForm;
