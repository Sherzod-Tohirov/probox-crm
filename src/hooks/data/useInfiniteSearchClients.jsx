import { useInfiniteQuery } from "@tanstack/react-query";
import { searchClients } from "@services/clientsService";

export const useInfiniteSearchClients = (options = {}) => {
  return useInfiniteQuery({
    queryKey: ["searchClients", query],
    queryFn: () => searchClients({ ...options }),
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage?.nextPage || false;
      return nextPage ? nextPage : undefined;
    },
    ...options,
    enabled: !!query,
  });
};
