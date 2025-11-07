import { getExecutors } from '@services/executorsService';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export default function useFetchExecutors(params) {
  const normalizedParams = useMemo(() => {
    if (!params) return {};
    const p = { ...params };
    if (Array.isArray(p.include_role)) {
      p.include_role = p.include_role.join(',');
    }
    return p;
  }, [params]);

  const { data, error, isLoading, isError, refetch } = useQuery({
    queryKey: ['executors', JSON.stringify(normalizedParams || {})],
    queryFn: async () => {
      const res = await getExecutors(normalizedParams);
      if (Array.isArray(res)) return res;
      if (Array.isArray(res?.data)) return res.data;
      if (Array.isArray(res?.content)) return res.content;
      return [];
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    keepPreviousData: true,
    retry: false,
  });
  return { data, error, isLoading, isError, refetch };
}
