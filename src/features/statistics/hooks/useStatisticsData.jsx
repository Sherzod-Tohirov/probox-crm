import useFetchMonthlyStatistics from "@hooks/data/statistics/useFetchMonthlyStatistics";
import useFetchSalesPersonStatistics from "@hooks/data/statistics/useFetchSalesPersonStatistics";
const useStatisticsData = (params) => {
  const { data: monthlyStatisticsData, isLoading: isMonthlyStatisticsLoading } =
    useFetchMonthlyStatistics(params);

  const {
    data: salesPersonStatisticsData,
    isLoading: isSalesPersonStatisticsLoading,
  } = useFetchSalesPersonStatistics(params);

  return {
    monthly: {
      data: monthlyStatisticsData,
      isLoading: isMonthlyStatisticsLoading,
    },
    salesPerson: {
      data: salesPersonStatisticsData,
      isLoading: isSalesPersonStatisticsLoading,
    },
  };
};

export default useStatisticsData;
