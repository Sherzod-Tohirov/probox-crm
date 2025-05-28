import { getSalesPersonStatistics } from "@services/statisticsService";
import { useQuery } from "@tanstack/react-query";

const useFetchSalesPersonStatistics = (params) => {
  return useQuery({
    queryKey: ["salesPersonStatistics", params],
    queryFn: () => getSalesPersonStatistics(params),
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export default useFetchSalesPersonStatistics;
