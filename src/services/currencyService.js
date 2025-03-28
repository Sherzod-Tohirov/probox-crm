import { fetchData } from "./utilities";

export const getCurrency = async () => {
  const response = await fetchData("/rate", "rates");
  return response;
};
