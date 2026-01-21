import { getLeadLimitHistory } from '@/services/leadsService';
import { useQuery } from '@tanstack/react-query';

export default function useFetchLeadLimitHistory(params) {
  const isEnabled = (params) => {
    if (!params.jshshir) return false;
    if (params?.enabled !== undefined) return !!params.enabled;
    else return true;
  };
  const { data, error, isLoading, isError, refetch } = useQuery({
    queryKey: ['leadLimitHistory', JSON.stringify(params || {})],
    queryFn: () =>
      getLeadLimitHistory({
        jshshir: params?.jshshir,
      }),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    keepPreviousData: true,
    retry: false,
    enabled: isEnabled(params),
  });
  return { data, error, isLoading, isError, refetch };
}
