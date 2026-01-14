import { getProductItems, getProducts } from '@/services/productsService';
import { useQuery } from '@tanstack/react-query';
import { isNil } from 'lodash';

export default function useFetchProductItems(params) {
  const { data, error, isLoading, isError, refetch } = useQuery({
    queryKey: ['productItems', JSON.stringify(params || {})],
    queryFn: () =>
      getProductItems({ itemCode: params.itemCode, whsCode: params.whsCode }),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    keepPreviousData: true,
    retry: false,
    enabled: params.enabled !== undefined ? !!params.enabled : true,
  });
  return { data, error, isLoading, isError, refetch };
}
