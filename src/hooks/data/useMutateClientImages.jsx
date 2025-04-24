import { useMutation } from "@tanstack/react-query";
import {
  updateClientImages,
  deleteClientImages,
} from "@services/clientsService";

import useAlert from "@hooks/useAlert";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentClient } from "@store/slices/clientsPageSlice";
import { store } from "@store/store";
import _ from "lodash";
let timeout = null;
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
        alert("Rasm muvaffaqiyatli yuklandi !");
      },
    });
  }

  if (action === "delete") {
    return useMutation({
      mutationFn: deleteClientImages,
      onError: (error) => {
        console.log("Error while deleting images: ", error);
        alert("Rasmlarni o'chirishda xatolik yuz berdi !", { type: "error" });
      },
      onSuccess: (response) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(
          () => alert("Rasm muvaffaqiyatli o'chirildi !"),
          200
        );

        const latestResponse = store.getState().page.clients.currentClient;
        if (response && _.has(response, "imageId")) {
          const filteredImages = latestResponse?.["Images"].filter(
            (img) => img._id !== response["imageId"]
          );
          dispatch(
            setCurrentClient({ ...latestResponse, Images: filteredImages })
          );
        }
      },
    });
  }
};

export default useMutateClientImages;
