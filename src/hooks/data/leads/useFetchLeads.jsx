import { getLeads } from '@/services/leadsService';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';

export default function useFetchLeads(options = {}) {
  const { currentPage, pageSize } = useSelector((state) => state.page.leads);
  const authToken = useSelector((state) => state.auth.token);

  const queryParams = {
    page: options.page || currentPage,
    limit: options.limit || pageSize,
    ...options.params,
  };
  const cleanedParams = Object.fromEntries(
    Object.entries(queryParams).filter(([_, v]) => {
      if (v === '' || v === null || v === undefined) return false;
      if (Array.isArray(v) && v.length === 0) return false;
      return true; // keep booleans (including false) and numbers
    })
  );
  const { data, error, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ['leads', authToken || 'anon', JSON.stringify(cleanedParams)],
    queryFn: () => getLeads(cleanedParams),
    enabled: options.enabled !== undefined ? !!options.enabled : true,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    keepPreviousData: true,
    retry: false,
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
