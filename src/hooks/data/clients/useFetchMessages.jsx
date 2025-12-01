import { useQuery } from '@tanstack/react-query';
import { getMessages } from '@services/messengerService';

export default function useFetchMessages(options) {
  const { data, error, isLoading, isError, refetch } = useQuery({
    // Keep in sync with useMutateMessages (['messages','client', docEntry, installmentId])
    queryKey: ['messages', 'client', options?.docEntry, options?.installmentId],
    queryFn: () => getMessages(options),
    enabled: options?.enabled || false,
  });
  return { data, error, isLoading, isError, refetch };
}
