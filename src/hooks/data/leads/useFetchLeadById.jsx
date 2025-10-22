import { useQuery } from '@tanstack/react-query';
import { getLeadById } from '@/services/leadsService';

export default function useFetchLeadById(id, options = {}) {
  const enabled = options.enabled !== undefined ? !!options.enabled : !!id;
  const query = useQuery({
    queryKey: ['lead', id],
    queryFn: () => getLeadById(id),
    enabled,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1,
    ...options.queryOptions,
  });
  return query;
}
