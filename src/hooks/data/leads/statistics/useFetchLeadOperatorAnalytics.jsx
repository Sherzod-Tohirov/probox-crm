import { useQuery } from '@tanstack/react-query';
import { getOperatorAnalytics } from '@/services/leadsStatisticsService';

export default function useFetchLeadOperatorAnalytics(options = {}) {
  const { start, end } = options ?? {};
  const query = useQuery({
    queryKey: ['leadOperatorAnalytics', start, end],
    queryFn: () => getOperatorAnalytics({ start, end }),
    enabled: options.enabled ?? true,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1,
    ...options.queryOptions,
  });
  return query;
}
