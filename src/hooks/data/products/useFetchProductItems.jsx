import { getProducts } from '@/services/productsService';
import { useQuery } from '@tanstack/react-query';

export default function useFetchProductItems(params) {
  const { data, error, isLoading, isError, refetch } = useQuery({
    queryKey: ['productItems', JSON.stringify(params || {})],
    queryFn: () => getProducts(params),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    keepPreviousData: true,
    retry: false,
  });
  return { data, error, isLoading, isError, refetch };
}
