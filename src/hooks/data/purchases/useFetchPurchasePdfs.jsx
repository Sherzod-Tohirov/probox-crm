import { useQuery } from '@tanstack/react-query';
import { getPurchasePdfs } from '@/services/purchasesService';

/**
 * Custom hook for fetching purchase pdfs
 * @param {Object} options - Query options
 * @param {number} options.docEntry - Purchase's DocEntry
 * @returns {Object} Query result with purchase pdfs data
 */
export default function useFetchPurchasePdfs({ docEntry, enabled = true }) {
  return useQuery({
    queryKey: ['purchase-pdfs', docEntry],
    queryFn: async () => {
      const response = await getPurchasePdfs(docEntry);
      return response;
    },
    keepPreviousData: true,
    staleTime: 30_000, // 30 seconds
    enabled,
  });
}
