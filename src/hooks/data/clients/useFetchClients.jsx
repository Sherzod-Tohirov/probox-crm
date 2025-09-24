import { getClients } from '@services/clientsService';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { applyDefaultParams } from '../../utils';

export default function useFetchClients(options = {}) {
  const { currentPage, pageSize } = useSelector((state) => state.page.clients);

  const queryParams = {
    page: options.page || currentPage,
    limit: options.limit || pageSize,
    ...options.params,
  };
  applyDefaultParams(queryParams); // Ensure params have default values
  const { data, error, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ['clients', queryParams],
    queryFn: () => getClients(queryParams),
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
