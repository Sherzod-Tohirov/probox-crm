import { fetchData } from "./utilities";

export const getCurrency = async (params = {}) => {
  const response = await fetchData("/rate", "rates", params);
  return response;
};
