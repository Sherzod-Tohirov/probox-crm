import { useQuery } from "@tanstack/react-query";
import { getClientEntriesById } from "@services/clientsService";

export default function useFetchClientEntriesById(id, params = {}) {
  return useQuery({
    queryKey: ["clientEntries", id, params],
    queryFn: () => getClientEntriesById(id, params),
    enabled: !!id, // Only fetch when id is available
  });
}
