import { getCurrency } from "@services/currencyService";
import { useQuery } from "@tanstack/react-query";

export default function useFetchCurrency() {
  const { data, error, isLoading, isError, refetch } = useQuery({
    queryKey: ["currency"],
    queryFn: getCurrency,
  });
  return { data, error, isLoading, isError, refetch };
}
