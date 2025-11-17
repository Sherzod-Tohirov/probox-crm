import { useMutation } from '@tanstack/react-query';
import { fetchContractTermsItems } from '@/services/leadsService';

export default function useMutateContractTerms(options = {}) {
  return useMutation({
    mutationFn: fetchContractTermsItems,
    ...options,
  });
}
