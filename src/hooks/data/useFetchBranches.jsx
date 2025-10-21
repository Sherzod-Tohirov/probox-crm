import { getBranches } from '@services/branchesService';
import { useQuery } from '@tanstack/react-query';

export default function useFetchBranches(params) {
  const { data, error, isLoading, isError, refetch } = useQuery({
    queryKey: ['branches', params],
    queryFn: () => getBranches(params),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  return { data, error, isLoading, isError, refetch };
}
