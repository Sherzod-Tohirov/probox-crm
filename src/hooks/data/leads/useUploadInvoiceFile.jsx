import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAlert from '@/hooks/useAlert';
import { uploadInvoiceFile } from '@/services/invoiceService';

/**
 * Invoice PDF (yoki boshqa fayl) ni `/lead-images/upload` endpointiga yuborish hook'i
 *
 * Foydalanish:
 * const uploadMutation = useUploadInvoiceFile();
 * uploadMutation.mutate({ file, leadId });
 */
export default function useUploadInvoiceFile(options = {}) {
  const { alert } = useAlert();
  const queryClient = useQueryClient();

  // Store external onSuccess callback
  const externalOnSuccess = options.onSuccess;

  return useMutation({
    mutationFn: uploadInvoiceFile,
    onSuccess: async (data, variables, context) => {
      const { leadId } = variables;
      
      // Helper function to extract images array from response
      const extractImages = (payload) => {
        if (!payload) return [];
        if (Array.isArray(payload)) return payload;
        if (Array.isArray(payload?.images)) return payload.images;
        // Handle singular 'image' field (PDF upload response)
        if (payload?.image && typeof payload.image === 'object') {
          return [payload.image];
        }
        if (Array.isArray(payload?.data)) return payload.data;
        return [];
      };
      
      // Update cache with new file
      if (leadId && data) {
        const key = ['lead-files', leadId];
        const newImages = extractImages(data);
        
        if (newImages.length > 0) {
          queryClient.setQueryData(key, (prev) => {
            const prevImages = extractImages(prev);
            
            const prevKeys = new Set(
              prevImages.map((it) => String(it._id || it.id || it.key || ''))
            );
            
            // Filter out duplicates
            const uniqueNewImages = newImages.filter(
              (it) => {
                const itId = String(it._id || it.id || it.key || '');
                return !prevKeys.has(itId);
              }
            );
            
            const merged = [...uniqueNewImages, ...prevImages];
            
            // Deduplicate
            const seen = new Set();
            const deduped = [];
            for (const it of merged) {
              const keyRaw = it._id || it.id || it.key || '';
              const keyStr = String(keyRaw);
              if (keyStr && !seen.has(keyStr)) {
                seen.add(keyStr);
                deduped.push(it);
              }
            }
            
            // Always return object structure with status and images
            // This matches the server response format: { status: true, images: [...] }
            if (Array.isArray(prev)) {
              return { status: true, images: deduped };
            }
            // Preserve status from previous data or set to true
            return { 
              ...prev, 
              status: prev?.status ?? true, 
              images: deduped 
            };
          });
        }
        
        // Invalidate queries - bu avtomatik refetch qiladi
        queryClient.invalidateQueries({ queryKey: key });
      }
      
      // Call external onSuccess callback if provided
      if (typeof externalOnSuccess === 'function') {
        externalOnSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      const message =
        error?.message ||
        error?.response?.data?.message ||
        'Invoice fayl yuklashda xatolik yuz berdi';
      alert(message, { type: 'error' });
      if (typeof options.onError === 'function') {
        options.onError(error, variables, context);
      }
    },
    // Spread other options except onSuccess and onError
    ...Object.fromEntries(
      Object.entries(options).filter(([key]) => !['onSuccess', 'onError'].includes(key))
    ),
  });
}



