import { useInfiniteQuery } from '@tanstack/react-query';
import { getMessages } from '@services/messengerService';

/**
 * Dynamic hook to fetch messages for both clients and leads with infinite scroll
 * @param {Object} options - Configuration options
 * @param {string} options.entityType - 'client' or 'lead'
 * @param {string} options.entityId - Lead ID (for leads)
 * @param {string} options.docEntry - Doc entry (for clients)
 * @param {string} options.installmentId - Installment ID (for clients)
 * @param {boolean} options.enabled - Enable/disable query
 * @param {number} options.limit - Number of messages per page
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
    (entityType === 'lead'
      ? !!entityId
      : !!(docEntry && installmentId));

  // Build query key based on entity type
  // Only build queryKey when query is enabled to avoid cache issues
  const queryKey = isQueryEnabled
    ? (entityType === 'lead'
        ? ['messages', 'lead', entityId]
        : ['messages', 'client', docEntry, installmentId])
    : ['messages', 'disabled'];

  const {
    data,
    error,
    isLoading,
    isError,
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
          try {
            // CRITICAL: Safety check - allPages must be an array or undefined
            // TanStack React Query sometimes passes undefined for allPages
            if (allPages === undefined || allPages === null) {
              return undefined;
            }
            
            // Safety check: ensure allPages is an array
            if (!Array.isArray(allPages)) {
              return undefined;
            }
            
            // Safety check: ensure lastPage is defined
            if (lastPage === undefined || lastPage === null) {
              return undefined;
            }
            
            // For leads: check if there's more data based on API response
            if (entityType === 'lead') {
              // Ensure lastPage is an array
              if (!Array.isArray(lastPage)) {
                return undefined;
              }
              // Additional safety check for allPages length
              if (!Array.isArray(allPages) || allPages.length === 0) {
                return undefined;
              }
              const currentPage = allPages.length;
              // If lastPage is empty or less than limit, no more pages
              if (lastPage.length < limit) {
                return undefined;
              }
              return currentPage + 1;
            }
            // For clients: no pagination (returns all messages)
            return undefined;
          } catch (error) {
            console.error('getNextPageParam error:', error);
            return undefined;
          }
        }
      : () => {
          // When query is disabled, always return undefined
          return undefined;
        },
    enabled: isQueryEnabled,
    initialPageParam: 1,
  });

  // Flatten pages for easy consumption
  // Safety check: ensure data.pages is an array before calling flat()
  const messages = 
    data?.pages && Array.isArray(data.pages) 
      ? data.pages.flat().filter(Boolean) 
      : [];

  return {
    data: messages,
    error,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  };
}
