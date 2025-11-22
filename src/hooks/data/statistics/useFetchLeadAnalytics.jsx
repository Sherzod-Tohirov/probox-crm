import { useQuery } from '@tanstack/react-query';
import { getLeadAnalytics } from '@services/statisticsService';

export default function useFetchLeadAnalytics(params, options = {}) {
  const { data, error, isLoading, isError, refetch } = useQuery({
    queryKey: ['lead-analytics', params],
    queryFn: () => getLeadAnalytics(params),
    enabled: options.enabled !== false,
    refetchOnMount: true,
  });
  return { data, error, isLoading, isError, refetch };
}
