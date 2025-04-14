import { useQuery } from "@tanstack/react-query";
import { getClientEntriesById } from "@services/clientsService";
import { applyDefaultParams } from "../utils";

export default function useFetchClientEntriesById(id, params = {}) {
  applyDefaultParams(params); // Ensure params have default values
  return useQuery({
    queryKey: ["clientEntries", id, params],
    queryFn: () => getClientEntriesById(id, params),
    enabled: !!id, // Only fetch when id is available
  });
}
