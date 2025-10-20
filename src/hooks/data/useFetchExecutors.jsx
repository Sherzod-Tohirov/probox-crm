import { getExecutors } from '@services/executorsService';
import { useQuery } from '@tanstack/react-query';

export default function useFetchExecutors(params) {
  const { data, error, isLoading, isError, refetch } = useQuery({
    queryKey: ['executors', params],
    queryFn: () => getExecutors(params),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  return { data, error, isLoading, isError, refetch };
}
