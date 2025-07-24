import useAlert from '@hooks/useAlert';
import { useMutation } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { updateClientAddress } from '@services/clientsService';
import { setCurrentClient } from '@store/slices/clientsPageSlice';

const useMutateClientAddress = () => {
  const { alert } = useAlert();
  const dispatch = useDispatch();
  const currentClient = useSelector(
    (state) => state.page.clients.currentClient
  );
  return useMutation({
    mutationFn: updateClientAddress,
    onError: (error) => {
      alert("Manzil ma'lumotlarini saqlashda muammo yuz berdi!");
      console.log('Error while updating client address: ', error);
    },
    onSuccess: (response) => {
      if (response.data && response.data.lat && response.data.long) {
        dispatch(
          setCurrentClient({
            ...currentClient,
            location: { lat: response.data.lat, long: response.data.long },
          })
        );
      }
      console.log(response, 'address update response');
    },
  });
};

export default useMutateClientAddress;
