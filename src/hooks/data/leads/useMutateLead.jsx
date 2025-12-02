import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateLeadFields } from '@/services/leadsService';

export default function useMutateLead(leadId, options = {}) {
  const queryClient = useQueryClient();

  // Extract callbacks before spreading options
  const {
    onSuccess: customOnSuccess,
    onError: customOnError,
    ...restOptions
  } = options;

  return useMutation({
    ...restOptions,
    mutationFn: (data) => updateLeadFields(leadId, data),
    onSuccess: async (updatedLead) => {
      // Invalidate queries first
      queryClient.invalidateQueries({ queryKey: ['lead', leadId] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });

      // Force refetch the lead data to ensure UI is updated
      await queryClient.refetchQueries({
        queryKey: ['lead', leadId],
        exact: true,
      });

      // Call custom onSuccess callback if provided
      customOnSuccess?.(updatedLead);
    },
    onError: (error) => {
      console.error('Error updating lead:', error);

      // Call custom onError callback if provided
      customOnError?.(error);
    },
  });
}
