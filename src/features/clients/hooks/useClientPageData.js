import { useSelector } from 'react-redux';
import useFetchCurrency from '@hooks/data/useFetchCurrency';
import useFetchMessages from '@hooks/data/useFetchMessages';
import useFetchClientEntriesById from '@hooks/data/clients/useFetchClientEntriesById';

/**
 * Custom hook to fetch all data needed for the ClientPage
 * @param {string} clientId - The client ID
 * @param {boolean} isMessengerOpen - Whether the messenger is open
 * @returns {Object} All data and loading states for ClientPage
 */
export default function useClientPageData(clientId, isMessengerOpen) {
  const currentClient = useSelector(
    (state) => state.page.clients.currentClient
  );

  const { data: clientEntries, isLoading: isEntriesLoading } =
    useFetchClientEntriesById(clientId);

  const { data: currency, isLoading: isCurrencyLoading } = useFetchCurrency();

  const docEntry = currentClient?.['DocEntry'];
  const installmentId = currentClient?.['InstlmntID'];

  const {
    data: messages,
    isLoading: isMessagesLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFetchMessages({
    entityType: 'client',
    docEntry,
    installmentId,
    enabled: isMessengerOpen,
  });

  return {
    currentClient,
    clientEntries,
    isEntriesLoading,
    currency,
    isCurrencyLoading,
    messages,
    isMessagesLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
}
