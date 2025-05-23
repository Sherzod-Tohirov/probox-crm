import useAlert from "@hooks/useAlert";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePhoneConfiscated } from "@services/clientsService";

const useMutatePhoneConfiscated = () => {
  const { alert } = useAlert();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePhoneConfiscated,
    onError: (error) => {
      console.log("Error while phone confiscating: ", error);
      alert("Mahsulot tanlashda xatolik yuz berdi!", { type: "error" });
    },
    onSuccess: (response) => {
      if (response) {
        console.log("accepted!");
        queryClient.invalidateQueries({ queryKey: ["clients"] });
        queryClient.invalidateQueries({ queryKey: ["statistics"] });
      }
    },
  });
};

export default useMutatePhoneConfiscated;
