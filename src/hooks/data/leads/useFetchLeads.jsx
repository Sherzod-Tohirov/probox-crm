import { getLeads } from '@/services/leadsService';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';

export default function useFetchLeads(options = {}) {
  const { currentPage, pageSize } = useSelector((state) => state.page.leads);

  const queryParams = {
    page: options.page || currentPage,
    limit: options.limit || pageSize,
    ...options.params,
  };
  console.log(queryParams);
  const { data, error, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ['leads', queryParams],
    queryFn: () => getLeads(queryParams),
    enabled: options.enabled !== undefined ? !!options.enabled : true,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    ...options.queryOptions,
  });

  return {
    data,
    error,
    isLoading,
    isFetching,
    isError,
    refetch,
    queryParams,
  };
}
