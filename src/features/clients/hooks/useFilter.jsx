import { useCallback } from "react";
import { Typography } from "@components/ui";
import { useSelector, useDispatch } from "react-redux"; // Add useDispatch
import { searchClients } from "@services/clientsService";
import { setClientsFilter } from "@store/slices/clientsPageSlice";

export default function useFilter() {
  const dispatch = useDispatch(); // Add dispatch
  const filterObj = useSelector((state) => state.page.clients.filter);

  const highlightText = useCallback((text, searchText) => {
    if (!text || !searchText) return text;
    const parts = text.split(new RegExp(`(${searchText})`, "gi"));
    return parts.map((part, index) => (
      <span
        key={index}
        style={
          part.toLowerCase() === searchText.toLowerCase()
            ? {
                display: "inline-flex",
                backgroundColor: "orange",
                color: "white",
              }
            : {}
        }>
        {part}
      </span>
    ));
  });

  const query = {
    onSearch: useCallback(
      (searchText, page = 1, applyFilters = false) => {
        return searchClients({
          search: searchText,
          page,
          ...(applyFilters ? filterObj : {}),
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
      (client) => {
        return (
          <Typography element="span">
            {highlightText(client.CardName, filterObj.search)}-{" "}
            {highlightText(client.IntrSerial, filterObj.search)}
          </Typography>
        );
      },
      [filterObj]
    ),
  };

  const phone = {
    onSearch: useCallback(
      (searchText, page = 1, applyFilters = false) => {
        return searchClients({
          phone: searchText,
          page,
          ...(applyFilters ? filterObj : {}),
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
      (client) => {
        return (
          <Typography element="span">
            {highlightText(client["CardName"], filterObj.phone)} -{" "}
            {highlightText(client["Phone1"], filterObj.phone)}
          </Typography>
        );
      },
      [filterObj]
    ),
  };

  return { query, phone };
}
