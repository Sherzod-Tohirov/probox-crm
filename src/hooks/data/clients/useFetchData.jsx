export default function useFetchData(queryKey, queryFn) {
  const { data, error, isLoading, isError, refetch } = useQuery({
    queryKey: [queryKey],
    queryFn,
  });
  return { data, error, isLoading, isError, refetch };
}
