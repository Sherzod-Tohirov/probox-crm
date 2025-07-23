import useAlert from '@hooks/useAlert';
import { useMutation } from '@tanstack/react-query';
import { updateClientAddress } from '@services/clientsService';

const useMutateClientAddress = () => {
  const { alert } = useAlert();
  return useMutation({
    mutationFn: updateClientAddress,
    onError: (error) => {
      alert("Ma'lumotlarni saqlashda muammo yuz berdi!");
      console.log('Error while updating client address: ', error);
    },
    onSuccess: (response) => {
      console.log(response, 'address update response');
      alert("Ma'lumotlar muvaffaqiyatli yangilandi!");
    },
  });
};

export default useMutateClientAddress;
