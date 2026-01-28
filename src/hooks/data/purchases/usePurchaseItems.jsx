import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPurchase } from '@/services/purchasesService';
import useAlert from '@/hooks/useAlert';
import { useNavigate } from 'react-router-dom';

export function useCreatePurchase(NEW_PURCHASE_STORAGE_KEY) {
  const { alert } = useAlert();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data) => createPurchase(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['purchase']);
      alert('Xarid qo`shildi', { type: 'success' });
      setTimeout(() => {
        localStorage.removeItem(NEW_PURCHASE_STORAGE_KEY);
        navigate('/purchases');
      }, 1200);
    },
    onError: (error) => {
      console.log(error);
      alert('Xarid qo`shishda xatolik', { type: 'error' });
    },
  });
}
