import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateLeadFields } from '@/services/leadsService';

export default function useMutateLead(leadId, options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => updateLeadFields(leadId, data),
    onSuccess: (updatedLead) => {
      // Invalidate and refetch lead data
      queryClient.invalidateQueries(['lead', leadId]);
      queryClient.invalidateQueries(['leads']);

      // Update the cache with new data
      queryClient.setQueryData(['lead', leadId], (oldData) => ({
        ...oldData,
        data: updatedLead,
      }));

      // Call custom onSuccess callback if provided
      options.onSuccess?.(updatedLead);
    },
    onError: (error) => {
      console.error('Error updating lead:', error);

      // Call custom onError callback if provided
      options.onError?.(error);
    },
    ...options,
  });
}
