import { getExecutors } from "@services/executorsService";
import { useQuery } from "@tanstack/react-query";

export default function useFetchExecutors() {
  const { data, error, isLoading, isError, refetch } = useQuery({
    queryKey: ["executors"],
    queryFn: getExecutors,
    refetchOnWindowFocus: false, // Prevent refetch when switching tabs
    refetchOnMount: false, // Prevent refetch every time the component mounts
  });
  return { data, error, isLoading, isError, refetch };
}
