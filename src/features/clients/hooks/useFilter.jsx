import { useCallback } from "react";
import { Typography } from "@components/ui";
import { useSelector } from "react-redux";

export default function useFilter() {
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
    onSearch: "",
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
    onSearch: "",
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
