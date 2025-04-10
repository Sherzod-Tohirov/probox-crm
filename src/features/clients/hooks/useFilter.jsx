import { useCallback } from "react";
import { Typography } from "@components/ui";
import { useSelector, useDispatch } from "react-redux"; // Add useDispatch
import { searchClients } from "@services/clientsService";
import { setClientsFilter } from "@store/slices/clientsPageSlice";

export default function useFilter() {
  const dispatch = useDispatch(); // Add dispatch
  const filterObj = useSelector((state) => state.page.clients.filter);

  const highlightText = useCallback((text, searchText, type) => {
    if (!text || !searchText) return text;

    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const normalizePhone = (str) => str.replace(/^998/, "").toLowerCase();
    const normalizedSearchText = searchText.toLowerCase();
    const phoneSearchText = normalizePhone(searchText);

    const regex =
      type === "phone"
        ? new RegExp(
            `(${escapeRegex(searchText)}|${escapeRegex(phoneSearchText)})`,
            "gi"
          )
        : new RegExp(`(${escapeRegex(searchText)})`, "gi");

    const parts = text.split(regex);

    const isHighlighted = (part) => {
      const normalizedPart = part.toLowerCase();
      return type === "phone"
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
                display: "inline-flex",
                backgroundColor: "orange",
                color: "white",
              }
            : {}
        }>
        {part}
      </span>
    ));
  }, []);

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
            {client["CardName"]} -{" "}
            {highlightText(client["Phone1"], filterObj.phone, "phone")}
            {client["Phone2"] && (
              <span>
                {" "}
                / {highlightText(client["Phone2"], filterObj.phone, "phone")}
              </span>
            )}
          </Typography>
        );
      },
      [filterObj]
    ),
  };

  return { query, phone };
}
