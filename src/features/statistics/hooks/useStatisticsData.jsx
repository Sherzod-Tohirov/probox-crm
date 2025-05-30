import useFetchMonthlyStatistics from "@hooks/data/statistics/useFetchMonthlyStatistics";
import useFetchSalesPersonStatistics from "@hooks/data/statistics/useFetchSalesPersonStatistics";
import { useCallback } from "react";
import formatDate from "@utils/formatDate";
import { insTotalCalculator } from "@utils/calculator";
const useStatisticsData = (params) => {
  const { data: monthlyStatisticsData, isLoading: isMonthlyStatisticsLoading } =
    useFetchMonthlyStatistics(params);
  const formatterMonthlyData = useCallback((data) => {
    return data.map((item) => ({
      day: formatDate(item["DueDate"], "YYYY.MM.DD", "DD.MM"),
      jami: parseInt(
        insTotalCalculator({
          paidToDate: item["PaidToDate"],
          sumApplied: item["SumApplied"],
          insTotal: item["InsTotal"],
        }),
        10
      ),
      qoplandi: parseInt(item["SumApplied"], 10),
    }));
  }, []);
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
    utils: {
      formatMonthlyData: formatterMonthlyData,
    },
  };
};

export default useStatisticsData;
