import { useCallback, useState } from "react";
import { clients } from "../../../../mockData";
import { Typography } from "@components/ui";
import { useSelector } from "react-redux";

export default function useFilter() {
  const filterObj = useSelector((state) => state.page.clients.filter);
  console.log("filterObj", filterObj);
  const highlightText = useCallback((text, searchText) => {
    const parts = text.split(new RegExp(`(${searchText})`, "gi"));
    console.log(parts, "parts");
    return parts.map((part, index) => (
      <span
        key={index}
        style={
          part.toLowerCase() === searchText.toLowerCase()
            ? {
                display: "inline-flex",
                backgroundColor: "gray",
                color: "white",
              }
            : {}
        }>
        {part}
      </span>
    ));
  });

  const query = {
    onSearch: useCallback(async (searchedText) => {
      console.log("search", searchedText);
      setSearchText(searchedText);
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
      return response;
    }, []),
    renderItem: useCallback((client) => {
      console.log("searchText", searchText);
      return (
        <Typography element="span">
          {highlightText(client.CardName, filterObj.query)} -{" "}
          {highlightText(client.IntrSerial, filterObj.query)}
        </Typography>
      );
    }, []),
  };

  return { query };
}
