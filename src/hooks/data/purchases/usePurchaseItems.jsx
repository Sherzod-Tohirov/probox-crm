import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  updatePurchaseItem,
  deletePurchaseItem,
  createPurchase,
} from '@/services/purchasesService';
import { toast } from 'react-toastify';

export function useCreatePurchase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => createPurchase(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['purchase']);
      // toast.success("Mahsulot qo'shildi");
    },
    onError: (error) => {
      // toast.error(
      //   'Xatolik: ' + (error.message || "Mahsulot qo'shishda xatolik")
      // );
    },
  });
}

export function useUpdatePurchaseItem(contractNo) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, data }) =>
      updatePurchaseItem(contractNo, itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['purchase', contractNo]);
    },
    onError: (error) => {
      toast.error('Xatolik: ' + (error.message || 'Yangilashda xatolik'));
    },
  });
}

export function useDeletePurchaseItem(contractNo) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId) => deletePurchaseItem(contractNo, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries(['purchase', contractNo]);
      toast.success("Mahsulot o'chirildi");
    },
    onError: (error) => {
      toast.error('Xatolik: ' + (error.message || "O'chirishda xatolik"));
    },
  });
}
