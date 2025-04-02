import { getClients } from "@services/clientsService";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

export default function useFetchClients(options = {}) {
  const filterState = useSelector((state) => state.page.clients.filter);
  const { currentPage, pageSize } = useSelector((state) => state.page.clients);

  const queryParams = {
    page: options.page || currentPage,
    limit: options.limit || pageSize,
    // search: options.search || filterState.query,
    // startDate: options.startDate || filterState.startDate,
    // endDate: options.endDate || filterState.endDate,
    // status: options.status || filterState.status,
    // executor: options.executor || filterState.executor,
    ...options.params,
  };

  const { data, error, isLoading, isError, refetch } = useQuery({
    queryKey: ["clients", queryParams],
    queryFn: () => getClients(queryParams),
    enabled: options.enabled !== false,
    ...options.queryOptions,
  });

  return {
    data,
    error,
    isLoading,
    isError,
    refetch,
    queryParams,
  };
}
