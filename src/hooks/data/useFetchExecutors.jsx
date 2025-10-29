import { getExecutors } from '@services/executorsService';
import { useQuery } from '@tanstack/react-query';

export default function useFetchExecutors(params) {
  const { data, error, isLoading, isError, refetch } = useQuery({
    queryKey: ['executors', JSON.stringify(params || {})],
    queryFn: () => getExecutors(params),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    keepPreviousData: true,
    retry: false,
  });
  return { data, error, isLoading, isError, refetch };
}
