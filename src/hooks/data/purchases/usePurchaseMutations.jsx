import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  cancelPurchase,
  confirmPurchase,
  createPurchase,
  updatePurchase,
  uploadPurchasePdf,
} from '@/services/purchasesService';
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

export function useUpdatePurchase(draftStorageKey) {
  const { alert } = useAlert();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ id, data }) => updatePurchase(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['purchase']);
      alert('Xarid muvaffaqiyatli yangilandi', { type: 'success' });
      setTimeout(() => {
        if (draftStorageKey) {
          localStorage.removeItem(draftStorageKey);
        }
        navigate('/purchases');
      }, 1200);
    },
    onError: (error) => {
      console.log(error);
      alert('Xarid yangilashda xatolik', { type: 'error' });
    },
  });
}

export function useConfirmPurchase() {
  const { alert } = useAlert();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (params) => confirmPurchase(params),
    onSuccess: (response) => {
      console.log(response, 'response');
      queryClient.invalidateQueries(['purchase']);
      alert('Xarid muvaffaqiyatli tasdiqlandi', { type: 'success' });
      setTimeout(() => {
        navigate('/purchases');
      }, 1000);
    },
    onError: (error) => {
      console.log(error);
      alert('Xaridni tasdiqlashda xatolik', { type: 'error' });
    },
  });
}

export function useUploadPurchasePdf() {
  const { alert } = useAlert();

  return useMutation({
    mutationFn: (params) => uploadPurchasePdf(params),
    onSuccess: () => {
      alert('PDF yuklab olish muvaffaqiyatli', { type: 'success' });
    },
    onError: (error) => {
      console.log(error);
      alert('PDF yuklab olishda xatolik', { type: 'error' });
    },
  });
}

export function useCancelPurchase() {
  const { alert } = useAlert();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (params) => cancelPurchase(params),
    onSuccess: () => {
      queryClient.invalidateQueries(['purchase']);
      alert('Xarid bekor qilindi', { type: 'success' });
      setTimeout(() => {
        navigate('/purchases');
      }, 1000);
    },
    onError: (error) => {
      console.log(error);
      alert('Xaridni bekor qilishda xatolik', { type: 'error' });
    },
  });
}
