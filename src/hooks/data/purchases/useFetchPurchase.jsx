import { useQuery } from '@tanstack/react-query';
import { getPurchaseById } from '@/services/purchasesService';

/**
 * Custom hook for fetching purchase
 * @param {Object} options - Query options
 * @param {number} options.id - Purchase id
 * @returns {Object} Query result with purchase data
 */
export default function useFetchPurchase({ id, enabled = true }) {
  return useQuery({
    queryKey: ['purchase', id],
    queryFn: async () => {
      const response = await getPurchaseById(id);
      return response;
    },
    keepPreviousData: true,
    staleTime: 30_000, // 30 seconds
    enabled,
  });
}
