import { getBranches } from '@services/branchesService';
import { useQuery } from '@tanstack/react-query';

export default function useFetchBranches(params) {
  const { data, error, isLoading, isError, refetch } = useQuery({
    queryKey: ['branches', JSON.stringify(params || {})],
    queryFn: () => getBranches(params),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    keepPreviousData: true,
    retry: false,
  });
  return { data, error, isLoading, isError, refetch };
}
