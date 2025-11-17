import { useMutation } from '@tanstack/react-query';
import { fetchItemSeries } from '@/services/leadsService';

export default function useFetchItemSeries(options = {}) {
  return useMutation({
    mutationFn: fetchItemSeries,
    retry: false,
    ...options,
  });
}

