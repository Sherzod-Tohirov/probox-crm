import useAlert from '@/hooks/useAlert';
import { postFileUpload, deleteFile } from '@/services/leadsService';
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

  const mutateFileDelete = useMutation({
    mutationFn: deleteFile,
    onSuccess: () => {
      alert("Hujjatlar muvaffaqiyatli o'chirildi", { type: 'success' });
    },
    onError: () => {
      alert("Hujjat o'chirishda xatolik yuz berdi", { type: 'error' });
    },
  });

  const mutateWithProgress = (
    { formData, onProgress, cancelToken },
    options = {}
  ) => {
    return mutateFileUpload.mutate(
      {
        formData,
        onUploadProgress: (evt) => {
          try {
            if (!evt?.total) return;
            const pct = Math.round((evt.loaded * 100) / evt.total);
            onProgress?.(pct);
          } catch (_) {}
        },
        cancelToken,
      },
      options
    );
  };

  return {
    mutateFileUpload,
    mutateFileDelete,
    mutateWithProgress,
  };
}
