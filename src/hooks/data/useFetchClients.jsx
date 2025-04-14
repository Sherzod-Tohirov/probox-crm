import { getClients } from "@services/clientsService";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { applyDefaultParams } from "../utils";

export default function useFetchClients(options = {}) {
  const { currentPage, pageSize } = useSelector((state) => state.page.clients);

  const queryParams = {
    page: options.page || currentPage,
    limit: options.limit || pageSize,
    ...options.params,
  };
  console.log(queryParams, "queryParams");
  applyDefaultParams(queryParams); // Ensure params have default values
  console.log(queryParams, "queryParamsAfterDefaultParams");
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
