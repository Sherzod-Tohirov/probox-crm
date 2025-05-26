import { useQuery } from "@tanstack/react-query";
import { getStatistics } from "@services/statisticsService";

export default function useFetchStatistics(options) {
  const { data, error, isLoading, isError, refetch } = useQuery({
    queryKey: ["statistics", options],
    queryFn: () => getStatistics(options),
    enabled: true,
    refetchOnMount: true,
  });
  return { data, error, isLoading, isError, refetch };
}
