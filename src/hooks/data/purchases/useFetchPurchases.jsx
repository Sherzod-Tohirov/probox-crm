import { useQuery } from '@tanstack/react-query';
import { getPurchases } from '@/services/purchasesService';

/**
 * Custom hook for fetching purchases with pagination
 * @param {Object} options - Query options
 * @param {number} options.page - Current page (1-indexed)
 * @param {number} options.limit - Items per page
 * @param {Object} options.params - Filter parameters
 * @returns {Object} Query result with purchases data
 */
export default function useFetchPurchases({
  page = 1,
  limit = 20,
  params = {},
} = {}) {
  return useQuery({
    queryKey: ['purchases', page, limit, params],
    queryFn: async () => {
      const response = await getPurchases({
        page,
        limit,
        ...params,
      });
      return response;
    },
    keepPreviousData: true,
    staleTime: 30000, // 30 seconds
  });
}
