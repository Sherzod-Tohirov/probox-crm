import { useQuery } from "@tanstack/react-query";
import { getMessages } from "@services/messengerService";

export default function useFetchMessages(options) {
  const { data, error, isLoading, isError, refetch } = useQuery({
    queryKey: ["messages", options?.docEntry, options?.installmentId],
    queryFn: () => getMessages(options),
    enabled: options?.enabled || false,
  });
  return { data, error, isLoading, isError, refetch };
}
