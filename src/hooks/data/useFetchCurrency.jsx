import { getCurrency } from "@services/currencyService";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";

export default function useFetchCurrency(params = {}) {
  if (!params?.date) {
    params.date = moment().format("YYYY.MM.DD");
  }
  
  const { data, error, isLoading, isError, refetch } = useQuery({
    queryKey: ["currency", params.date],
    queryFn: () => getCurrency(params),
  });

  return { data, error, isLoading, isError, refetch };
}
