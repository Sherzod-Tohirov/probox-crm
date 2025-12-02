import { useQuery } from '@tanstack/react-query';
import { getLeadFiles } from '@/services/leadsService';

export default function useFetchLeadFiles(data, options = {}) {
  const query = useQuery({
    queryKey: ['lead-files', data?.leadId],
    queryFn: () =>
      getLeadFiles({ leadId: data?.leadId }),
    enabled:
      !!data?.leadId &&
      (options.enabled !== undefined ? !!options.enabled : true),
    staleTime: 60_000,
    retry: options.retry ?? 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 5000),
    refetchOnWindowFocus: false,
    ...options.queryOptions,
  });

  return query;
}
