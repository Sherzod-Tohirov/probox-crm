import useAlert from '@/hooks/useAlert';
import { postFileUpload } from '@/services/leadsService';
import { useMutation } from '@tanstack/react-query';

export function useMutateFileUpload() {
  const { alert } = useAlert();
  const mutateFileUpload = useMutation({
    mutationFn: postFileUpload,
    onSuccess: () => {
      alert('Hujjatlar muvaffaqiyatli yuklandi', { type: 'success' });
    },
    onError: () => {
      alert('Hujjat yuklashda xatolik yuz berdi', { type: 'error' });
    },
  });

  return {
    mutateFileUpload,
  };
}
