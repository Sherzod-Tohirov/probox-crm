import { useInfiniteQuery } from "@tanstack/react-query";
import { searchClients } from "@services/clientsService";
import { useSelector } from "react-redux";

export default function useInfiniteSearchClients(
  query,
  options = {},
  enableFilters = false
) {
  const filters = useSelector((state) => state.page.clients.filter);
  return useInfiniteQuery({
    queryKey: ["searchClients", query],
    queryFn: ({ pageParam = 1 }) => {
      return searchClients({
        ...options,
        page: pageParam,
        ...(enableFilters ? filters : {}),
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      console.log(lastPage, "lastPage");
      console.log(allPages, "allPages");
      console.log(lastPageParam, "lastPageParam");

      const nextPage =
        lastPage?.page < lastPage?.totalPages ? lastPage?.page + 1 : false;

      return nextPage;
    },
    ...options,
    enabled: !!query,
  });
}
