import { useQuery } from '@tanstack/react-query';
import { getSuppliers } from '@/services/purchasesService';

/**
 * Custom hook for fetching purchases with pagination
 * @param {Object} options - Query options
 * @param {number} options.page - Current page (1-indexed)
 * @param {number} options.limit - Items per page
 * @param {Object} options.params - Filter parameters
 * @returns {Object} Query result with purchases data
 */
export default function useFetchSuppliers({
  offset = 0,
  limit = 20,
  enabled = true,
  params = {},
} = {}) {
  return useQuery({
    queryKey: ['suppliers', offset, limit, params],
    queryFn: async () => {
      const response = await getSuppliers({
        offset,
        limit,
        ...params,
      });
      return response;
    },
    keepPreviousData: true,
    staleTime: 30_000, // 30 seconds
    enabled,
  });
}
