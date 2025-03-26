import { useCallback } from "react";
import { clients } from "../../../../mockData";
import { Typography } from "@components/ui";
import { useSelector } from "react-redux";

export default function useFilter() {
  const filterObj = useSelector((state) => state.page.clients.filter);
  const highlightText = useCallback((text, searchText) => {
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
      async (searchedText) => {
        console.log("searchedText", searchedText);
        const response = await new Promise((resolve) => {
          setTimeout(() => {
            resolve(
              clients.filter((client) => {
                return (
                  client.CardName.toLowerCase().includes(
                    searchedText.toLowerCase()
                  ) || client.IntrSerial.includes(searchedText)
                );
              })
            );
          }, 1000);
        });
        console.log("response", response);
        return response;
      },
      [filterObj]
    ),
    renderItem: useCallback(
      (client) => {
        return (
          <Typography element="span">
            {highlightText(client.CardName, filterObj.query)}-{" "}
            {highlightText(client.IntrSerial, filterObj.query)}
          </Typography>
        );
      },
      [filterObj]
    ),
  };

  const phone = {
    onSearch: useCallback(
      async (searchedText) => {
        console.log("searchedText", searchedText);
        const response = await new Promise((resolve) => {
          setTimeout(() => {
            resolve(
              clients.filter((client) => {
                return client["Phone1"]
                  .toLowerCase()
                  .includes(searchedText.toLowerCase());
              })
            );
          }, 1000);
        });
        console.log("response", response);
        return response;
      },
      [filterObj]
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
