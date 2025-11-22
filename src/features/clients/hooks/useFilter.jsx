import { useCallback } from 'react';
import { Typography } from '@components/ui';
import { useSelector, useDispatch } from 'react-redux'; // Add useDispatch
import { searchClients } from '@services/clientsService';
import { setClientsFilter } from '@store/slices/clientsPageSlice';
import { applyDefaultParams } from '@hooks/utils';
export default function useFilter() {
  const dispatch = useDispatch(); // Add dispatch
  const filterObj = useSelector((state) => state.page.clients.filter);
  const mutatedFilterObj = {
    ...filterObj,
  };
  applyDefaultParams(mutatedFilterObj); // Ensure params have default values
  const highlightText = useCallback((text, searchText, type) => {
    if (!text || !searchText) return text;

    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const normalizePhone = (str) => str.replace(/^998/, '').toLowerCase();
    const normalizedSearchText = searchText.toLowerCase();
    const phoneSearchText = normalizePhone(searchText);

    const regex =
      type === 'phone'
        ? new RegExp(
            `(${escapeRegex(searchText)}|${escapeRegex(phoneSearchText)})`,
            'gi'
          )
        : new RegExp(`(${escapeRegex(searchText)})`, 'gi');

    const parts = text.split(regex);

    const isHighlighted = (part) => {
      const normalizedPart = part.toLowerCase();
      return type === 'phone'
        ? normalizedPart === phoneSearchText ||
            normalizedPart === normalizedSearchText
        : normalizedPart === normalizedSearchText;
    };

    return parts.map((part, index) => (
      <span
        key={index}
        style={
          isHighlighted(part)
            ? {
                display: 'inline-flex',
                backgroundColor: 'orange',
                color: 'white',
              }
            : {}
        }
      >
        {part}
      </span>
    ));
  }, []);

  const query = {
    onSearch: useCallback(
      (searchText, page = 1, applyFilters = false) => {
        return searchClients({
          ...(applyFilters ? mutatedFilterObj : {}),
          search: searchText,
          page,
        });
      },
      [filterObj]
    ),

    onSelect: useCallback(
      (client) => {
        dispatch(
          setClientsFilter({
            ...filterObj, // Preserve existing filters
            search: client.CardName,
            phone: client.Phone1,
          })
        );
      },
      [dispatch, filterObj]
    ),

    renderItem: useCallback(
      (client, searchText) => {
        return (
          <Typography element="span">
            {highlightText(client.CardName, searchText)}-{' '}
            {highlightText(client.IntrSerial, searchText)}
          </Typography>
        );
      },
      [highlightText]
    ),
  };

  const phone = {
    onSearch: useCallback(
      (searchText, page = 1, applyFilters = false) => {
        return searchClients({
          ...(applyFilters ? mutatedFilterObj : {}),
          phone: searchText,
          page,
        });
      },
      [filterObj]
    ),

    onSelect: useCallback(
      (client) => {
        dispatch(
          setClientsFilter({
            ...filterObj, // Preserve existing filters
            search: client.CardName,
            phone: client.Phone1,
          })
        );
      },
      [dispatch, filterObj]
    ),

    renderItem: useCallback(
      (client, searchText) => {
        return (
          <Typography element="span">
            {client['CardName']} -{' '}
            {highlightText(client['Phone1'], searchText, 'phone')}
            {client['Phone2'] && (
              <span>
                {' '}
                / {highlightText(client['Phone2'], searchText, 'phone')}
              </span>
            )}
          </Typography>
        );
      },
      [highlightText]
    ),
  };

  return { query, phone };
}
