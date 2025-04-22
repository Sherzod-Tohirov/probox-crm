import { useMutation } from "@tanstack/react-query";
import {
  updateClientImages,
  deleteClientImages,
} from "@services/clientsService";

import useAlert from "@hooks/useAlert";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentClient } from "@store/slices/clientsPageSlice";
const useMutateClientImages = (action) => {
  const { alert } = useAlert();
  const dispatch = useDispatch();
  const currentClient = useSelector(
    (state) => state.page.clients.currentClient
  );
  if (action === "update") {
    return useMutation({
      mutationFn: updateClientImages,
      onError: (error) => {
        console.log("Error while updating client images: ", error);
        alert("Rasmlarni yuklashda xatolik yuz berdi !", { type: "error" });
      },
      onSuccess: (response) => {
        console.log(response, "response");
        if (response && response?.images?.length > 0) {
          dispatch(
            setCurrentClient({
              ...currentClient,
              Images: [...currentClient?.["Images"], ...response.images],
            })
          );
        }
        alert("Rasmlar muvaffaqiyatli yuklandi !");
      },
    });
  }

  if (action === "delete") {
    return useMutation({
      mutationFn: deleteClientImages,
      onError: (error) => {
        console.log("Error while adding payment in: ", error);
        alert("Rasmlarni o'chirishda xatolik yuz berdi !", { type: "error" });
      },
      onSuccess: (response) => {
        if (!response?.data) return;
        alert("Rasmlar muvaffaqiyatli o'chirildi !");
      },
    });
  }
};

export default useMutateClientImages;
