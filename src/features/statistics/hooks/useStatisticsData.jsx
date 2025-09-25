import useFetchMonthlyStatistics from '@hooks/data/statistics/useFetchMonthlyStatistics';
import useFetchSalesPersonStatistics from '@hooks/data/statistics/useFetchSalesPersonStatistics';
import { useCallback } from 'react';
import formatDate from '@utils/formatDate';
import { insTotalCalculator } from '@utils/calculator';
import useFetchClients from '@/hooks/data/clients/useFetchClients';

const CLIENTS_LIMIT = 10000;

const useStatisticsData = (params) => {
  const { data: monthlyStatisticsData, isLoading: isMonthlyStatisticsLoading } =
    useFetchMonthlyStatistics(params);
  const formatterMonthlyData = useCallback((data) => {
    return data.map((item) => ({
      day: formatDate(item['DueDate'], 'YYYY.MM.DD', 'DD.MM'),
      jami: parseInt(
        insTotalCalculator({
          paidToDate: item['PaidToDate'],
          sumApplied: item['SumApplied'],
          insTotal: item['InsTotal'],
        }),
        10
      ),
      qoplandi: parseInt(item['SumApplied'], 10),
    }));
  }, []);
  const {
    data: salesPersonStatisticsData,
    isLoading: isSalesPersonStatisticsLoading,
  } = useFetchSalesPersonStatistics(params);
  const {
    data: clientsData,
    isLoading: isClientsLoading,
    refetch: refetchClients,
    queryParams: clientsQueryParams,
  } = useFetchClients({
    limit: CLIENTS_LIMIT,
    page: 1,
    enabled: false,
    params,
  });
  return {
    monthly: {
      data: monthlyStatisticsData,
      isLoading: isMonthlyStatisticsLoading,
    },
    salesPerson: {
      data: salesPersonStatisticsData,
      isLoading: isSalesPersonStatisticsLoading,
    },
    clients: {
      data: clientsData,
      isLoading: isClientsLoading,
      refetch: refetchClients,
      queryParams: clientsQueryParams,
    },
    utils: {
      formatMonthlyData: formatterMonthlyData,
    },
  };
};

export default useStatisticsData;
