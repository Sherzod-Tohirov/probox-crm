import { getExecutors } from "@services/executorsService";
import { useQuery } from "@tanstack/react-query";

export default function useFetchCurrency() {
  const { data, error, isLoading, isError, refetch } = useQuery({
    queryKey: ["executors"],
    queryFn: getExecutors,
  });
  return { data, error, isLoading, isError, refetch };
}
