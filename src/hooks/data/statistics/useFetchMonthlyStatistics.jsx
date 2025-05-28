import { getMonthlyStatistics } from "@services/statisticsService";
import { useQuery } from "@tanstack/react-query";

const useFetchMonthlyStatistics = (params) => {
  return useQuery({
    queryKey: ["monthlyStatistics", params],
    queryFn: () => getMonthlyStatistics(params),
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export default useFetchMonthlyStatistics;
