import { useInfiniteQuery } from '@tanstack/react-query';
import { getMessages } from '@services/messengerService';

/**
 * Dynamic hook to fetch messages for both clients and leads with infinite scroll.
 *
 * For leads:
 *  - On open: fetches page=1 first (bootstrap, gets totalPages), then auto-fetches
 *    the last page (newest messages). User sees newest messages on open.
 *  - "Load older": user scrolls to top or clicks button → loads page N-1, N-2, ... 2
 *    one page at a time (manual, not auto).
 *
 * @param {Object} options
 * @param {string} options.entityType - 'client' or 'lead'
 * @param {string} options.entityId
 * @param {string} options.docEntry
 * @param {string} options.installmentId
 * @param {boolean} options.enabled
 * @param {number}  options.limit
 */
export default function useFetchMessages(options = {}) {
  const {
    entityType = 'client',
    entityId,
    docEntry,
    installmentId,
    enabled = false,
    limit = 20,
  } = options;

  // Determine if query should be enabled based on required parameters
  const isQueryEnabled =
    enabled &&
    (entityType === 'lead' ? !!entityId : !!(docEntry && installmentId));

  // Build query key based on entity type
  // Only build queryKey when query is enabled to avoid cache issues
  const queryKey = isQueryEnabled
    ? entityType === 'lead'
      ? ['messages', 'lead', entityId]
      : ['messages', 'client', docEntry, installmentId]
    : ['messages', 'disabled'];

  const {
    data,
    error,
    isLoading,
    isError,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 1 }) =>
      getMessages({
        ...options,
        page: pageParam,
        limit,
      }),
    getNextPageParam: isQueryEnabled
      ? (lastPage, allPages) => {
          if (entityType !== 'lead') return undefined;
          const { page: currentPage, totalPages } = lastPage ?? {};
          if (!totalPages || !currentPage) return undefined;

          // Step 1 — bootstrap: auto-jump from page 1 to the last page (newest)
          if (allPages.length === 1) {
            return totalPages > 1 ? totalPages : undefined;
          }

          // Step 2+ — walk backwards: the current lastPage tells us its page number.
          // Go one older, but never below 2 (page 1 is already loaded as bootstrap).
          if (currentPage > 2) return currentPage - 1;

          // currentPage === 2 means we've loaded everything down to page 2,
          // and page 1 is already loaded as bootstrap. All done.
          return undefined;
        }
      : () => undefined,
    initialPageParam: 1,
    enabled: isQueryEnabled,
  });

  // Sort all loaded pages ascending by page number → oldest msgs at top, newest at bottom.
  const messages =
    data?.pages && Array.isArray(data.pages)
      ? entityType === 'lead'
        ? [...data.pages]
            .sort((a, b) => (a?.page ?? 0) - (b?.page ?? 0))
            .flatMap((p) => (Array.isArray(p?.data) ? p.data : []))
            .filter(Boolean)
        : data.pages.flat().filter(Boolean)
      : [];

  // For leads, hasNextPage from React Query tells us if there are older pages left.
  // fetchNextPage will call getNextPageParam(lastPage) which returns the next older page.
  // We expose them directly — no custom wrapper needed since getNextPageParam is correct.
  return {
    data: messages,
    error,
    isLoading,
    isRefetching,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  };
}
